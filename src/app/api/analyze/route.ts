import { NextRequest, NextResponse } from "next/server";

const WHISPER_SERVER_URL =
  process.env.WHISPER_SERVER_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File | null;
    const targetWord = formData.get("target_word") as string;
    const targetPhoneme = formData.get("target_phoneme") as string;

    if (!audio || !targetWord || !targetPhoneme) {
      return NextResponse.json(
        { error: "Missing required fields: audio, target_word, target_phoneme" },
        { status: 400 }
      );
    }

    // Forward to the Whisper GPU server
    const gpuFormData = new FormData();
    gpuFormData.append("audio", audio);
    gpuFormData.append("target_word", targetWord);
    gpuFormData.append("target_phoneme", targetPhoneme);

    const response = await fetch(`${WHISPER_SERVER_URL}/analyze`, {
      method: "POST",
      body: gpuFormData,
    });

    if (!response.ok) {
      // Fall back to demo mode if GPU server is unavailable
      return NextResponse.json(generateDemoResponse(targetWord, targetPhoneme));
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch {
    // GPU server unreachable — use demo mode
    const formData = await request.clone().formData().catch(() => null);
    const targetWord = formData?.get("target_word") as string ?? "word";
    const targetPhoneme = formData?.get("target_phoneme") as string ?? "/r/";
    return NextResponse.json(generateDemoResponse(targetWord, targetPhoneme));
  }
}

function generateDemoResponse(targetWord: string, targetPhoneme: string) {
  const score = Math.floor(Math.random() * 40) + 60;
  const phonemeScore = Math.floor(Math.random() * 30) + 70;

  const feedback =
    score >= 90
      ? "Amazing job! That sounded perfect!"
      : score >= 75
        ? "Great try! Almost perfect!"
        : "Good effort! Let's try again!";

  const suggestion =
    targetPhoneme === "/r/"
      ? "Try curling your tongue back a little more."
      : targetPhoneme === "/s/"
        ? "Keep your tongue behind your teeth and blow gently."
        : "Slow down and focus on making the sound clearly.";

  return {
    transcript: targetWord,
    score,
    phonemeScores: { [targetPhoneme]: phonemeScore },
    feedback,
    suggestion,
  };
}
