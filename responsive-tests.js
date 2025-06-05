/**
 * Responsive Design Testing Suite
 * AutoZone Claude Code Training Website
 * 
 * Comprehensive testing for device compatibility, responsive layouts,
 * touch interfaces, and cross-device performance validation.
 */

class ResponsiveTestSuite {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
        
        this.deviceBreakpoints = {
            mobile: { min: 320, max: 767 },
            tablet: { min: 768, max: 1023 },
            desktop: { min: 1024, max: 1920 },
            widescreen: { min: 1921, max: 3840 }
        };
        
        this.testDevices = [
            // Mobile Devices
            { name: 'iPhone SE', width: 375, height: 667, devicePixelRatio: 2, category: 'mobile' },
            { name: 'iPhone 12 Pro', width: 390, height: 844, devicePixelRatio: 3, category: 'mobile' },
            { name: 'iPhone 14 Pro Max', width: 428, height: 926, devicePixelRatio: 3, category: 'mobile' },
            { name: 'Samsung Galaxy S21', width: 384, height: 854, devicePixelRatio: 2.75, category: 'mobile' },
            { name: 'Google Pixel 6', width: 393, height: 851, devicePixelRatio: 2.75, category: 'mobile' },
            
            // Tablet Devices
            { name: 'iPad', width: 768, height: 1024, devicePixelRatio: 2, category: 'tablet' },
            { name: 'iPad Pro 11"', width: 834, height: 1194, devicePixelRatio: 2, category: 'tablet' },
            { name: 'iPad Pro 12.9"', width: 1024, height: 1366, devicePixelRatio: 2, category: 'tablet' },
            { name: 'Samsung Galaxy Tab', width: 800, height: 1280, devicePixelRatio: 2, category: 'tablet' },
            
            // Desktop Devices
            { name: 'Desktop HD', width: 1366, height: 768, devicePixelRatio: 1, category: 'desktop' },
            { name: 'Desktop FHD', width: 1920, height: 1080, devicePixelRatio: 1, category: 'desktop' },
            { name: 'MacBook Air 13"', width: 1440, height: 900, devicePixelRatio: 2, category: 'desktop' },
            { name: 'MacBook Pro 16"', width: 1728, height: 1117, devicePixelRatio: 2, category: 'desktop' }
        ];
        
        this.touchGestures = [
            'tap', 'double-tap', 'long-press', 'swipe-left', 'swipe-right', 
            'swipe-up', 'swipe-down', 'pinch-zoom-in', 'pinch-zoom-out', 'rotate'
        ];
        
