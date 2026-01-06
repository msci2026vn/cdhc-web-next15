import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl overflow-hidden">
                <Image
                  src="/icons/icon-512x512.png"
                  alt="CĐHC Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <strong className="block text-base font-bold">
                  Con Đường Hữu Cơ
                </strong>
                <span className="text-xs text-slate-400">
                  Super App Nông Nghiệp
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              Ứng dụng toàn diện cho nông dân hữu cơ Việt Nam. AI chẩn đoán
              bệnh, sàn thương mại, truy xuất nguồn gốc, quản lý HTX.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                📘
              </Link>
              <Link
                href="https://youtube.com"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                ▶️
              </Link>
              <Link
                href="https://tiktok.com"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                🎵
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {["USDA Organic", "TraceViet", "VietGAP"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-slate-800 text-xs rounded-full text-slate-300"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-lg mb-6">Tính Năng</h4>
            <ul className="space-y-3">
              {[
                { label: "AI Chẩn đoán bệnh", href: "/features/ai-diagnosis" },
                { label: "Chợ nông sản", href: "/features/marketplace" },
                {
                  label: "Truy xuất nguồn gốc",
                  href: "/features/traceability",
                },
                { label: "Quản lý HTX", href: "/features/coop-management" },
                { label: "Dự báo thời tiết", href: "/features/weather" },
                { label: "Trợ lý AI", href: "/features/ai-assistant" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="text-green-500">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6">Hỗ Trợ</h4>
            <ul className="space-y-3">
              {[
                { label: "Hướng dẫn sử dụng", href: "/support/guide" },
                { label: "Câu hỏi thường gặp", href: "/support/faq" },
                { label: "Video hướng dẫn", href: "/support/videos" },
                { label: "Hotline: 1900 xxxx", href: "tel:1900xxxx" },
                { label: "Zalo hỗ trợ", href: "https://zalo.me/cdhc" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="text-green-500">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <span>📍</span>
                TP. Hồ Chí Minh, Việt Nam
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <span>📧</span>
                contact@cdhc.vn
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <span>📞</span>
                1900 1234
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <span>⏰</span>
                24/7 hỗ trợ
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-12 flex justify-center">
          <Link
            href="/tra-cuu-tai-khoan"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <span className="text-2xl">🔍</span>
            <span>Tra Cứu Tài Khoản Cũ</span>
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 Con Đường Hữu Cơ. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/api-docs"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              API cho đối tác
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
