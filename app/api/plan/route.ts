import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PlanRequestInput, generateGeminiPlan } from "@/lib/aiPlan";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rateLimit";

// Strict Zod schema enforcing fixed allowed values and maximum note length
export const PlanInputSchema = z.object({
  city: z.string().max(60).optional().default("Delhi"),
  age: z
    .enum(["Under 18", "18 to 30", "31 to 45", "46 to 60", "Over 60"])
    .optional()
    .default("31 to 45"),
  occupation: z
    .enum([
      "Not specified",
      "Delivery Driver",
      "Student",
      "Farmer",
      "Traffic Police",
      "Office Worker"
    ])
    .optional()
    .default("Not specified"),
  sunHours: z
    .enum(["Up to 2 hours", "2 to 6 hours", "More than 6 hours"])
    .optional()
    .default("2 to 6 hours"),
  healthHistory: z.array(z.string().max(40)).max(10).optional().default([]),
  customHealthNote: z.string().max(80, "Typed note cannot exceed 80 characters.").optional().default(""),
  lang: z.enum(["en", "hi"]).optional().default("en"),
  currentTemp: z.number().min(-30).max(70).optional().default(38),
  adjustedTemp: z.number().min(-30).max(85).optional().default(42),
  riskLevel: z.enum(["Low", "Caution", "Danger", "Extreme"]).optional().default("Danger")
});

export async function POST(req: NextRequest) {
  try {
    // 1. In-memory rate limiting by client IP (20 requests per minute)
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit("plan", ip, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retryAfterSeconds);
    }

    // 2. Parse and validate request body with Zod
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = PlanInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.issues.map(i => ({
            field: i.path.join("."),
            message: i.message
          }))
        },
        { status: 400 }
      );
    }

    const validated: PlanRequestInput = parseResult.data;

    // 3. Generate plan via Gemini or robust rule-based fallback
    const apiKey = process.env.GEMINI_API_KEY || "";
    const result = await generateGeminiPlan(validated, apiKey);

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
