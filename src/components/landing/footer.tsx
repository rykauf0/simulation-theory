export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/60 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              <span className="text-3xl">🎙️</span> SpeakBuddy
            </h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              AI-powered speech therapy practice for kids. Not a replacement for
              your speech-language pathologist — a supplement that makes daily
              practice fun.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="hover:text-gray-900">
              Pricing
            </a>
          </div>

          <div className="text-xs text-gray-400">
            <p>
              SpeakBuddy is a practice tool, not a medical device. Always follow
              your SLP&apos;s recommendations.
            </p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} SpeakBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
