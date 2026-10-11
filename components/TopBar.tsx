"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, ArrowRight01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

/**
 * Clean inline Google "G" logo for the OAuth button.
 */
function GoogleIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function TopBar() {
  const { lang, setLang, t, user, isAuthLoading, signInWithGoogle, signOut } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/plan", label: t.nav.safetyPlan },
    { href: "/weather", label: t.nav.weather },
    { href: "/about", label: t.nav.about },
    { href: "/faqs", label: t.nav.faqs }
  ];

  // Derived user display details from Supabase auth session
  const userDisplayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "User";

  const userAvatarUrl = (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) as string | undefined;
  const userInitial = (user?.email?.[0] || userDisplayName[0] || "U").toUpperCase();

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

          {/* Desktop Auth Section */}
          {isAuthLoading ? (
            <div className="hidden sm:inline-flex w-28 h-8 bg-[#1E2A44]/10 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-[#1E2A44] bg-[#FFFAF4] border border-[#1E2A44]/20 rounded-xl hover:bg-[#FBEBD9] transition-all cursor-pointer subtle-shadow"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                {userAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userAvatarUrl}
                    alt={userDisplayName}
                    className="w-5 h-5 rounded-full object-cover border border-[#1E2A44]/20"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#F47A1F] text-[#FFFAF4] flex items-center justify-center text-[10px] font-black">
                    {userInitial}
                  </span>
                )}
                <span className="max-w-[100px] truncate text-[11px] font-semibold text-[#1E2A44]">
                  {userDisplayName}
                </span>
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2.5} className="text-[#5B6577]" />
              </button>

              {/* User Dropdown Card */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-2">
                  <div className="px-2 py-1 border-b border-[#1E2A44]/10 pb-2">
                    <p className="text-[11px] text-[#5B6577] font-medium">{t.nav.signedInAs}</p>
                    <p className="text-xs font-bold text-[#1E2A44] truncate">{user.email}</p>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-[#EAF6EE] text-[#2E9E5B] text-[10px] font-bold">
                      ✓ Google Verified
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-[#D03B29] hover:bg-[#FBEBD9] rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{t.nav.signOut}</span>
                    <span className="text-[11px] text-[#D03B29]/70 font-bold">↳</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-[#1E2A44] bg-[#FFFAF4] border border-[#1E2A44]/20 rounded-xl hover:bg-[#FBEBD9] transition-all cursor-pointer subtle-shadow"
            >
              <GoogleIcon />
              <span>{t.nav.signIn}</span>
            </button>
          )}

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

          {/* Mobile Auth Drawer Item */}
          {isAuthLoading ? (
            <div className="w-full h-9 bg-[#1E2A44]/10 rounded-xl animate-pulse mt-1" />
          ) : user ? (
            <div className="pt-2 border-t border-[#1E2A44]/10 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-1 py-1">
                {userAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userAvatarUrl}
                    alt={userDisplayName}
                    className="w-7 h-7 rounded-full object-cover border border-[#1E2A44]/20"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-[#F47A1F] text-[#FFFAF4] flex items-center justify-center text-xs font-black">
                    {userInitial}
                  </span>
                )}
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-[#1E2A44] truncate">{userDisplayName}</span>
                  <span className="text-[10px] text-[#5B6577] truncate">{user.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full text-left font-semibold text-xs text-[#D03B29] py-2 px-2.5 bg-[#FBEBD9]/60 rounded-xl cursor-pointer flex items-center justify-between"
              >
                <span>{t.nav.signOut}</span>
                <span className="text-xs font-bold">↳</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                signInWithGoogle();
              }}
              className="w-full text-left font-semibold text-sm text-[#1E2A44] pt-2 border-t border-[#1E2A44]/10 cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <GoogleIcon />
                <span>{t.nav.signIn}</span>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
