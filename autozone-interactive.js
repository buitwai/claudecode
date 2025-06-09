/**
 * AutoZone Interactive Design System
 * JavaScript utilities and behaviors for Claude Code documentation
 */

class AutoZoneInteractive {
    constructor() {
        this.init();
    }

    init() {
        this.setupSwipeDetection();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
        this.setupSearchFunctionality();
        this.setupProgressTracking();
        this.setupTooltips();
        this.setupSmoothScrolling();
        this.setupPerformanceOptimizations();
    }

    /**
     * Mobile swipe gesture detection for navigation
     */
    setupSwipeDetection() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
                const direction = distX > 0 ? 'right' : 'left';
                this.handleSwipe(direction);
            }
            
            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        }, { passive: true });
    }

    handleSwipe(direction) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (direction === 'right' && window.innerWidth < 1024) {
            // Open sidebar on right swipe
            if (sidebar) {
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
                if (overlay) overlay.classList.remove('hidden');
            }
        } else if (direction === 'left' && window.innerWidth < 1024) {
            // Close sidebar on left swipe
            if (sidebar) {
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('translate-x-0');
                if (overlay) overlay.classList.add('hidden');
            }
        }
    }

    /**
     * Intersection Observer for animations
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-up, .stagger-children').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        if (element.classList.contains('stagger-children')) {
            this.staggerChildAnimations(element);
        } else {
            element.style.animationDelay = '0s';
            element.classList.add('animate');
        }
    }

    staggerChildAnimations(parent) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.animation = 'fadeInStagger 0.6s ease-out both';
            }, index * 100);
        });
    }

    /**
     * Keyboard navigation support
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals/sidebars
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Tab navigation enhancements
            if (e.key === 'Tab') {
                this.enhanceTabNavigation(e);
            }
            
            // Arrow key navigation for tab systems
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleArrowNavigation(e);
            }
        });
    }

    closeModals() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            if (overlay) overlay.classList.add('hidden');
        }
    }

    enhanceTabNavigation(e) {
        const focusedElement = document.activeElement;
        
        // Add visible focus indicators
        if (focusedElement && !focusedElement.classList.contains('focus-visible')) {
            focusedElement.classList.add('focus-visible');
            
            focusedElement.addEventListener('blur', () => {
                focusedElement.classList.remove('focus-visible');
            }, { once: true });
        }
    }

    handleArrowNavigation(e) {
        const focusedElement = document.activeElement;
        
        if (focusedElement.classList.contains('tab-button')) {
            e.preventDefault();
            const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
            const currentIndex = tabButtons.indexOf(focusedElement);
            
            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabButtons.length;
            } else {
                nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
            }
            
            tabButtons[nextIndex].focus();
            tabButtons[nextIndex].click();
        }
    }

    /**
     * Enhanced search functionality
     */
    setupSearchFunctionality() {
        const searchInputs = document.querySelectorAll('.search-input, input[type="search"]');
        
        searchInputs.forEach(input => {
            this.enhanceSearchInput(input);
        });
    }

    enhanceSearchInput(input) {
        let searchTimeout;
        
        // Debounced search
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
        
        // Search suggestions
        input.addEventListener('focus', () => {
            this.showSearchSuggestions(input);
        });
        
        input.addEventListener('blur', (e) => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => {
                this.hideSearchSuggestions(input);
            }, 150);
        });
    }

    performSearch(query) {
        if (!query || query.length < 2) return;
        
        // Mock search functionality
        console.log('Searching for:', query);
        
        // In a real implementation, this would:
        // 1. Search through documentation content
        // 2. Highlight matching sections
        // 3. Update URL with search parameters
        // 4. Show search results
    }

    showSearchSuggestions(input) {
        let suggestions = input.parentNode.querySelector('.search-suggestions');
        
        if (!suggestions) {
            suggestions = this.createSearchSuggestions(input);
        }
        
        suggestions.style.display = 'block';
        suggestions.innerHTML = this.getSearchSuggestions();
    }

    hideSearchSuggestions(input) {
        const suggestions = input.parentNode.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    createSearchSuggestions(input) {
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        suggestions.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--color-gray-200);
            border-radius: var(--radius-lg);
            margin-top: 4px;
            box-shadow: var(--shadow-lg);
            max-height: 300px;
            overflow-y: auto;
            z-index: 50;
            display: none;
        `;
        
        input.parentNode.appendChild(suggestions);
        return suggestions;
    }

    getSearchSuggestions() {
        // Mock suggestions - in real implementation, this would be dynamic
        return `
            <div class="search-suggestion" onclick="window.location.href='#security'">
                <strong>Security Setup</strong> - Configure Vertex AI authentication
            </div>
            <div class="search-suggestion" onclick="window.location.href='#installation'">
                <strong>Installation</strong> - Install Claude Code CLI
            </div>
            <div class="search-suggestion" onclick="window.location.href='#commands'">
                <strong>Commands</strong> - Reference guide for all commands
            </div>
            <div class="search-suggestion" onclick="window.location.href='#workflows'">
                <strong>Workflows</strong> - Development workflow examples
            </div>
        `;
    }

    /**
     * Progress tracking system
     */
    setupProgressTracking() {
        this.trackReadingProgress();
        this.trackSetupProgress();
    }

    trackReadingProgress() {
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            
            this.updateProgressBar(progress);
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    updateProgressBar(progress) {
        const progressBars = document.querySelectorAll('.reading-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    trackSetupProgress() {
        // Track completion of setup steps
        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-setup-step]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSetupProgress();
            });
        });
    }

    updateSetupProgress() {
        const total = document.querySelectorAll('input[type="checkbox"][data-setup-step]').length;
        const completed = document.querySelectorAll('input[type="checkbox"][data-setup-step]:checked').length;
        const progress = (completed / total) * 100;
        
        const setupProgress = document.querySelector('.setup-progress');
        if (setupProgress) {
            setupProgress.style.width = `${progress}%`;
        }
        
        // Save progress to localStorage
        localStorage.setItem('claudeCodeSetupProgress', JSON.stringify({ completed, total, progress }));
    }

    /**
     * Tooltip system
     */
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            this.createTooltip(element);
        });
    }

    createTooltip(element) {
        let tooltip;
        
        element.addEventListener('mouseenter', () => {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-gray-800);
                color: white;
                padding: 8px 12px;
                border-radius: var(--radius-md);
                font-size: 0.875rem;
                z-index: 1000;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            this.positionTooltip(element, tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            }
        });
    }

    positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 8;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Adjust if tooltip would go off screen
        if (top < 0) {
            top = rect.bottom + 8;
        }
        
        if (left < 0) {
            left = 8;
        } else if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        
        tooltip.style.top = `${top + window.pageYOffset}px`;
        tooltip.style.left = `${left}px`;
    }

    /**
     * Smooth scrolling with offset
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offset = 80; // Account for fixed headers
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, anchor.getAttribute('href'));
                }
            });
        });
    }

    /**
     * Performance optimizations
     */
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce resize events
        this.optimizeResizeEvents();
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
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
    }

    optimizeResizeEvents() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
    }

    handleResize() {
        // Update any size-dependent calculations
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }

    /**
     * Utility methods
     */
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static animateValue(obj, start, end, duration, callback) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = start + (end - start) * progress;
            
            if (callback) callback(value);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Initialize the interactive system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AutoZoneInteractive();
});

// Global utility functions for backward compatibility
window.AutoZoneUtils = {
    showTab: function(event, tabId) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
        event.target.classList.add('active');
    },

    toggleAccordion: function(header) {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('open');
            }
        });
        
        if (isOpen) {
            item.classList.remove('open');
        } else {
            item.classList.add('open');
        }
    },

    copyToClipboard: function(button) {
        const codeBlock = button.closest('.code-block');
        const codeElement = codeBlock.querySelector('pre');
        
        if (!codeElement) return;
        
        const codeText = codeElement.textContent;
        
        navigator.clipboard.writeText(codeText).then(() => {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('text-green-400');
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.classList.remove('text-green-400');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code: ', err);
        });
    }
};