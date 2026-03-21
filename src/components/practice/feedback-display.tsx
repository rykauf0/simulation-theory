"use client";

interface FeedbackDisplayProps {
  score: number;
  feedback: string;
  suggestion: string;
  targetWord: string;
  streak: number;
  onNext: () => void;
  onTryAgain: () => void;
}

export function FeedbackDisplay({
  score,
  feedback,
  suggestion,
  targetWord,
  streak,
  onNext,
  onTryAgain,
}: FeedbackDisplayProps) {
  const isGreat = score >= 90;
  const isGood = score >= 75;

  const stars = isGreat ? 3 : isGood ? 2 : 1;

  return (
    <div className="animate-bounce-in">
      {/* Stars */}
      <div className="mb-4 flex justify-center gap-2">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`text-5xl transition-all ${
              n <= stars ? "opacity-100 scale-100" : "opacity-20 scale-75"
            }`}
            style={{
              animationDelay: `${n * 0.15}s`,
            }}
          >
            {n <= stars ? "⭐" : "☆"}
          </span>
        ))}
      </div>

      {/* Score */}
      <div
        className={`mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black text-white ${
          isGreat
            ? "bg-green-500"
            : isGood
              ? "bg-yellow-500"
              : "bg-orange-500"
        }`}
      >
        {score}
      </div>

      {/* Word repeated */}
      <p className="mb-2 text-lg text-gray-400">
        &ldquo;{targetWord}&rdquo;
      </p>

      {/* Feedback message */}
      <p className="mb-2 text-xl font-bold text-gray-900">{feedback}</p>
      <p className="mb-6 text-sm text-gray-500">{suggestion}</p>

      {/* Streak bonus */}
      {streak >= 3 && (
        <div className="mb-6 animate-bounce-in rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-bold text-white">
          {streak} in a row! You&apos;re on fire!
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onTryAgain}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Try Again
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          {isGreat ? "Next Word!" : "Next Word"}
        </button>
      </div>
    </div>
  );
}
