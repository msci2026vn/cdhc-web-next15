import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
} from "serwist";
import {
  BackgroundSyncPlugin,
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// TypeScript declarations
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Background sync plugin for offline order submissions
const orderSyncPlugin = new BackgroundSyncPlugin("cdhc-order-queue", {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
});

// CDHC-specific caching strategies
const cdchCacheRules: RuntimeCaching[] = [
  // Auth routes - Never cache
  {
    matcher: /\/api\/auth\/.*/,
    handler: new NetworkOnly(),
  },

  // API endpoints - Network first with Vietnam network optimization
  {
    matcher: /\/api\/(products|orders|farmers|cooperatives).*/,
    handler: new NetworkFirst({
      cacheName: "cdhc-api-cache",
      networkTimeoutSeconds: 10, // Fast fallback for rural Vietnam
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  },

  // Order submission - Background sync for offline support
  {
    matcher: /\/api\/orders/,
    method: "POST",
    handler: new NetworkOnly({
      plugins: [orderSyncPlugin],
    }),
  },

  // Product images - Cache first (save mobile data)
  {
    matcher: /\.(png|jpg|jpeg|svg|gif|webp)$/,
    handler: new CacheFirst({
      cacheName: "cdhc-images",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  },

  // Static assets - Cache first
  {
    matcher: /\.(?:js|css|woff2?)$/,
    handler: new CacheFirst({
      cacheName: "cdhc-static-resources",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    }),
  },

  // External CDN - Stale while revalidate
  {
    matcher: /^https:\/\/(cdn\.cloudflare\.com|fonts\.googleapis\.com)/,
    handler: new StaleWhileRevalidate({
      cacheName: "cdhc-external-resources",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    }),
  },

  // Include default Next.js caching rules
  ...defaultCache,
];

// Listen for skip waiting message from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Initialize Serwist
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false, // Let user decide when to update
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: cdchCacheRules,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    // Only ignore common cache-busting and tracking parameters
    ignoreURLParametersMatching: [
      /^utm_/, // UTM tracking parameters
      /^fbclid$/, // Facebook click ID
      /^gclid$/, // Google click ID
      /^_ga$/, // Google Analytics
      /^__next_private_/, // Next.js internal params
    ],
  },
  disableDevLogs: true,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Push notification data validation
interface PushNotificationData {
  title?: string;
  body?: string;
  icon?: string;
  tag?: string;
  url?: string;
  orderId?: string;
}

function isValidPushData(data: unknown): data is PushNotificationData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  // Validate required title field and optional fields types
  if (d.title !== undefined && typeof d.title !== "string") return false;
  if (d.body !== undefined && typeof d.body !== "string") return false;
  if (d.icon !== undefined && typeof d.icon !== "string") return false;
  if (d.tag !== undefined && typeof d.tag !== "string") return false;
  if (d.url !== undefined && typeof d.url !== "string") return false;
  if (d.orderId !== undefined && typeof d.orderId !== "string") return false;
  return true;
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString, self.location.origin);
    // Only allow http, https, or relative URLs (same origin)
    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.origin === self.location.origin
    );
  } catch {
    return false;
  }
}

// Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data: unknown;
  try {
    data = event.data.json();
  } catch {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.warn("[SW] Invalid push data JSON");
    }
    return;
  }

  // Validate push data structure
  if (!isValidPushData(data)) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.warn("[SW] Invalid push data structure");
    }
    return;
  }

  // Validate and sanitize URL
  const notificationUrl = data.url && isValidUrl(data.url) ? data.url : "/";

  // Extended NotificationOptions for service worker context
  const options = {
    body: data.body || "",
    icon: data.icon || "/icons/icon-512x512.png",
    badge: "/icons/icon-180x180.png",
    vibrate: [100, 50, 100],
    tag: data.tag || "cdhc-notification",
    renotify: true,
    data: {
      url: notificationUrl,
      orderId: data.orderId,
    },
    actions: [
      {
        action: "view",
        title: "Xem chi tiết",
      },
      {
        action: "dismiss",
        title: "Đóng",
      },
    ],
  } as NotificationOptions;

  const title = data.title || "Thông báo từ CĐHC";
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Background sync handler
self.addEventListener("sync", (event) => {
  if (event.tag === "cdhc-order-sync") {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders(): Promise<void> {
  // Handled by BackgroundSyncPlugin
}

// Register all event listeners
serwist.addEventListeners();
