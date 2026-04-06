import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "placeholder-key",
});

const MUSHROOM_PROMPT = `You are a world-class expert mycologist with 30+ years of field experience.
You are analyzing multiple photos of the SAME mushroom specimen from different angles.
Use ALL provided images together for the most accurate identification possible.

CRITICAL SAFETY RULES (non-negotiable):
1. If ANY image shows a bulbous/sack-like base (volva) → likely Amanita → mark HIGH risk
2. If cap has white/yellowish warts or patches → likely Amanita → mark HIGH risk  
3. If gills are pure white and free from stem → Amanita indicator → mark HIGH risk
4. If ANY deadly lookalike exists for this species → mark at least MEDIUM risk
5. When in doubt between two risk levels → ALWAYS choose the higher risk level
6. A wrong LOW risk result can kill someone — be conservative

Analyze carefully: cap shape/color/texture/warts, gill color/spacing/attachment,
stem features/ring/skirt, base/volva shape, overall size and habitat clues.

Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text.

{
  "commonName": "string",
  "scientificName": "string",
  "riskLevel": "HIGH" or "MEDIUM" or "LOW",
  "edibility": "Edible" or "Toxic" or "Deadly" or "Unknown",
  "confidence": "High" or "Medium" or "Low",
  "keyFeatures": ["string","string","string","string","string"],
  "color": "string",
  "smell": "string",
  "habitat": "string",
  "distribution": "string",
  "seasonality": "string",
  "criticalFeatures": ["string","string","string"],
  "economicValue": "string",
  "similarSpecies": [
    {
      "name": "string",
      "scientificName": "string",
      "toxicity": "DEADLY" or "TOXIC" or "SAFE",
      "differences": ["string","string","string"]
    }
  ],
  "recommendedAction": "string",
  "funFact": "string"
}

If the image does not show a mushroom, set commonName to "Not a mushroom" and riskLevel to "LOW".`;

