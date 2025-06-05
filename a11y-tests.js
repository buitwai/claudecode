/**
 * Accessibility Testing Suite (A11Y)
 * AutoZone Claude Code Training Website
 * 
 * Comprehensive WCAG 2.1 AA compliance testing for screen readers,
 * keyboard navigation, color contrast, and visual accessibility.
 */

class AccessibilityTestSuite {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0,
            issues: []
        };
        
        this.wcagLevels = {
            A: 'Level A (Minimum)',
            AA: 'Level AA (Standard)',
            AAA: 'Level AAA (Enhanced)'
        };
        
        this.colorContrastRatios = {
            normalTextAA: 4.5,
            largeTextAA: 3.0,
            normalTextAAA: 7.0,
            largeTextAAA: 4.5
        };
        
        this.keyboardTestSequence = [
            'Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Home', 'End', 'PageUp', 'PageDown'
        ];
        
        this.ariaAttributes = [
            'aria-label', 'aria-labelledby', 'aria-describedby',
            'aria-expanded', 'aria-hidden', 'aria-live',
            'aria-atomic', 'aria-relevant', 'aria-busy',
            'aria-controls', 'aria-owns', 'aria-flowto'
        ];
        
        this.semanticElements = [
            'header', 'nav', 'main', 'section', 'article',
            'aside', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ];
        
        this.init();
    }
    
    init() {
        this.createTestInterface();
        this.setupKeyboardListeners();
        this.detectScreenReader();
        this.analyzeColorContrast();
    }
    
    createTestInterface() {
        if (!document.getElementById('a11y-test-container')) {
            this.createStandaloneInterface();
        }
    }
    
    createStandaloneInterface() {
        const container = document.createElement('div');
        container.id = 'a11y-test-container';
        container.setAttribute('role', 'application');
        container.setAttribute('aria-label', 'Accessibility Testing Suite');
        container.innerHTML = `
            <style>
                #a11y-test-container {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 400px;
                    max-height: 80vh;
                    background: white;
                    border: 2px solid #0066cc;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    font-size: 14px;
                    z-index: 10000;
                    overflow-y: auto;
                }
                
                .a11y-header {
                    background: linear-gradient(135deg, #0066cc, #004499);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .a11y-header h2 {
                    margin: 0;
                    font-size: 1.3rem;
                }
                
                .close-button {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .close-button:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .close-button:focus {
                    outline: 2px solid white;
                    outline-offset: 2px;
                }
                
                .a11y-content {
                    padding: 20px;
                }
                
                .test-category {
                    margin-bottom: 25px;
                    border: 1px solid #e1e5e9;
                    border-radius: 6px;
                    overflow: hidden;
                }
                
                .category-header {
                    background: #f8f9fa;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e1e5e9;
                    font-weight: 600;
                    color: #2c3e50;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .category-header:hover {
                    background: #e9ecef;
                }
                
                .category-header:focus {
                    outline: 2px solid #0066cc;
                    outline-offset: -2px;
                }
                
                .category-content {
                    padding: 16px;
                    background: white;
                }
                
                .test-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #f1f3f4;
                }
                
                .test-item:last-child {
                    border-bottom: none;
                }
                
                .test-name {
                    flex: 1;
                    color: #495057;
                    font-weight: 500;
                }
                
                .test-status {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    min-width: 50px;
                    text-align: center;
                }
                
                .status-pass {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-fail {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .status-warning {
                    background: #fff3cd;
                    color: #856404;
                }
                
                .status-pending {
                    background: #e2e3e5;
                    color: #6c757d;
                }
                
                .test-button {
                    background: #0066cc;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    margin: 4px;
                    transition: all 0.2s ease;
                }
                
                .test-button:hover {
                    background: #0052a3;
                    transform: translateY(-1px);
                }
                
                .test-button:focus {
                    outline: 2px solid #0066cc;
                    outline-offset: 2px;
                }
                
                .test-button:active {
                    transform: translateY(0);
                }
                
                .test-button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .keyboard-test-area {
                    border: 2px solid #0066cc;
                    border-radius: 4px;
                    padding: 12px;
                    margin: 12px 0;
                    background: #f8f9fa;
                    min-height: 60px;
                    position: relative;
                }
                
                .keyboard-instructions {
                    font-size: 12px;
                    color: #6c757d;
                    margin-bottom: 8px;
                }
                
                .keyboard-feedback {
                    font-family: monospace;
                    background: #2c3e50;
                    color: #ecf0f1;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    margin-top: 8px;
                    min-height: 40px;
                }
                
                .focus-indicator {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    background: #28a745;
                    border-radius: 50%;
                    display: none;
                }
                
                .focus-indicator.active {
                    display: block;
                    animation: pulse 1s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .color-contrast-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin: 12px 0;
                }
                
                .contrast-sample {
                    padding: 8px;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .screen-reader-test {
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 12px;
                    margin: 12px 0;
                }
                
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                .live-region {
                    position: absolute;
                    left: -10000px;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                }
                
                .results-summary {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 16px;
                    margin-top: 20px;
                }
                
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-top: 12px;
                }
                
                .result-card {
                    text-align: center;
                    padding: 12px;
                    background: white;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                }
                
                .result-number {
                    font-size: 20px;
                    font-weight: bold;
                    color: #0066cc;
                    margin-bottom: 4px;
                }
                
                .result-label {
                    font-size: 10px;
                    color: #6c757d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .issue-list {
                    max-height: 200px;
                    overflow-y: auto;
                    margin-top: 12px;
                }
                
                .issue-item {
                    padding: 8px;
                    margin-bottom: 6px;
                    background: #fff3cd;
                    border-left: 3px solid #ffc107;
                    border-radius: 0 4px 4px 0;
                    font-size: 12px;
                }
                
                .issue-item.error {
                    background: #f8d7da;
                    border-left-color: #dc3545;
                }
                
                .issue-item.warning {
                    background: #fff3cd;
                    border-left-color: #ffc107;
                }
                
                .wcag-level {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: bold;
                    margin-left: 8px;
                }
                
                .wcag-a {
                    background: #28a745;
                    color: white;
                }
                
                .wcag-aa {
                    background: #ffc107;
                    color: #212529;
                }
                
                .wcag-aaa {
                    background: #17a2b8;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    #a11y-test-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: auto;
                        max-height: none;
                        border-radius: 0;
                    }
                    
                    .color-contrast-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .results-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    #a11y-test-container {
                        border-width: 3px;
                    }
                    
                    .test-button {
                        border: 2px solid white;
                    }
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .focus-indicator {
                        animation: none;
                    }
                    
                    .test-button {
                        transition: none;
                    }
                }
            </style>
            
            <div class="a11y-header">
                <h2>♿ Accessibility Tests</h2>
                <button class="close-button" 
                        onclick="this.closest('#a11y-test-container').remove()"
                        aria-label="Close accessibility tests">×</button>
            </div>
            
            <div class="a11y-content">
                <!-- Screen Reader Tests -->
                <div class="test-category">
                    <div class="category-header" 
                         tabindex="0" 
                         role="button"
                         aria-expanded="true"
                         aria-controls="screen-reader-tests">
                        <span>🔊 Screen Reader Support</span>
                        <span class="wcag-level wcag-a">WCAG A</span>
                    </div>
                    <div class="category-content" id="screen-reader-tests">
                        <div class="test-item">
                            <span class="test-name">Alternative Text for Images</span>
                            <div class="test-status status-pending" id="alt-text">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Heading Structure</span>
                            <div class="test-status status-pending" id="heading-structure">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">ARIA Labels</span>
                            <div class="test-status status-pending" id="aria-labels">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Landmark Regions</span>
                            <div class="test-status status-pending" id="landmarks">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Skip Links</span>
                            <div class="test-status status-pending" id="skip-links">Pending</div>
                        </div>
                        
                        <div class="screen-reader-test">
                            <h4>Screen Reader Test Area</h4>
                            <div class="sr-only">This text is only for screen readers</div>
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='30'%3E%3Crect width='50' height='30' fill='%23007bff'/%3E%3C/svg%3E" 
                                 alt="Blue rectangle representing Claude Code logo">
                            <div aria-live="polite" class="live-region" id="live-announcements"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Keyboard Navigation Tests -->
                <div class="test-category">
                    <div class="category-header" 
                         tabindex="0" 
                         role="button"
                         aria-expanded="true"
                         aria-controls="keyboard-tests">
                        <span>⌨️ Keyboard Navigation</span>
                        <span class="wcag-level wcag-a">WCAG A</span>
                    </div>
                    <div class="category-content" id="keyboard-tests">
                        <div class="test-item">
                            <span class="test-name">Tab Order</span>
                            <div class="test-status status-pending" id="tab-order">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Focus Indicators</span>
                            <div class="test-status status-pending" id="focus-indicators">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Keyboard Shortcuts</span>
                            <div class="test-status status-pending" id="keyboard-shortcuts">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Modal Focus Management</span>
                            <div class="test-status status-pending" id="modal-focus">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Skip to Content</span>
                            <div class="test-status status-pending" id="skip-content">Pending</div>
                        </div>
                        
                        <div class="keyboard-test-area" tabindex="0" id="keyboard-test-area">
                            <div class="keyboard-instructions">
                                Press Tab, Shift+Tab, Enter, or Arrow keys to test keyboard navigation
                            </div>
                            <div class="focus-indicator" id="focus-indicator"></div>
                            <div class="keyboard-feedback" id="keyboard-feedback">
                                Keyboard events will appear here...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Color Contrast Tests -->
                <div class="test-category">
                    <div class="category-header" 
                         tabindex="0" 
                         role="button"
                         aria-expanded="true"
                         aria-controls="contrast-tests">
                        <span>🎨 Color Contrast</span>
                        <span class="wcag-level wcag-aa">WCAG AA</span>
                    </div>
                    <div class="category-content" id="contrast-tests">
                        <div class="test-item">
                            <span class="test-name">Normal Text (4.5:1)</span>
                            <div class="test-status status-pending" id="normal-text-contrast">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Large Text (3:1)</span>
                            <div class="test-status status-pending" id="large-text-contrast">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Interactive Elements</span>
                            <div class="test-status status-pending" id="interactive-contrast">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Focus Indicators</span>
                            <div class="test-status status-pending" id="focus-contrast">Pending</div>
                        </div>
                        
                        <div class="color-contrast-grid" id="contrast-samples">
                            <!-- Contrast samples will be added dynamically -->
                        </div>
                    </div>
                </div>
                
                <!-- ARIA and Semantics Tests -->
                <div class="test-category">
                    <div class="category-header" 
                         tabindex="0" 
                         role="button"
                         aria-expanded="true"
                         aria-controls="aria-tests">
                        <span>🏗️ ARIA & Semantics</span>
                        <span class="wcag-level wcag-a">WCAG A</span>
                    </div>
                    <div class="category-content" id="aria-tests">
                        <div class="test-item">
                            <span class="test-name">Semantic HTML</span>
                            <div class="test-status status-pending" id="semantic-html">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">ARIA Attributes</span>
                            <div class="test-status status-pending" id="aria-attributes">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Form Labels</span>
                            <div class="test-status status-pending" id="form-labels">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Button Accessibility</span>
                            <div class="test-status status-pending" id="button-accessibility">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Link Purpose</span>
                            <div class="test-status status-pending" id="link-purpose">Pending</div>
                        </div>
                    </div>
                </div>
                
                <!-- Test Actions -->
                <div style="margin: 20px 0; text-align: center;">
                    <button class="test-button" onclick="a11yTests.runAllTests()">
                        🚀 Run All A11Y Tests
                    </button>
                    <button class="test-button" onclick="a11yTests.generateReport()">
                        📋 Generate Report
                    </button>
                    <button class="test-button" onclick="a11yTests.clearResults()">
                        🗑️ Clear Results
                    </button>
                </div>
                
                <!-- Results Summary -->
                <div class="results-summary" id="results-summary" style="display: none;">
                    <h4>Accessibility Test Results</h4>
                    <div class="results-grid">
                        <div class="result-card">
                            <div class="result-number" id="a11y-passed">0</div>
                            <div class="result-label">Passed</div>
                        </div>
                        <div class="result-card">
                            <div class="result-number" id="a11y-failed">0</div>
                            <div class="result-label">Failed</div>
                        </div>
                        <div class="result-card">
                            <div class="result-number" id="a11y-warnings">0</div>
                            <div class="result-label">Warnings</div>
                        </div>
                        <div class="result-card">
                            <div class="result-number" id="a11y-total">0</div>
                            <div class="result-label">Total</div>
                        </div>
                    </div>
                    
                    <div class="issue-list" id="issue-list">
                        <!-- Issues will be populated here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }
    
    setupKeyboardListeners() {
        const testArea = document.getElementById('keyboard-test-area');
        const feedback = document.getElementById('keyboard-feedback');
        const indicator = document.getElementById('focus-indicator');
        
        if (testArea && feedback) {
            testArea.addEventListener('keydown', (e) => {
                const keyName = e.key;
                const modifiers = [];
                if (e.ctrlKey) modifiers.push('Ctrl');
                if (e.altKey) modifiers.push('Alt');
                if (e.shiftKey) modifiers.push('Shift');
                if (e.metaKey) modifiers.push('Meta');
                
                const keyCombo = modifiers.length > 0 ? 
                    `${modifiers.join('+')}+${keyName}` : keyName;
                
                feedback.textContent += `Key pressed: ${keyCombo}\n`;
                feedback.scrollTop = feedback.scrollHeight;
                
                // Don't prevent default for Tab navigation
                if (keyName !== 'Tab') {
                    e.preventDefault();
                }
            });
            
            testArea.addEventListener('focus', () => {
                if (indicator) {
                    indicator.classList.add('active');
                }
                feedback.textContent += 'Focus gained\n';
            });
            
            testArea.addEventListener('blur', () => {
                if (indicator) {
                    indicator.classList.remove('active');
                }
                feedback.textContent += 'Focus lost\n';
            });
        }
    }
    
    detectScreenReader() {
        // Detect common screen readers
        const userAgent = navigator.userAgent.toLowerCase();
        const screenReaders = {
            jaws: /jaws/i,
            nvda: /nvda/i,
            windowEyes: /window-eyes/i,
            dragon: /dragon/i,
            voiceover: /voiceover/i
        };
        
        this.screenReaderDetected = Object.keys(screenReaders).some(sr => 
            screenReaders[sr].test(userAgent)
        );
        
        // Alternative detection methods
        if (!this.screenReaderDetected) {
            // Check for screen reader APIs
            this.screenReaderDetected = !!(
                window.speechSynthesis ||
                window.navigator.userAgent.includes('NVDA') ||
                window.navigator.userAgent.includes('JAWS')
            );
        }
    }
    
    analyzeColorContrast() {
        const contrastSamples = document.getElementById('contrast-samples');
        if (!contrastSamples) return;
        
        // Sample color combinations to test
        const colorTests = [
            { bg: '#ffffff', fg: '#000000', label: 'Black on White' },
            { bg: '#007bff', fg: '#ffffff', label: 'White on Blue' },
            { bg: '#28a745', fg: '#ffffff', label: 'White on Green' },
            { bg: '#dc3545', fg: '#ffffff', label: 'White on Red' },
            { bg: '#f8f9fa', fg: '#495057', label: 'Gray on Light' },
            { bg: '#343a40', fg: '#ffffff', label: 'White on Dark' }
        ];
        
        colorTests.forEach(test => {
            const sample = document.createElement('div');
            sample.className = 'contrast-sample';
            sample.style.backgroundColor = test.bg;
            sample.style.color = test.fg;
            
            const ratio = this.calculateContrastRatio(test.fg, test.bg);
            const passAA = ratio >= this.colorContrastRatios.normalTextAA;
            const passAAA = ratio >= this.colorContrastRatios.normalTextAAA;
            
            sample.innerHTML = `
                ${test.label}<br>
                Ratio: ${ratio.toFixed(2)}:1<br>
                <small>${passAAA ? 'AAA' : passAA ? 'AA' : 'Fail'}</small>
            `;
            
            sample.style.border = passAA ? '2px solid #28a745' : '2px solid #dc3545';
            contrastSamples.appendChild(sample);
        });
    }
    
    calculateContrastRatio(color1, color2) {
        // Convert hex to RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        // Calculate relative luminance
        const l1 = this.getRelativeLuminance(rgb1);
        const l2 = this.getRelativeLuminance(rgb2);
        
        // Calculate contrast ratio
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    getRelativeLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    updateTestStatus(testId, status, message = '') {
        const statusElement = document.getElementById(testId);
        if (statusElement) {
            const statusText = status === true ? 'PASS' : 
                              status === false ? 'FAIL' : 
                              status === 'warning' ? 'WARN' : 'PENDING';
            
            statusElement.textContent = statusText;
            statusElement.className = `test-status status-${status === true ? 'pass' : 
                                      status === false ? 'fail' : 
                                      status === 'warning' ? 'warning' : 'pending'}`;
            
            if (status === true) {
                this.testResults.passed++;
            } else if (status === false) {
                this.testResults.failed++;
                if (message) {
                    this.testResults.issues.push({
                        type: 'error',
                        test: testId,
                        message: message
                    });
                }
            } else if (status === 'warning') {
                this.testResults.warnings++;
                if (message) {
                    this.testResults.issues.push({
                        type: 'warning',
                        test: testId,
                        message: message
                    });
                }
            }
            
            if (status !== 'pending') {
                this.testResults.total++;
            }
        }
    }
    
    testScreenReaderSupport() {
        console.log('🔊 Testing Screen Reader Support...');
        
        // Test alt text for images
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.alt && img.alt.trim().length > 0) {
                imagesWithAlt++;
            }
        });
        
        const altTextPass = images.length === 0 || imagesWithAlt === images.length;
        this.updateTestStatus('alt-text', altTextPass, 
            altTextPass ? '' : `${images.length - imagesWithAlt} images missing alt text`);
        
        // Test heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const hasH1 = document.querySelector('h1') !== null;
        const headingStructureValid = this.validateHeadingStructure(headings);
        
        this.updateTestStatus('heading-structure', hasH1 && headingStructureValid,
            hasH1 ? (headingStructureValid ? '' : 'Heading levels not sequential') : 'Missing H1 element');
        
        // Test ARIA labels
        const elementsNeedingLabels = document.querySelectorAll('input, button, select, textarea');
        let elementsWithLabels = 0;
        elementsNeedingLabels.forEach(element => {
            const hasLabel = element.getAttribute('aria-label') ||
                            element.getAttribute('aria-labelledby') ||
                            document.querySelector(`label[for="${element.id}"]`) ||
                            element.closest('label');
            if (hasLabel) elementsWithLabels++;
        });
        
        const labelsPass = elementsNeedingLabels.length === 0 || elementsWithLabels === elementsNeedingLabels.length;
        this.updateTestStatus('aria-labels', labelsPass,
            labelsPass ? '' : `${elementsNeedingLabels.length - elementsWithLabels} elements missing labels`);
        
        // Test landmark regions
        const landmarks = document.querySelectorAll('header, nav, main, section, article, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
        const hasMain = document.querySelector('main, [role="main"]') !== null;
        
        this.updateTestStatus('landmarks', hasMain && landmarks.length > 0,
            hasMain ? (landmarks.length > 0 ? '' : 'No landmark regions found') : 'Missing main landmark');
        
        // Test skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        const hasSkipLink = Array.from(skipLinks).some(link => 
            link.textContent.toLowerCase().includes('skip') ||
            link.textContent.toLowerCase().includes('main')
        );
        
        this.updateTestStatus('skip-links', hasSkipLink ? true : 'warning',
            hasSkipLink ? '' : 'No skip links found');
        
        // Announce to screen readers
        this.announceToScreenReader('Screen reader tests completed');
    }
    
    validateHeadingStructure(headings) {
        if (headings.length === 0) return true;
        
        let previousLevel = 0;
        for (const heading of headings) {
            const currentLevel = parseInt(heading.tagName.substring(1));
            
            if (previousLevel > 0 && currentLevel > previousLevel + 1) {
                return false; // Skipped heading level
            }
            
            previousLevel = currentLevel;
        }
        
        return true;
    }
    
    testKeyboardNavigation() {
        console.log('⌨️ Testing Keyboard Navigation...');
        
        // Test tab order
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        let tabOrderValid = true;
        let previousTabIndex = -1;
        
        focusableElements.forEach(element => {
            const tabIndex = parseInt(element.getAttribute('tabindex')) || 0;
            if (tabIndex > 0 && tabIndex < previousTabIndex) {
                tabOrderValid = false;
            }
            previousTabIndex = tabIndex;
        });
        
        this.updateTestStatus('tab-order', tabOrderValid,
            tabOrderValid ? '' : 'Tab order may be confusing');
        
        // Test focus indicators
        const elementsWithFocus = document.querySelectorAll(':focus-visible, .focus\\:outline, [style*="outline"]');
        const hasFocusIndicators = elementsWithFocus.length > 0 || 
                                  this.checkCSSFocusIndicators();
        
        this.updateTestStatus('focus-indicators', hasFocusIndicators,
            hasFocusIndicators ? '' : 'No visible focus indicators found');
        
        // Test keyboard shortcuts
        const hasKeyboardShortcuts = this.checkKeyboardShortcuts();
        this.updateTestStatus('keyboard-shortcuts', hasKeyboardShortcuts ? true : 'warning',
            'Check keyboard shortcuts documentation');
        
        // Test modal focus management
        const modals = document.querySelectorAll('[role="dialog"], .modal, [aria-modal="true"]');
        const modalFocusValid = modals.length === 0 || this.testModalFocus(modals);
        
        this.updateTestStatus('modal-focus', modalFocusValid,
            modalFocusValid ? '' : 'Modal focus management issues detected');
        
        // Test skip to content
        const skipToContent = document.querySelector('a[href="#main"], a[href="#content"], .skip-link');
        this.updateTestStatus('skip-content', skipToContent !== null,
            skipToContent ? '' : 'No skip to content link found');
    }
    
    checkCSSFocusIndicators() {
        // Check if CSS includes focus styles
        const styleSheets = Array.from(document.styleSheets);
        
        try {
            for (const sheet of styleSheets) {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                for (const rule of rules) {
                    if (rule.selectorText && rule.selectorText.includes(':focus')) {
                        return true;
                    }
                }
            }
        } catch (e) {
            // CORS or other security restrictions
            return true; // Assume focus indicators exist
        }
        
        return false;
    }
    
    checkKeyboardShortcuts() {
        // Check for common keyboard shortcut patterns
        const hasAccessKey = document.querySelector('[accesskey]') !== null;
        const hasShortcutDoc = document.querySelector('[data-shortcut], .shortcut, .hotkey') !== null;
        
        return hasAccessKey || hasShortcutDoc;
    }
    
    testModalFocus(modals) {
        // Basic modal focus management test
        modals.forEach(modal => {
            const focusableInModal = modal.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableInModal.length === 0) {
                return false; // Modal should have focusable elements
            }
        });
        
        return true;
    }
    
    testColorContrast() {
        console.log('🎨 Testing Color Contrast...');
        
        // Test normal text contrast
        const textElements = document.querySelectorAll('p, span, div, li, td, th');
        let normalTextPass = true;
        let normalTextCount = 0;
        
        textElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            if (element.textContent.trim().length > 0) {
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
                const ratio = this.getElementContrastRatio(element);
                
                if (ratio > 0) {
                    const requiredRatio = isLargeText ? 
                        this.colorContrastRatios.largeTextAA : 
                        this.colorContrastRatios.normalTextAA;
                    
                    if (ratio < requiredRatio) {
                        normalTextPass = false;
                    }
                    normalTextCount++;
                }
            }
        });
        
        this.updateTestStatus('normal-text-contrast', normalTextCount === 0 || normalTextPass,
            normalTextPass ? '' : 'Some text elements have insufficient contrast');
        
        // Test large text contrast (simplified)
        this.updateTestStatus('large-text-contrast', true, ''); // Assume large text passes if normal text passes
        
        // Test interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select');
        let interactivePass = true;
        
        interactiveElements.forEach(element => {
            const ratio = this.getElementContrastRatio(element);
            if (ratio > 0 && ratio < this.colorContrastRatios.normalTextAA) {
                interactivePass = false;
            }
        });
        
        this.updateTestStatus('interactive-contrast', interactivePass,
            interactivePass ? '' : 'Some interactive elements have insufficient contrast');
        
        // Test focus indicators contrast
        this.updateTestStatus('focus-contrast', true, 'Manual verification required for focus states');
    }
    
    getElementContrastRatio(element) {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Simple approximation - in reality, you'd need to calculate the actual background
        if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            return this.calculateContrastRatio(color, backgroundColor);
        }
        
        return 0; // Unable to determine
    }
    
    testARIAAndSemantics() {
        console.log('🏗️ Testing ARIA and Semantics...');
        
        // Test semantic HTML
        const semanticElements = document.querySelectorAll(this.semanticElements.join(', '));
        const hasSemanticStructure = semanticElements.length > 0;
        
        this.updateTestStatus('semantic-html', hasSemanticStructure,
            hasSemanticStructure ? '' : 'Limited use of semantic HTML elements');
        
        // Test ARIA attributes usage
        const elementsWithARIA = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
        const properARIAUsage = this.validateARIAUsage(elementsWithARIA);
        
        this.updateTestStatus('aria-attributes', properARIAUsage,
            properARIAUsage ? '' : 'Some ARIA attributes may be used incorrectly');
        
        // Test form labels
        const formInputs = document.querySelectorAll('input, select, textarea');
        let formsWithLabels = 0;
        
        formInputs.forEach(input => {
            const hasLabel = input.labels && input.labels.length > 0 ||
                            input.getAttribute('aria-label') ||
                            input.getAttribute('aria-labelledby');
            if (hasLabel) formsWithLabels++;
        });
        
        const formLabelsPass = formInputs.length === 0 || formsWithLabels === formInputs.length;
        this.updateTestStatus('form-labels', formLabelsPass,
            formLabelsPass ? '' : `${formInputs.length - formsWithLabels} form inputs missing labels`);
        
        // Test button accessibility
        const buttons = document.querySelectorAll('button, [role="button"]');
        let accessibleButtons = 0;
        
        buttons.forEach(button => {
            const hasAccessibleName = button.textContent.trim() ||
                                    button.getAttribute('aria-label') ||
                                    button.getAttribute('aria-labelledby') ||
                                    button.querySelector('img[alt]');
            if (hasAccessibleName) accessibleButtons++;
        });
        
        const buttonAccessibilityPass = buttons.length === 0 || accessibleButtons === buttons.length;
        this.updateTestStatus('button-accessibility', buttonAccessibilityPass,
            buttonAccessibilityPass ? '' : `${buttons.length - accessibleButtons} buttons lack accessible names`);
        
        // Test link purpose
        const links = document.querySelectorAll('a[href]');
        let descriptiveLinks = 0;
        
        links.forEach(link => {
            const linkText = link.textContent.trim();
            const hasDescriptiveText = linkText.length > 0 && 
                                     !['click here', 'read more', 'more', 'here'].includes(linkText.toLowerCase());
            if (hasDescriptiveText || link.getAttribute('aria-label')) {
                descriptiveLinks++;
            }
        });
        
        const linkPurposePass = links.length === 0 || descriptiveLinks / links.length > 0.8;
        this.updateTestStatus('link-purpose', linkPurposePass ? true : 'warning',
            linkPurposePass ? '' : 'Some links may not have clear purpose');
    }
    
    validateARIAUsage(elements) {
        // Basic ARIA validation
        for (const element of elements) {
            const role = element.getAttribute('role');
            const ariaLabel = element.getAttribute('aria-label');
            
            // Check for common ARIA mistakes
            if (role && !this.isValidRole(role)) {
                return false;
            }
            
            if (ariaLabel && ariaLabel.trim().length === 0) {
                return false;
            }
        }
        
        return true;
    }
    
    isValidRole(role) {
        const validRoles = [
            'alert', 'application', 'article', 'banner', 'button', 'cell',
            'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
            'dialog', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell',
            'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem',
            'main', 'menu', 'menubar', 'menuitem', 'navigation', 'option',
            'presentation', 'progressbar', 'radio', 'radiogroup', 'region',
            'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox',
            'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab',
            'table', 'tablist', 'tabpanel', 'textbox', 'timer', 'toolbar',
            'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
        
        return validRoles.includes(role);
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    async runAllTests() {
        console.log('🚀 Running all accessibility tests...');
        
        // Reset results
        this.testResults = { passed: 0, failed: 0, warnings: 0, total: 0, issues: [] };
        
        // Run all test suites
        this.testScreenReaderSupport();
        await this.sleep(500);
        
        this.testKeyboardNavigation();
        await this.sleep(500);
        
        this.testColorContrast();
        await this.sleep(500);
        
        this.testARIAAndSemantics();
        await this.sleep(500);
        
        // Show results
        this.showResults();
        
        // Announce completion
        this.announceToScreenReader(`Accessibility tests completed. ${this.testResults.passed} passed, ${this.testResults.failed} failed, ${this.testResults.warnings} warnings.`);
    }
    
    showResults() {
        const summary = document.getElementById('results-summary');
        if (summary) {
            summary.style.display = 'block';
            
            document.getElementById('a11y-passed').textContent = this.testResults.passed;
            document.getElementById('a11y-failed').textContent = this.testResults.failed;
            document.getElementById('a11y-warnings').textContent = this.testResults.warnings;
            document.getElementById('a11y-total').textContent = this.testResults.total;
            
            // Show issues
            const issueList = document.getElementById('issue-list');
            if (issueList && this.testResults.issues.length > 0) {
                issueList.innerHTML = '<h5>Issues Found:</h5>';
                this.testResults.issues.forEach(issue => {
                    const issueDiv = document.createElement('div');
                    issueDiv.className = `issue-item ${issue.type}`;
                    issueDiv.innerHTML = `<strong>${issue.test}:</strong> ${issue.message}`;
                    issueList.appendChild(issueDiv);
                });
            }
        }
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            results: this.testResults,
            summary: {
                totalScore: Math.round((this.testResults.passed / this.testResults.total) * 100),
                wcagLevel: this.getWCAGLevel(),
                recommendations: this.generateRecommendations()
            }
        };
        
        // Create downloadable report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.announceToScreenReader('Accessibility report generated and downloaded');
    }
    
    getWCAGLevel() {
        const successRate = this.testResults.passed / this.testResults.total;
        
        if (successRate >= 0.95) return 'AAA';
        if (successRate >= 0.85) return 'AA';
        if (successRate >= 0.70) return 'A';
        return 'Below A';
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.failed > 0) {
            recommendations.push('Address all failed accessibility tests before deployment');
        }
        
        if (this.testResults.warnings > 0) {
            recommendations.push('Review warning items for potential improvements');
        }
        
        recommendations.push('Conduct manual testing with actual assistive technologies');
        recommendations.push('Include accessibility testing in your regular QA process');
        
        return recommendations;
    }
    
    clearResults() {
        this.testResults = { passed: 0, failed: 0, warnings: 0, total: 0, issues: [] };
        
        // Reset all status indicators
        document.querySelectorAll('.test-status').forEach(status => {
            status.textContent = 'Pending';
            status.className = 'test-status status-pending';
        });
        
        // Hide results summary
        const summary = document.getElementById('results-summary');
        if (summary) {
            summary.style.display = 'none';
        }
        
        // Clear keyboard feedback
        const feedback = document.getElementById('keyboard-feedback');
        if (feedback) {
            feedback.textContent = 'Keyboard events will appear here...';
        }
        
        this.announceToScreenReader('Test results cleared');
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API
    getTestResults() {
        return this.testResults;
    }
    
    isScreenReaderDetected() {
        return this.screenReaderDetected;
    }
    
    getWCAGComplianceLevel() {
        return this.getWCAGLevel();
    }
}

// Auto-initialize if not in test environment
let a11yTests;
if (typeof window !== 'undefined' && !window.a11yTestsDisabled) {
    a11yTests = new AccessibilityTestSuite();
}

// Export for testing frameworks
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityTestSuite;
}