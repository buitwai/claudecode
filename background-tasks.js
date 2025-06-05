// AutoZone Claude Code Training Hub - Background Tasks
// Handles behind-the-scenes functionality, progress sync, and notifications

class BackgroundTasks {
  constructor() {
    this.isVisible = !document.hidden;
    this.syncIntervals = new Map();
    this.notificationQueue = [];
    this.updateCheckInterval = null;
    this.analyticsBuffer = [];
    this.performanceMetrics = {
      sessionStart: Date.now(),
      pageViews: 0,
      timeOnPage: 0,
      interactions: 0
    };
    
    this.init();
  }

  async init() {
    this.setupVisibilityHandling();
    this.setupNotificationScheduling();
    this.setupProgressSync();
    this.setupUpdateChecking();
    this.setupAnalyticsTracking();
    this.setupPerformanceMonitoring();
    this.setupConnectionMonitoring();
    
    // Start background tasks
    this.startBackgroundTasks();
    
    console.log('[BackgroundTasks] Initialized successfully');
  }

  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      
      if (this.isVisible) {
        this.handlePageVisible();
      } else {
        this.handlePageHidden();
      }
    });
    
    // Handle app becoming active/inactive
    window.addEventListener('focus', () => {
      this.handleAppActive();
    });
    
    window.addEventListener('blur', () => {
      this.handleAppInactive();
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload();
    });
  }

  handlePageVisible() {
    console.log('[BackgroundTasks] Page became visible');
    
    // Resume active sync
    this.resumeActiveSync();
    
    // Check for pending notifications
    this.processPendingNotifications();
    
    // Update performance metrics
    this.performanceMetrics.pageViews++;
    this.trackAnalyticsEvent('page_visible', {
      section: this.getCurrentSection(),
      timestamp: Date.now()
    });
    
    // Check for updates
    this.checkForUpdates();
  }

  handlePageHidden() {
    console.log('[BackgroundTasks] Page became hidden');
    
    // Sync current progress
    this.syncCurrentProgress();
    
    // Schedule learning reminders
    this.scheduleLearningReminders();
    
    // Reduce sync frequency
    this.adjustSyncFrequency('background');
    
    this.trackAnalyticsEvent('page_hidden', {
      section: this.getCurrentSection(),
      timeSpent: this.calculateTimeOnCurrentSection(),
      timestamp: Date.now()
    });
  }

  handleAppActive() {
    console.log('[BackgroundTasks] App became active');
    
    // Resume full functionality
    this.resumeActiveSync();
    this.adjustSyncFrequency('active');
  }

  handleAppInactive() {
    console.log('[BackgroundTasks] App became inactive');
    
    // Prepare for background mode
    this.prepareForBackground();
  }

  handlePageUnload() {
    console.log('[BackgroundTasks] Page unloading');
    
    // Final sync before unload
    this.performFinalSync();
    
    // Send analytics
    this.flushAnalytics();
  }

  setupNotificationScheduling() {
    // Request notification permission
    this.requestNotificationPermission();
    
    // Setup notification scheduling logic
    this.scheduleDefaultReminders();
  }

  async requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('[BackgroundTasks] Notification permission granted');
        this.setupPushNotifications();
      } else {
        console.log('[BackgroundTasks] Notification permission denied');
      }
    }
  }

  setupPushNotifications() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Subscribe to push notifications
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
        });
      }).then(subscription => {
        console.log('[BackgroundTasks] Push subscription:', subscription);
        this.savePushSubscription(subscription);
      }).catch(error => {
        console.error('[BackgroundTasks] Push subscription failed:', error);
      });
    }
  }

  getVapidPublicKey() {
    // This would be your actual VAPID public key
    return 'BKx_example_vapid_key_here';
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  scheduleDefaultReminders() {
    const defaultReminders = [
      {
        id: 'daily_learning',
        title: 'Daily Claude Code Practice',
        body: 'Ready for your daily Claude Code training session?',
        schedule: 'daily',
        time: '09:00',
        enabled: true
      },
      {
        id: 'weekly_review',
        title: 'Weekly Progress Review',
        body: 'Time to review your Claude Code learning progress!',
        schedule: 'weekly',
        time: '14:00',
        day: 'friday',
        enabled: true
      },
      {
        id: 'completion_reminder',
        title: 'Complete Your Training',
        body: 'You\'re almost done! Finish your current training section.',
        schedule: 'conditional',
        condition: 'incomplete_section',
        delay: 24 * 60 * 60 * 1000, // 24 hours
        enabled: true
      }
    ];
    
    defaultReminders.forEach(reminder => {
      this.scheduleNotification(reminder);
    });
  }

  scheduleNotification(notification) {
    const now = new Date();
    let scheduleTime;
    
    switch (notification.schedule) {
      case 'daily':
        scheduleTime = this.getNextDailyTime(notification.time);
        break;
      case 'weekly':
        scheduleTime = this.getNextWeeklyTime(notification.day, notification.time);
        break;
      case 'conditional':
        scheduleTime = this.getConditionalTime(notification.condition, notification.delay);
        break;
      default:
        return;
    }
    
    if (scheduleTime) {
      const delay = scheduleTime.getTime() - now.getTime();
      if (delay > 0) {
        setTimeout(() => {
          this.sendNotification(notification);
          
          // Reschedule for next occurrence
          if (notification.schedule !== 'conditional') {
            this.scheduleNotification(notification);
          }
        }, delay);
        
        console.log(`[BackgroundTasks] Scheduled notification "${notification.title}" for ${scheduleTime}`);
      }
    }
  }

  getNextDailyTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const scheduleTime = new Date();
    
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }
    
    return scheduleTime;
  }

  getNextWeeklyTime(dayName, timeString) {
    const days = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6, 'sunday': 0
    };
    
    const targetDay = days[dayName.toLowerCase()];
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const scheduleTime = new Date();
    
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    // Calculate days until target day
    const currentDay = now.getDay();
    let daysUntilTarget = targetDay - currentDay;
    
    if (daysUntilTarget <= 0 || (daysUntilTarget === 0 && scheduleTime <= now)) {
      daysUntilTarget += 7;
    }
    
    scheduleTime.setDate(scheduleTime.getDate() + daysUntilTarget);
    return scheduleTime;
  }

  getConditionalTime(condition, delay) {
    switch (condition) {
      case 'incomplete_section':
        return this.hasIncompleteSection() ? new Date(Date.now() + delay) : null;
      default:
        return null;
    }
  }

  hasIncompleteSection() {
    // Check if user has an incomplete section
    const currentSection = this.getCurrentSection();
    const progress = this.getSectionProgress(currentSection);
    return progress && progress < 100;
  }

  sendNotification(notification) {
    if (Notification.permission === 'granted') {
      const options = {
        body: notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: notification.id,
        data: {
          url: notification.url || '/',
          action: notification.action || 'open'
        },
        actions: [
          {
            action: 'open',
            title: 'Start Training',
            icon: '/icons/action-open.png'
          },
          {
            action: 'later',
            title: 'Remind Later',
            icon: '/icons/action-later.png'
          }
        ],
        requireInteraction: false,
        silent: false
      };
      
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Send through service worker for better handling
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: { title: notification.title, options }
        });
      } else {
        // Fallback to direct notification
        new Notification(notification.title, options);
      }
      
      this.trackAnalyticsEvent('notification_sent', {
        notificationId: notification.id,
        title: notification.title,
        timestamp: Date.now()
      });
    }
  }

  scheduleLearningReminders() {
    // Schedule reminders based on current progress and activity
    const currentSection = this.getCurrentSection();
    const timeSpent = this.calculateTimeOnCurrentSection();
    const progress = this.getSectionProgress(currentSection);
    
    // If user spent significant time but didn't complete, remind them later
    if (timeSpent > 5 * 60 * 1000 && progress < 100) { // 5 minutes
      this.scheduleNotification({
        id: 'section_completion',
        title: 'Complete Your Training Section',
        body: `Finish your "${this.getSectionTitle(currentSection)}" training section`,
        schedule: 'conditional',
        delay: 2 * 60 * 60 * 1000, // 2 hours
        url: `/#${currentSection}`
      });
    }
  }

  setupProgressSync() {
    // Sync progress in background
    this.startProgressSync();
  }

  startProgressSync() {
    // Immediate sync
    this.syncCurrentProgress();
    
    // Regular sync every 2 minutes when active
    this.syncIntervals.set('progress', setInterval(() => {
      if (this.isVisible) {
        this.syncCurrentProgress();
      }
    }, 2 * 60 * 1000));
    
    // Less frequent sync when in background (every 10 minutes)
    this.syncIntervals.set('background-progress', setInterval(() => {
      if (!this.isVisible) {
        this.syncCurrentProgress();
      }
    }, 10 * 60 * 1000));
  }

  async syncCurrentProgress() {
    try {
      const currentSection = this.getCurrentSection();
      const timeSpent = this.calculateTimeOnCurrentSection();
      const scrollProgress = this.calculateScrollProgress();
      
      const progressData = {
        section: currentSection,
        timeSpent,
        scrollProgress,
        timestamp: Date.now(),
        interactions: this.performanceMetrics.interactions
      };
      
      if (window.offlineManager) {
        await window.offlineManager.saveProgress(currentSection, progressData);
      }
      
      console.log('[BackgroundTasks] Progress synced:', progressData);
      
    } catch (error) {
      console.error('[BackgroundTasks] Progress sync failed:', error);
    }
  }

  resumeActiveSync() {
    // Resume or increase sync frequency
    this.adjustSyncFrequency('active');
    
    // Process any queued background syncs
    if (window.offlineManager) {
      window.offlineManager.processSyncQueue();
    }
  }

  adjustSyncFrequency(mode) {
    // Clear existing intervals
    this.syncIntervals.forEach(interval => clearInterval(interval));
    this.syncIntervals.clear();
    
    if (mode === 'active') {
      // More frequent sync when active
      this.syncIntervals.set('progress', setInterval(() => {
        this.syncCurrentProgress();
      }, 2 * 60 * 1000)); // 2 minutes
    } else if (mode === 'background') {
      // Less frequent sync in background
      this.syncIntervals.set('progress', setInterval(() => {
        this.syncCurrentProgress();
      }, 10 * 60 * 1000)); // 10 minutes
    }
  }

  prepareForBackground() {
    // Sync current state
    this.syncCurrentProgress();
    
    // Save current state
    if (window.offlineManager) {
      window.offlineManager.saveCurrentState();
    }
    
    // Flush analytics buffer
    this.flushAnalytics();
  }

  setupUpdateChecking() {
    // Check for updates every hour
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);
    
    // Initial check after 5 minutes
    setTimeout(() => {
      this.checkForUpdates();
    }, 5 * 60 * 1000);
  }

  async checkForUpdates() {
    try {
      // Check for service worker updates
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            this.handleServiceWorkerUpdate(registration);
          }
        }
      }
      
      // Check for content updates
      await this.checkContentUpdates();
      
    } catch (error) {
      console.error('[BackgroundTasks] Update check failed:', error);
    }
  }

  handleServiceWorkerUpdate(registration) {
    console.log('[BackgroundTasks] Service worker update available');
    
    // Show update notification to user
    this.showUpdateNotification(() => {
      // Activate new service worker
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Reload page to use new version
      window.location.reload();
    });
  }

  async checkContentUpdates() {
    try {
      const response = await fetch('/api/version-check', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const versionInfo = await response.json();
        const currentVersion = localStorage.getItem('app-version');
        
        if (currentVersion && versionInfo.version !== currentVersion) {
          this.handleContentUpdate(versionInfo);
        }
        
        localStorage.setItem('app-version', versionInfo.version);
      }
    } catch (error) {
      console.debug('[BackgroundTasks] Content update check failed:', error);
    }
  }

  handleContentUpdate(versionInfo) {
    console.log('[BackgroundTasks] Content update available:', versionInfo);
    
    this.showUpdateNotification(() => {
      window.location.reload();
    }, 'New training content is available!');
  }

  showUpdateNotification(onUpdate, message = 'A new version is available!') {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <i class="fas fa-sync-alt"></i>
        <span>${message}</span>
        <div class="update-actions">
          <button class="btn-update">Update Now</button>
          <button class="btn-dismiss">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.btn-update').addEventListener('click', () => {
      onUpdate();
      notification.remove();
    });
    
    notification.querySelector('.btn-dismiss').addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 30000);
  }

  setupAnalyticsTracking() {
    // Track page interaction events
    document.addEventListener('click', (event) => {
      this.performanceMetrics.interactions++;
      
      const target = event.target.closest('a, button, .card, .command-item');
      if (target) {
        this.trackAnalyticsEvent('interaction', {
          type: 'click',
          element: target.tagName.toLowerCase(),
          className: target.className,
          section: this.getCurrentSection(),
          timestamp: Date.now()
        });
      }
    });
    
    // Track scroll events (throttled)
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackAnalyticsEvent('scroll', {
          section: this.getCurrentSection(),
          scrollPercent: this.calculateScrollProgress(),
          timestamp: Date.now()
        });
      }, 500);
    });
    
    // Track section changes
    let currentSection = this.getCurrentSection();
    setInterval(() => {
      const newSection = this.getCurrentSection();
      if (newSection !== currentSection) {
        this.trackAnalyticsEvent('section_change', {
          from: currentSection,
          to: newSection,
          timestamp: Date.now()
        });
        currentSection = newSection;
      }
    }, 1000);
  }

  trackAnalyticsEvent(eventType, data) {
    const event = {
      type: eventType,
      data,
      sessionId: this.getSessionId(),
      timestamp: Date.now()
    };
    
    this.analyticsBuffer.push(event);
    
    // Batch send analytics events
    if (this.analyticsBuffer.length >= 10) {
      this.flushAnalytics();
    }
  }

  async flushAnalytics() {
    if (this.analyticsBuffer.length === 0) return;
    
    const events = [...this.analyticsBuffer];
    this.analyticsBuffer = [];
    
    try {
      if (window.offlineManager) {
        for (const event of events) {
          await window.offlineManager.trackEvent(event.type, event.data);
        }
      }
      
      console.log('[BackgroundTasks] Analytics flushed:', events.length, 'events');
    } catch (error) {
      console.error('[BackgroundTasks] Analytics flush failed:', error);
      // Re-add failed events to buffer
      this.analyticsBuffer.unshift(...events);
    }
  }

  setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackAnalyticsEvent('performance', {
            type: 'navigation',
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            timestamp: Date.now()
          });
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      
      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.trackAnalyticsEvent('performance', {
              type: 'long_task',
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: Date.now()
            });
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
    
    // Memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.trackAnalyticsEvent('performance', {
          type: 'memory',
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        });
      }, 5 * 60 * 1000); // Every 5 minutes
    }
  }

  setupConnectionMonitoring() {
    // Monitor connection changes
    window.addEventListener('online', () => {
      this.trackAnalyticsEvent('connection', {
        type: 'online',
        timestamp: Date.now()
      });
      
      // Resume active sync when back online
      this.resumeActiveSync();
    });
    
    window.addEventListener('offline', () => {
      this.trackAnalyticsEvent('connection', {
        type: 'offline',
        timestamp: Date.now()
      });
    });
    
    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const logConnectionInfo = () => {
        this.trackAnalyticsEvent('connection', {
          type: 'info',
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          timestamp: Date.now()
        });
      };
      
      connection.addEventListener('change', logConnectionInfo);
      
      // Initial log
      logConnectionInfo();
    }
  }

  startBackgroundTasks() {
    // Start all background tasks
    console.log('[BackgroundTasks] Starting background tasks');
    
    // Periodic analytics flush
    setInterval(() => {
      this.flushAnalytics();
    }, 5 * 60 * 1000); // Every 5 minutes
    
    // Periodic cleanup
    setInterval(() => {
      this.cleanupOldData();
    }, 30 * 60 * 1000); // Every 30 minutes
    
    // Periodic health check
    setInterval(() => {
      this.performHealthCheck();
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  async cleanupOldData() {
    try {
      // Clean up old analytics events
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
      
      if (window.offlineManager) {
        await window.offlineManager.cleanupOldData();
      }
      
      // Clean up old notifications
      this.cleanupOldNotifications();
      
      console.log('[BackgroundTasks] Cleanup completed');
    } catch (error) {
      console.error('[BackgroundTasks] Cleanup failed:', error);
    }
  }

  cleanupOldNotifications() {
    // Clear old notification IDs from localStorage
    const notificationKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('notification_')
    );
    
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    notificationKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data.timestamp < cutoff) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Remove invalid entries
        localStorage.removeItem(key);
      }
    });
  }

  performHealthCheck() {
    const health = {
      timestamp: Date.now(),
      isOnline: navigator.onLine,
      isVisible: this.isVisible,
      serviceWorker: 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
      indexedDB: 'indexedDB' in window,
      notifications: 'Notification' in window && Notification.permission === 'granted'
    };
    
    this.trackAnalyticsEvent('health_check', health);
    
    // Log any issues
    if (!health.serviceWorker) {
      console.warn('[BackgroundTasks] Service worker not available');
    }
    
    if (!health.indexedDB) {
      console.warn('[BackgroundTasks] IndexedDB not available');
    }
  }

  performFinalSync() {
    // Perform final sync before page unload
    this.syncCurrentProgress();
    this.flushAnalytics();
    
    // Record session end
    this.trackAnalyticsEvent('session_end', {
      duration: Date.now() - this.performanceMetrics.sessionStart,
      pageViews: this.performanceMetrics.pageViews,
      interactions: this.performanceMetrics.interactions,
      timestamp: Date.now()
    });
  }

  processPendingNotifications() {
    // Process any notifications that were queued while app was in background
    if (this.notificationQueue.length > 0) {
      const notifications = [...this.notificationQueue];
      this.notificationQueue = [];
      
      notifications.forEach(notification => {
        this.sendNotification(notification);
      });
    }
  }

  savePushSubscription(subscription) {
    // Save push subscription to server
    fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(error => {
      console.error('[BackgroundTasks] Failed to save push subscription:', error);
    });
  }

  // Utility methods
  getCurrentSection() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : 'overview';
  }

  getSectionTitle(sectionId) {
    const section = document.getElementById(sectionId);
    const heading = section?.querySelector('h2, h3');
    return heading?.textContent || sectionId;
  }

  calculateTimeOnCurrentSection() {
    const key = `section_time_${this.getCurrentSection()}`;
    const startTime = sessionStorage.getItem(key);
    
    if (startTime) {
      return Date.now() - parseInt(startTime);
    } else {
      sessionStorage.setItem(key, Date.now().toString());
      return 0;
    }
  }

  calculateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  getSectionProgress(sectionId) {
    // Get progress from offline manager
    if (window.offlineManager) {
      return window.offlineManager.getProgress(sectionId);
    }
    return 0;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('az-claude-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('az-claude-session-id', sessionId);
    }
    return sessionId;
  }

  destroy() {
    // Clean up all intervals and listeners
    this.syncIntervals.forEach(interval => clearInterval(interval));
    this.syncIntervals.clear();
    
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
    
    // Final sync
    this.performFinalSync();
    
    console.log('[BackgroundTasks] Destroyed');
  }
}

// Initialize background tasks
let backgroundTasks;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    backgroundTasks = new BackgroundTasks();
  });
} else {
  backgroundTasks = new BackgroundTasks();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (backgroundTasks) {
    backgroundTasks.destroy();
  }
});

// Make it globally available
window.backgroundTasks = backgroundTasks;