export async function POST(request: NextRequest) {
  try {
    const { imagesBase64, imageHash, userId } = await request.json();

    if (
      !imagesBase64 ||
      !Array.isArray(imagesBase64) ||
      imagesBase64.length === 0 ||
      !imageHash
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!userId) {
      return NextResponse.json({ error: "signup_required" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .maybeSingle();

    if (!profile || profile.credits < 10) {
      return NextResponse.json(
        { error: "insufficient_credits" },
        { status: 402 },
      );
    }

    // Check cache first
    const { data: cachedResult } = await supabase
      .from("analyses")
      .select("result, image_url")
      .eq("image_hash", imageHash)
      .maybeSingle();

    if (cachedResult) {
      return NextResponse.json({ result: cachedResult.result, cached: true });
    }

    // Call Claude Sonnet for better accuracy on complex multi-image identification
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            ...imagesBase64.map((img: string) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: "image/jpeg" as const,
                data: img,
              },
            })),
            { type: "text" as const, text: MUSHROOM_PROMPT },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();
    const result = JSON.parse(responseText);

    // Upload all images to Supabase Storage
    const imageUrls: string[] = [];
    for (let i = 0; i < imagesBase64.length; i++) {
      try {
        const buffer = Buffer.from(imagesBase64[i], "base64");
        const fileName = `${imageHash}_${i}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("mushroom-scans")
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });
        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from("mushroom-scans")
            .getPublicUrl(fileName);
          imageUrls.push(urlData.publicUrl);
        }
      } catch {}
    }

    // Deduct credits
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("credits, total_identifications")
      .eq("id", userId)
      .maybeSingle();

    if (currentProfile) {
      await supabase
        .from("profiles")
        .update({
          credits: currentProfile.credits - 10,
          total_identifications: currentProfile.total_identifications + 1,
        })
        .eq("id", userId);
    }

    // Save analysis
    await supabase.from("analyses").insert({
      user_id: userId,
      ip_address: ip,
      image_hash: imageHash,
      result,
      credits_used: 10,
      image_url: imageUrls[0] || null,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
    });

    return NextResponse.json({ result, cached: false });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error.message },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "placeholder-key",
});

const MUSHROOM_PROMPT = `You are a world-class expert mycologist with 30+ years of field experience.
You are analyzing multiple photos of the SAME mushroom specimen from different angles.
Use ALL provided images together for the most accurate identification possible.

CRITICAL SAFETY RULES (non-negotiable):
1. If ANY image shows a bulbous/sack-like base (volva) → likely Amanita → mark HIGH risk
2. If cap has white/yellowish warts or patches → likely Amanita → mark HIGH risk  
3. If gills are pure white and free from stem → Amanita indicator → mark HIGH risk
4. If ANY deadly lookalike exists for this species → mark at least MEDIUM risk
5. When in doubt between two risk levels → ALWAYS choose the higher risk level
6. A wrong LOW risk result can kill someone — be conservative

Analyze carefully: cap shape/color/texture/warts, gill color/spacing/attachment,
stem features/ring/skirt, base/volva shape, overall size and habitat clues.

Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text.

{
  "commonName": "string",
  "scientificName": "string",
  "riskLevel": "HIGH" or "MEDIUM" or "LOW",
  "edibility": "Edible" or "Toxic" or "Deadly" or "Unknown",
  "confidence": "High" or "Medium" or "Low",
  "keyFeatures": ["string","string","string","string","string"],
  "color": "string",
  "smell": "string",
  "habitat": "string",
  "distribution": "string",
  "seasonality": "string",
  "criticalFeatures": ["string","string","string"],
  "economicValue": "string",
  "similarSpecies": [
    {
      "name": "string",
      "scientificName": "string",
      "toxicity": "DEADLY" or "TOXIC" or "SAFE",
      "differences": ["string","string","string"]
    }
  ],
  "recommendedAction": "string",
  "funFact": "string"
}

If the image does not show a mushroom, set commonName to "Not a mushroom" and riskLevel to "LOW".`;

export async function POST(request: NextRequest) {
  try {
    const { imagesBase64, imageHash, userId } = await request.json();

    if (
      !imagesBase64 ||
      !Array.isArray(imagesBase64) ||
      imagesBase64.length === 0 ||
      !imageHash
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!userId) {
      return NextResponse.json({ error: "signup_required" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .maybeSingle();

    if (!profile || profile.credits < 10) {
      return NextResponse.json(
        { error: "insufficient_credits" },
        { status: 402 },
      );
    }

    // Check cache first
    const { data: cachedResult } = await supabase
      .from("analyses")
      .select("result, image_url")
      .eq("image_hash", imageHash)
      .maybeSingle();

    if (cachedResult) {
      return NextResponse.json({ result: cachedResult.result, cached: true });
    }

    // Call Claude Sonnet for better accuracy on complex multi-image identification
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            ...imagesBase64.map((img: string) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: "image/jpeg" as const,
                data: img,
              },
            })),
            { type: "text" as const, text: MUSHROOM_PROMPT },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();
    const result = JSON.parse(responseText);

    // Upload all images to Supabase Storage
    const imageUrls: string[] = [];
    for (let i = 0; i < imagesBase64.length; i++) {
      try {
        const buffer = Buffer.from(imagesBase64[i], "base64");
        const fileName = `${imageHash}_${i}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("mushroom-scans")
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });
        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from("mushroom-scans")
            .getPublicUrl(fileName);
          imageUrls.push(urlData.publicUrl);
        }
      } catch {}
    }

    // Deduct credits
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("credits, total_identifications")
      .eq("id", userId)
      .maybeSingle();

    if (currentProfile) {
      await supabase
        .from("profiles")
        .update({
          credits: currentProfile.credits - 10,
          total_identifications: currentProfile.total_identifications + 1,
        })
        .eq("id", userId);
    }

    // Save analysis
    await supabase.from("analyses").insert({
      user_id: userId,
      ip_address: ip,
      image_hash: imageHash,
      result,
      credits_used: 10,
      image_url: imageUrls[0] || null,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
    });

    return NextResponse.json({ result, cached: false });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error.message },
      { status: 500 },
    );
  }
}
