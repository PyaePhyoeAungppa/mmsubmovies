import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "MMSubMovie - Movies & Series with Myanmar Subtitles",
  description: "Watch the latest movies and series with Myanmar subtitles. Browse our collection of films and TV shows with direct streaming links.",
  keywords: ["myanmar", "subtitles", "movies", "series", "streaming", "telegram"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
