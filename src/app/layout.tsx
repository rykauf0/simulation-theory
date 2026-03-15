import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMULATION THEORY",
  description: "AI-powered organizational health simulation engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scanlines crt-vignette">
        {children}
      </body>
    </html>
  );
}
