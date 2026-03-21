import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakBuddy — AI Speech Therapy Practice for Kids",
  description:
    "Fun, AI-powered speech therapy practice at home. Your child says the word, our AI listens and gives instant, kid-friendly feedback. Free starter packs included!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
