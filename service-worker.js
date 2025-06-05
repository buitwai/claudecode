// AutoZone Claude Code Training Hub Service Worker
// Version 1.0.0

const CACHE_NAME = 'az-claude-training-v1.0.0';
const STATIC_CACHE = 'static-cache-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-cache-v1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Essential resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/offline-manager.js',
  '/mobile-enhancements.js',
  '/background-tasks.js',
  '/install-prompt.js',
  '/manifest.json',
  OFFLINE_PAGE,
  // External dependencies with fallbacks
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js'
];

// Resources that should be cached when accessed
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\.autozone\.com\/claude-training/,
  /^https:\/\/training-analytics\.autozone\.com/,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/
];

// Background sync tags
const SYNC_TAGS = {
  PROGRESS_SYNC: 'progress-sync',
  FAVORITES_SYNC: 'favorites-sync',
  ANALYTICS_SYNC: 'analytics-sync'
};

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
    }).catch((error) => {
      console.error('[SW] Failed to cache static assets:', error);
      // Cache critical resources only if full cache fails
      return caches.open(STATIC_CACHE).then((cache) => {
        const criticalAssets = ['/', '/index.html', '/styles.css', '/script.js'];
        return cache.addAll(criticalAssets);
      });
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First for training content
    if (isTrainingContent(url)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate for dynamic content
    if (isDynamicContent(url)) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await getOfflineFallback(request);
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return await getOfflineFallback(request);
  }
}

// Network-first strategy for training content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return await getOfflineFallback(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await fetchPromise || await getOfflineFallback(request);
}

// Network with cache fallback
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || await getOfflineFallback(request);
  }
}

// Helper functions to determine resource types
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset || url.href === asset) ||
         /\.(css|js|png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf)$/.test(url.pathname);
}

function isTrainingContent(url) {
  return url.pathname.includes('/training/') || 
         url.pathname.includes('/content/') ||
         url.search.includes('section=');
}

function isDynamicContent(url) {
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(url.href));
}

// Offline fallback logic
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match(OFFLINE_PAGE);
    return offlineResponse || new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
  
  // Return cached version or placeholder for other resources
  const cachedResponse = await caches.match(request.url);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return appropriate fallback based on resource type
  if (request.destination === 'image') {
    return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
      <rect width="200" height="150" fill="#f0f0f0"/>
      <text x="100" y="75" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Image Offline</text>
    </svg>`, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  return new Response('Resource not available offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Background Sync for progress tracking
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.PROGRESS_SYNC:
      event.waitUntil(syncUserProgress());
      break;
    case SYNC_TAGS.FAVORITES_SYNC:
      event.waitUntil(syncFavorites());
      break;
    case SYNC_TAGS.ANALYTICS_SYNC:
      event.waitUntil(syncAnalytics());
      break;
  }
});

async function syncUserProgress() {
  try {
    const progressData = await getStoredData('user-progress');
    if (progressData && progressData.length > 0) {
      const response = await fetch('/api/sync/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
      
      if (response.ok) {
        await clearStoredData('user-progress');
        console.log('[SW] Progress synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Progress sync failed:', error);
    throw error; // Retry sync
  }
}

async function syncFavorites() {
  try {
    const favoritesData = await getStoredData('user-favorites');
    if (favoritesData && favoritesData.length > 0) {
      const response = await fetch('/api/sync/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoritesData)
      });
      
      if (response.ok) {
        await clearStoredData('user-favorites');
        console.log('[SW] Favorites synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Favorites sync failed:', error);
    throw error;
  }
}

async function syncAnalytics() {
  try {
    const analyticsData = await getStoredData('analytics-events');
    if (analyticsData && analyticsData.length > 0) {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      });
      
      if (response.ok) {
        await clearStoredData('analytics-events');
        console.log('[SW] Analytics synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
    throw error;
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      notificationData = { title: 'AutoZone Claude Training', body: event.data.text() };
    }
  }
  
  const options = {
    title: notificationData.title || 'AutoZone Claude Training',
    body: notificationData.body || 'Time for your Claude Code training session!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: notificationData.image,
    data: notificationData.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open Training',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    requireInteraction: notificationData.requireInteraction || false,
    silent: notificationData.silent || false,
    vibrate: [200, 100, 200],
    tag: notificationData.tag || 'training-reminder'
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
  
  // Handle other actions (dismiss, etc.)
  if (event.action === 'dismiss') {
    // Analytics or other tracking for dismissed notifications
    storeAnalyticsEvent('notification_dismissed', {
      tag: event.notification.tag,
      timestamp: Date.now()
    });
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'SCHEDULE_SYNC':
      if (payload.tag) {
        self.registration.sync.register(payload.tag);
      }
      break;
    case 'CACHE_CONTENT':
      if (payload.urls) {
        cacheUrls(payload.urls);
      }
      break;
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status });
      });
      break;
  }
});

// Utility functions
async function getStoredData(key) {
  try {
    return new Promise((resolve) => {
      const transaction = indexedDB.open('az-claude-training', 1);
      transaction.onsuccess = (event) => {
        const db = event.target.result;
        const objectStore = db.transaction([key], 'readonly').objectStore(key);
        const request = objectStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
      };
      transaction.onerror = () => resolve([]);
    });
  } catch (error) {
    return [];
  }
}

async function clearStoredData(key) {
  return new Promise((resolve) => {
    const transaction = indexedDB.open('az-claude-training', 1);
    transaction.onsuccess = (event) => {
      const db = event.target.result;
      const objectStore = db.transaction([key], 'readwrite').objectStore(key);
      const request = objectStore.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    };
    transaction.onerror = () => resolve();
  });
}

async function storeAnalyticsEvent(eventType, data) {
  // Store analytics events for later sync
  const event = {
    type: eventType,
    data,
    timestamp: Date.now()
  };
  
  // Implementation would store in IndexedDB
  console.log('[SW] Analytics event stored:', event);
}

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const url of urls) {
    try {
      await cache.add(url);
      console.log('[SW] Cached URL:', url);
    } catch (error) {
      console.warn('[SW] Failed to cache URL:', url, error);
    }
  }
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
}