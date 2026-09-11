import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt } from "@/lib/buildPrompt";
import type { ItineraryResponse, TripFormData } from "@/lib/types";

export const maxDuration = 60;

function isValidTripFormData(body: unknown): body is TripFormData {
  if (!body || typeof body !== "object") return false;
  const data = body as Record<string, unknown>;
  return (
    typeof data.destination === "string" &&
    data.destination.trim().length > 0 &&
    typeof data.days === "number" &&
    data.days >= 1 &&
    data.days <= 21 &&
    typeof data.budgetPerDay === "number" &&
    data.budgetPerDay > 0 &&
    typeof data.currency === "string" &&
    typeof data.pace === "string" &&
    typeof data.vibe === "string" &&
    Array.isArray(data.interests) &&
    typeof data.groupType === "string"
  );
}

function isValidItineraryResponse(body: unknown): body is ItineraryResponse {
  if (!body || typeof body !== "object") return false;
  const data = body as Record<string, unknown>;
  return (
    typeof data.destination === "string" &&
    Array.isArray(data.dayPlans) &&
    data.dayPlans.length > 0 &&
    Array.isArray(data.bookingChecklist)
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidTripFormData(body)) {
    return NextResponse.json({ error: "Missing or invalid trip details." }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server isn't configured correctly (missing API key) — contact the developer." },
      { status: 500 }
    );
  }

  const client = new OpenAI({ baseURL: "https://api.deepseek.com", apiKey });
  const prompt = buildPrompt(body);

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "The generator had trouble producing this — try again." },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "The generator returned something we could not read — try again." },
        { status: 502 }
      );
    }

    if (!isValidItineraryResponse(parsed)) {
      return NextResponse.json(
        { error: "The generator returned something we could not read — try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    if (err instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        { error: "Server isn't configured correctly (API key issue) — contact the developer." },
        { status: 500 }
      );
    }
    if (err instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: "Too many requests right now — try again in a minute." },
        { status: 429 }
      );
    }
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "The generator had trouble producing this — try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: "Something went wrong — try again." }, { status: 500 });
  }
}
