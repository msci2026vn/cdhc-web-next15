import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật của Con Đường Hữu Cơ (CDHC)",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-bold hover:opacity-90">
            Con Đường Hữu Cơ
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Chính sách bảo mật
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-slate-600">
          <p className="text-sm text-slate-400">
            Cập nhật lần cuối: 09/01/2026
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              1. Thông tin thu thập
            </h2>
            <p className="mb-2">Chúng tôi thu thập các thông tin sau:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Thông tin cá nhân: Họ tên, email, số điện thoại</li>
              <li>
                Thông tin tài khoản: Google OAuth (email, tên, ảnh đại diện)
              </li>
              <li>Thông tin sử dụng: Cookies, dữ liệu phân tích</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              2. Sử dụng thông tin
            </h2>
            <p className="mb-2">Thông tin của bạn được sử dụng để:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Cung cấp và cải thiện dịch vụ</li>
              <li>Xác thực người dùng</li>
              <li>Gửi thông báo quan trọng</li>
              <li>Phân tích và cải thiện trải nghiệm người dùng</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              3. Bảo vệ thông tin
            </h2>
            <p className="mb-2">Chúng tôi sử dụng các biện pháp bảo mật:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Mã hóa SSL/TLS cho tất cả kết nối</li>
              <li>Lưu trữ an toàn với HttpOnly cookies</li>
              <li>Kiểm soát truy cập nghiêm ngặt</li>
              <li>Xác thực token JWT</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. Chia sẻ thông tin
            </h2>
            <p className="mb-2">
              Chúng tôi KHÔNG bán hoặc chia sẻ thông tin cá nhân của bạn cho bên
              thứ ba, ngoại trừ:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Khi có yêu cầu pháp lý</li>
              <li>Để bảo vệ quyền lợi của CDHC</li>
              <li>Với sự đồng ý của bạn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              5. Quyền của bạn
            </h2>
            <p className="mb-2">Bạn có quyền:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Truy cập thông tin cá nhân</li>
              <li>Chỉnh sửa thông tin</li>
              <li>Xóa tài khoản</li>
              <li>Từ chối nhận thông báo marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              6. Cookies
            </h2>
            <p className="mb-2">Website sử dụng cookies để:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Duy trì phiên đăng nhập</li>
              <li>Nhớ tùy chọn của bạn</li>
              <li>Phân tích lượng truy cập</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              7. Liên hệ
            </h2>
            <p>Nếu có thắc mắc về chính sách bảo mật:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@cdhc.vn"
                  className="text-green-600 hover:underline"
                >
                  support@cdhc.vn
                </a>
              </li>
              <li>
                Website:{" "}
                <a
                  href="https://cdhc.vn"
                  className="text-green-600 hover:underline"
                >
                  https://cdhc.vn
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-green-600 hover:underline font-medium">
            ← Quay về trang chủ
          </Link>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          CDHC - Con Đường Hữu Cơ
          <br />
          &ldquo;Đồng hành cùng nông dân Việt Nam&rdquo;
        </p>
      </main>
    </div>
  );
}
