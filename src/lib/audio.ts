const WHISPER_SERVER_URL =
  process.env.NEXT_PUBLIC_WHISPER_SERVER_URL ?? "http://localhost:8000";

export async function startRecording(): Promise<{
  mediaRecorder: MediaRecorder;
  audioChunks: Blob[];
}> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm",
  });

  const audioChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start(100); // collect data every 100ms

  return { mediaRecorder, audioChunks };
}

export function stopRecording(mediaRecorder: MediaRecorder): Promise<Blob> {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Access chunks from the closure that created this recorder
      const chunks =
        (mediaRecorder as MediaRecorder & { _chunks?: Blob[] })._chunks ?? [];
      resolve(new Blob(chunks, { type: "audio/webm" }));
    };
    mediaRecorder.stop();
  });
}

export async function analyzeAudio(
  audioBlob: Blob,
  targetWord: string,
  targetPhoneme: string
): Promise<{
  transcript: string;
  score: number;
  phonemeScores: Record<string, number>;
  feedback: string;
  suggestion: string;
}> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("target_word", targetWord);
  formData.append("target_phoneme", targetPhoneme);

  const response = await fetch(`${WHISPER_SERVER_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

// Demo mode: simulate analysis when GPU server is not available
export function analyzeAudioDemo(
  targetWord: string,
  targetPhoneme: string
): {
  transcript: string;
  score: number;
  phonemeScores: Record<string, number>;
  feedback: string;
  suggestion: string;
} {
  const score = Math.floor(Math.random() * 40) + 60; // 60-100
  const phonemeScore = Math.floor(Math.random() * 30) + 70; // 70-100

  const feedbacks =
    score >= 90
      ? [
          "Amazing job! That sounded perfect! 🌟",
          "Wow, you nailed it! Super clear! 🎉",
          "Incredible! Your sound was spot on! ⭐",
        ]
      : score >= 75
        ? [
            "Great try! Almost perfect — one more time! 💪",
            "So close! You're getting really good at this! 👏",
            "Nice work! Just a tiny bit more and you've got it! 🔥",
          ]
        : [
            "Good effort! Let's try again — you're getting better! 🌈",
            "Keep going! Practice makes perfect! 💫",
            "Not bad! Focus on the tip and try once more! 🎯",
          ];

  const suggestions =
    score >= 90
      ? ["Try the next word!", "You're ready to level up!", "Keep up the amazing work!"]
      : targetPhoneme === "/r/"
        ? [
            "Try curling your tongue back a little more.",
            "Pretend you're a pirate — Arrrr!",
            "Pull your tongue back without touching the roof of your mouth.",
          ]
        : targetPhoneme === "/s/"
          ? [
              "Keep your tongue behind your teeth and blow gently.",
              "Think of a snake hissing — sssss!",
              "Smile and let the air slide over your tongue.",
            ]
          : [
              "Slow down and focus on making the sound clearly.",
              "Try stretching the sound out longer.",
              "Take a breath and try once more!",
            ];

  return {
    transcript: targetWord,
    score,
    phonemeScores: { [targetPhoneme]: phonemeScore },
    feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
  };
}
