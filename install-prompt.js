// AutoZone Claude Code Training Hub - Installation Prompt
// Smart timing for app installation and user education

class InstallPrompt {
  constructor() {
    this.deferredPrompt = null;
    this.installPromptShown = false;
    this.userEngagement = {
      pageViews: 0,
      timeSpent: 0,
      sectionsVisited: new Set(),
      interactions: 0,
      returnVisits: 0
    };
    this.installCriteria = {
      minPageViews: 3,
      minTimeSpent: 5 * 60 * 1000, // 5 minutes
      minSections: 2,
      minInteractions: 5
    };
    
    this.init();
  }

  init() {
    this.trackUserEngagement();
    this.setupInstallPromptHandling();
    this.setupPlatformDetection();
    this.checkInstallEligibility();
    this.setupInstallButton();
    
    console.log('[InstallPrompt] Initialized successfully');
  }

  trackUserEngagement() {
    // Load existing engagement data
    const saved = localStorage.getItem('az-claude-engagement');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.userEngagement = { ...this.userEngagement, ...data };
        this.userEngagement.sectionsVisited = new Set(data.sectionsVisited || []);
      } catch (error) {
        console.error('[InstallPrompt] Failed to load engagement data:', error);
      }
    }
    
    // Track current session
    this.startSessionTracking();
    this.trackPageInteractions();
    this.trackSectionVisits();
    
    // Increment return visits
    this.userEngagement.returnVisits++;
    this.saveEngagementData();
  }

  startSessionTracking() {
    this.sessionStart = Date.now();
    this.userEngagement.pageViews++;
    
    // Track time spent on page
    setInterval(() => {
      if (!document.hidden) {
        this.userEngagement.timeSpent += 1000; // Add 1 second
        this.saveEngagementData();
        this.checkInstallEligibility();
      }
    }, 1000);
    
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveEngagementData();
      }
    });
    
    // Save data before page unload
    window.addEventListener('beforeunload', () => {
      this.saveEngagementData();
    });
  }

  trackPageInteractions() {
    // Track meaningful interactions
    document.addEventListener('click', (event) => {
      const target = event.target.closest('a, button, .card, .command-item, .accordion-header');
      if (target) {
        this.userEngagement.interactions++;
        this.checkInstallEligibility();
      }
    });
    
    // Track scroll engagement
    let scrollEngagement = false;
    document.addEventListener('scroll', () => {
      if (!scrollEngagement && window.scrollY > 500) {
        scrollEngagement = true;
        this.userEngagement.interactions++;
      }
    });
    
    // Track form interactions
    document.addEventListener('focus', (event) => {
      if (event.target.matches('input, textarea, select')) {
        this.userEngagement.interactions++;
      }
    }, true);
  }

  trackSectionVisits() {
    let currentSection = this.getCurrentSection();
    this.userEngagement.sectionsVisited.add(currentSection);
    
    // Monitor hash changes
    window.addEventListener('hashchange', () => {
      const newSection = this.getCurrentSection();
      if (newSection !== currentSection) {
        this.userEngagement.sectionsVisited.add(newSection);
        currentSection = newSection;
        this.checkInstallEligibility();
      }
    });
    
    // Monitor programmatic section changes
    const observer = new MutationObserver(() => {
      const newSection = this.getCurrentSection();
      if (newSection !== currentSection) {
        this.userEngagement.sectionsVisited.add(newSection);
        currentSection = newSection;
        this.checkInstallEligibility();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-section']
    });
  }

  setupInstallPromptHandling() {
    // Handle the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('[InstallPrompt] Before install prompt event fired');
      
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Store the event so it can be triggered later
      this.deferredPrompt = event;
      
      // Check if we should show the prompt now
      this.checkInstallEligibility();
    });
    
    // Handle successful installation
    window.addEventListener('appinstalled', (event) => {
      console.log('[InstallPrompt] App was installed');
      
      this.handleSuccessfulInstall();
      
      // Track installation
      if (window.backgroundTasks) {
        window.backgroundTasks.trackAnalyticsEvent('app_installed', {
          platform: this.getPlatform(),
          engagement: this.userEngagement,
          timestamp: Date.now()
        });
      }
    });
  }

  setupPlatformDetection() {
    this.platform = this.getPlatform();
    this.isStandalone = this.isRunningStandalone();
    
    // Add platform-specific CSS classes
    document.body.classList.add(`platform-${this.platform}`);
    
    if (this.isStandalone) {
      document.body.classList.add('standalone-app');
    }
    
    console.log(`[InstallPrompt] Platform: ${this.platform}, Standalone: ${this.isStandalone}`);
  }

  getPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/windows/.test(userAgent)) {
      return 'windows';
    } else if (/mac/.test(userAgent)) {
      return 'macos';
    } else if (/linux/.test(userAgent)) {
      return 'linux';
    } else {
      return 'unknown';
    }
  }

  isRunningStandalone() {
    // Check if app is running in standalone mode
    return (
      window.navigator.standalone === true || // iOS Safari
      window.matchMedia('(display-mode: standalone)').matches || // PWA
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      document.referrer.includes('android-app://') // Android TWA
    );
  }

  checkInstallEligibility() {
    // Don't show if already installed or prompt already shown
    if (this.isStandalone || this.installPromptShown) {
      return;
    }
    
    // Check if user meets engagement criteria
    const meetsPageViews = this.userEngagement.pageViews >= this.installCriteria.minPageViews;
    const meetsTimeSpent = this.userEngagement.timeSpent >= this.installCriteria.minTimeSpent;
    const meetsSections = this.userEngagement.sectionsVisited.size >= this.installCriteria.minSections;
    const meetsInteractions = this.userEngagement.interactions >= this.installCriteria.minInteractions;
    
    const isEligible = meetsPageViews || meetsTimeSpent || (meetsSections && meetsInteractions);
    
    console.log('[InstallPrompt] Eligibility check:', {
      pageViews: `${this.userEngagement.pageViews}/${this.installCriteria.minPageViews}`,
      timeSpent: `${Math.round(this.userEngagement.timeSpent / 1000)}s/${this.installCriteria.minTimeSpent / 1000}s`,
      sections: `${this.userEngagement.sectionsVisited.size}/${this.installCriteria.minSections}`,
      interactions: `${this.userEngagement.interactions}/${this.installCriteria.minInteractions}`,
      eligible: isEligible
    });
    
    if (isEligible) {
      this.showInstallPrompt();
    }
  }

  showInstallPrompt() {
    if (this.installPromptShown) return;
    
    this.installPromptShown = true;
    
    // Show platform-specific install prompt
    if (this.platform === 'ios') {
      this.showIOSInstallPrompt();
    } else if (this.platform === 'android' && this.deferredPrompt) {
      this.showAndroidInstallPrompt();
    } else if (this.deferredPrompt) {
      this.showDesktopInstallPrompt();
    } else {
      this.showGenericInstallPrompt();
    }
    
    // Track prompt display
    if (window.backgroundTasks) {
      window.backgroundTasks.trackAnalyticsEvent('install_prompt_shown', {
        platform: this.platform,
        engagement: this.userEngagement,
        timestamp: Date.now()
      });
    }
  }

  showIOSInstallPrompt() {
    const prompt = this.createInstallPrompt({
      title: 'Install AutoZone Claude Training',
      message: 'Add this training app to your home screen for quick access and offline learning!',
      benefits: [
        'Access training content offline',
        'Quick launch from home screen',
        'Full-screen experience',
        'Receive learning reminders'
      ],
      instructions: [
        'Tap the Share button <i class="fas fa-share"></i> in Safari',
        'Scroll down and tap "Add to Home Screen" <i class="fas fa-plus-square"></i>',
        'Tap "Add" to install the app'
      ],
      showInstructions: true
    });
    
    this.displayPrompt(prompt);
  }

  showAndroidInstallPrompt() {
    const prompt = this.createInstallPrompt({
      title: 'Install AutoZone Claude Training',
      message: 'Install this app for the best training experience!',
      benefits: [
        'Works offline for uninterrupted learning',
        'Faster loading and performance',
        'Desktop shortcut for quick access',
        'Push notifications for reminders'
      ],
      primaryAction: {
        text: 'Install App',
        action: () => this.triggerNativeInstall()
      },
      secondaryAction: {
        text: 'Maybe Later',
        action: () => this.dismissPrompt('later')
      }
    });
    
    this.displayPrompt(prompt);
  }

  showDesktopInstallPrompt() {
    const prompt = this.createInstallPrompt({
      title: 'Install AutoZone Claude Training',
      message: 'Install this training hub as a desktop app for the best experience!',
      benefits: [
        'Dedicated app window',
        'Offline access to all content',
        'System notifications',
        'Always available in your taskbar'
      ],
      primaryAction: {
        text: 'Install App',
        action: () => this.triggerNativeInstall()
      },
      secondaryAction: {
        text: 'Not Now',
        action: () => this.dismissPrompt('declined')
      }
    });
    
    this.displayPrompt(prompt);
  }

  showGenericInstallPrompt() {
    const prompt = this.createInstallPrompt({
      title: 'Get the Full Training Experience',
      message: 'Save this training hub for easy access and offline learning!',
      benefits: [
        'Bookmark for quick access',
        'Offline content availability',
        'Better mobile experience',
        'Progress tracking across sessions'
      ],
      primaryAction: {
        text: 'Learn How',
        action: () => this.showInstallInstructions()
      },
      secondaryAction: {
        text: 'Continue in Browser',
        action: () => this.dismissPrompt('browser')
      }
    });
    
    this.displayPrompt(prompt);
  }

  createInstallPrompt(config) {
    const prompt = document.createElement('div');
    prompt.className = 'install-prompt';
    prompt.setAttribute('role', 'dialog');
    prompt.setAttribute('aria-labelledby', 'install-title');
    prompt.setAttribute('aria-describedby', 'install-description');
    
    prompt.innerHTML = `
      <div class="install-prompt-overlay"></div>
      <div class="install-prompt-content">
        <div class="install-prompt-header">
          <div class="install-prompt-icon">
            <i class="fas fa-robot"></i>
          </div>
          <h3 id="install-title">${config.title}</h3>
          <button class="install-prompt-close" aria-label="Close">&times;</button>
        </div>
        
        <div class="install-prompt-body">
          <p id="install-description">${config.message}</p>
          
          ${config.benefits ? `
            <div class="install-benefits">
              <h4>Benefits:</h4>
              <ul>
                ${config.benefits.map(benefit => `<li><i class="fas fa-check"></i> ${benefit}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${config.instructions && config.showInstructions ? `
            <div class="install-instructions">
              <h4>How to install:</h4>
              <ol>
                ${config.instructions.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
        </div>
        
        <div class="install-prompt-actions">
          ${config.primaryAction ? `
            <button class="install-btn-primary">
              ${config.primaryAction.text}
            </button>
          ` : ''}
          
          ${config.secondaryAction ? `
            <button class="install-btn-secondary">
              ${config.secondaryAction.text}
            </button>
          ` : ''}
          
          <button class="install-btn-dismiss">
            Don't show again
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    const closeBtn = prompt.querySelector('.install-prompt-close');
    const overlay = prompt.querySelector('.install-prompt-overlay');
    const primaryBtn = prompt.querySelector('.install-btn-primary');
    const secondaryBtn = prompt.querySelector('.install-btn-secondary');
    const dismissBtn = prompt.querySelector('.install-btn-dismiss');
    
    const closePrompt = () => {
      prompt.remove();
      document.body.style.overflow = '';
    };
    
    closeBtn?.addEventListener('click', closePrompt);
    overlay?.addEventListener('click', closePrompt);
    
    if (primaryBtn && config.primaryAction) {
      primaryBtn.addEventListener('click', () => {
        config.primaryAction.action();
        closePrompt();
      });
    }
    
    if (secondaryBtn && config.secondaryAction) {
      secondaryBtn.addEventListener('click', () => {
        config.secondaryAction.action();
        closePrompt();
      });
    }
    
    dismissBtn?.addEventListener('click', () => {
      this.dismissPrompt('dismissed');
      closePrompt();
    });
    
    return prompt;
  }

  displayPrompt(prompt) {
    document.body.appendChild(prompt);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
      prompt.classList.add('visible');
    });
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (prompt.parentElement) {
        this.dismissPrompt('timeout');
        prompt.remove();
        document.body.style.overflow = '';
      }
    }, 30000);
  }

  async triggerNativeInstall() {
    if (this.deferredPrompt) {
      try {
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`[InstallPrompt] User chose: ${outcome}`);
        
        // Track the outcome
        if (window.backgroundTasks) {
          window.backgroundTasks.trackAnalyticsEvent('install_prompt_result', {
            outcome,
            platform: this.platform,
            timestamp: Date.now()
          });
        }
        
        if (outcome === 'accepted') {
          this.handleSuccessfulInstall();
        } else {
          this.dismissPrompt('declined');
        }
        
        // Clear the deferred prompt
        this.deferredPrompt = null;
        
      } catch (error) {
        console.error('[InstallPrompt] Install prompt failed:', error);
        this.showInstallInstructions();
      }
    } else {
      // Fallback to manual instructions
      this.showInstallInstructions();
    }
  }

  showInstallInstructions() {
    const instructions = this.getInstallInstructions();
    const modal = this.createInstructionsModal(instructions);
    this.displayPrompt(modal);
  }

  getInstallInstructions() {
    switch (this.platform) {
      case 'ios':
        return {
          title: 'Install on iPhone/iPad',
          steps: [
            'Open this page in Safari (not Chrome or other browsers)',
            'Tap the Share button <i class="fas fa-share"></i> at the bottom of the screen',
            'Scroll down and tap "Add to Home Screen" <i class="fas fa-plus-square"></i>',
            'Tap "Add" to install the app on your home screen'
          ],
          note: 'The app will appear on your home screen and work offline!'
        };
      case 'android':
        return {
          title: 'Install on Android',
          steps: [
            'Open this page in Chrome browser',
            'Tap the menu button <i class="fas fa-ellipsis-v"></i> (three dots)',
            'Tap "Add to Home screen" or "Install app"',
            'Tap "Add" or "Install" to confirm'
          ],
          note: 'You can also install from the address bar notification.'
        };
      case 'windows':
        return {
          title: 'Install on Windows',
          steps: [
            'Open this page in Chrome, Edge, or another modern browser',
            'Look for the install button <i class="fas fa-download"></i> in the address bar',
            'Click the install button or go to browser menu > "Install AutoZone Claude Training"',
            'Click "Install" to add the app to your computer'
          ],
          note: 'The app will appear in your Start Menu and taskbar.'
        };
      case 'macos':
        return {
          title: 'Install on Mac',
          steps: [
            'Open this page in Chrome, Safari, or another modern browser',
            'In Chrome: Look for the install button in the address bar',
            'In Safari: Go to File > Add to Dock',
            'Click "Install" or "Add" to install the app'
          ],
          note: 'The app will appear in your Applications folder and Dock.'
        };
      default:
        return {
          title: 'Install This App',
          steps: [
            'Open this page in a modern browser (Chrome, Edge, Firefox, Safari)',
            'Look for an install or "Add to Home Screen" option in your browser',
            'Follow your browser\'s prompts to install the app',
            'The app will be available for offline use'
          ],
          note: 'Installation options vary by browser and device.'
        };
    }
  }

  createInstructionsModal(instructions) {
    const modal = document.createElement('div');
    modal.className = 'install-instructions-modal';
    modal.innerHTML = `
      <div class="install-prompt-overlay"></div>
      <div class="install-prompt-content">
        <div class="install-prompt-header">
          <div class="install-prompt-icon">
            <i class="fas fa-download"></i>
          </div>
          <h3>${instructions.title}</h3>
          <button class="install-prompt-close" aria-label="Close">&times;</button>
        </div>
        
        <div class="install-prompt-body">
          <div class="install-instructions">
            <ol>
              ${instructions.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            ${instructions.note ? `<p class="install-note"><i class="fas fa-info-circle"></i> ${instructions.note}</p>` : ''}
          </div>
        </div>
        
        <div class="install-prompt-actions">
          <button class="install-btn-primary">Got it!</button>
        </div>
      </div>
    `;
    
    // Add close functionality
    const closeElements = modal.querySelectorAll('.install-prompt-close, .install-prompt-overlay, .install-btn-primary');
    closeElements.forEach(element => {
      element.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
      });
    });
    
    return modal;
  }

  setupInstallButton() {
    // Add install button to header if not standalone
    if (!this.isStandalone) {
      const installBtn = document.createElement('button');
      installBtn.className = 'header-install-btn';
      installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
      installBtn.setAttribute('aria-label', 'Install training app');
      
      installBtn.addEventListener('click', () => {
        this.showInstallPrompt();
      });
      
      // Add to navigation
      const nav = document.querySelector('.nav-list');
      if (nav) {
        const listItem = document.createElement('li');
        listItem.appendChild(installBtn);
        nav.appendChild(listItem);
      }
    }
  }

  handleSuccessfulInstall() {
    this.installPromptShown = true;
    
    // Save install status
    localStorage.setItem('az-claude-installed', 'true');
    
    // Show success message
    this.showSuccessMessage();
    
    // Remove install button
    const installBtn = document.querySelector('.header-install-btn');
    if (installBtn) {
      installBtn.parentElement.remove();
    }
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'install-success-message';
    message.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <h4>App Installed Successfully!</h4>
        <p>AutoZone Claude Training is now available on your device. You can access it anytime, even offline!</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 500);
    }, 5000);
  }

  dismissPrompt(reason) {
    console.log(`[InstallPrompt] Dismissed: ${reason}`);
    
    // Track dismissal
    if (window.backgroundTasks) {
      window.backgroundTasks.trackAnalyticsEvent('install_prompt_dismissed', {
        reason,
        platform: this.platform,
        engagement: this.userEngagement,
        timestamp: Date.now()
      });
    }
    
    // Save dismissal status
    localStorage.setItem('az-claude-install-dismissed', JSON.stringify({
      reason,
      timestamp: Date.now(),
      platform: this.platform
    }));
    
    // Don't show again for a while
    if (reason === 'dismissed') {
      localStorage.setItem('az-claude-install-never', 'true');
    }
  }

  saveEngagementData() {
    const data = {
      ...this.userEngagement,
      sectionsVisited: Array.from(this.userEngagement.sectionsVisited),
      lastSave: Date.now()
    };
    
    localStorage.setItem('az-claude-engagement', JSON.stringify(data));
  }

  getCurrentSection() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : 'overview';
  }
}

// Initialize install prompt
let installPrompt;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if user previously dismissed permanently
    const neverShow = localStorage.getItem('az-claude-install-never');
    const isInstalled = localStorage.getItem('az-claude-installed');
    
    if (!neverShow && !isInstalled) {
      installPrompt = new InstallPrompt();
    }
  });
} else {
  const neverShow = localStorage.getItem('az-claude-install-never');
  const isInstalled = localStorage.getItem('az-claude-installed');
  
  if (!neverShow && !isInstalled) {
    installPrompt = new InstallPrompt();
  }
}

// Make it globally available
window.installPrompt = installPrompt;