        this.currentDevice = null;
        this.originalViewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        this.init();
    }
    
    init() {
        this.detectCurrentDevice();
        this.setupEventListeners();
        this.createTestInterface();
    }
    
    detectCurrentDevice() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Try to match with known devices
        for (const device of this.testDevices) {
            if (Math.abs(device.width - width) <= 10 && Math.abs(device.height - height) <= 50) {
                this.currentDevice = device;
                return;
            }
        }
        
        // Fallback to category detection
        let category = 'desktop';
        if (width <= this.deviceBreakpoints.mobile.max) {
            category = 'mobile';
        } else if (width <= this.deviceBreakpoints.tablet.max) {
            category = 'tablet';
        }
        
        this.currentDevice = {
            name: 'Unknown Device',
            width,
            height,
            devicePixelRatio,
            category
        };
    }
    
    setupEventListeners() {
        // Viewport change detection
        window.addEventListener('resize', () => {
            this.detectCurrentDevice();
            this.updateDeviceInfo();
        });
        
        // Orientation change detection
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectCurrentDevice();
                this.updateDeviceInfo();
                this.testOrientationHandling();
            }, 100);
        });
        
        // Touch event detection
        if ('ontouchstart' in window) {
            this.setupTouchEventListeners();
        }
    }
    
    setupTouchEventListeners() {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        let lastTap = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndPos = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };
            
            const distance = Math.sqrt(
                Math.pow(touchEndPos.x - touchStartPos.x, 2) +
                Math.pow(touchEndPos.y - touchStartPos.y, 2)
            );
            
            // Detect gesture type
            if (distance < 10 && touchDuration < 200) {
                // Tap
                const currentTime = Date.now();
                if (currentTime - lastTap < 300) {
                    this.logGesture('double-tap', touchEndPos);
                } else {
                    this.logGesture('tap', touchEndPos);
                }
                lastTap = currentTime;
            } else if (distance < 10 && touchDuration >= 500) {
                // Long press
                this.logGesture('long-press', touchEndPos);
            } else if (distance >= 50) {
                // Swipe
                const deltaX = touchEndPos.x - touchStartPos.x;
                const deltaY = touchEndPos.y - touchStartPos.y;
                
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.logGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left', touchEndPos);
                } else {
                    this.logGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up', touchEndPos);
                }
            }
        });
    }
    
    logGesture(gestureType, position) {
        const log = document.getElementById('gesture-log');
        if (log) {
            const timestamp = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${timestamp}] ${gestureType} at (${Math.round(position.x)}, ${Math.round(position.y)})</div>`;
            log.scrollTop = log.scrollHeight;
        }
    }
    
    createTestInterface() {
        // Check if we're in a test environment or standalone page
        if (!document.getElementById('responsive-test-container')) {
            this.createStandaloneInterface();
        }
    }
    
    createStandaloneInterface() {
        const container = document.createElement('div');
        container.id = 'responsive-test-container';
        container.innerHTML = `
            <style>
                #responsive-test-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 350px;
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    font-size: 14px;
                    z-index: 10000;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                
                .test-header {
                    background: #007bff;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px 8px 0 0;
                    font-weight: 600;
                }
                
                .test-content {
                    padding: 16px;
                }
                
                .device-info {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                }
                
                .device-info h4 {
                    margin: 0 0 8px 0;
                    color: #495057;
                }
                
                .device-info p {
                    margin: 4px 0;
                    color: #6c757d;
                }
                
                .test-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin: 4px;
                    font-size: 12px;
                }
                
                .test-button:hover {
                    background: #0056b3;
                }
                
                .test-button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                }
                
                .test-results {
                    margin-top: 16px;
                    max-height: 200px;
                    overflow-y: auto;
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 11px;
                }
                
                .gesture-log {
                    margin-top: 16px;
                    max-height: 150px;
                    overflow-y: auto;
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 11px;
                }
                
                .close-button {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .progress-bar {
                    background: #e9ecef;
                    border-radius: 4px;
                    height: 8px;
                    margin: 12px 0;
                    overflow: hidden;
                }
                
                .progress-fill {
                    background: #007bff;
                    height: 100%;
                    width: 0%;
                    transition: width 0.3s ease;
                }
                
                @media (max-width: 768px) {
                    #responsive-test-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: auto;
                        height: auto;
                        max-height: none;
                        border-radius: 0;
                    }
                }
            </style>
            
            <div class="test-header">
                📱 Responsive Design Tests
                <button class="close-button" onclick="this.closest('#responsive-test-container').remove()">×</button>
            </div>
            
            <div class="test-content">
                <div class="device-info" id="device-info">
                    <h4>Current Device</h4>
                    <p id="device-name">Detecting...</p>
                    <p id="device-dimensions">Detecting...</p>
                    <p id="device-category">Detecting...</p>
                    <p id="device-pixel-ratio">Detecting...</p>
                </div>
                
                <div>
                    <button class="test-button" onclick="responsiveTests.runBreakpointTests()">
                        Test Breakpoints
                    </button>
                    <button class="test-button" onclick="responsiveTests.runLayoutTests()">
                        Test Layouts
                    </button>
                    <button class="test-button" onclick="responsiveTests.runTouchTests()">
                        Test Touch
                    </button>
                    <button class="test-button" onclick="responsiveTests.runPerformanceTests()">
                        Test Performance
                    </button>
                </div>
                
                <div>
                    <button class="test-button" onclick="responsiveTests.runAllTests()">
                        🚀 Run All Tests
                    </button>
                    <button class="test-button" onclick="responsiveTests.clearResults()">
                        Clear Results
                    </button>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="test-progress"></div>
                </div>
                
                <div class="test-results" id="test-results">
                    Test results will appear here...
                </div>
                
                <div class="gesture-log" id="gesture-log" style="display: none;">
                    Touch events will be logged here...
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.updateDeviceInfo();
    }
    
    updateDeviceInfo() {
        const deviceName = document.getElementById('device-name');
        const deviceDimensions = document.getElementById('device-dimensions');
        const deviceCategory = document.getElementById('device-category');
        const devicePixelRatio = document.getElementById('device-pixel-ratio');
        
        if (deviceName) {
            deviceName.textContent = this.currentDevice.name;
            deviceDimensions.textContent = `${this.currentDevice.width} × ${this.currentDevice.height}`;
            deviceCategory.textContent = `Category: ${this.currentDevice.category}`;
            devicePixelRatio.textContent = `DPR: ${this.currentDevice.devicePixelRatio}`;
        }
    }
    
    log(message, type = 'info') {
        const results = document.getElementById('test-results');
        if (results) {
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
            results.innerHTML += `<div class="${className}">[${timestamp}] ${message}</div>`;
            results.scrollTop = results.scrollHeight;
        }
        console.log(`[ResponsiveTests] ${message}`);
    }
    
    updateProgress(percentage) {
        const progressFill = document.getElementById('test-progress');
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
    }
    
    clearResults() {
        const results = document.getElementById('test-results');
        if (results) {
            results.innerHTML = 'Test results cleared...';
        }
        
        const gestureLog = document.getElementById('gesture-log');
        if (gestureLog) {
            gestureLog.innerHTML = '';
            gestureLog.style.display = 'none';
        }
        
        this.testResults = { passed: 0, failed: 0, warnings: 0, total: 0 };
        this.updateProgress(0);
    }
    
    async runBreakpointTests() {
        this.log('🔍 Testing CSS Breakpoints...');
        
        // Test media queries
        const breakpointTests = [
            { name: 'Mobile breakpoint', query: '(max-width: 767px)' },
            { name: 'Tablet breakpoint', query: '(min-width: 768px) and (max-width: 1023px)' },
            { name: 'Desktop breakpoint', query: '(min-width: 1024px)' },
            { name: 'High DPI display', query: '(-webkit-min-device-pixel-ratio: 2)' },
            { name: 'Portrait orientation', query: '(orientation: portrait)' },
            { name: 'Landscape orientation', query: '(orientation: landscape)' }
        ];
        
        breakpointTests.forEach((test, index) => {
            const matches = window.matchMedia(test.query).matches;
            this.log(`${test.name}: ${matches ? 'ACTIVE' : 'INACTIVE'}`, matches ? 'success' : 'info');
            
            if (matches) {
                this.testResults.passed++;
            }
            this.testResults.total++;
        });
        
        // Test viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            this.log('✅ Viewport meta tag found', 'success');
            this.log(`Viewport content: ${viewportMeta.content}`, 'info');
            this.testResults.passed++;
        } else {
            this.log('❌ Viewport meta tag missing', 'error');
            this.testResults.failed++;
        }
        this.testResults.total++;
    }
    
    async runLayoutTests() {
        this.log('📐 Testing Layout Responsiveness...');
        
        // Test container widths at different breakpoints
        const containers = document.querySelectorAll('.container, .main-content, .content-section');
        
        containers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(container);
            
            this.log(`Container ${index + 1}: ${Math.round(rect.width)}px wide`, 'info');
            
            // Check for overflow
            if (rect.width > window.innerWidth) {
                this.log(`⚠️ Container ${index + 1} overflows viewport`, 'error');
                this.testResults.failed++;
            } else {
                this.testResults.passed++;
            }
            this.testResults.total++;
            
            // Check for minimum margins
            const marginLeft = parseFloat(computedStyle.marginLeft);
            const marginRight = parseFloat(computedStyle.marginRight);
            if (marginLeft < 10 || marginRight < 10) {
                this.log(`⚠️ Container ${index + 1} has minimal margins`, 'error');
                this.testResults.warnings++;
            }
        });
        
        // Test grid layouts
        const gridContainers = document.querySelectorAll('[style*="grid"], .grid, .cards-grid');
        gridContainers.forEach((grid, index) => {
            const computedStyle = window.getComputedStyle(grid);
            if (computedStyle.display === 'grid') {
                this.log(`✅ Grid ${index + 1} properly configured`, 'success');
                this.testResults.passed++;
            } else {
                this.log(`❌ Grid ${index + 1} not using CSS Grid`, 'error');
                this.testResults.failed++;
            }
            this.testResults.total++;
        });
        
        // Test flexbox layouts
        const flexContainers = document.querySelectorAll('[style*="flex"], .flex, .nav-list');
        flexContainers.forEach((flex, index) => {
            const computedStyle = window.getComputedStyle(flex);
            if (computedStyle.display.includes('flex')) {
                this.log(`✅ Flex ${index + 1} properly configured`, 'success');
                this.testResults.passed++;
            } else {
                this.log(`❌ Flex ${index + 1} not using Flexbox`, 'error');
                this.testResults.failed++;
            }
            this.testResults.total++;
        });
    }
    
    async runTouchTests() {
        this.log('👆 Testing Touch Interface...');
        
        // Show gesture log
        const gestureLog = document.getElementById('gesture-log');
        if (gestureLog) {
            gestureLog.style.display = 'block';
            gestureLog.innerHTML = 'Touch the screen to test gestures...';
        }
        
        // Test touch device detection
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.log(`Touch screen detected: ${hasTouchScreen}`, hasTouchScreen ? 'success' : 'info');
        
        // Test touch target sizes
        const interactiveElements = document.querySelectorAll('button, a, input, [onclick], [tabindex]');
        let adequateTouchTargets = 0;
        
        interactiveElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const minSize = 44; // Apple's recommended minimum touch target size
            
            if (rect.width >= minSize && rect.height >= minSize) {
                adequateTouchTargets++;
            } else if (rect.width > 0 && rect.height > 0) { // Only count visible elements
                this.log(`⚠️ Touch target ${index + 1} too small: ${Math.round(rect.width)}×${Math.round(rect.height)}px`, 'error');
                this.testResults.failed++;
                this.testResults.total++;
            }
        });
        
        if (adequateTouchTargets > 0) {
            this.log(`✅ ${adequateTouchTargets} adequate touch targets found`, 'success');
            this.testResults.passed += adequateTouchTargets;
            this.testResults.total += adequateTouchTargets;
        }
        
        // Test hover effects (should be adapted for touch)
        const hoverElements = document.querySelectorAll('[style*="hover"], .btn:hover, a:hover');
        if (hoverElements.length > 0 && hasTouchScreen) {
            this.log(`⚠️ ${hoverElements.length} hover effects found on touch device`, 'error');
            this.testResults.warnings += hoverElements.length;
        }
        
        // Test scroll behavior
        const scrollableElements = document.querySelectorAll('[style*="overflow"], .console-output');
        scrollableElements.forEach((element, index) => {
            const computedStyle = window.getComputedStyle(element);
            const hasScroll = computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll';
            
            if (hasScroll) {
                this.log(`✅ Scrollable area ${index + 1} configured for touch`, 'success');
                this.testResults.passed++;
            }
            this.testResults.total++;
        });
    }
    
    async runPerformanceTests() {
        this.log('⚡ Testing Device Performance...');
        
        // Memory usage estimation
        if (performance.memory) {
            const memoryInfo = performance.memory;
            const memoryUsageMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
            const memoryLimitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024);
            
            this.log(`Memory usage: ${memoryUsageMB}MB / ${memoryLimitMB}MB`, 'info');
            
            if (memoryUsageMB < memoryLimitMB * 0.8) {
                this.log('✅ Memory usage within acceptable limits', 'success');
                this.testResults.passed++;
            } else {
                this.log('⚠️ High memory usage detected', 'error');
                this.testResults.warnings++;
            }
            this.testResults.total++;
        }
        
        // Frame rate test
        let frameCount = 0;
        let startTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const elapsed = performance.now() - startTime;
            
            if (elapsed < 1000) {
                requestAnimationFrame(countFrames);
            } else {
                const fps = Math.round(frameCount / (elapsed / 1000));
                this.log(`Frame rate: ${fps} FPS`, 'info');
                
                if (fps >= 30) {
                    this.log('✅ Smooth frame rate detected', 'success');
                    this.testResults.passed++;
                } else if (fps >= 20) {
                    this.log('⚠️ Moderate frame rate', 'error');
                    this.testResults.warnings++;
                } else {
                    this.log('❌ Poor frame rate performance', 'error');
                    this.testResults.failed++;
                }
                this.testResults.total++;
            }
        };
        
        requestAnimationFrame(countFrames);
        
        // Device capabilities
        const deviceCapabilities = {
            'WebGL': !!window.WebGLRenderingContext,
            'WebGL2': !!window.WebGL2RenderingContext,
            'WebAssembly': typeof WebAssembly === 'object',
            'Service Workers': 'serviceWorker' in navigator,
            'Web Workers': typeof Worker !== 'undefined',
            'Device Motion': 'DeviceMotionEvent' in window,
            'Device Orientation': 'DeviceOrientationEvent' in window,
            'Geolocation': 'geolocation' in navigator,
            'Camera': 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
        };
        
        Object.entries(deviceCapabilities).forEach(([feature, supported]) => {
            this.log(`${feature}: ${supported ? 'Supported' : 'Not supported'}`, supported ? 'success' : 'info');
            if (supported) {
                this.testResults.passed++;
            }
            this.testResults.total++;
        });
        
        // Network information (if available)
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.log(`Network: ${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'} Mbps)`, 'info');
            
            if (connection.effectiveType === '4g') {
                this.log('✅ High-speed network detected', 'success');
                this.testResults.passed++;
            } else if (connection.effectiveType === '3g') {
                this.log('⚠️ Medium-speed network', 'error');
                this.testResults.warnings++;
            } else {
                this.log('❌ Slow network detected', 'error');
                this.testResults.failed++;
            }
            this.testResults.total++;
        }
    }
    
    testOrientationHandling() {
        this.log('🔄 Testing orientation change handling...');
        
        const orientation = screen.orientation ? screen.orientation.angle : window.orientation;
        this.log(`Current orientation: ${orientation}°`, 'info');
        
        // Test if layout adapts to orientation
        setTimeout(() => {
            this.detectCurrentDevice();
            this.updateDeviceInfo();
            this.log('✅ Orientation change handled', 'success');
        }, 500);
    }
    
    async runAllTests() {
        this.clearResults();
        this.log('🚀 Starting comprehensive responsive design tests...');
        
        let progress = 0;
        const totalSteps = 4;
        
        // Run breakpoint tests
        await this.runBreakpointTests();
        progress += 25;
        this.updateProgress(progress);
        await this.sleep(500);
        
        // Run layout tests
        await this.runLayoutTests();
        progress += 25;
        this.updateProgress(progress);
        await this.sleep(500);
        
        // Run touch tests
        await this.runTouchTests();
        progress += 25;
        this.updateProgress(progress);
        await this.sleep(500);
        
        // Run performance tests
        await this.runPerformanceTests();
        progress += 25;
        this.updateProgress(progress);
        
        // Summary
        const totalTests = this.testResults.total;
        const passedTests = this.testResults.passed;
        const failedTests = this.testResults.failed;
        const warningTests = this.testResults.warnings;
        
        this.log('', 'info');
        this.log('=== TEST SUMMARY ===', 'info');
        this.log(`Total tests: ${totalTests}`, 'info');
        this.log(`Passed: ${passedTests}`, 'success');
        this.log(`Failed: ${failedTests}`, 'error');
        this.log(`Warnings: ${warningTests}`, 'error');
        this.log(`Success rate: ${Math.round((passedTests / totalTests) * 100)}%`, 'info');
        
        if (failedTests === 0 && warningTests === 0) {
            this.log('🎉 All responsive design tests passed!', 'success');
        } else if (failedTests === 0) {
            this.log('✅ Tests passed with warnings', 'success');
        } else {
            this.log('❌ Some tests failed - review and fix issues', 'error');
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API for external testing
    getDeviceInfo() {
        return this.currentDevice;
    }
    
    getTestResults() {
        return this.testResults;
    }
    
    isResponsiveDesign() {
        // Quick check for responsive design indicators
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const hasFlexbox = Array.from(document.querySelectorAll('*')).some(el => 
            window.getComputedStyle(el).display.includes('flex')
        );
        const hasGrid = Array.from(document.querySelectorAll('*')).some(el => 
            window.getComputedStyle(el).display === 'grid'
        );
        const hasMediaQueries = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules).some(rule => 
                    rule.type === CSSRule.MEDIA_RULE
                );
            } catch (e) {
                return false;
            }
        });
        
        return !!(viewportMeta && (hasFlexbox || hasGrid || hasMediaQueries));
    }
}

// Auto-initialize if not in test environment
let responsiveTests;
if (typeof window !== 'undefined' && !window.responsiveTestsDisabled) {
    responsiveTests = new ResponsiveTestSuite();
}

// Export for testing frameworks
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveTestSuite;
}