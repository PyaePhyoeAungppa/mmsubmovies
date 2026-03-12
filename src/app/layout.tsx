import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "MMSubMovie - Best Platform for Myanmar Subtitled Movies & Series",
    template: "%s | MMSubMovie - Myanmar Subtitles"
  },
  description: "Watch and download the latest movies, KDramas, and series with ultra-clear Myanmar subtitles. Join our exclusive VIP lifetime membership to browse our premium collection. Watch directly on Telegram effortlessly.",
  keywords: ["myanmar", "subtitles", "movies", "series", "kdrama", "streaming", "telegram", "mmsub", "myanmar sub movie", "channel myanmar", "mmsubmovie vip", "buy movie myanmar"],
  authors: [{ name: "MMSubMovie" }],
  creator: "MMSubMovie",
  publisher: "MMSubMovie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MMSubMovie - Best Platform for Myanmar Subtitled Movies & Series",
    description: "Watch and download the latest movies, KDramas, and series with ultra-clear Myanmar subtitles. Watch directly on Telegram effortlessly.",
    url: 'https://mmsubmovie.org', // Note: update with actual deployment domain later
    siteName: 'MMSubMovie',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', // Default OG Banner
        width: 1200,
        height: 630,
        alt: 'MMSubMovie Banner',
      },
    ],
    locale: 'my_MM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMSubMovie - Best Platform for Myanmar Subtitled Movies & Series',
    description: 'Watch the latest movies & series with ultra-clear Myanmar subtitles directly from Telegram.',
    images: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, "dark")}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={'https://www.googletagmanager.com/gtag/js?id=G-P0LJ5X264P'}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P0LJ5X264P');
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#0a0a0f] text-white min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
