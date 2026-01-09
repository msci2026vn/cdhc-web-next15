import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { UpdateNotification } from "@/components/UpdateNotification";
import { getCspHeaderValue } from "@/lib/csp-config";
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

/**
 * Check if running in dynamic mode (middleware active)
 * Returns nonce from middleware headers if available
 */
async function getDynamicCspConfig(): Promise<{
  nonce: string | null;
  isStatic: boolean;
}> {
  try {
    const headersList = await headers();
    const nonce = headersList.get("x-nonce");
    if (nonce) {
      return { nonce, isStatic: false };
    }
  } catch {
    // headers() throws in static export - expected behavior
  }
  return { nonce: null, isStatic: true };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check deployment mode and get nonce if available
  const { nonce, isStatic } = await getDynamicCspConfig();

  // Build CSP header
  // - Dynamic mode: uses nonce + strict-dynamic (most secure)
  // - Static export: uses domain allowlist (acceptable for static sites)
  const cspContent = getCspHeaderValue(
    isStatic ? undefined : (nonce ?? undefined)
  );

  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* Security meta tags
            CSP is built from environment variables
            - Dynamic mode (with middleware): nonce-based + strict-dynamic (most secure)
            - Static export: domain allowlist + unsafe-inline (acceptable for static sites)
            See lib/csp-config.ts for configuration */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
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
        <GlobalErrorHandler />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <UpdateNotification />
      </body>
    </html>
  );
}
