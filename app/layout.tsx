import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-devanagari",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solsitice-a-heat-wave-buddy.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Solstice: Heatwave Buddy",
  description: "Live temperature, adjusted feels-like index, and personalised heat safety plans for India.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Solstice: Heatwave Buddy",
    description: "Live temperature, adjusted feels-like index, and personalised heat safety plans for India.",
    url: siteUrl,
    siteName: "Solstice: Heatwave Buddy",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Solstice: Heatwave Buddy - Real-Time Heat Safety",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solstice: Heatwave Buddy",
    description: "Live temperature, adjusted feels-like index, and personalised heat safety plans for India.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${notoSansDevanagari.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FDF3E7] text-[#1E2A44] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
