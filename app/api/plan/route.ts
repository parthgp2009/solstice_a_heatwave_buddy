import { NextRequest, NextResponse } from "next/server";
import { PlanRequestInput, generateGeminiPlan } from "@/lib/aiPlan";

// In-memory rate limiting: map IP -> timestamps array
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by client IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: "Too many plan requests. Please wait a minute before updating your plan." },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 2. Parse and validate request body
    const body = (await req.json().catch(() => null)) as Partial<PlanRequestInput> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Input sanitization (Zero storage: values are never persisted or logged per rules.md)
    const sanitizedInput: PlanRequestInput = {
      city: typeof body.city === "string" ? body.city.slice(0, 50) : "Delhi",
      age: typeof body.age === "string" ? body.age.slice(0, 30) : "31 to 45",
      occupation: typeof body.occupation === "string" ? body.occupation.slice(0, 50) : "Not specified",
      sunHours: typeof body.sunHours === "string" ? body.sunHours.slice(0, 30) : "2 to 6 hours",
      healthHistory: Array.isArray(body.healthHistory)
        ? body.healthHistory.map(h => String(h).slice(0, 30))
        : [],
      customHealthNote: typeof body.customHealthNote === "string"
        ? body.customHealthNote.slice(0, 100)
        : "",
      lang: body.lang === "hi" ? "hi" : "en",
      currentTemp: typeof body.currentTemp === "number" ? body.currentTemp : 38,
      adjustedTemp: typeof body.adjustedTemp === "number" ? body.adjustedTemp : 42,
      riskLevel: typeof body.riskLevel === "string" ? body.riskLevel.slice(0, 20) : "Danger"
    };

    // 3. Generate plan via Gemini or robust fallback
    const apiKey = process.env.GEMINI_API_KEY || "";
    const result = await generateGeminiPlan(sanitizedInput, apiKey);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=60"
      }
    });
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined;
    console.error("AI Plan Route error:", err?.message || error);
    return NextResponse.json(
      { error: "Failed to generate safety plan." },
      { status: 500 }
    );
  }
}
