/**
 * Accessibility Enhancements for Claude Code Training Website
 * Provides comprehensive ARIA implementation, live regions, role definitions, and state management
 * WCAG 2.1 AA compliance focused
 */

class AccessibilityEnhancer {
    constructor() {
        this.liveRegions = new Map();
        this.dynamicContent = new Map();
        this.interactiveElements = new Map();
        this.stateManagers = new Map();
        this.init();
    }

    init() {
        this.setupLiveRegions();
        this.enhanceARIALabels();
        this.setupRoleDefinitions();
        this.initializeStateManagement();
        this.setupDynamicContentAnnouncements();
        this.enhanceFormAccessibility();
        this.setupProgressIndicators();
    }

    /**
     * Set up ARIA live regions for dynamic content announcements
     */
    setupLiveRegions() {
        // Create primary announcement region
        const announcementRegion = document.createElement('div');
        announcementRegion.id = 'aria-announcements';
        announcementRegion.setAttribute('aria-live', 'polite');
        announcementRegion.setAttribute('aria-atomic', 'true');
        announcementRegion.setAttribute('role', 'status');
        announcementRegion.className = 'sr-only';
        document.body.appendChild(announcementRegion);
        this.liveRegions.set('announcements', announcementRegion);

        // Create alert region for urgent notifications
        const alertRegion = document.createElement('div');
        alertRegion.id = 'aria-alerts';
        alertRegion.setAttribute('aria-live', 'assertive');
        alertRegion.setAttribute('aria-atomic', 'true');
        alertRegion.setAttribute('role', 'alert');
        alertRegion.className = 'sr-only';
        document.body.appendChild(alertRegion);
        this.liveRegions.set('alerts', alertRegion);

        // Create progress region for loading states
        const progressRegion = document.createElement('div');
        progressRegion.id = 'aria-progress';
        progressRegion.setAttribute('aria-live', 'polite');
        progressRegion.setAttribute('aria-atomic', 'false');
        progressRegion.setAttribute('role', 'status');
        progressRegion.className = 'sr-only';
        document.body.appendChild(progressRegion);
        this.liveRegions.set('progress', progressRegion);
    }

    /**
     * Enhance ARIA labels and descriptions throughout the site
     */
    enhanceARIALabels() {
        // Navigation enhancements
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Navigation toggle button
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-list');
            navToggle.setAttribute('aria-label', 'Toggle main navigation menu');
        }

        // Navigation list
        const navList = document.querySelector('.nav-list');
        if (navList) {
            navList.id = 'nav-list';
        }

