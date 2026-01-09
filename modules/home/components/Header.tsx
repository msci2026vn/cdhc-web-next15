"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SecureStorage, type UserData } from "@/modules/shared";

// ===== NAVIGATION DATA (moved outside to avoid recreation) =====
const NAV_ITEMS = [
  { href: "#features", label: "Tính Năng" },
  { href: "#ai", label: "AI Chẩn Đoán" },
  { href: "#marketplace", label: "Chợ Hữu Cơ" },
  { href: "#cooperative", label: "Hợp Tác Xã" },
  { href: "#community", label: "Cộng Đồng" },
  { href: "#download", label: "Tải App" },
] as const;

const MOBILE_NAV_ITEMS = [
  { href: "#features", label: "Tính Năng", icon: "📱" },
  { href: "#ai", label: "AI Chẩn Đoán", icon: "🧠" },
  { href: "#marketplace", label: "Chợ Hữu Cơ", icon: "🏪" },
  { href: "#cooperative", label: "Hợp Tác Xã", icon: "👥" },
  { href: "#community", label: "Cộng Đồng", icon: "🌍" },
  { href: "#download", label: "Tải App", icon: "📲" },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Ref to track if scroll handler is throttled
  const ticking = useRef(false);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = SecureStorage.getUserSync();
      setUser(userData);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const hamburgerLineClass = `w-6 h-0.5 transition-all ${isScrolled ? "bg-slate-800" : "bg-white"}`;

  // Throttled scroll handler using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Memoized toggle handler
  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Memoized close handler
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden">
                <Image
                  src="/icons/icon-512x512.png"
                  alt="CĐHC Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <strong
                  className={`block text-base font-bold ${isScrolled ? "text-slate-900" : "text-white"}`}
                >
                  Con Đường Hữu Cơ
                </strong>
                <span
                  className={`text-xs ${isScrolled ? "text-slate-500" : "text-white/80"}`}
                >
                  Super App Nông Nghiệp
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-green-500 ${
                    isScrolled ? "text-slate-700" : "text-white/90"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isCheckingAuth ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <Link
                  href="/community/dashboard"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right hidden lg:block">
                    <div
                      className={`text-sm font-semibold ${isScrolled ? "text-slate-900" : "text-white"}`}
                    >
                      {user.name}
                    </div>
                    <div
                      className={`text-xs ${isScrolled ? "text-slate-500" : "text-white/70"}`}
                    >
                      Xem Dashboard
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold rounded-full gradient-primary text-white hover:shadow-lg transition-all"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={handleToggleMobileMenu}
            >
              <span
                className={`${hamburgerLineClass} ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`${hamburgerLineClass} ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`${hamburgerLineClass} ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "70px" }}
      >
        <nav className="flex flex-col p-6 gap-4">
          {MOBILE_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 text-slate-700 hover:bg-green-50 rounded-xl"
              onClick={handleCloseMobileMenu}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
            {isCheckingAuth ? (
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                </div>
              </div>
            ) : user ? (
              <Link
                href="/community/dashboard"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                onClick={handleCloseMobileMenu}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-lg">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-green-600">Xem Dashboard →</div>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 text-center font-semibold text-white gradient-primary rounded-full"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
