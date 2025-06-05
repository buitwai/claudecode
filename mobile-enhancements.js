// AutoZone Claude Code Training Hub - Mobile Enhancements
// Touch-friendly interactions and mobile optimizations

class MobileEnhancements {
  constructor() {
    this.isMobile = this.detectMobileDevice();
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.isScrolling = false;
    this.lastTap = 0;
    this.scrollThreshold = 10;
    this.swipeThreshold = 50;
    
    this.init();
  }

  init() {
    if (this.isMobile) {
      this.setupMobileOptimizations();
      this.setupTouchGestures();
      this.setupMobileNavigation();
      this.setupPullToRefresh();
      this.optimizeForMobile();
      this.setupKeyboardHandling();
      
      console.log('[MobileEnhancements] Mobile optimizations applied');
    }
    
    this.setupResponsiveImages();
    this.setupPerformanceMonitoring();
  }

  detectMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    return (
      mobileRegex.test(userAgent.toLowerCase()) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      window.innerWidth <= 768
    );
  }

  setupMobileOptimizations() {
    // Add mobile-specific CSS class
    document.body.classList.add('mobile-device');
    
    // Prevent zoom on form inputs
    this.preventZoomOnInputs();
    
    // Optimize scroll behavior
    this.optimizeScrolling();
    
    // Add mobile meta tags if not present
    this.ensureMobileMetaTags();
    
    // Setup safe area handling for notched devices
    this.setupSafeAreaHandling();
  }

  preventZoomOnInputs() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
        }
      });
      
      input.addEventListener('blur', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0'
          );
        }
      });
    });
  }

  optimizeScrolling() {
    // Smooth scrolling for better mobile experience
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent scroll chaining on mobile
    document.body.style.overscrollBehavior = 'contain';
  }

  ensureMobileMetaTags() {
    const head = document.head;
    
    // Ensure proper viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      head.appendChild(viewport);
    }
    
    // Add mobile web app capable
    if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
      const mobileCapable = document.createElement('meta');
      mobileCapable.name = 'mobile-web-app-capable';
      mobileCapable.content = 'yes';
      head.appendChild(mobileCapable);
    }
    
    // Add Apple mobile web app capable
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const appleCapable = document.createElement('meta');
      appleCapable.name = 'apple-mobile-web-app-capable';
      appleCapable.content = 'yes';
      head.appendChild(appleCapable);
    }
    
    // Add status bar style for iOS
    if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
      const statusBar = document.createElement('meta');
      statusBar.name = 'apple-mobile-web-app-status-bar-style';
      statusBar.content = 'default';
      head.appendChild(statusBar);
    }
  }

  setupSafeAreaHandling() {
    // CSS custom properties for safe areas
    const root = document.documentElement;
    
    // Set safe area insets if supported
    if (CSS.supports('padding: env(safe-area-inset-top)')) {
      root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
      root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
      root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
      root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
    } else {
      root.style.setProperty('--safe-area-top', '0px');
      root.style.setProperty('--safe-area-right', '0px');
      root.style.setProperty('--safe-area-bottom', '0px');
      root.style.setProperty('--safe-area-left', '0px');
    }
  }

  setupTouchGestures() {
    // Swipe navigation between sections
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Double tap to top
    document.addEventListener('touchend', this.handleDoubleTap.bind(this), { passive: true });
    
    // Long press for context menu
    document.addEventListener('touchstart', this.handleLongPress.bind(this), { passive: true });
  }

  handleTouchStart(event) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isScrolling = false;
    
    // Store touch start time for long press detection
    this.touchStartTime = Date.now();
    this.longPressTimer = setTimeout(() => {
      this.handleLongPressActivated(event);
    }, 500);
  }

  handleTouchMove(event) {
    if (!this.touchStartX || !this.touchStartY) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    // Determine if user is scrolling
    if (Math.abs(deltaY) > this.scrollThreshold) {
      this.isScrolling = true;
    }
    
    // Clear long press timer on movement
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    // Handle horizontal swipes for navigation
    if (!this.isScrolling && Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0) {
        this.handleSwipeRight();
      } else {
        this.handleSwipeLeft();
      }
    }
    
    // Prevent default for specific interactions
    if (this.shouldPreventDefault(event)) {
      event.preventDefault();
    }
  }

  handleTouchEnd(event) {
    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isScrolling = false;
  }

  handleSwipeRight() {
    // Navigate to previous section
    const currentSection = this.getCurrentSection();
    const sections = this.getSections();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
      const previousSection = sections[currentIndex - 1];
      this.navigateToSection(previousSection);
      this.showSwipeNavigation('Previous: ' + this.getSectionTitle(previousSection));
    }
  }

  handleSwipeLeft() {
    // Navigate to next section
    const currentSection = this.getCurrentSection();
    const sections = this.getSections();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      this.navigateToSection(nextSection);
      this.showSwipeNavigation('Next: ' + this.getSectionTitle(nextSection));
    }
  }

  handleDoubleTap(event) {
    const currentTime = Date.now();
    const tapDelay = currentTime - this.lastTap;
    
    if (tapDelay < 300 && tapDelay > 0) {
      // Double tap detected - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.showFeedback('Scrolled to top');
      
      // Prevent default double tap zoom
      event.preventDefault();
    }
    
    this.lastTap = currentTime;
  }

  handleLongPress(event) {
    // Setup for long press detection
    this.longPressStarted = false;
  }

  handleLongPressActivated(event) {
    if (this.longPressStarted) return;
    this.longPressStarted = true;
    
    const target = event.target.closest('[data-long-press]') || event.target;
    
    // Show context menu for interactive elements
    if (target.matches('a, button, .command-item, .card')) {
      this.showContextMenu(target, event);
    }
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  shouldPreventDefault(event) {
    // Prevent default for specific elements during touch
    const target = event.target;
    
    return (
      target.matches('.code-block') ||
      target.closest('.accordion-item') ||
      target.matches('[data-prevent-default]')
    );
  }

  setupMobileNavigation() {
    // Enhanced mobile navigation menu
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle && navList) {
      // Improve mobile menu functionality
      navToggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('nav-open');
        navToggle.classList.toggle('nav-active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', isOpen);
        navList.setAttribute('aria-hidden', !isOpen);
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav') && navList.classList.contains('nav-open')) {
          navList.classList.remove('nav-open');
          navToggle.classList.remove('nav-active');
          document.body.style.overflow = '';
        }
      });
      
      // Close menu on section navigation
      navList.addEventListener('click', (event) => {
        if (event.target.matches('a')) {
          navList.classList.remove('nav-open');
          navToggle.classList.remove('nav-active');
          document.body.style.overflow = '';
        }
      });
    }
    
    // Add floating action button for quick access
    this.createFloatingActionButton();
  }

  createFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-button';
    fab.innerHTML = `
      <button class="fab-main" aria-label="Quick actions">
        <i class="fas fa-plus"></i>
      </button>
      <div class="fab-menu">
        <button class="fab-item" data-action="top" title="Scroll to top">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button class="fab-item" data-action="favorites" title="View favorites">
          <i class="fas fa-star"></i>
        </button>
        <button class="fab-item" data-action="search" title="Search content">
          <i class="fas fa-search"></i>
        </button>
        <button class="fab-item" data-action="share" title="Share page">
          <i class="fas fa-share"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(fab);
    
    // FAB functionality
    const fabMain = fab.querySelector('.fab-main');
    const fabMenu = fab.querySelector('.fab-menu');
    
    fabMain.addEventListener('click', () => {
      fab.classList.toggle('fab-open');
    });
    
    // FAB actions
    fab.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action) {
        this.handleFabAction(action);
        fab.classList.remove('fab-open');
      }
    });
    
    // Hide FAB when keyboard is visible
    this.setupKeyboardDetection(fab);
  }

  handleFabAction(action) {
    switch (action) {
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'favorites':
        this.showFavorites();
        break;
      case 'search':
        this.showSearchDialog();
        break;
      case 'share':
        this.shareCurrentPage();
        break;
    }
  }

  setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const pullThreshold = 80;
    
    // Create pull to refresh indicator
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'pull-refresh-indicator';
    refreshIndicator.innerHTML = `
      <div class="refresh-spinner">
        <i class="fas fa-sync-alt"></i>
      </div>
      <span class="refresh-text">Pull to refresh</span>
    `;
    document.body.insertBefore(refreshIndicator, document.body.firstChild);
    
    document.addEventListener('touchstart', (event) => {
      if (window.scrollY === 0) {
        startY = event.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (event) => {
      if (!isPulling) return;
      
      currentY = event.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 0 && window.scrollY === 0) {
        const progress = Math.min(pullDistance / pullThreshold, 1);
        refreshIndicator.style.transform = `translateY(${pullDistance * 0.5}px)`;
        refreshIndicator.style.opacity = progress;
        
        if (progress >= 1) {
          refreshIndicator.classList.add('ready-to-refresh');
          refreshIndicator.querySelector('.refresh-text').textContent = 'Release to refresh';
        } else {
          refreshIndicator.classList.remove('ready-to-refresh');
          refreshIndicator.querySelector('.refresh-text').textContent = 'Pull to refresh';
        }
        
        event.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      if (!isPulling) return;
      
      const pullDistance = currentY - startY;
      isPulling = false;
      
      if (pullDistance >= pullThreshold) {
        this.performRefresh(refreshIndicator);
      } else {
        this.resetRefreshIndicator(refreshIndicator);
      }
    }, { passive: true });
  }

  async performRefresh(indicator) {
    indicator.classList.add('refreshing');
    indicator.querySelector('.refresh-text').textContent = 'Refreshing...';
    
    try {
      // Simulate refresh actions
      await this.refreshContent();
      
      // Show success feedback
      this.showFeedback('Content refreshed!');
      
    } catch (error) {
      console.error('[MobileEnhancements] Refresh failed:', error);
      this.showFeedback('Refresh failed. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        this.resetRefreshIndicator(indicator);
      }, 1000);
    }
  }

  resetRefreshIndicator(indicator) {
    indicator.style.transform = 'translateY(-100%)';
    indicator.style.opacity = '0';
    indicator.classList.remove('ready-to-refresh', 'refreshing');
    indicator.querySelector('.refresh-text').textContent = 'Pull to refresh';
    
    setTimeout(() => {
      indicator.style.transform = '';
    }, 300);
  }

  async refreshContent() {
    // Refresh offline content and sync data
    if (window.offlineManager) {
      await window.offlineManager.processSyncQueue();
    }
    
    // Reload current section content if needed
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  setupKeyboardHandling() {
    let initialViewportHeight = window.innerHeight;
    
    // Detect virtual keyboard appearance
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        // Keyboard is likely visible
        document.body.classList.add('keyboard-visible');
        this.handleKeyboardVisible();
      } else {
        // Keyboard is likely hidden
        document.body.classList.remove('keyboard-visible');
        this.handleKeyboardHidden();
      }
    });
    
    // Handle focus on form elements
    const focusableElements = document.querySelectorAll('input, textarea, select');
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        this.scrollToElement(element);
      });
    });
  }

  setupKeyboardDetection(fab) {
    // Hide FAB when keyboard is visible to prevent overlap
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('keyboard-visible')) {
        fab.style.display = 'none';
      } else {
        fab.style.display = 'block';
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  handleKeyboardVisible() {
    // Adjust layout when keyboard appears
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.matches('input, textarea, select'))) {
      setTimeout(() => {
        this.scrollToElement(activeElement);
      }, 300);
    }
  }

  handleKeyboardHidden() {
    // Reset layout when keyboard disappears
    document.querySelectorAll('.keyboard-adjusted').forEach(element => {
      element.classList.remove('keyboard-adjusted');
    });
  }

  scrollToElement(element) {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const offset = viewportHeight * 0.3; // Show element in top 30% of viewport
    
    window.scrollTo({
      top: elementTop - offset,
      behavior: 'smooth'
    });
  }

  setupResponsiveImages() {
    // Lazy load images for better performance
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
    
    // Optimize image loading based on connection
    this.optimizeImageQuality();
  }

  optimizeImageQuality() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.saveData;
      
      if (isSlowConnection) {
        document.body.classList.add('slow-connection');
        // Load lower quality images
        this.loadLowQualityImages();
      }
    }
  }

  loadLowQualityImages() {
    const images = document.querySelectorAll('img[data-src-low]');
    images.forEach(img => {
      if (img.dataset.srcLow) {
        img.src = img.dataset.srcLow;
      }
    });
  }

  setupPerformanceMonitoring() {
    // Monitor performance metrics specific to mobile
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime < 2500) { // Good LCP
            console.log('[MobileEnhancements] Good LCP:', entry.startTime);
          } else {
            console.warn('[MobileEnhancements] Poor LCP:', entry.startTime);
            this.optimizeForSlowLoading();
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.processingStart - entry.startTime < 100) {
            console.log('[MobileEnhancements] Good FID:', entry.processingStart - entry.startTime);
          } else {
            console.warn('[MobileEnhancements] Poor FID:', entry.processingStart - entry.startTime);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
    
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedMemoryMB = memory.usedJSHeapSize / 1048576;
        
        if (usedMemoryMB > 50) { // Alert if using more than 50MB
          console.warn('[MobileEnhancements] High memory usage:', usedMemoryMB.toFixed(2), 'MB');
          this.optimizeMemoryUsage();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  optimizeForSlowLoading() {
    // Reduce animations for slow devices
    document.body.classList.add('reduce-motion');
    
    // Defer non-critical resources
    const nonCriticalResources = document.querySelectorAll('[data-defer]');
    nonCriticalResources.forEach(resource => {
      if (resource.tagName === 'SCRIPT') {
        resource.defer = true;
      }
    });
  }

  optimizeMemoryUsage() {
    // Clean up unused DOM elements
    const hiddenElements = document.querySelectorAll('[hidden]');
    hiddenElements.forEach(element => {
      if (!element.dataset.keepInDom) {
        element.remove();
      }
    });
    
    // Clear old cached content
    if (window.offlineManager) {
      window.offlineManager.cleanupOldData();
    }
  }

  // Context Menu for Long Press
  showContextMenu(target, event) {
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    
    const actions = this.getContextActions(target);
    menu.innerHTML = actions.map(action => `
      <button class="context-menu-item" data-action="${action.id}">
        <i class="fas fa-${action.icon}"></i>
        ${action.label}
      </button>
    `).join('');
    
    document.body.appendChild(menu);
    
    // Position menu
    const touch = event.touches[0] || event.changedTouches[0];
    menu.style.left = touch.clientX + 'px';
    menu.style.top = touch.clientY + 'px';
    
    // Handle menu actions
    menu.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action) {
        this.handleContextAction(action, target);
      }
      menu.remove();
    });
    
    // Remove menu after timeout
    setTimeout(() => {
      if (menu.parentElement) {
        menu.remove();
      }
    }, 3000);
  }

  getContextActions(target) {
    const actions = [];
    
    if (target.matches('a')) {
      actions.push(
        { id: 'copy-link', icon: 'copy', label: 'Copy Link' },
        { id: 'bookmark', icon: 'bookmark', label: 'Bookmark' }
      );
    }
    
    if (target.matches('.command-item')) {
      actions.push(
        { id: 'copy-command', icon: 'terminal', label: 'Copy Command' },
        { id: 'favorite', icon: 'star', label: 'Add to Favorites' }
      );
    }
    
    if (target.matches('.code-block')) {
      actions.push(
        { id: 'copy-code', icon: 'code', label: 'Copy Code' },
        { id: 'share-code', icon: 'share', label: 'Share Code' }
      );
    }
    
    return actions;
  }

  handleContextAction(action, target) {
    switch (action) {
      case 'copy-link':
        this.copyToClipboard(target.href);
        this.showFeedback('Link copied!');
        break;
      case 'bookmark':
        this.addBookmark(target);
        break;
      case 'copy-command':
        const command = target.querySelector('.command')?.textContent;
        if (command) {
          this.copyToClipboard(command);
          this.showFeedback('Command copied!');
        }
        break;
      case 'copy-code':
        const code = target.querySelector('code')?.textContent;
        if (code) {
          this.copyToClipboard(code);
          this.showFeedback('Code copied!');
        }
        break;
      case 'favorite':
        this.addToFavorites(target);
        break;
    }
  }

  // Utility Methods
  getCurrentSection() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : 'overview';
  }

  getSections() {
    return ['overview', 'security', 'installation', 'memory', 'commands', 'pitfalls', 'sub-agents', 'troubleshooting'];
  }

  getSectionTitle(sectionId) {
    const section = document.getElementById(sectionId);
    const heading = section?.querySelector('h2, h3');
    return heading?.textContent || sectionId;
  }

  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = sectionId;
    }
  }

  showSwipeNavigation(message) {
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    indicator.textContent = message;
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.classList.add('visible');
    }, 10);
    
    setTimeout(() => {
      indicator.classList.remove('visible');
      setTimeout(() => indicator.remove(), 300);
    }, 2000);
  }

  showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `mobile-feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('visible');
    }, 10);
    
    setTimeout(() => {
      feedback.classList.remove('visible');
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  showFavorites() {
    // Show favorites overlay
    if (window.offlineManager) {
      window.offlineManager.getFavorites().then(favorites => {
        this.showOverlay('Favorites', window.offlineManager.renderFavorites(favorites));
      });
    }
  }

  showSearchDialog() {
    const searchHtml = `
      <div class="search-container">
        <input type="text" class="search-input" placeholder="Search training content..." autofocus>
        <div class="search-results"></div>
      </div>
    `;
    
    this.showOverlay('Search', searchHtml);
    
    // Implement search functionality
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value, searchResults);
      });
    }
  }

  performSearch(query, resultsContainer) {
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    const sections = document.querySelectorAll('.content-section');
    const results = [];
    
    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      const title = section.querySelector('h2, h3')?.textContent || 'Untitled';
      
      if (text.includes(query.toLowerCase())) {
        results.push({
          title,
          id: section.id,
          snippet: this.extractSnippet(text, query)
        });
      }
    });
    
    resultsContainer.innerHTML = results.map(result => `
      <div class="search-result" data-section="${result.id}">
        <h4>${result.title}</h4>
        <p>${result.snippet}</p>
      </div>
    `).join('');
    
    // Handle result clicks
    resultsContainer.addEventListener('click', (e) => {
      const result = e.target.closest('.search-result');
      if (result) {
        const sectionId = result.dataset.section;
        this.navigateToSection(sectionId);
        document.querySelector('.overlay').remove();
      }
    });
  }

  extractSnippet(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
  }

  shareCurrentPage() {
    const shareData = {
      title: document.title,
      text: 'Check out this AutoZone Claude Code training resource!',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      this.copyToClipboard(window.location.href);
      this.showFeedback('Link copied to clipboard!');
    }
  }

  showOverlay(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <div class="overlay-header">
          <h3>${title}</h3>
          <button class="overlay-close">&times;</button>
        </div>
        <div class="overlay-body">
          ${content}
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Close overlay
    overlay.querySelector('.overlay-close').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = '';
      }
    });
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  }

  addBookmark(link) {
    if (window.offlineManager) {
      const id = 'bookmark_' + Date.now();
      window.offlineManager.addToFavorites(id, 'bookmark', link.textContent, link.href);
      this.showFeedback('Bookmark added!');
    }
  }

  addToFavorites(element) {
    if (window.offlineManager) {
      const id = 'favorite_' + Date.now();
      const title = element.textContent || 'Untitled';
      const url = window.location.href + '#' + (element.id || '');
      
      window.offlineManager.addToFavorites(id, 'favorite', title, url);
      this.showFeedback('Added to favorites!');
    }
  }
}

// Initialize mobile enhancements
let mobileEnhancements;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mobileEnhancements = new MobileEnhancements();
  });
} else {
  mobileEnhancements = new MobileEnhancements();
}

// Make it globally available
window.mobileEnhancements = mobileEnhancements;