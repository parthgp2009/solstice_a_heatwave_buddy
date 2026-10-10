import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heatwave Buddy | Extreme Heat Safety & Action Plan",
  description: "Real-time heat safety guidance, safe outdoor hours, hydration schedules, and emergency advice for India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
