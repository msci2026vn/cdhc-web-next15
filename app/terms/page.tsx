import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng dịch vụ Con Đường Hữu Cơ (CDHC)",
};

export default function TermsPage() {
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
          Điều khoản sử dụng
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-slate-600">
          <p className="text-sm text-slate-400">
            Cập nhật lần cuối: 09/01/2026
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              1. Chấp nhận điều khoản
            </h2>
            <p>
              Bằng việc sử dụng dịch vụ CDHC, bạn đồng ý với các điều khoản sau.
              Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              2. Đăng ký tài khoản
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Bạn phải cung cấp thông tin chính xác</li>
              <li>Bạn chịu trách nhiệm bảo mật tài khoản</li>
              <li>Mỗi người chỉ được tạo một tài khoản</li>
              <li>Phải đủ 18 tuổi hoặc có sự đồng ý của phụ huynh</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              3. Sử dụng dịch vụ
            </h2>
            <p className="mb-2">Bạn đồng ý KHÔNG:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Vi phạm pháp luật Việt Nam</li>
              <li>Spam hoặc gửi nội dung độc hại</li>
              <li>Can thiệp vào hoạt động của hệ thống</li>
              <li>Sử dụng bot hoặc công cụ tự động trái phép</li>
              <li>Giả mạo người khác</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              4. Nội dung người dùng
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Bạn giữ quyền sở hữu nội dung của mình</li>
              <li>
                Bạn cấp cho CDHC quyền sử dụng nội dung để cung cấp dịch vụ
              </li>
              <li>Nội dung phải tuân thủ pháp luật</li>
              <li>CDHC có quyền gỡ bỏ nội dung vi phạm</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              5. Điểm và phần thưởng
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Điểm OGN và TOR chỉ có giá trị trong hệ thống CDHC</li>
              <li>Không được mua bán, chuyển nhượng điểm trái phép</li>
              <li>CDHC có quyền điều chỉnh tỷ lệ quy đổi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              6. Tài khoản doanh nghiệp/HTX
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Cần xác minh thông tin doanh nghiệp</li>
              <li>Phải được Admin phê duyệt</li>
              <li>Chịu trách nhiệm về thông tin sản phẩm đăng bán</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              7. Chấm dứt
            </h2>
            <p className="mb-2">
              Chúng tôi có quyền đình chỉ hoặc xóa tài khoản:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Vi phạm điều khoản sử dụng</li>
              <li>Hoạt động gian lận</li>
              <li>Theo yêu cầu pháp lý</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              8. Giới hạn trách nhiệm
            </h2>
            <p className="mb-2">CDHC không chịu trách nhiệm về:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Thiệt hại gián tiếp từ việc sử dụng dịch vụ</li>
              <li>Mất mát dữ liệu do lỗi người dùng</li>
              <li>Gián đoạn dịch vụ do nguyên nhân khách quan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              9. Thay đổi điều khoản
            </h2>
            <p>
              Chúng tôi có thể cập nhật điều khoản bất kỳ lúc nào. Việc tiếp tục
              sử dụng dịch vụ đồng nghĩa với việc chấp nhận thay đổi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              10. Liên hệ
            </h2>
            <p>Nếu có thắc mắc về điều khoản sử dụng:</p>
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
