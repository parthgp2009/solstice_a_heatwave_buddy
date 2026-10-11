import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rateLimit";

export const ALLOWED_CITIES = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Jaipur"
] as const;

export const ALLOWED_OCCUPATIONS = [
  "Not specified",
  "Delivery Driver",
  "Student",
  "Farmer",
  "Traffic Police",
  "Office Worker"
] as const;

export const ALLOWED_AGE_BRACKETS = [
  "18 to 30",
  "31 to 45",
  "46 to 60",
  "Over 60"
] as const;

// Strict Zod schema for updating user preferences
// Rule 19 & Requirement 4: Strict validation rejects any health details, notes, or coordinates
export const PreferencesUpdateSchema = z
  .object({
    favorite_cities: z.array(z.enum(ALLOWED_CITIES)).max(8).optional(),
    default_city: z.enum(ALLOWED_CITIES).optional(),
    occupation: z.enum(ALLOWED_OCCUPATIONS).optional(),
    age_bracket: z.enum(ALLOWED_AGE_BRACKETS).optional(),
    preferred_language: z.enum(["en", "hi"]).optional()
  })
  .strict();

export async function GET(request?: Request) {
  // Rate limiting (20 requests per minute)
  const ip = request ? getClientIp(request) : "127.0.0.1";
  const rateLimit = checkRateLimit("preferences", ip, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    preferences: data ?? {
      id: user.id,
      preferred_language: "en",
      favorite_cities: ["Delhi"],
      default_city: "Delhi",
      occupation: "Not specified",
      age_bracket: null
    }
  });
}

export async function POST(request: Request) {
  // Rate limiting (20 requests per minute)
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit("preferences", ip, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Requirement 3: Under 18 safety lock -> Save NOTHING to database
  if (
    typeof body === "object" &&
    body !== null &&
    (body as { age_bracket?: string }).age_bracket === "Under 18"
  ) {
    return NextResponse.json(
      { error: "Preferences cannot be stored for users under 18 per safety regulations." },
      { status: 400 }
    );
  }

  const parseResult = PreferencesUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.issues },
      { status: 400 }
    );
  }

  const validated = parseResult.data;

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      id: user.id,
      favorite_cities: validated.favorite_cities ? [...validated.favorite_cities] : undefined,
      default_city: validated.default_city,
      occupation: validated.occupation,
      age_bracket: validated.age_bracket,
      preferred_language: validated.preferred_language,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, preferences: data });
}

export async function DELETE(request?: Request) {
  // Rate limiting (20 requests per minute)
  const ip = request ? getClientIp(request) : "127.0.0.1";
  const rateLimit = checkRateLimit("preferences", ip, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("user_preferences")
    .delete()
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "User preferences deleted successfully"
  });
}
