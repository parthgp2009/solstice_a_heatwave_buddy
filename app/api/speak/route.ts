import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// In-memory rate limiting: map IP -> timestamps array
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by client IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before requesting more audio." },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 2. Parse and validate input text
    const body = await req.json().catch(() => null);
    if (!body || typeof body.text !== "string") {
      return NextResponse.json({ error: "Missing 'text' parameter in request body." }, { status: 400 });
    }

    const text = body.text.trim();
    if (!text) {
      return NextResponse.json({ error: "Text cannot be empty." }, { status: 400 });
    }

    // Safety rule: max 1500 characters
    if (text.length > 1500) {
      return NextResponse.json(
        { error: `Text too long (${text.length} chars). Maximum allowed is 1500 characters.` },
        { status: 400 }
      );
    }

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

    // 5. Build SynthesizeSpeechCommand using Kajal Neural voice (Rule 9)
    // Kajal is AWS Polly's bilingual Hindi and Indian English Neural voice
    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      VoiceId: "Kajal",
      LanguageCode: body.lang === "hi" ? "hi-IN" : "en-IN",
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
  } catch (error: any) {
    console.error("Polly speech synthesis error:", error?.message || error);
    return NextResponse.json(
      {
        error: "POLLY_ERROR",
        message: error?.message || "Failed to synthesize speech with Amazon Polly."
      },
      { status: 500 }
    );
  }
}
