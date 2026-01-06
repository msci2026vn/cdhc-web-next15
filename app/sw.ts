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

// Initialize Serwist
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: cdchCacheRules,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    ignoreURLParametersMatching: [/.*/],
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

// Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  // Extended NotificationOptions for service worker context
  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-512x512.png",
    badge: "/icons/icon-180x180.png",
    vibrate: [100, 50, 100],
    tag: data.tag || "cdhc-notification",
    renotify: true,
    data: {
      url: data.url || "/",
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

  event.waitUntil(self.registration.showNotification(data.title, options));
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
  console.log("Syncing pending orders...");
  // Handled by BackgroundSyncPlugin
}

// Register all event listeners
serwist.addEventListeners();
