"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun02Icon, Menu01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

export default function TopBar() {
  const { lang, setLang, t } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignInClick = () => {
    alert(
      lang === "en"
        ? "Google Sign-In will connect via Supabase in Phase 3."
        : "गूगल साइन-इन चरण 3 में जुड़ेगा।"
    );
  };

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 text-[#1E2A44] hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-[#F47A1F]/15 text-[#F47A1F] flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Sun02Icon} size={22} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-[#1E2A44]">
              {t.brand}
            </span>
            <span className="text-[10px] font-semibold text-[#5B6577] tracking-wider uppercase mt-0.5">
              {lang === "en" ? "Heat Safety India" : "गर्मी सुरक्षा साथी"}
            </span>
          </div>
        </a>

        {/* Desktop Nav Links (Hidden under 900px) */}
        <nav className="hidden min-[900px]:flex items-center gap-7 text-sm font-semibold text-[#5B6577]">
          <a
            href="#"
            className="text-[#1E2A44] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F47A1F] after:rounded-full"
          >
            {t.nav.home}
          </a>
          <a href="#about" className="hover:text-[#1E2A44] transition-colors">
            {t.nav.about}
          </a>
          <a href="#plan" className="hover:text-[#1E2A44] transition-colors">
            {t.nav.safetyPlan}
          </a>
          <a href="#faqs" className="hover:text-[#1E2A44] transition-colors">
            {t.nav.faqs}
          </a>
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
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#F47A1F] py-1"
          >
            {t.nav.home}
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-sm text-[#5B6577] hover:text-[#1E2A44] py-1"
          >
            {t.nav.about}
          </a>
          <a
            href="#plan"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-sm text-[#5B6577] hover:text-[#1E2A44] py-1"
          >
            {t.nav.safetyPlan}
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-sm text-[#5B6577] hover:text-[#1E2A44] py-1"
          >
            {t.nav.faqs}
          </a>
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
