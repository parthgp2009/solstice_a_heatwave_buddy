import type { Metadata } from "next";
import { Rozha_One, Hind } from "next/font/google";
import "./globals.css";

const rozhaOne = Rozha_One({
  subsets: ["latin", "devanagari"],
  weight: ["400"],
  variable: "--font-rozha",
  display: "swap",
});

const hind = Hind({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heatwave Buddy | Spring Landscape Heat Safety",
  description: "Real-time heat safety guidance and living Spring landscape heat map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rozhaOne.variable} ${hind.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FBF4E6] text-[#2B3A2E]">
        {children}
      </body>
    </html>
  );
}
