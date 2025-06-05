/**
 * Keyboard Navigation for Claude Code Training Website
 * Provides comprehensive keyboard accessibility with logical tab order, focus management,
 * keyboard shortcuts, skip links, and navigation aids
 * WCAG 2.1 AA compliance focused
 */

class KeyboardNavigation {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.skipLinks = [];
        this.shortcuts = new Map();
        this.focusHistory = [];
        this.init();
    }

    init() {
        this.createSkipLinks();
        this.setupKeyboardShortcuts();
        this.enhanceFocusManagement();
        this.setupTabTrapping();
        this.createFocusIndicators();
        this.setupRovingTabIndex();
        this.addKeyboardHelpDialog();
        this.monitorFocusableElements();
    }

    /**
     * Create skip links for easier navigation
     */
    createSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.setAttribute('role', 'navigation');
        skipLinksContainer.setAttribute('aria-label', 'Skip navigation links');

        const skipLinks = [
            { href: '#main-content', text: 'Skip to main content' },
            { href: '#overview', text: 'Skip to overview' },
            { href: '#commands', text: 'Skip to commands reference' },
            { href: '#nav-list', text: 'Skip to navigation menu' },
            { href: '#troubleshooting', text: 'Skip to troubleshooting' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'skip-link';
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.focusElement(document.querySelector(link.href));
                window.accessibilityEnhancer?.announce(`Skipped to ${link.text.replace('Skip to ', '')}`);
            });
            skipLinksContainer.appendChild(skipLink);
            this.skipLinks.push(skipLink);
        });

        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }

    /**
     * Setup comprehensive keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const shortcuts = [
            { key: 'h', ctrlKey: true, action: () => this.showKeyboardShortcuts(), description: 'Show keyboard shortcuts help' },
            { key: '/', ctrlKey: true, action: () => this.focusSearchOrNavigation(), description: 'Focus search or navigation' },
            { key: 'm', ctrlKey: true, action: () => this.focusMainContent(), description: 'Focus main content' },
            { key: 'n', ctrlKey: true, action: () => this.focusNavigation(), description: 'Focus navigation menu' },
            { key: '1', ctrlKey: true, action: () => this.focusHeading(1), description: 'Focus first heading' },
            { key: '2', ctrlKey: true, action: () => this.focusHeading(2), description: 'Focus second heading' },
            { key: '3', ctrlKey: true, action: () => this.focusHeading(3), description: 'Focus third heading' },
            { key: '4', ctrlKey: true, action: () => this.focusHeading(4), description: 'Focus fourth heading' },
            { key: '5', ctrlKey: true, action: () => this.focusHeading(5), description: 'Focus fifth heading' },
            { key: 't', ctrlKey: true, action: () => this.focusNextTab(), description: 'Focus next tab in tab interface' },
            { key: 'a', ctrlKey: true, action: () => this.focusNextAccordion(), description: 'Focus next accordion section' },
            { key: 'c', ctrlKey: true, action: () => this.focusNextCodeBlock(), description: 'Focus next code block' },
            { key: 'Escape', action: () => this.handleEscape(), description: 'Close dialogs or return to previous focus' },
            { key: 'Enter', action: (e) => this.handleEnterKey(e), description: 'Activate focused element' },
            { key: ' ', action: (e) => this.handleSpaceKey(e), description: 'Activate buttons or scroll page' },
            { key: 'ArrowUp', action: (e) => this.handleArrowKey(e, 'up'), description: 'Navigate up in menus' },
            { key: 'ArrowDown', action: (e) => this.handleArrowKey(e, 'down'), description: 'Navigate down in menus' },
            { key: 'ArrowLeft', action: (e) => this.handleArrowKey(e, 'left'), description: 'Navigate left in tabs' },
            { key: 'ArrowRight', action: (e) => this.handleArrowKey(e, 'right'), description: 'Navigate right in tabs' },
            { key: 'Home', action: (e) => this.handleHomeEnd(e, 'home'), description: 'Go to first item' },
            { key: 'End', action: (e) => this.handleHomeEnd(e, 'end'), description: 'Go to last item' }
        ];

        shortcuts.forEach(shortcut => {
            this.shortcuts.set(this.createShortcutKey(shortcut), shortcut);
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Special handling for focus visible
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Enhance focus management throughout the site
     */
    enhanceFocusManagement() {
        // Monitor all focusable elements
        this.updateFocusableElements();

        // Add focus event listeners
        document.addEventListener('focusin', (e) => {
            this.onFocusIn(e);
        });

        document.addEventListener('focusout', (e) => {
            this.onFocusOut(e);
        });

        // Handle roving tabindex for complex widgets
        this.setupRovingTabIndex();
    }

    /**
     * Setup tab trapping for modal dialogs and popups
     */
    setupTabTrapping() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal:not([hidden]), .dialog:not([hidden])');
                if (modal) {
                    this.trapTabInModal(e, modal);
                }
            }
        });
    }

    /**
     * Create enhanced focus indicators
     */
    createFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid #4A90E2;
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            .keyboard-navigation button:focus,
            .keyboard-navigation a:focus {
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
            }
            
            .focus-within {
                background-color: rgba(74, 144, 226, 0.1);
                border-left: 4px solid #4A90E2;
                padding-left: 16px;
                margin-left: -20px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup roving tabindex for complex widgets
     */
    setupRovingTabIndex() {
        // Tab interfaces
        document.querySelectorAll('.tab-buttons').forEach(tabList => {
            this.setupRovingTabIndexForGroup(tabList, '.tab-btn');
        });

        // Navigation menu
        const navList = document.querySelector('.nav-list');
        if (navList) {
            this.setupRovingTabIndexForGroup(navList, 'a');
        }

        // Command lists
        document.querySelectorAll('.command-list').forEach(commandList => {
            this.setupRovingTabIndexForGroup(commandList, '.command-item');
        });

        // Card grids
        document.querySelectorAll('.cards-grid').forEach(cardGrid => {
            this.setupRovingTabIndexForGroup(cardGrid, '.card');
        });
    }

    /**
     * Add keyboard help dialog
     */
    addKeyboardHelpDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'keyboard-help-dialog';
        dialog.className = 'keyboard-help-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-labelledby', 'keyboard-help-title');
        dialog.setAttribute('aria-modal', 'true');
        dialog.hidden = true;

        dialog.innerHTML = `
            <div class="keyboard-help-content">
                <div class="keyboard-help-header">
                    <h2 id="keyboard-help-title">Keyboard Shortcuts</h2>
                    <button class="close-dialog" aria-label="Close keyboard shortcuts dialog">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="keyboard-help-body">
                    <div class="shortcuts-grid">
                        <div class="shortcut-category">
                            <h3>Navigation</h3>
                            <ul class="shortcuts-list">
                                <li><kbd>Ctrl</kbd> + <kbd>/</kbd> - Focus search or navigation</li>
                                <li><kbd>Ctrl</kbd> + <kbd>M</kbd> - Focus main content</li>
                                <li><kbd>Ctrl</kbd> + <kbd>N</kbd> - Focus navigation menu</li>
                                <li><kbd>Tab</kbd> - Next focusable element</li>
                                <li><kbd>Shift</kbd> + <kbd>Tab</kbd> - Previous focusable element</li>
                            </ul>
                        </div>
                        <div class="shortcut-category">
                            <h3>Sections</h3>
                            <ul class="shortcuts-list">
                                <li><kbd>Ctrl</kbd> + <kbd>1-5</kbd> - Jump to heading by number</li>
                                <li><kbd>Ctrl</kbd> + <kbd>T</kbd> - Next tab in tab interface</li>
                                <li><kbd>Ctrl</kbd> + <kbd>A</kbd> - Next accordion section</li>
                                <li><kbd>Ctrl</kbd> + <kbd>C</kbd> - Next code block</li>
                            </ul>
                        </div>
                        <div class="shortcut-category">
                            <h3>Interaction</h3>
                            <ul class="shortcuts-list">
                                <li><kbd>Enter</kbd> - Activate focused element</li>
                                <li><kbd>Space</kbd> - Activate buttons or scroll</li>
                                <li><kbd>Escape</kbd> - Close dialogs or go back</li>
                                <li><kbd>Arrow Keys</kbd> - Navigate in menus/tabs</li>
                                <li><kbd>Home</kbd>/<kbd>End</kbd> - First/last item</li>
                            </ul>
                        </div>
                        <div class="shortcut-category">
                            <h3>Help</h3>
                            <ul class="shortcuts-list">
                                <li><kbd>Ctrl</kbd> + <kbd>H</kbd> - Show this help dialog</li>
                                <li><kbd>?</kbd> - Context-sensitive help</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="keyboard-help-backdrop"></div>
        `;

        document.body.appendChild(dialog);

        // Setup close functionality
        const closeBtn = dialog.querySelector('.close-dialog');
        const backdrop = dialog.querySelector('.keyboard-help-backdrop');
        
        [closeBtn, backdrop].forEach(element => {
            element.addEventListener('click', () => {
                this.hideKeyboardShortcuts();
            });
        });
    }

    /**
     * Monitor focusable elements dynamically
     */
    monitorFocusableElements() {
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['tabindex', 'disabled', 'hidden']
        });
    }

    /**
     * Update list of focusable elements
     */
    updateFocusableElements() {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');

        this.focusableElements = Array.from(document.querySelectorAll(selector))
            .filter(el => {
                return el.offsetParent !== null && 
                       !el.hidden && 
                       !el.hasAttribute('inert') &&
                       window.getComputedStyle(el).visibility !== 'hidden';
            });
    }

    /**
     * Handle keydown events
     */
    handleKeydown(e) {
        const shortcutKey = this.createShortcutKey({
            key: e.key,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey
        });

        const shortcut = this.shortcuts.get(shortcutKey);
        if (shortcut && shortcut.action) {
            const shouldPreventDefault = shortcut.action(e);
            if (shouldPreventDefault !== false) {
                e.preventDefault();
            }
        }
    }

    /**
     * Setup roving tabindex for a group of elements
     */
    setupRovingTabIndexForGroup(container, selector) {
        const items = container.querySelectorAll(selector);
        let currentIndex = 0;

        // Set initial tabindex values
        items.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        container.addEventListener('keydown', (e) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                return;
            }

            e.preventDefault();
            
            const isVertical = container.classList.contains('vertical') || 
                              container.matches('.nav-list, .command-list');
            
            switch (e.key) {
                case 'ArrowUp':
                    if (isVertical) currentIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowDown':
                    if (isVertical) currentIndex = Math.min(items.length - 1, currentIndex + 1);
                    break;
                case 'ArrowLeft':
                    if (!isVertical) currentIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowRight':
                    if (!isVertical) currentIndex = Math.min(items.length - 1, currentIndex + 1);
                    break;
                case 'Home':
                    currentIndex = 0;
                    break;
                case 'End':
                    currentIndex = items.length - 1;
                    break;
            }

            // Update tabindex and focus
            items.forEach((item, index) => {
                item.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
            });

            items[currentIndex].focus();
        });

        // Handle focus events to update current index
        items.forEach((item, index) => {
            item.addEventListener('focus', () => {
                currentIndex = index;
            });
        });
    }

    /**
     * Focus management methods
     */
    focusElement(element) {
        if (element) {
            this.focusHistory.push(document.activeElement);
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    focusSearchOrNavigation() {
        const searchInput = document.querySelector('input[type="search"], input[name="search"]');
        const navToggle = document.querySelector('.nav-toggle');
        const firstNavLink = document.querySelector('.nav-list a');

        if (searchInput) {
            this.focusElement(searchInput);
        } else if (firstNavLink) {
            this.focusElement(firstNavLink);
        } else if (navToggle) {
            this.focusElement(navToggle);
        }
    }

    focusMainContent() {
        const mainContent = document.querySelector('main, #main-content, .main-content');
        if (mainContent) {
            this.focusElement(mainContent);
        }
    }

    focusNavigation() {
        const nav = document.querySelector('.nav-list a, .nav-toggle');
        if (nav) {
            this.focusElement(nav);
        }
    }

    focusHeading(number) {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings[number - 1]) {
            this.focusElement(headings[number - 1]);
        }
    }

    focusNextTab() {
        const currentTab = document.querySelector('.tab-btn[aria-selected="true"]');
        if (currentTab) {
            const allTabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = allTabs.indexOf(currentTab);
            const nextTab = allTabs[(currentIndex + 1) % allTabs.length];
            if (nextTab) {
                nextTab.click();
                this.focusElement(nextTab);
            }
        }
    }

    focusNextAccordion() {
        const accordions = document.querySelectorAll('.accordion-header');
        const currentAccordion = Array.from(accordions).find(acc => 
            acc.getAttribute('aria-expanded') === 'true'
        );
        
        if (currentAccordion) {
            const allAccordions = Array.from(accordions);
            const currentIndex = allAccordions.indexOf(currentAccordion);
            const nextAccordion = allAccordions[(currentIndex + 1) % allAccordions.length];
            if (nextAccordion) {
                this.focusElement(nextAccordion);
            }
        } else if (accordions[0]) {
            this.focusElement(accordions[0]);
        }
    }

    focusNextCodeBlock() {
        const codeBlocks = document.querySelectorAll('.code-block');
        const focusedElement = document.activeElement;
        const currentBlock = focusedElement.closest('.code-block');
        
        if (currentBlock) {
            const allBlocks = Array.from(codeBlocks);
            const currentIndex = allBlocks.indexOf(currentBlock);
            const nextBlock = allBlocks[(currentIndex + 1) % allBlocks.length];
            if (nextBlock) {
                const copyBtn = nextBlock.querySelector('.copy-btn');
                this.focusElement(copyBtn || nextBlock);
            }
        } else if (codeBlocks[0]) {
            const copyBtn = codeBlocks[0].querySelector('.copy-btn');
            this.focusElement(copyBtn || codeBlocks[0]);
        }
    }

    /**
     * Event handlers
     */
    handleEscape() {
        // Close any open dialogs
        const dialog = document.querySelector('.keyboard-help-dialog:not([hidden])');
        if (dialog) {
            this.hideKeyboardShortcuts();
            return;
        }

        // Close any expanded accordions
        const expandedAccordion = document.querySelector('.accordion-header[aria-expanded="true"]');
        if (expandedAccordion) {
            expandedAccordion.click();
            return;
        }

        // Return to previous focus
        if (this.focusHistory.length > 0) {
            const previousElement = this.focusHistory.pop();
            if (previousElement && document.contains(previousElement)) {
                this.focusElement(previousElement);
            }
        }
    }

    handleEnterKey(e) {
        const element = e.target;
        
        if (element.matches('.accordion-header, .tab-btn')) {
            element.click();
            return false;
        }
        
        return true; // Allow default behavior
    }

    handleSpaceKey(e) {
        const element = e.target;
        
        if (element.matches('button, [role="button"]')) {
            element.click();
            return false;
        }
        
        return true; // Allow default behavior (page scroll)
    }

    handleArrowKey(e, direction) {
        const element = e.target;
        
        // Handle tab navigation
        if (element.matches('.tab-btn')) {
            e.preventDefault();
            const tabs = Array.from(element.closest('.tab-buttons').querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(element);
            let nextIndex;
            
            if (direction === 'left') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            } else if (direction === 'right') {
                nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            }
            
            if (nextIndex !== undefined) {
                tabs[nextIndex].focus();
            }
            return false;
        }
        
        return true; // Allow default behavior
    }

    handleHomeEnd(e, type) {
        const element = e.target;
        const container = element.closest('[role="tablist"], .nav-list, .command-list');
        
        if (container) {
            e.preventDefault();
            const items = container.querySelectorAll('[role="tab"], a, .command-item');
            const targetElement = type === 'home' ? items[0] : items[items.length - 1];
            if (targetElement) {
                this.focusElement(targetElement);
            }
            return false;
        }
        
        return true; // Allow default behavior
    }

    /**
     * Event handlers for focus events
     */
    onFocusIn(e) {
        const element = e.target;
        
        // Add focus-within class to containers
        const container = element.closest('.content-section, .card, .command-category');
        if (container) {
            container.classList.add('focus-within');
        }
        
        // Update current focus index
        this.currentFocusIndex = this.focusableElements.indexOf(element);
        
        // Announce context for screen readers
        this.announceContext(element);
    }

    onFocusOut(e) {
        const element = e.target;
        
        // Remove focus-within class
        document.querySelectorAll('.focus-within').forEach(el => {
            if (!el.contains(document.activeElement)) {
                el.classList.remove('focus-within');
            }
        });
    }

    /**
     * Announce context for screen readers
     */
    announceContext(element) {
        let context = '';
        
        // Determine context based on element location
        const section = element.closest('section[id]');
        if (section) {
            const heading = section.querySelector('h2, h3');
            if (heading) {
                context = `In ${heading.textContent.trim()} section`;
            }
        }
        
        const card = element.closest('.card');
        if (card) {
            const cardHeading = card.querySelector('h3, h4');
            if (cardHeading) {
                context += `, ${cardHeading.textContent.trim()} card`;
            }
        }
        
        if (context && window.accessibilityEnhancer) {
            window.accessibilityEnhancer.announce(context);
        }
    }

    /**
     * Trap tab navigation within modal
     */
    trapTabInModal(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Show keyboard shortcuts dialog
     */
    showKeyboardShortcuts() {
        const dialog = document.getElementById('keyboard-help-dialog');
        if (dialog) {
            dialog.hidden = false;
            const firstFocusable = dialog.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                this.focusElement(firstFocusable);
            }
            window.accessibilityEnhancer?.announce('Keyboard shortcuts dialog opened');
        }
    }

    /**
     * Hide keyboard shortcuts dialog
     */
    hideKeyboardShortcuts() {
        const dialog = document.getElementById('keyboard-help-dialog');
        if (dialog) {
            dialog.hidden = true;
            if (this.focusHistory.length > 0) {
                const previousElement = this.focusHistory.pop();
                if (previousElement && document.contains(previousElement)) {
                    this.focusElement(previousElement);
                }
            }
            window.accessibilityEnhancer?.announce('Keyboard shortcuts dialog closed');
        }
    }

    /**
     * Create shortcut key for mapping
     */
    createShortcutKey({ key, ctrlKey = false, altKey = false, shiftKey = false }) {
        return `${ctrlKey ? 'ctrl+' : ''}${altKey ? 'alt+' : ''}${shiftKey ? 'shift+' : ''}${key.toLowerCase()}`;
    }
}

// Initialize keyboard navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.keyboardNavigation = new KeyboardNavigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardNavigation;
}