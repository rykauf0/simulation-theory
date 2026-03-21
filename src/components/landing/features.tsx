export function LandingFeatures() {
  const features = [
    {
      icon: "👂",
      title: "AI That Actually Listens",
      description:
        "Unlike flashcard apps, SpeakBuddy uses AI speech recognition tuned for children's voices. It hears what your child says and gives accurate feedback.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: "🎮",
      title: "Fun & Gamified",
      description:
        "Stars, streaks, and celebrations keep kids motivated. 5-10 minute daily sessions that feel like a game, not homework.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: "🎯",
      title: "Targeted Practice",
      description:
        "Exercise packs focus on specific sounds (/r/, /s/, /l/, /th/, /sh/) at specific positions — exactly what your SLP recommends.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: "📊",
      title: "Track Progress",
      description:
        "See your child's improvement over time. Share progress with their speech therapist to keep everyone aligned.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description:
        "Your child's voice data is processed securely and never sold. We take children's privacy seriously (COPPA compliant).",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: "💰",
      title: "Affordable",
      description:
        "Free starter packs included. Additional packs just $4.99 each — less than 5 minutes of a private SLP session.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900">
            Why Parents Love SpeakBuddy
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Built by parents who know how hard it is to get kids to practice
            speech exercises at home.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
