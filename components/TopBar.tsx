"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

export default function TopBar() {
  const { lang, setLang, t } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignInClick = () => {
    alert(
      lang === "en"
        ? "Google Sign-In will connect via Supabase in Phase 3."
        : "गूगल साइन-इन चरण 3 में जुड़ेगा।"
    );
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/plan", label: t.nav.safetyPlan },
    { href: "/faqs", label: t.nav.faqs }
  ];

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
      <div className="flex items-center justify-between">
        {/* Brand Logo in Top-Left Corner */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity"
        >
          {/* Solstice Logo blended into top-left */}
          <div className="relative h-8 sm:h-10 w-32 sm:w-44 flex items-center">
            <Image
              src="/logo.png"
              alt="Solstice Heatwave Buddy Logo"
              width={180}
              height={42}
              priority
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* Sub-label border divider */}
          <div className="hidden sm:flex flex-col border-l border-[#1E2A44]/15 pl-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F47A1F] leading-tight">
              Heatwave Buddy
            </span>
            <span className="text-[10px] font-medium text-[#5B6577] leading-tight">
              {lang === "hi" ? "लू साथी" : "Heat Safety India"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Multi-page navigation) */}
        <nav className="hidden min-[900px]:flex items-center gap-7 text-sm font-semibold text-[#5B6577]">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 transition-colors relative ${
                  isActive
                    ? "text-[#1E2A44] font-extrabold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F47A1F] after:rounded-full"
                    : "hover:text-[#1E2A44]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Pill Language Toggle & Google Sign-In */}
        <div className="flex items-center gap-3">
          {/* Pill Language Toggle (two-option pill) */}
          <div
            className="flex items-center bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-full p-1 subtle-shadow"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#F47A1F] text-[#FFFAF4] shadow-sm"
                  : "text-[#5B6577] hover:text-[#1E2A44]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                lang === "hi"
                  ? "bg-[#F47A1F] text-[#FFFAF4] shadow-sm"
                : "text-[#5B6577] hover:text-[#1E2A44]"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Sign In with Google Button (Desktop) */}
          <button
            type="button"
            onClick={handleSignInClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#1E2A44] bg-[#FFFAF4] border border-[#1E2A44]/20 rounded-xl hover:bg-[#FBEBD9] transition-all cursor-pointer subtle-shadow"
          >
            <span>{t.nav.signIn}</span>
          </button>

          {/* Mobile Menu Button (under 900px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            className="min-[900px]:hidden p-2 rounded-xl text-[#1E2A44] bg-[#FFFAF4] border border-[#1E2A44]/15 cursor-pointer hover:bg-[#FBEBD9]"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (under 900px) */}
      {mobileMenuOpen && (
        <div className="min-[900px]:hidden mt-3 p-4 bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[18px] card-shadow flex flex-col gap-3">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 text-sm font-bold ${
                  isActive ? "text-[#F47A1F]" : "text-[#5B6577] hover:text-[#1E2A44]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleSignInClick}
            className="w-full text-left font-semibold text-sm text-[#1E2A44] pt-2 border-t border-[#1E2A44]/10 cursor-pointer flex items-center justify-between"
          >
            <span>{t.nav.signIn}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </header>
  );
}
