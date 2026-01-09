import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UpdateNotification } from "@/components/UpdateNotification";
import { Providers } from "./providers";

const APP_NAME = "Con Đường Hữu Cơ";
const APP_DEFAULT_TITLE = "Con Đường Hữu Cơ";
const APP_TITLE_TEMPLATE = "%s | Con Đường Hữu Cơ";
const APP_DESCRIPTION =
  "Ứng dụng toàn diện cho nông dân hữu cơ: AI chẩn đoán bệnh cây, dự báo thời tiết, sàn thương mại, truy xuất nguồn gốc, quản lý HTX. Tham gia cộng đồng 15,000+ thành viên.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords:
    "hữu cơ, organic, nông nghiệp thông minh, AI nông nghiệp, truy xuất nguồn gốc, CDHC, sàn nông sản",
  openGraph: {
    title: "Con Đường Hữu Cơ",
    description:
      "AI chẩn đoán bệnh cây, sàn thương mại hữu cơ, truy xuất nguồn gốc",
    type: "website",
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200",
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* Security meta tags
            Note: 'unsafe-inline' required for Next.js inline styles and scripts
            'unsafe-eval' removed for better security - test if Google OAuth still works */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.cdhc.vn https://accounts.google.com https://provinces.open-api.vn; frame-src https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Con Đường Hữu Cơ" />
      </head>
      <body className="bg-white text-slate-600">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <UpdateNotification />
      </body>
    </html>
  );
}