        // Code blocks with copy functionality
        document.querySelectorAll('.code-block').forEach((block, index) => {
            const id = `code-block-${index}`;
            block.id = id;
            block.setAttribute('role', 'region');
            
            const header = block.querySelector('.code-header span');
            const codeTitle = header ? header.textContent : 'Code snippet';
            block.setAttribute('aria-label', `${codeTitle} - Code example`);

            const copyBtn = block.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.setAttribute('aria-describedby', id);
                copyBtn.setAttribute('aria-label', `Copy ${codeTitle} to clipboard`);
            }
        });

        // Interactive demos
        document.querySelectorAll('.demo-btn').forEach(btn => {
            const demo = btn.closest('.interactive-demo, .interactive-example');
            if (demo) {
                const demoTitle = demo.querySelector('h3, h4')?.textContent || 'Interactive demo';
                btn.setAttribute('aria-describedby', demo.id || '');
                btn.setAttribute('aria-label', `Run ${demoTitle}`);
            }
        });

        // Tab interfaces
        document.querySelectorAll('.tab-buttons').forEach(tabContainer => {
            tabContainer.setAttribute('role', 'tablist');
            tabContainer.setAttribute('aria-label', 'Installation options');
            
            const tabs = tabContainer.querySelectorAll('.tab-btn');
            const panels = document.querySelectorAll('.tab-content');
            
            tabs.forEach((tab, index) => {
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', tab.classList.contains('active'));
                tab.setAttribute('aria-controls', panels[index]?.id || `panel-${index}`);
                tab.id = `tab-${index}`;
            });

            panels.forEach((panel, index) => {
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', `tab-${index}`);
                panel.setAttribute('tabindex', panel.classList.contains('active') ? '0' : '-1');
                if (!panel.id) panel.id = `panel-${index}`;
            });
        });

        // Accordion interfaces
        document.querySelectorAll('.accordion-item').forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.setAttribute('role', 'button');
                header.setAttribute('aria-expanded', 'false');
                header.setAttribute('aria-controls', `accordion-content-${index}`);
                header.setAttribute('tabindex', '0');
                header.id = `accordion-header-${index}`;
                
                content.setAttribute('role', 'region');
                content.setAttribute('aria-labelledby', `accordion-header-${index}`);
                content.id = `accordion-content-${index}`;
            }
        });

        // Card grids and interactive elements
        document.querySelectorAll('.card, .command-item, .pitfall-card').forEach(card => {
            const heading = card.querySelector('h3, h4');
            if (heading) {
                card.setAttribute('aria-labelledby', heading.id || this.generateId(heading));
            }
        });

        // Badges and status indicators
        document.querySelectorAll('.badge').forEach(badge => {
            badge.setAttribute('role', 'status');
            if (badge.classList.contains('required')) {
                badge.setAttribute('aria-label', 'Required configuration');
            } else if (badge.classList.contains('warning')) {
                badge.setAttribute('aria-label', 'Warning information');
            }
        });
    }

    /**
     * Setup custom role definitions for complex components
     */
    setupRoleDefinitions() {
        // Command reference sections
        document.querySelectorAll('.command-category').forEach(category => {
            category.setAttribute('role', 'group');
            const heading = category.querySelector('h3');
            if (heading) {
                category.setAttribute('aria-labelledby', heading.id || this.generateId(heading));
            }
        });

        // Feature highlights
        document.querySelectorAll('.feature-highlight, .special-feature').forEach(feature => {
            feature.setAttribute('role', 'region');
            const heading = feature.querySelector('h3, h4');
            if (heading) {
                feature.setAttribute('aria-labelledby', heading.id || this.generateId(heading));
            }
        });

        // Diagram components
        document.querySelectorAll('.sub-agents-diagram, .capabilities-grid').forEach(diagram => {
            diagram.setAttribute('role', 'img');
            diagram.setAttribute('aria-label', 'Architecture diagram showing sub-agent relationships');
        });

        // Alert boxes
        document.querySelectorAll('.alert').forEach(alert => {
            alert.setAttribute('role', 'alert');
            if (alert.classList.contains('alert-warning')) {
                alert.setAttribute('aria-label', 'Important warning information');
            }
        });
    }

    /**
     * Initialize state management for interactive elements
     */
    initializeStateManagement() {
        // Navigation toggle state
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            this.stateManagers.set('navigation', {
                element: navToggle,
                isExpanded: false,
                toggle: () => {
                    const currentState = this.stateManagers.get('navigation').isExpanded;
                    const newState = !currentState;
                    navToggle.setAttribute('aria-expanded', newState);
                    this.stateManagers.get('navigation').isExpanded = newState;
                    this.announce(newState ? 'Navigation menu opened' : 'Navigation menu closed');
                }
            });
        }

        // Tab state management
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleTabActivation(e.target);
            });
        });

        // Accordion state management
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                this.handleAccordionToggle(e.target);
            });
        });

        // Copy button state management
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCopyAction(e.target);
            });
        });
    }

    /**
     * Setup dynamic content announcements
     */
    setupDynamicContentAnnouncements() {
        // Demo result announcements
        const demoButtons = document.querySelectorAll('.demo-btn');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const demoName = btn.closest('.interactive-demo, .interactive-example')
                    ?.querySelector('h3, h4')?.textContent || 'Demo';
                this.announce(`Running ${demoName}. Results will be displayed shortly.`);
            });
        });

        // Form submission feedback
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.announce('Form submitted. Processing your request.');
            });
        });

        // Loading state announcements
        this.setupLoadingStateAnnouncements();
    }

    /**
     * Enhance form accessibility
     */
    enhanceFormAccessibility() {
        document.querySelectorAll('input, select, textarea').forEach(field => {
            // Add proper labels if missing
            if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${field.id}"]`);
                if (!label) {
                    const placeholder = field.getAttribute('placeholder');
                    if (placeholder) {
                        field.setAttribute('aria-label', placeholder);
                    }
                }
            }

            // Add error message support
            field.addEventListener('invalid', (e) => {
                const errorMsg = `Invalid ${field.getAttribute('aria-label') || field.name || 'field'}. Please check your input.`;
                this.announceAlert(errorMsg);
            });
        });
    }

    /**
     * Setup progress indicators
     */
    setupProgressIndicators() {
        // Page load progress
        window.addEventListener('load', () => {
            this.announce('Page fully loaded and ready for interaction');
        });

        // Section navigation progress
        const sections = document.querySelectorAll('section[id]');
        const totalSections = sections.length;
        
        sections.forEach((section, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionTitle = entry.target.querySelector('h2, h3')?.textContent || 'Section';
                        const progress = `Section ${index + 1} of ${totalSections}: ${sectionTitle}`;
                        this.announceProgress(progress);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(section);
        });
    }

    /**
     * Handle tab activation with proper state management
     */
    handleTabActivation(activeTab) {
        const tabList = activeTab.closest('.tab-buttons');
        const allTabs = tabList.querySelectorAll('.tab-btn');
        const allPanels = document.querySelectorAll('.tab-content');
        
        // Update tab states
        allTabs.forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove('active');
        });
        
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.classList.add('active');
        
        // Update panel states
        const targetPanel = document.getElementById(activeTab.getAttribute('aria-controls'));
        allPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('tabindex', '-1');
        });
        
        if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.setAttribute('tabindex', '0');
        }
        
        // Announce the change
        const tabText = activeTab.textContent.trim();
        this.announce(`Switched to ${tabText} tab`);
    }

    /**
     * Handle accordion toggle with proper state management
     */
    handleAccordionToggle(header) {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        header.setAttribute('aria-expanded', newState);
        
        const content = document.getElementById(header.getAttribute('aria-controls'));
        if (content) {
            content.style.display = newState ? 'block' : 'none';
        }
        
        // Announce the change
        const headerText = header.querySelector('h3, h4')?.textContent || 'Section';
        this.announce(`${headerText} ${newState ? 'expanded' : 'collapsed'}`);
    }

    /**
     * Handle copy action with feedback
     */
    handleCopyAction(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock?.querySelector('pre code')?.textContent;
        
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.setAttribute('aria-label', 'Code copied to clipboard');
                
                this.announce('Code snippet copied to clipboard');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.setAttribute('aria-label', 'Copy code to clipboard');
                }, 2000);
            }).catch(() => {
                this.announceAlert('Failed to copy code to clipboard');
            });
        }
    }

    /**
     * Setup loading state announcements
     */
    setupLoadingStateAnnouncements() {
        // Monitor for dynamic content loading
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check for loading indicators
                            if (node.classList?.contains('loading') || node.querySelector?.('.loading')) {
                                this.announce('Content is loading, please wait');
                            }
                            
                            // Check for newly added content
                            if (node.classList?.contains('dynamic-content')) {
                                this.announce('New content has been loaded');
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Announce message to screen readers (polite)
     */
    announce(message) {
        const region = this.liveRegions.get('announcements');
        if (region) {
            region.textContent = message;
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    /**
     * Announce alert message to screen readers (assertive)
     */
    announceAlert(message) {
        const region = this.liveRegions.get('alerts');
        if (region) {
            region.textContent = message;
            setTimeout(() => {
                region.textContent = '';
            }, 3000);
        }
    }

    /**
     * Announce progress information
     */
    announceProgress(message) {
        const region = this.liveRegions.get('progress');
        if (region) {
            region.textContent = message;
        }
    }

    /**
     * Generate unique ID for elements
     */
    generateId(element) {
        const text = element.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const id = `aria-${text}-${Math.random().toString(36).substr(2, 9)}`;
        element.id = id;
        return id;
    }

    /**
     * Update ARIA attributes dynamically
     */
    updateAriaAttribute(element, attribute, value) {
        element.setAttribute(attribute, value);
        
        // Announce significant state changes
        if (attribute === 'aria-expanded') {
            const label = element.getAttribute('aria-label') || element.textContent.trim();
            this.announce(`${label} ${value === 'true' ? 'expanded' : 'collapsed'}`);
        }
    }

    /**
     * Validate ARIA implementation
     */
    validateARIA() {
        const issues = [];
        
        // Check for missing labels
        document.querySelectorAll('button, input, select, textarea').forEach(element => {
            if (!element.getAttribute('aria-label') && 
                !element.getAttribute('aria-labelledby') && 
                !document.querySelector(`label[for="${element.id}"]`)) {
                issues.push(`Missing label for ${element.tagName.toLowerCase()}`);
            }
        });
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                issues.push(`Heading level skip: ${heading.textContent.trim()}`);
            }
            previousLevel = level;
        });
        
        return issues;
    }
}

// Initialize accessibility enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityEnhancer = new AccessibilityEnhancer();
    
    // Add global keyboard event listeners
    document.addEventListener('keydown', (e) => {
        // Support for custom keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '/':
                    e.preventDefault();
                    window.keyboardNavigation?.focusSearchOrNavigation();
                    break;
                case 'k':
                    e.preventDefault();
                    window.keyboardNavigation?.showKeyboardShortcuts();
                    break;
            }
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityEnhancer;
}