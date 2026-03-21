"use client";

import { useRef, useState, useCallback } from "react";

interface RecordButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (audioBlob: Blob) => void;
}

export function RecordButton({
  isRecording,
  onStartRecording,
  onStopRecording,
}: RecordButtonProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      onStartRecording();
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
    }
  }, [onStartRecording]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    recorder.onstop = () => {
      recorder.stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      onStopRecording(blob);
    };
    recorder.stop();
  }, [onStopRecording]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all ${
          isRecording
            ? "bg-red-500 shadow-lg shadow-red-200 animate-pulse-glow"
            : "bg-indigo-600 shadow-lg shadow-indigo-200 hover:scale-105 hover:bg-indigo-700"
        }`}
      >
        {isRecording ? (
          <svg
            className="h-10 w-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg
            className="h-12 w-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2Z" />
          </svg>
        )}
      </button>

      {permissionDenied && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          Microphone access is needed. Please enable it in your browser
          settings.
        </div>
      )}
    </div>
  );
}
