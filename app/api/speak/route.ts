import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rateLimit";

const ALLOWED_LANGUAGES = ["hi-IN", "en-IN"] as const;
type AllowedLanguage = (typeof ALLOWED_LANGUAGES)[number];

export async function POST(req: NextRequest) {
  try {
    // 1. In-memory rate limiting by client IP (20 requests per minute)
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit("speak", ip, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retryAfterSeconds);
    }

    // 2. Parse and validate input text & language
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' parameter in request body." },
        { status: 400 }
      );
    }

    const text = body.text.trim();
    if (!text) {
      return NextResponse.json({ error: "Text cannot be empty." }, { status: 400 });
    }

    // Safe maximum character length limit (3000 characters)
    if (text.length > 3000) {
      return NextResponse.json(
        { error: `Text too long (${text.length} chars). Maximum allowed is 3000 characters.` },
        { status: 400 }
      );
    }

    // Accept only languages hi-IN and en-IN (normalizing shorthand 'hi' / 'en' if provided)
    let rawLang = typeof body.lang === "string" ? body.lang.trim() : "en-IN";
    if (rawLang === "hi") rawLang = "hi-IN";
    if (rawLang === "en") rawLang = "en-IN";

    if (!ALLOWED_LANGUAGES.includes(rawLang as AllowedLanguage)) {
      return NextResponse.json(
        {
          error: "Invalid language. Allowed languages are 'hi-IN' and 'en-IN'."
        },
        { status: 400 }
      );
    }
    const validatedLang: AllowedLanguage = rawLang as AllowedLanguage;

    // 3. Check for AWS credentials with MY_ prefix (Rules 5, 6, 7)
    const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY;
    const region = process.env.MY_AWS_REGION || "ap-south-1";

    if (!accessKeyId || !secretAccessKey) {
      // Graceful signal to frontend: AWS credentials not configured, use browser fallback
      return NextResponse.json(
        { error: "POLLY_UNCONFIGURED", message: "Amazon Polly credentials not set in .env.local." },
        { status: 503 }
      );
    }

    // 4. Initialize Amazon Polly Client (server-side only)
    const pollyClient = new PollyClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    // 5. Synthesize speech using Kajal Neural voice (Rule 9)
    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      VoiceId: "Kajal",
      LanguageCode: validatedLang,
      OutputFormat: "mp3",
      Text: text,
      TextType: "text"
    });

    const response = await pollyClient.send(command);

    if (!response.AudioStream) {
      return NextResponse.json({ error: "No audio stream returned by Amazon Polly." }, { status: 500 });
    }

    // Convert stream to Buffer / Uint8Array
    const audioBytes = await response.AudioStream.transformToByteArray();

    return new NextResponse(Buffer.from(audioBytes), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined;
    console.error("Polly speech synthesis error:", err?.message || error);
    return NextResponse.json(
      {
        error: "POLLY_ERROR",
        message: err?.message || "Failed to synthesize speech with Amazon Polly."
      },
      { status: 500 }
    );
  }
}
