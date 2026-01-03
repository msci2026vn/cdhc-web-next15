"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hamburgerLineClass = `w-6 h-0.5 transition-all ${isScrolled ? "bg-slate-800" : "bg-white"}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
              <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                🌱
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
              {[
                { href: "#features", label: "Tính Năng" },
                { href: "#ai", label: "AI Chẩn Đoán" },
                { href: "#marketplace", label: "Chợ Hữu Cơ" },
                { href: "#cooperative", label: "Hợp Tác Xã" },
                { href: "#community", label: "Cộng Đồng" },
                { href: "#download", label: "Tải App" },
              ].map((item) => (
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
              <Link
                href="/login"
                className={`px-5 py-2.5 text-sm font-semibold rounded-full border-2 transition-all ${
                  isScrolled
                    ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    : "border-white/50 text-white hover:bg-white hover:text-green-700"
                }`}
              >
                Đăng Nhập
              </Link>
              <a
                href="#download"
                className="px-5 py-2.5 text-sm font-semibold rounded-full gradient-primary text-white hover:shadow-lg transition-all"
              >
                Tải Miễn Phí
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
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
          {[
            { href: "#features", label: "Tính Năng", icon: "📱" },
            { href: "#ai", label: "AI Chẩn Đoán", icon: "🧠" },
            { href: "#marketplace", label: "Chợ Hữu Cơ", icon: "🏪" },
            { href: "#cooperative", label: "Hợp Tác Xã", icon: "👥" },
            { href: "#community", label: "Cộng Đồng", icon: "🌍" },
            { href: "#download", label: "Tải App", icon: "📲" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 text-slate-700 hover:bg-green-50 rounded-xl"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
            <Link
              href="/login"
              className="w-full py-3 text-center font-semibold text-green-600 border-2 border-green-600 rounded-full"
            >
              Đăng Nhập
            </Link>
            <a
              href="#download"
              className="w-full py-3 text-center font-semibold text-white gradient-primary rounded-full"
            >
              Tải Miễn Phí
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
