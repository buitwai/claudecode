/**
 * Accessibility Checker for Claude Code Training Website
 * Provides automated testing for WCAG 2.1 AA compliance including
 * color contrast verification, ARIA validation, and comprehensive accessibility auditing
 */

class AccessibilityChecker {
    constructor() {
        this.violations = [];
        this.warnings = [];
        this.suggestions = [];
        this.colorContrastResults = new Map();
        this.ariaValidationResults = new Map();
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            warnings: 0
        };
        this.init();
    }

    init() {
        this.setupTestingSuite();
        this.createTestingInterface();
        this.scheduleAutomaticChecks();
    }

    /**
     * Setup comprehensive testing suite
     */
    setupTestingSuite() {
        this.testSuite = [
            { name: 'Color Contrast', test: () => this.checkColorContrast(), critical: true },
            { name: 'ARIA Labels', test: () => this.checkAriaLabels(), critical: true },
            { name: 'Keyboard Navigation', test: () => this.checkKeyboardNavigation(), critical: true },
            { name: 'Heading Structure', test: () => this.checkHeadingStructure(), critical: true },
            { name: 'Focus Management', test: () => this.checkFocusManagement(), critical: false },
            { name: 'Alt Text', test: () => this.checkAltText(), critical: true },
            { name: 'Form Labels', test: () => this.checkFormLabels(), critical: true },
            { name: 'Live Regions', test: () => this.checkLiveRegions(), critical: false },
            { name: 'Landmark Structure', test: () => this.checkLandmarkStructure(), critical: true },
            { name: 'Tab Order', test: () => this.checkTabOrder(), critical: true },
            { name: 'Button Accessibility', test: () => this.checkButtonAccessibility(), critical: true },
            { name: 'Link Accessibility', test: () => this.checkLinkAccessibility(), critical: true },
            { name: 'Table Accessibility', test: () => this.checkTableAccessibility(), critical: false },
            { name: 'Media Accessibility', test: () => this.checkMediaAccessibility(), critical: false },
            { name: 'Touch Target Size', test: () => this.checkTouchTargetSize(), critical: false }
        ];
    }

    /**
     * Create testing interface for manual testing
     */
    createTestingInterface() {
        const testingPanel = document.createElement('div');
        testingPanel.id = 'accessibility-testing-panel';
        testingPanel.className = 'accessibility-testing-panel';
        testingPanel.setAttribute('role', 'region');
        testingPanel.setAttribute('aria-label', 'Accessibility testing controls');
        testingPanel.style.display = 'none';

        testingPanel.innerHTML = `
            <div class="testing-header">
                <h3>Accessibility Testing</h3>
                <button class="close-testing-panel" aria-label="Close testing panel">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            
            <div class="testing-controls">
                <button class="run-all-tests" id="run-all-tests">
                    <i class="fas fa-play" aria-hidden="true"></i>
                    Run All Tests
                </button>
                <button class="run-quick-check" id="run-quick-check">
                    <i class="fas fa-bolt" aria-hidden="true"></i>
                    Quick Check
                </button>
                <button class="export-results" id="export-results">
                    <i class="fas fa-download" aria-hidden="true"></i>
                    Export Results
                </button>
            </div>

            <div class="testing-progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">Ready to run tests</div>
            </div>

            <div class="test-results">
                <div class="results-summary">
                    <div class="result-stat passed">
                        <span class="stat-number" id="tests-passed">0</span>
                        <span class="stat-label">Passed</span>
                    </div>
                    <div class="result-stat failed">
                        <span class="stat-number" id="tests-failed">0</span>
                        <span class="stat-label">Failed</span>
                    </div>
                    <div class="result-stat warnings">
                        <span class="stat-number" id="tests-warnings">0</span>
                        <span class="stat-label">Warnings</span>
                    </div>
                </div>
                
                <div class="results-details" id="results-details">
                    <!-- Test results will be populated here -->
                </div>
            </div>
        `;

        document.body.appendChild(testingPanel);
        this.setupTestingPanelEvents(testingPanel);

        // Add keyboard shortcut to open testing panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggleTestingPanel();
            }
        });
    }

    /**
     * Schedule automatic accessibility checks
     */
    scheduleAutomaticChecks() {
        // Run quick check when page loads
        window.addEventListener('load', () => {
            setTimeout(() => this.runQuickCheck(), 2000);
        });

        // Check on DOM changes
        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if significant content was added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.tagName === 'SECTION' || node.classList?.contains('content'))) {
                            shouldRecheck = true;
                        }
                    });
                }
            });

            if (shouldRecheck) {
                setTimeout(() => this.runQuickCheck(), 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Color contrast checking
     */
    checkColorContrast() {
        const results = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const textColor = styles.color;
            const backgroundColor = styles.backgroundColor;
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            if (this.hasVisibleText(element) && textColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrast(textColor, backgroundColor, element);
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
                const requiredRatio = isLargeText ? 3.0 : 4.5;
                
                if (contrast < requiredRatio) {
                    results.push({
                        type: 'violation',
                        element: element,
                        message: `Insufficient color contrast: ${contrast.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
                        selector: this.getSelector(element),
                        textColor: textColor,
                        backgroundColor: backgroundColor,
                        actualRatio: contrast,
                        requiredRatio: requiredRatio
                    });
                }
            }
        });

        return results;
    }

    /**
     * ARIA labels and attributes validation
     */
    checkAriaLabels() {
        const results = [];
        
        // Check for missing ARIA labels on interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]');
        
        interactiveElements.forEach(element => {
            const hasLabel = this.hasAccessibleLabel(element);
            if (!hasLabel) {
                results.push({
                    type: 'violation',
                    element: element,
                    message: 'Interactive element missing accessible label',
                    selector: this.getSelector(element),
                    suggestion: 'Add aria-label, aria-labelledby, or associated label element'
                });
            }
        });

        // Check for invalid ARIA attributes
        const ariaElements = document.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked], [aria-pressed]');
        
        ariaElements.forEach(element => {
            const ariaAttrs = ['aria-expanded', 'aria-selected', 'aria-checked', 'aria-pressed'];
            ariaAttrs.forEach(attr => {
                const value = element.getAttribute(attr);
                if (value !== null && !['true', 'false'].includes(value)) {
                    results.push({
                        type: 'violation',
                        element: element,
                        message: `Invalid ARIA attribute value: ${attr}="${value}"`,
                        selector: this.getSelector(element),
                        suggestion: 'ARIA boolean attributes must be "true" or "false"'
                    });
                }
            });
        });

        // Check for orphaned ARIA references
        const referencingElements = document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]');
        
        referencingElements.forEach(element => {
            ['aria-labelledby', 'aria-describedby', 'aria-controls'].forEach(attr => {
                const value = element.getAttribute(attr);
                if (value) {
                    const ids = value.split(/\s+/);
                    ids.forEach(id => {
                        if (!document.getElementById(id)) {
                            results.push({
                                type: 'violation',
                                element: element,
                                message: `ARIA reference points to non-existent element: ${attr}="${id}"`,
                                selector: this.getSelector(element),
                                suggestion: 'Ensure referenced element exists or remove the reference'
                            });
                        }
                    });
                }
            });
        });

        return results;
    }

    /**
     * Keyboard navigation testing
     */
    checkKeyboardNavigation() {
        const results = [];
        const focusableElements = this.getFocusableElements();
        
        // Check if all interactive elements are keyboard accessible
        focusableElements.forEach(element => {
            if (element.tabIndex === -1 && !this.isInRovingTabIndexGroup(element)) {
                results.push({
                    type: 'warning',
                    element: element,
                    message: 'Element not keyboard accessible (tabindex="-1")',
                    selector: this.getSelector(element),
                    suggestion: 'Ensure element can receive keyboard focus'
                });
            }
        });

        // Check for keyboard traps
        const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
        modals.forEach(modal => {
            if (!modal.hidden && window.getComputedStyle(modal).display !== 'none') {
                const modalFocusable = modal.querySelectorAll(this.getFocusableSelector());
                if (modalFocusable.length === 0) {
                    results.push({
                        type: 'violation',
                        element: modal,
                        message: 'Modal/dialog has no focusable elements',
                        selector: this.getSelector(modal),
                        suggestion: 'Add at least one focusable element to modal'
                    });
                }
            }
        });

        return results;
    }

    /**
     * Heading structure validation
     */
    checkHeadingStructure() {
        const results = [];
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        if (headings.length === 0) {
            results.push({
                type: 'violation',
                message: 'Page has no headings',
                suggestion: 'Add heading structure to organize content'
            });
            return results;
        }

        let previousLevel = 0;
        let hasH1 = false;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (level === 1) {
                hasH1 = true;
            }

            // Check for skipped heading levels
            if (level > previousLevel + 1) {
                results.push({
                    type: 'violation',
                    element: heading,
                    message: `Heading level skipped: jumped from h${previousLevel} to h${level}`,
                    selector: this.getSelector(heading),
                    suggestion: 'Use consecutive heading levels'
                });
            }

            // Check for empty headings
            if (!heading.textContent.trim()) {
                results.push({
                    type: 'violation',
                    element: heading,
                    message: 'Empty heading element',
                    selector: this.getSelector(heading),
                    suggestion: 'Add meaningful text to heading or remove element'
                });
            }

            previousLevel = level;
        });

        if (!hasH1) {
            results.push({
                type: 'violation',
                message: 'Page missing h1 element',
                suggestion: 'Add an h1 element as the main page heading'
            });
        }

        return results;
    }

    /**
     * Focus management testing
     */
    checkFocusManagement() {
        const results = [];
        
        // Check for visible focus indicators
        const focusableElements = this.getFocusableElements();
        
        // Note: This is a simplified check. In a real implementation,
        // you would need to actually test focus styles programmatically
        const hasGlobalFocusStyles = !!document.querySelector('style, link[rel="stylesheet"]');
        
        if (!hasGlobalFocusStyles) {
            results.push({
                type: 'warning',
                message: 'No CSS stylesheets detected - focus indicators may be missing',
                suggestion: 'Ensure focus indicators are properly styled'
            });
        }

        // Check for elements that might need focus management
        const dynamicElements = document.querySelectorAll('[aria-expanded], [aria-selected]');
        
        dynamicElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && !this.isNativelyFocusable(element)) {
                results.push({
                    type: 'warning',
                    element: element,
                    message: 'Dynamic element may need focus management',
                    selector: this.getSelector(element),
                    suggestion: 'Consider adding tabindex="0" for keyboard access'
                });
            }
        });

        return results;
    }

    /**
     * Alt text validation for images
     */
    checkAltText() {
        const results = [];
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const alt = img.getAttribute('alt');
            const hasAltAttribute = img.hasAttribute('alt');
            
            if (!hasAltAttribute) {
                results.push({
                    type: 'violation',
                    element: img,
                    message: 'Image missing alt attribute',
                    selector: this.getSelector(img),
                    suggestion: 'Add alt attribute (empty for decorative images)'
                });
            } else if (alt && alt.trim().length === 0) {
                // Empty alt is OK for decorative images
                if (!img.getAttribute('role') === 'presentation') {
                    results.push({
                        type: 'warning',
                        element: img,
                        message: 'Image has empty alt text - ensure this is decorative',
                        selector: this.getSelector(img),
                        suggestion: 'Add descriptive alt text or role="presentation"'
                    });
                }
            } else if (alt && (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture'))) {
                results.push({
                    type: 'warning',
                    element: img,
                    message: 'Alt text contains redundant words like "image" or "picture"',
                    selector: this.getSelector(img),
                    suggestion: 'Remove redundant words from alt text'
                });
            }
        });

        // Check decorative icons
        const icons = document.querySelectorAll('i[class*="fa"], .icon');
        icons.forEach(icon => {
            if (!icon.getAttribute('aria-hidden') && !icon.getAttribute('alt') && !icon.getAttribute('aria-label')) {
                results.push({
                    type: 'warning',
                    element: icon,
                    message: 'Decorative icon should have aria-hidden="true"',
                    selector: this.getSelector(icon),
                    suggestion: 'Add aria-hidden="true" for decorative icons'
                });
            }
        });

        return results;
    }

    /**
     * Form labels validation
     */
    checkFormLabels() {
        const results = [];
        const formControls = document.querySelectorAll('input, select, textarea');
        
        formControls.forEach(control => {
            const hasLabel = this.hasAccessibleLabel(control);
            const type = control.getAttribute('type');
            
            // Skip hidden inputs
            if (type === 'hidden') return;
            
            if (!hasLabel) {
                results.push({
                    type: 'violation',
                    element: control,
                    message: 'Form control missing accessible label',
                    selector: this.getSelector(control),
                    suggestion: 'Add label element, aria-label, or aria-labelledby'
                });
            }

            // Check for placeholder as label anti-pattern
            if (control.hasAttribute('placeholder') && !hasLabel) {
                results.push({
                    type: 'violation',
                    element: control,
                    message: 'Placeholder text used as label (not accessible)',
                    selector: this.getSelector(control),
                    suggestion: 'Add proper label in addition to placeholder'
                });
            }
        });

        return results;
    }

    /**
     * Live regions validation
     */
    checkLiveRegions() {
        const results = [];
        const liveRegions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
        
        // Check for live regions in viewport (they should be off-screen)
        liveRegions.forEach(region => {
            const rect = region.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 && 
                            rect.top >= 0 && rect.left >= 0 &&
                            rect.bottom <= window.innerHeight && 
                            rect.right <= window.innerWidth;
            
            if (isVisible && !region.classList.contains('sr-only')) {
                results.push({
                    type: 'warning',
                    element: region,
                    message: 'Live region may be visible to sighted users',
                    selector: this.getSelector(region),
                    suggestion: 'Consider making live region screen reader only'
                });
            }
        });

        return results;
    }

    /**
     * Landmark structure validation
     */
    checkLandmarkStructure() {
        const results = [];
        
        // Check for main landmark
        const main = document.querySelector('main, [role="main"]');
        if (!main) {
            results.push({
                type: 'violation',
                message: 'Page missing main landmark',
                suggestion: 'Add <main> element or role="main"'
            });
        }

        // Check for navigation landmark
        const nav = document.querySelector('nav, [role="navigation"]');
        if (!nav) {
            results.push({
                type: 'warning',
                message: 'Page missing navigation landmark',
                suggestion: 'Add <nav> element or role="navigation"'
            });
        }

        // Check for duplicate landmarks without labels
        const landmarks = document.querySelectorAll('main, nav, aside, section, [role="main"], [role="navigation"], [role="complementary"], [role="region"]');
        const landmarkCounts = new Map();
        
        landmarks.forEach(landmark => {
            const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
            landmarkCounts.set(role, (landmarkCounts.get(role) || 0) + 1);
        });

        landmarkCounts.forEach((count, role) => {
            if (count > 1) {
                const elements = document.querySelectorAll(`${role}, [role="${role}"]`);
                elements.forEach(element => {
                    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                        results.push({
                            type: 'warning',
                            element: element,
                            message: `Multiple ${role} landmarks should have unique labels`,
                            selector: this.getSelector(element),
                            suggestion: 'Add aria-label or aria-labelledby to distinguish landmarks'
                        });
                    }
                });
            }
        });

        return results;
    }

    /**
     * Tab order validation
     */
    checkTabOrder() {
        const results = [];
        const focusableElements = this.getFocusableElements();
        
        let previousTabIndex = -Infinity;
        let hasPositiveTabIndex = false;
        
        focusableElements.forEach(element => {
            const tabIndex = element.tabIndex;
            
            if (tabIndex > 0) {
                hasPositiveTabIndex = true;
                if (tabIndex < previousTabIndex) {
                    results.push({
                        type: 'warning',
                        element: element,
                        message: 'Tab order may be confusing due to positive tabindex values',
                        selector: this.getSelector(element),
                        suggestion: 'Use DOM order instead of positive tabindex values'
                    });
                }
                previousTabIndex = tabIndex;
            }
        });

        if (hasPositiveTabIndex) {
            results.push({
                type: 'warning',
                message: 'Page uses positive tabindex values',
                suggestion: 'Consider using DOM order and tabindex="0" or "-1" only'
            });
        }

        return results;
    }

    /**
     * Button accessibility validation
     */
    checkButtonAccessibility() {
        const results = [];
        const buttons = document.querySelectorAll('button, [role="button"]');
        
        buttons.forEach(button => {
            // Check for accessible name
            if (!this.hasAccessibleLabel(button)) {
                results.push({
                    type: 'violation',
                    element: button,
                    message: 'Button missing accessible name',
                    selector: this.getSelector(button),
                    suggestion: 'Add text content, aria-label, or aria-labelledby'
                });
            }

            // Check for proper button semantics
            if (button.tagName === 'DIV' || button.tagName === 'SPAN') {
                if (!button.hasAttribute('role') || button.getAttribute('role') !== 'button') {
                    results.push({
                        type: 'violation',
                        element: button,
                        message: 'Non-button element used as button without proper role',
                        selector: this.getSelector(button),
                        suggestion: 'Use <button> element or add role="button"'
                    });
                }
            }

            // Check minimum touch target size
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                results.push({
                    type: 'warning',
                    element: button,
                    message: 'Button smaller than recommended touch target size (44x44px)',
                    selector: this.getSelector(button),
                    suggestion: 'Increase button size or add padding'
                });
            }
        });

        return results;
    }

    /**
     * Link accessibility validation
     */
    checkLinkAccessibility() {
        const results = [];
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            // Check for accessible name
            if (!this.hasAccessibleLabel(link)) {
                results.push({
                    type: 'violation',
                    element: link,
                    message: 'Link missing accessible name',
                    selector: this.getSelector(link),
                    suggestion: 'Add text content or aria-label'
                });
            }

            // Check for vague link text
            const linkText = this.getAccessibleName(link).toLowerCase();
            const vagueTexts = ['click here', 'read more', 'here', 'more', 'link'];
            if (vagueTexts.some(vague => linkText.includes(vague))) {
                results.push({
                    type: 'warning',
                    element: link,
                    message: 'Link text may not be descriptive enough',
                    selector: this.getSelector(link),
                    suggestion: 'Use descriptive link text that makes sense out of context'
                });
            }

            // Check for missing href
            if (!link.getAttribute('href') && !link.getAttribute('role')) {
                results.push({
                    type: 'violation',
                    element: link,
                    message: 'Link missing href attribute',
                    selector: this.getSelector(link),
                    suggestion: 'Add href attribute or use button element'
                });
            }
        });

        return results;
    }

    /**
     * Table accessibility validation
     */
    checkTableAccessibility() {
        const results = [];
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // Check for table headers
            const headers = table.querySelectorAll('th');
            if (headers.length === 0) {
                results.push({
                    type: 'warning',
                    element: table,
                    message: 'Table missing header cells',
                    selector: this.getSelector(table),
                    suggestion: 'Add <th> elements or headers attribute'
                });
            }

            // Check for table caption
            const caption = table.querySelector('caption');
            if (!caption) {
                results.push({
                    type: 'warning',
                    element: table,
                    message: 'Table missing caption',
                    selector: this.getSelector(table),
                    suggestion: 'Add <caption> element to describe table purpose'
                });
            }
        });

        return results;
    }

    /**
     * Media accessibility validation
     */
    checkMediaAccessibility() {
        const results = [];
        
        // Check videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const hasControls = video.hasAttribute('controls');
            const hasCaptions = video.querySelector('track[kind="captions"], track[kind="subtitles"]');
            
            if (!hasControls) {
                results.push({
                    type: 'warning',
                    element: video,
                    message: 'Video missing controls attribute',
                    selector: this.getSelector(video),
                    suggestion: 'Add controls attribute for keyboard accessibility'
                });
            }

            if (!hasCaptions) {
                results.push({
                    type: 'warning',
                    element: video,
                    message: 'Video missing captions/subtitles',
                    selector: this.getSelector(video),
                    suggestion: 'Add <track> element with captions'
                });
            }
        });

        // Check audio
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            if (!audio.hasAttribute('controls')) {
                results.push({
                    type: 'warning',
                    element: audio,
                    message: 'Audio missing controls attribute',
                    selector: this.getSelector(audio),
                    suggestion: 'Add controls attribute for accessibility'
                });
            }
        });

        return results;
    }

    /**
     * Touch target size validation
     */
    checkTouchTargetSize() {
        const results = [];
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) { // Element is visible
                if (rect.width < 44 || rect.height < 44) {
                    results.push({
                        type: 'warning',
                        element: element,
                        message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum: 44x44px)`,
                        selector: this.getSelector(element),
                        suggestion: 'Increase element size or add padding'
                    });
                }
            }
        });

        return results;
    }

    /**
     * Helper methods
     */
    calculateContrast(foreground, background, element) {
        const fgRGB = this.parseColor(foreground);
        let bgRGB = this.parseColor(background);
        
        // If background is transparent, find the actual background
        if (bgRGB.a === 0) {
            bgRGB = this.getEffectiveBackgroundColor(element);
        }
        
        const fgLuminance = this.getLuminance(fgRGB);
        const bgLuminance = this.getLuminance(bgRGB);
        
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    parseColor(color) {
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01]?\.?\d*))?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parseFloat(match[4]) : 1
            };
        }
        
        // Fallback
        return { r: 0, g: 0, b: 0, a: 1 };
    }

    getLuminance(rgb) {
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;
        
        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    getEffectiveBackgroundColor(element) {
        let current = element;
        while (current && current !== document.body) {
            const bg = window.getComputedStyle(current).backgroundColor;
            const bgRGB = this.parseColor(bg);
            if (bgRGB.a > 0) {
                return bgRGB;
            }
            current = current.parentElement;
        }
        return { r: 255, g: 255, b: 255, a: 1 }; // Default to white
    }

    hasVisibleText(element) {
        return element.textContent && element.textContent.trim().length > 0;
    }

    hasAccessibleLabel(element) {
        // Check for various forms of accessible labels
        if (element.getAttribute('aria-label')) return true;
        if (element.getAttribute('aria-labelledby')) return true;
        if (element.textContent && element.textContent.trim()) return true;
        
        // Check for associated label
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label) return true;
        }
        
        // Check if wrapped in label
        const parentLabel = element.closest('label');
        if (parentLabel) return true;
        
        // Check for title attribute (not ideal but valid)
        if (element.getAttribute('title')) return true;
        
        return false;
    }

    getAccessibleName(element) {
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }
        
        if (element.getAttribute('aria-labelledby')) {
            const ids = element.getAttribute('aria-labelledby').split(/\s+/);
            return ids.map(id => {
                const labelElement = document.getElementById(id);
                return labelElement ? labelElement.textContent.trim() : '';
            }).join(' ');
        }
        
        if (element.textContent) {
            return element.textContent.trim();
        }
        
        return '';
    }

    getFocusableElements() {
        const selector = this.getFocusableSelector();
        return Array.from(document.querySelectorAll(selector)).filter(el => {
            return el.offsetParent !== null && !el.hidden && !el.disabled;
        });
    }

    getFocusableSelector() {
        return [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');
    }

    isNativelyFocusable(element) {
        const focusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
        return focusable.includes(element.tagName) && !element.disabled;
    }

    isInRovingTabIndexGroup(element) {
        const parent = element.closest('[role="tablist"], [role="menubar"], [role="tree"]');
        return !!parent;
    }

    getSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    /**
     * Test execution methods
     */
    async runAllTests() {
        this.resetResults();
        this.updateProgress(0, 'Starting comprehensive accessibility audit...');
        
        for (let i = 0; i < this.testSuite.length; i++) {
            const test = this.testSuite[i];
            const progress = ((i + 1) / this.testSuite.length) * 100;
            
            this.updateProgress(progress, `Running ${test.name}...`);
            
            try {
                const results = await test.test();
                this.processTestResults(test.name, results, test.critical);
            } catch (error) {
                console.error(`Error running test ${test.name}:`, error);
                this.testResults.failed++;
            }
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.updateProgress(100, 'Accessibility audit complete');
        this.displayResults();
        this.announceResults();
    }

    async runQuickCheck() {
        this.resetResults();
        const quickTests = this.testSuite.filter(test => test.critical);
        
        for (const test of quickTests) {
            try {
                const results = await test.test();
                this.processTestResults(test.name, results, test.critical);
            } catch (error) {
                console.error(`Error running quick test ${test.name}:`, error);
            }
        }
        
        if (this.testResults.failed > 0) {
            console.warn(`Quick accessibility check found ${this.testResults.failed} critical issues`);
        }
    }

    processTestResults(testName, results, isCritical) {
        results.forEach(result => {
            this.testResults.total++;
            
            if (result.type === 'violation') {
                this.violations.push({ ...result, test: testName, critical: isCritical });
                this.testResults.failed++;
            } else if (result.type === 'warning') {
                this.warnings.push({ ...result, test: testName });
                this.testResults.warnings++;
            } else {
                this.testResults.passed++;
            }
        });
        
        if (results.length === 0) {
            this.testResults.passed++;
        }
    }

    resetResults() {
        this.violations = [];
        this.warnings = [];
        this.suggestions = [];
        this.testResults = { total: 0, passed: 0, failed: 0, warnings: 0 };
    }

    updateProgress(percentage, message) {
        const progressBar = document.querySelector('#accessibility-testing-panel .progress-bar');
        const progressFill = document.querySelector('#accessibility-testing-panel .progress-fill');
        const progressText = document.querySelector('#accessibility-testing-panel .progress-text');
        
        if (progressBar && progressFill && progressText) {
            progressBar.setAttribute('aria-valuenow', percentage);
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = message;
        }
    }

    displayResults() {
        const resultsContainer = document.getElementById('results-details');
        if (!resultsContainer) return;
        
        // Update summary stats
        document.getElementById('tests-passed').textContent = this.testResults.passed;
        document.getElementById('tests-failed').textContent = this.testResults.failed;
        document.getElementById('tests-warnings').textContent = this.testResults.warnings;
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Display violations
        if (this.violations.length > 0) {
            const violationsSection = this.createResultsSection('Violations', this.violations, 'error');
            resultsContainer.appendChild(violationsSection);
        }
        
        // Display warnings
        if (this.warnings.length > 0) {
            const warningsSection = this.createResultsSection('Warnings', this.warnings, 'warning');
            resultsContainer.appendChild(warningsSection);
        }
        
        // Show success message if no issues
        if (this.violations.length === 0 && this.warnings.length === 0) {
            resultsContainer.innerHTML = '<div class="no-issues">✅ No accessibility issues found!</div>';
        }
    }

    createResultsSection(title, results, type) {
        const section = document.createElement('div');
        section.className = `results-section ${type}`;
        
        const header = document.createElement('h4');
        header.textContent = `${title} (${results.length})`;
        section.appendChild(header);
        
        const list = document.createElement('ul');
        list.className = 'results-list';
        
        results.forEach(result => {
            const item = document.createElement('li');
            item.className = 'result-item';
            
            item.innerHTML = `
                <div class="result-message">${result.message}</div>
                ${result.selector ? `<div class="result-selector">Element: ${result.selector}</div>` : ''}
                ${result.suggestion ? `<div class="result-suggestion">💡 ${result.suggestion}</div>` : ''}
                <div class="result-test">Test: ${result.test}</div>
            `;
            
            if (result.element) {
                const highlightBtn = document.createElement('button');
                highlightBtn.textContent = 'Highlight Element';
                highlightBtn.className = 'highlight-element-btn';
                highlightBtn.addEventListener('click', () => {
                    this.highlightElement(result.element);
                });
                item.appendChild(highlightBtn);
            }
            
            list.appendChild(item);
        });
        
        section.appendChild(list);
        return section;
    }

    highlightElement(element) {
        // Remove existing highlights
        document.querySelectorAll('.accessibility-highlight').forEach(el => {
            el.classList.remove('accessibility-highlight');
        });
        
        // Add highlight
        element.classList.add('accessibility-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            element.classList.remove('accessibility-highlight');
        }, 3000);
    }

    announceResults() {
        let message = `Accessibility audit complete. `;
        
        if (this.testResults.failed > 0) {
            message += `Found ${this.testResults.failed} violations`;
            if (this.testResults.warnings > 0) {
                message += ` and ${this.testResults.warnings} warnings`;
            }
        } else if (this.testResults.warnings > 0) {
            message += `Found ${this.testResults.warnings} warnings`;
        } else {
            message += `No accessibility issues found`;
        }
        
        if (window.accessibilityEnhancer) {
            window.accessibilityEnhancer.announceAlert(message);
        }
    }

    setupTestingPanelEvents(panel) {
        // Run all tests
        panel.querySelector('#run-all-tests').addEventListener('click', () => {
            this.runAllTests();
        });
        
        // Run quick check
        panel.querySelector('#run-quick-check').addEventListener('click', () => {
            this.runQuickCheck();
        });
        
        // Export results
        panel.querySelector('#export-results').addEventListener('click', () => {
            this.exportResults();
        });
        
        // Close panel
        panel.querySelector('.close-testing-panel').addEventListener('click', () => {
            this.toggleTestingPanel();
        });
    }

    toggleTestingPanel() {
        const panel = document.getElementById('accessibility-testing-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            
            if (panel.style.display === 'block') {
                panel.querySelector('#run-all-tests').focus();
            }
        }
    }

    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            summary: this.testResults,
            violations: this.violations,
            warnings: this.warnings
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Public API
    getResults() {
        return {
            summary: this.testResults,
            violations: this.violations,
            warnings: this.warnings
        };
    }

    getCriticalIssues() {
        return this.violations.filter(v => v.critical);
    }
}

// Initialize accessibility checker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityChecker = new AccessibilityChecker();
    
    // Add testing panel styles
    const style = document.createElement('style');
    style.textContent = `
        .accessibility-testing-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            overflow-y: auto;
        }
        
        .accessibility-highlight {
            outline: 3px solid #ff0000 !important;
            outline-offset: 2px !important;
            background: rgba(255, 0, 0, 0.1) !important;
        }
        
        .result-item {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-left: 4px solid #ccc;
        }
        
        .results-section.error .result-item {
            border-left-color: #dc3545;
        }
        
        .results-section.warning .result-item {
            border-left-color: #ffc107;
        }
        
        .highlight-element-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityChecker;
}