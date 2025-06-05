// AutoZone Claude Code Training Hub - Offline Manager
// Handles content prioritization and offline functionality

class OfflineManager {
  constructor() {
    this.dbName = 'az-claude-training';
    this.dbVersion = 1;
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    
    this.init();
  }

  async init() {
    await this.initDatabase();
    this.setupEventListeners();
    this.startPeriodicSync();
    
    // Initialize content prioritization
    await this.prioritizeEssentialContent();
    
    console.log('[OfflineManager] Initialized successfully');
  }

  // Initialize IndexedDB for offline storage
  async initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // User Progress Store
        if (!db.objectStoreNames.contains('user-progress')) {
          const progressStore = db.createObjectStore('user-progress', { keyPath: 'id', autoIncrement: true });
          progressStore.createIndex('section', 'section', { unique: false });
          progressStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // User Favorites Store
        if (!db.objectStoreNames.contains('user-favorites')) {
          const favoritesStore = db.createObjectStore('user-favorites', { keyPath: 'id' });
          favoritesStore.createIndex('type', 'type', { unique: false });
        }
        
        // Cached Content Store
        if (!db.objectStoreNames.contains('cached-content')) {
          const contentStore = db.createObjectStore('cached-content', { keyPath: 'url' });
          contentStore.createIndex('priority', 'priority', { unique: false });
          contentStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }
        
        // Analytics Events Store
        if (!db.objectStoreNames.contains('analytics-events')) {
          const analyticsStore = db.createObjectStore('analytics-events', { keyPath: 'id', autoIncrement: true });
          analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Sync Queue Store
        if (!db.objectStoreNames.contains('sync-queue')) {
          const syncStore = db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('priority', 'priority', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatus();
      this.showNotification('Back online! Syncing your progress...', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOfflineStatus();
      this.showNotification('You\'re offline. Don\'t worry, your progress is being saved locally!', 'info');
    });
    
    // Before page unload - save current state
    window.addEventListener('beforeunload', () => {
      this.saveCurrentState();
    });
    
    // Page visibility change - handle backgrounding
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
  }

  // Prioritize essential content for offline access
  async prioritizeEssentialContent() {
    const essentialSections = [
      { id: 'security', priority: 1, title: 'Security Setup' },
      { id: 'installation', priority: 1, title: 'Installation' },
      { id: 'commands', priority: 2, title: 'Commands Reference' },
      { id: 'troubleshooting', priority: 2, title: 'Troubleshooting' },
      { id: 'memory', priority: 3, title: 'Memory Management' },
      { id: 'pitfalls', priority: 3, title: 'Common Pitfalls' }
    ];
    
    // Cache essential content elements
    for (const section of essentialSections) {
      const element = document.getElementById(section.id);
      if (element) {
        await this.cacheContentElement(section.id, element.innerHTML, section.priority);
      }
    }
    
    // Pre-cache external resources
    await this.preloadCriticalResources();
  }

  async cacheContentElement(id, content, priority) {
    const contentData = {
      url: `#${id}`,
      content,
      priority,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      size: new Blob([content]).size
    };
    
    try {
      const transaction = this.db.transaction(['cached-content'], 'readwrite');
      const store = transaction.objectStore('cached-content');
      await store.put(contentData);
    } catch (error) {
      console.error('[OfflineManager] Failed to cache content:', error);
    }
  }

  async preloadCriticalResources() {
    const criticalResources = [
      '/styles.css',
      '/script.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
    ];
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_CONTENT',
        payload: { urls: criticalResources }
      });
    }
  }

  // User Progress Management
  async saveProgress(section, data) {
    const progressData = {
      section,
      data,
      timestamp: Date.now(),
      synced: false
    };
    
    try {
      const transaction = this.db.transaction(['user-progress'], 'readwrite');
      const store = transaction.objectStore('user-progress');
      const result = await store.add(progressData);
      
      // Add to sync queue if online
      if (this.isOnline) {
        this.addToSyncQueue('progress', progressData);
      }
      
      return result;
    } catch (error) {
      console.error('[OfflineManager] Failed to save progress:', error);
      throw error;
    }
  }

  async getProgress(section = null) {
    try {
      const transaction = this.db.transaction(['user-progress'], 'readonly');
      const store = transaction.objectStore('user-progress');
      
      if (section) {
        const index = store.index('section');
        return await this.getAllFromIndex(index, section);
      } else {
        return await this.getAllFromStore(store);
      }
    } catch (error) {
      console.error('[OfflineManager] Failed to get progress:', error);
      return [];
    }
  }

  // Favorites Management
  async addToFavorites(id, type, title, url) {
    const favoriteData = {
      id,
      type,
      title,
      url,
      timestamp: Date.now(),
      synced: false
    };
    
    try {
      const transaction = this.db.transaction(['user-favorites'], 'readwrite');
      const store = transaction.objectStore('user-favorites');
      await store.put(favoriteData);
      
      if (this.isOnline) {
        this.addToSyncQueue('favorites', favoriteData);
      }
      
      this.updateFavoritesUI();
      return true;
    } catch (error) {
      console.error('[OfflineManager] Failed to add favorite:', error);
      return false;
    }
  }

  async removeFromFavorites(id) {
    try {
      const transaction = this.db.transaction(['user-favorites'], 'readwrite');
      const store = transaction.objectStore('user-favorites');
      await store.delete(id);
      
      this.updateFavoritesUI();
      return true;
    } catch (error) {
      console.error('[OfflineManager] Failed to remove favorite:', error);
      return false;
    }
  }

  async getFavorites() {
    try {
      const transaction = this.db.transaction(['user-favorites'], 'readonly');
      const store = transaction.objectStore('user-favorites');
      return await this.getAllFromStore(store);
    } catch (error) {
      console.error('[OfflineManager] Failed to get favorites:', error);
      return [];
    }
  }

  // Analytics and Usage Tracking
  async trackEvent(eventType, data) {
    const eventData = {
      type: eventType,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      synced: false
    };
    
    try {
      const transaction = this.db.transaction(['analytics-events'], 'readwrite');
      const store = transaction.objectStore('analytics-events');
      await store.add(eventData);
      
      if (this.isOnline) {
        this.addToSyncQueue('analytics', eventData);
      }
    } catch (error) {
      console.error('[OfflineManager] Failed to track event:', error);
    }
  }

  // Sync Queue Management
  addToSyncQueue(type, data, priority = 1) {
    const syncItem = {
      type,
      data,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };
    
    this.syncQueue.push(syncItem);
    
    // Process immediately if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }
    
    const batch = this.syncQueue.splice(0, 10); // Process in batches
    
    for (const item of batch) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error('[OfflineManager] Sync failed for item:', item, error);
        
        item.retryCount++;
        if (item.retryCount < item.maxRetries) {
          this.syncQueue.push(item); // Re-queue for retry
        }
      }
    }
    
    // Continue processing if there are more items
    if (this.syncQueue.length > 0) {
      setTimeout(() => this.processSyncQueue(), 1000);
    }
  }

  async syncItem(item) {
    const endpoints = {
      progress: '/api/sync/progress',
      favorites: '/api/sync/favorites',
      analytics: '/api/analytics/events'
    };
    
    const endpoint = endpoints[item.type];
    if (!endpoint) {
      throw new Error(`Unknown sync type: ${item.type}`);
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Offline-Sync': 'true'
      },
      body: JSON.stringify(item.data)
    });
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Online/Offline Status Handlers
  handleOnlineStatus() {
    document.body.classList.remove('offline');
    document.body.classList.add('online');
    
    // Start syncing
    this.processSyncQueue();
    
    // Update UI indicators
    this.updateConnectionIndicator(true);
  }

  handleOfflineStatus() {
    document.body.classList.remove('online');
    document.body.classList.add('offline');
    
    // Update UI indicators
    this.updateConnectionIndicator(false);
    
    // Show offline capabilities
    this.showOfflineCapabilities();
  }

  updateConnectionIndicator(isOnline) {
    const indicator = document.getElementById('connection-indicator');
    if (indicator) {
      indicator.className = isOnline ? 'connection-online' : 'connection-offline';
      indicator.textContent = isOnline ? 'Online' : 'Offline';
    }
  }

  showOfflineCapabilities() {
    // Show which features are available offline
    const offlineFeatures = [
      'View cached training content',
      'Browse previously visited sections',
      'Access saved favorites',
      'Continue tracking progress'
    ];
    
    // Could show a modal or notification with available features
    console.log('[OfflineManager] Available offline features:', offlineFeatures);
  }

  // Content Management
  async getCachedContent(section) {
    try {
      const transaction = this.db.transaction(['cached-content'], 'readonly');
      const store = transaction.objectStore('cached-content');
      const result = await store.get(`#${section}`);
      
      if (result) {
        // Update last accessed time
        result.lastAccessed = Date.now();
        const updateTransaction = this.db.transaction(['cached-content'], 'readwrite');
        const updateStore = updateTransaction.objectStore('cached-content');
        await updateStore.put(result);
        
        return result.content;
      }
      
      return null;
    } catch (error) {
      console.error('[OfflineManager] Failed to get cached content:', error);
      return null;
    }
  }

  // Cleanup and Maintenance
  async cleanupOldData() {
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    const cutoff = Date.now() - maxAge;
    
    const stores = ['user-progress', 'analytics-events', 'cached-content'];
    
    for (const storeName of stores) {
      try {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore('cached-content');
        const index = store.index('lastAccessed');
        const range = IDBKeyRange.upperBound(cutoff);
        
        await this.deleteByRange(index, range);
      } catch (error) {
        console.error(`[OfflineManager] Failed to cleanup ${storeName}:`, error);
      }
    }
  }

  // Periodic sync and maintenance
  startPeriodicSync() {
    // Sync every 5 minutes when online
    setInterval(() => {
      if (this.isOnline) {
        this.processSyncQueue();
      }
    }, 5 * 60 * 1000);
    
    // Cleanup old data daily
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000);
  }

  // State Management
  saveCurrentState() {
    const state = {
      currentSection: this.getCurrentSection(),
      scrollPosition: window.scrollY,
      formData: this.collectFormData(),
      timestamp: Date.now()
    };
    
    localStorage.setItem('az-claude-training-state', JSON.stringify(state));
  }

  restoreState() {
    try {
      const saved = localStorage.getItem('az-claude-training-state');
      if (saved) {
        const state = JSON.parse(saved);
        
        // Restore scroll position
        if (state.scrollPosition) {
          window.scrollTo(0, state.scrollPosition);
        }
        
        // Restore form data
        if (state.formData) {
          this.restoreFormData(state.formData);
        }
        
        return state;
      }
    } catch (error) {
      console.error('[OfflineManager] Failed to restore state:', error);
    }
    
    return null;
  }

  // UI Updates
  updateFavoritesUI() {
    // Update favorites display in the UI
    this.getFavorites().then(favorites => {
      const container = document.getElementById('favorites-container');
      if (container) {
        container.innerHTML = this.renderFavorites(favorites);
      }
    });
  }

  renderFavorites(favorites) {
    if (favorites.length === 0) {
      return '<p class="no-favorites">No favorites saved yet. Click the star icon next to sections to save them!</p>';
    }
    
    return favorites.map(fav => `
      <div class="favorite-item" data-id="${fav.id}">
        <a href="${fav.url}" class="favorite-link">
          <i class="fas fa-star"></i>
          <span>${fav.title}</span>
        </a>
        <button class="remove-favorite" onclick="offlineManager.removeFromFavorites('${fav.id}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  showNotification(message, type = 'info') {
    // Show user notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Utility Methods
  getCurrentSection() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : 'overview';
  }

  collectFormData() {
    const formData = {};
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form, index) => {
      const data = new FormData(form);
      formData[`form_${index}`] = Object.fromEntries(data.entries());
    });
    
    return formData;
  }

  restoreFormData(formData) {
    Object.keys(formData).forEach(formKey => {
      const formIndex = parseInt(formKey.split('_')[1]);
      const form = document.querySelectorAll('form')[formIndex];
      
      if (form) {
        Object.keys(formData[formKey]).forEach(fieldName => {
          const field = form.querySelector(`[name="${fieldName}"]`);
          if (field) {
            field.value = formData[formKey][fieldName];
          }
        });
      }
    });
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('az-claude-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('az-claude-session-id', sessionId);
    }
    return sessionId;
  }

  // IndexedDB Utility Methods
  async getAllFromStore(store) {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFromIndex(index, key) {
    return new Promise((resolve, reject) => {
      const request = index.getAll(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteByRange(index, range) {
    return new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  handlePageHidden() {
    this.saveCurrentState();
    this.trackEvent('page_hidden', { section: this.getCurrentSection() });
  }

  handlePageVisible() {
    this.trackEvent('page_visible', { section: this.getCurrentSection() });
  }
}

// Initialize offline manager when DOM is ready
let offlineManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    offlineManager = new OfflineManager();
  });
} else {
  offlineManager = new OfflineManager();
}

// Make it globally available
window.offlineManager = offlineManager;