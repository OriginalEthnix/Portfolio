import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhruv Wadhwa | The Vibe Studio — Developer × Artist Portfolio",
  description:
    "Portfolio of Dhruv Wadhwa — CS undergrad specializing in AI & Robotics at VIT Chennai. Developer, rapper, and performer. Explore projects, skills, and creative work through an immersive DAW-IDE hybrid experience.",
  keywords: [
    "Dhruv Wadhwa",
    "portfolio",
    "developer",
    "AI",
    "robotics",
    "VIT Chennai",
    "rapper",
    "full-stack",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Dhruv Wadhwa" }],
  openGraph: {
    title: "Dhruv Wadhwa | The Vibe Studio",
    description:
      "Developer × Artist — An immersive portfolio experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
