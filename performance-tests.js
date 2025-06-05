/**
 * Performance Testing Suite
 * AutoZone Claude Code Training Website
 * 
 * Comprehensive performance validation including load times, memory usage,
 * network optimization, Core Web Vitals, and resource monitoring.
 */

class PerformanceTestSuite {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0,
            metrics: {}
        };
        
        this.thresholds = {
            // Core Web Vitals
            LCP: 2500,        // Largest Contentful Paint (ms)
            FID: 100,         // First Input Delay (ms)
            CLS: 0.1,         // Cumulative Layout Shift
            FCP: 1800,        // First Contentful Paint (ms)
            TTI: 3800,        // Time to Interactive (ms)
            TBT: 200,         // Total Blocking Time (ms)
            
            // Custom metrics
            loadTime: 3000,   // Complete page load (ms)
            domReady: 2000,   // DOM ready (ms)
            memoryUsage: 50,  // MB
            bundleSize: 1000, // KB
            imageOptimization: 100, // KB per image
            
            // Network
            resourceCount: 50,
            errorRate: 0.05,  // 5%
            cacheHitRate: 0.8 // 80%
        };
        
        this.resourceTypes = [
            'document', 'script', 'stylesheet', 'image', 'font',
            'fetch', 'xmlhttprequest', 'other'
        ];
        
        this.performanceObserver = null;
        this.resourceData = [];
        this.navigationData = null;
        
        this.init();
    }
    
    init() {
        this.createTestInterface();
        this.setupPerformanceObservers();
        this.collectBasicMetrics();
        this.startResourceMonitoring();
    }
    
    createTestInterface() {
        if (!document.getElementById('performance-test-container')) {
            this.createStandaloneInterface();
        }
    }
    
    createStandaloneInterface() {
        const container = document.createElement('div');
        container.id = 'performance-test-container';
        container.innerHTML = `
            <style>
                #performance-test-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 900px;
                    height: 90vh;
                    background: white;
                    border: 2px solid #28a745;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .perf-header {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .perf-header h2 {
                    margin: 0;
                    font-size: 1.4rem;
                }
                
                .close-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .perf-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .perf-tabs {
                    display: flex;
                    border-bottom: 2px solid #e9ecef;
                    margin-bottom: 20px;
                }
                
                .perf-tab {
                    padding: 12px 20px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #6c757d;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                }
                
                .perf-tab.active {
                    color: #28a745;
                    border-bottom-color: #28a745;
                    background: #f8f9fa;
                }
                
                .perf-tab:hover {
                    background: #f8f9fa;
                }
                
                .tab-content {
                    display: none;
                }
                
                .tab-content.active {
                    display: block;
                }
                
                .metric-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 30px;
                }
                
                .metric-card {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .metric-card.excellent {
                    border-left: 4px solid #28a745;
                    background: #d4edda;
                }
                
                .metric-card.good {
                    border-left: 4px solid #ffc107;
                    background: #fff3cd;
                }
                
                .metric-card.poor {
                    border-left: 4px solid #dc3545;
                    background: #f8d7da;
                }
                
                .metric-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .metric-value.excellent {
                    color: #28a745;
                }
                
                .metric-value.good {
                    color: #ffc107;
                }
                
                .metric-value.poor {
                    color: #dc3545;
                }
                
                .metric-label {
                    font-size: 12px;
                    color: #6c757d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }
                
                .metric-threshold {
                    font-size: 10px;
                    color: #6c757d;
                }
                
                .test-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #28a745;
                }
                
                .test-section h3 {
                    margin: 0 0 15px 0;
                    color: #2c3e50;
                    font-size: 1.2rem;
                }
                
                .test-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                }
                
                .test-name {
                    font-weight: 500;
                    color: #495057;
                    flex: 1;
                }
                
                .test-status {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    min-width: 60px;
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
                    color: #495057;
                }
                
                .test-button {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin: 5px;
                    font-size: 14px;
                    transition: background 0.3s ease;
                }
                
                .test-button:hover {
                    background: #218838;
                }
                
                .test-button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                }
                
                .resource-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16px 0;
                    font-size: 12px;
                }
                
                .resource-table th,
                .resource-table td {
                    padding: 8px 12px;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .resource-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #495057;
                }
                
                .resource-table tr:hover {
                    background: #f8f9fa;
                }
                
                .waterfall-chart {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 16px;
                    margin: 16px 0;
                    overflow-x: auto;
                }
                
                .waterfall-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                }
                
                .waterfall-label {
                    width: 150px;
                    flex-shrink: 0;
                    color: #495057;
                    font-weight: 500;
                }
                
                .waterfall-bar {
                    flex: 1;
                    height: 20px;
                    background: #e9ecef;
                    border-radius: 10px;
                    position: relative;
                    margin: 0 10px;
                }
                
                .waterfall-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #28a745, #20c997);
                    border-radius: 10px;
                    transition: width 0.5s ease;
                }
                
                .waterfall-time {
                    width: 80px;
                    text-align: right;
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .memory-monitor {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 16px;
                    margin: 16px 0;
                }
                
                .memory-chart {
                    height: 100px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                    margin: 12px 0;
                }
                
                .memory-usage {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: linear-gradient(to top, #28a745, #20c997);
                    transition: height 0.3s ease;
                    border-radius: 4px 4px 0 0;
                }
                
                .network-info {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    padding: 16px;
                    margin: 16px 0;
                }
                
                .network-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 12px;
                    margin: 12px 0;
                }
                
                .network-stat {
                    text-align: center;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 4px;
                }
                
                .network-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #28a745;
                    margin-bottom: 4px;
                }
                
                .network-label {
                    font-size: 10px;
                    color: #6c757d;
                    text-transform: uppercase;
                }
                
                .loading-indicator {
                    display: none;
                    text-align: center;
                    padding: 20px;
                    color: #6c757d;
                }
                
                .loading-indicator.active {
                    display: block;
                }
                
                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #28a745;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .performance-score {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    margin: 20px 0;
                }
                
                .score-value {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .score-label {
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                @media (max-width: 768px) {
                    #performance-test-container {
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                        top: 0;
                        left: 0;
                        transform: none;
                    }
                    
                    .metric-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .perf-tabs {
                        overflow-x: auto;
                    }
                    
                    .perf-tab {
                        white-space: nowrap;
                        padding: 10px 15px;
                    }
                }
            </style>
            
            <div class="perf-header">
                <h2>⚡ Performance Tests</h2>
                <button class="close-btn" onclick="this.closest('#performance-test-container').remove()">×</button>
            </div>
            
            <div class="perf-content">
                <div class="perf-tabs">
                    <button class="perf-tab active" onclick="perfTests.switchTab('vitals')">Core Web Vitals</button>
                    <button class="perf-tab" onclick="perfTests.switchTab('resources')">Resource Analysis</button>
                    <button class="perf-tab" onclick="perfTests.switchTab('memory')">Memory Usage</button>
                    <button class="perf-tab" onclick="perfTests.switchTab('network')">Network</button>
                    <button class="perf-tab" onclick="perfTests.switchTab('optimization')">Optimization</button>
                </div>
                
                <!-- Core Web Vitals Tab -->
                <div id="vitals-tab" class="tab-content active">
                    <div class="performance-score">
                        <div class="score-value" id="overall-score">--</div>
                        <div class="score-label">Performance Score</div>
                    </div>
                    
                    <div class="metric-grid">
                        <div class="metric-card" id="lcp-card">
                            <div class="metric-label">Largest Contentful Paint</div>
                            <div class="metric-value" id="lcp-value">--</div>
                            <div class="metric-threshold">Target: < 2.5s</div>
                        </div>
                        <div class="metric-card" id="fid-card">
                            <div class="metric-label">First Input Delay</div>
                            <div class="metric-value" id="fid-value">--</div>
                            <div class="metric-threshold">Target: < 100ms</div>
                        </div>
                        <div class="metric-card" id="cls-card">
                            <div class="metric-label">Cumulative Layout Shift</div>
                            <div class="metric-value" id="cls-value">--</div>
                            <div class="metric-threshold">Target: < 0.1</div>
                        </div>
                        <div class="metric-card" id="fcp-card">
                            <div class="metric-label">First Contentful Paint</div>
                            <div class="metric-value" id="fcp-value">--</div>
                            <div class="metric-threshold">Target: < 1.8s</div>
                        </div>
                        <div class="metric-card" id="tti-card">
                            <div class="metric-label">Time to Interactive</div>
                            <div class="metric-value" id="tti-value">--</div>
                            <div class="metric-threshold">Target: < 3.8s</div>
                        </div>
                        <div class="metric-card" id="tbt-card">
                            <div class="metric-label">Total Blocking Time</div>
                            <div class="metric-value" id="tbt-value">--</div>
                            <div class="metric-threshold">Target: < 200ms</div>
                        </div>
                    </div>
                    
                    <div class="test-section">
                        <h3>⚡ Core Performance Tests</h3>
                        <div class="test-item">
                            <span class="test-name">Page Load Time</span>
                            <div class="test-status status-pending" id="page-load">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">DOM Content Loaded</span>
                            <div class="test-status status-pending" id="dom-loaded">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Time to First Byte</span>
                            <div class="test-status status-pending" id="ttfb">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Render Blocking Resources</span>
                            <div class="test-status status-pending" id="render-blocking">Pending</div>
                        </div>
                    </div>
                    
                    <button class="test-button" onclick="perfTests.runCoreWebVitalsTests()">Measure Core Web Vitals</button>
                </div>
                
                <!-- Resource Analysis Tab -->
                <div id="resources-tab" class="tab-content">
                    <div class="test-section">
                        <h3>📦 Resource Loading</h3>
                        <div class="test-item">
                            <span class="test-name">Total Resources</span>
                            <div class="test-status status-pending" id="total-resources">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">JavaScript Bundle Size</span>
                            <div class="test-status status-pending" id="js-bundle-size">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">CSS Bundle Size</span>
                            <div class="test-status status-pending" id="css-bundle-size">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Image Optimization</span>
                            <div class="test-status status-pending" id="image-optimization">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Font Loading</span>
                            <div class="test-status status-pending" id="font-loading">Pending</div>
                        </div>
                    </div>
                    
                    <div class="waterfall-chart">
                        <h4>Resource Loading Waterfall</h4>
                        <div id="waterfall-container">
                            <div class="loading-indicator active">
                                <div class="spinner"></div>
                                <p>Analyzing resource loading...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="resource-table-container">
                        <table class="resource-table">
                            <thead>
                                <tr>
                                    <th>Resource</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Load Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="resource-table-body">
                                <!-- Resources will be populated here -->
                            </tbody>
                        </table>
                    </div>
                    
                    <button class="test-button" onclick="perfTests.analyzeResources()">Analyze Resources</button>
                </div>
                
                <!-- Memory Usage Tab -->
                <div id="memory-tab" class="tab-content">
                    <div class="test-section">
                        <h3>🧠 Memory Performance</h3>
                        <div class="test-item">
                            <span class="test-name">JavaScript Heap Size</span>
                            <div class="test-status status-pending" id="heap-size">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Memory Usage</span>
                            <div class="test-status status-pending" id="memory-usage">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Memory Leaks</span>
                            <div class="test-status status-pending" id="memory-leaks">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Garbage Collection</span>
                            <div class="test-status status-pending" id="garbage-collection">Pending</div>
                        </div>
                    </div>
                    
                    <div class="memory-monitor">
                        <h4>Real-time Memory Usage</h4>
                        <div class="memory-chart">
                            <div class="memory-usage" id="memory-usage-bar" style="height: 0%; width: 100%;"></div>
                        </div>
                        <div class="metric-grid">
                            <div class="metric-card">
                                <div class="metric-label">Used</div>
                                <div class="metric-value" id="memory-used">--</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-label">Total</div>
                                <div class="metric-value" id="memory-total">--</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-label">Limit</div>
                                <div class="metric-value" id="memory-limit">--</div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="test-button" onclick="perfTests.testMemoryUsage()">Test Memory Usage</button>
                    <button class="test-button" onclick="perfTests.startMemoryMonitoring()">Start Monitoring</button>
                </div>
                
                <!-- Network Tab -->
                <div id="network-tab" class="tab-content">
                    <div class="test-section">
                        <h3>🌐 Network Performance</h3>
                        <div class="test-item">
                            <span class="test-name">Connection Type</span>
                            <div class="test-status status-pending" id="connection-type">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Effective Bandwidth</span>
                            <div class="test-status status-pending" id="bandwidth">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Round Trip Time</span>
                            <div class="test-status status-pending" id="rtt">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Cache Hit Rate</span>
                            <div class="test-status status-pending" id="cache-hit-rate">Pending</div>
                        </div>
                    </div>
                    
                    <div class="network-info">
                        <h4>Network Information</h4>
                        <div class="network-grid">
                            <div class="network-stat">
                                <div class="network-value" id="network-downlink">--</div>
                                <div class="network-label">Downlink (Mbps)</div>
                            </div>
                            <div class="network-stat">
                                <div class="network-value" id="network-rtt">--</div>
                                <div class="network-label">RTT (ms)</div>
                            </div>
                            <div class="network-stat">
                                <div class="network-value" id="network-type">--</div>
                                <div class="network-label">Connection</div>
                            </div>
                            <div class="network-stat">
                                <div class="network-value" id="network-savedata">--</div>
                                <div class="network-label">Save Data</div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="test-button" onclick="perfTests.testNetworkPerformance()">Test Network</button>
                </div>
                
                <!-- Optimization Tab -->
                <div id="optimization-tab" class="tab-content">
                    <div class="test-section">
                        <h3>🔧 Optimization Checks</h3>
                        <div class="test-item">
                            <span class="test-name">Image Compression</span>
                            <div class="test-status status-pending" id="image-compression">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">CSS Minification</span>
                            <div class="test-status status-pending" id="css-minification">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">JavaScript Minification</span>
                            <div class="test-status status-pending" id="js-minification">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">GZIP Compression</span>
                            <div class="test-status status-pending" id="gzip-compression">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Lazy Loading</span>
                            <div class="test-status status-pending" id="lazy-loading">Pending</div>
                        </div>
                        <div class="test-item">
                            <span class="test-name">Critical CSS</span>
                            <div class="test-status status-pending" id="critical-css">Pending</div>
                        </div>
                    </div>
                    
                    <button class="test-button" onclick="perfTests.runOptimizationTests()">Run Optimization Tests</button>
                </div>
                
                <!-- Global Actions -->
                <div style="margin: 20px 0; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
                    <button class="test-button" onclick="perfTests.runAllTests()">🚀 Run All Performance Tests</button>
                    <button class="test-button" onclick="perfTests.generateReport()">📊 Generate Report</button>
                    <button class="test-button" onclick="perfTests.clearResults()">🗑️ Clear Results</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }
    
    setupPerformanceObservers() {
        // Performance Observer for Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // Largest Contentful Paint
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.testResults.metrics.LCP = lastEntry.startTime;
                    this.updateMetricCard('lcp', lastEntry.startTime, this.thresholds.LCP);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.name === 'first-input') {
                            this.testResults.metrics.FID = entry.processingStart - entry.startTime;
                            this.updateMetricCard('fid', entry.processingStart - entry.startTime, this.thresholds.FID);
                        }
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                
                // Cumulative Layout Shift
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.testResults.metrics.CLS = clsValue;
                    this.updateMetricCard('cls', clsValue, this.thresholds.CLS);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
            } catch (e) {
                console.warn('Performance Observer not fully supported:', e);
            }
        }
    }
    
    collectBasicMetrics() {
        // Navigation timing
        if (performance.timing) {
            const timing = performance.timing;
            this.navigationData = {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                ttfb: timing.responseStart - timing.navigationStart,
                connectTime: timing.connectEnd - timing.connectStart,
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart
            };
        }
        
        // Paint timing
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.testResults.metrics.FCP = entry.startTime;
                    this.updateMetricCard('fcp', entry.startTime, this.thresholds.FCP);
                }
            });
        }
    }
    
    startResourceMonitoring() {
        // Monitor resource loading
        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            this.resourceData = resources.map(resource => ({
                name: resource.name,
                type: this.getResourceType(resource.name, resource.initiatorType),
                size: resource.transferSize || resource.encodedBodySize || 0,
                duration: resource.duration,
                startTime: resource.startTime
            }));
        }
    }
    
    getResourceType(url, initiatorType) {
        if (initiatorType === 'img') return 'image';
        if (initiatorType === 'script') return 'script';
        if (initiatorType === 'link') return 'stylesheet';
        if (url.includes('.woff') || url.includes('.ttf')) return 'font';
        if (url.includes('.json') || url.includes('/api/')) return 'fetch';
        return 'other';
    }
    
    updateMetricCard(metric, value, threshold) {
        const card = document.getElementById(`${metric}-card`);
        const valueElement = document.getElementById(`${metric}-value`);
        
        if (!valueElement) return;
        
        let displayValue, status;
        
        if (metric === 'cls') {
            displayValue = value.toFixed(3);
            status = value <= threshold ? 'excellent' : value <= threshold * 2 ? 'good' : 'poor';
        } else {
            displayValue = value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(1)}s`;
            status = value <= threshold ? 'excellent' : value <= threshold * 1.5 ? 'good' : 'poor';
        }
        
        valueElement.textContent = displayValue;
        valueElement.className = `metric-value ${status}`;
        
        if (card) {
            card.className = `metric-card ${status}`;
        }
        
        this.updateOverallScore();
    }
    
    updateOverallScore() {
        const metrics = this.testResults.metrics;
        let score = 100;
        let count = 0;
        
        // Calculate score based on Core Web Vitals
        if (metrics.LCP) {
            score += metrics.LCP <= this.thresholds.LCP ? 0 : -15;
            count++;
        }
        
        if (metrics.FID) {
            score += metrics.FID <= this.thresholds.FID ? 0 : -15;
            count++;
        }
        
        if (metrics.CLS !== undefined) {
            score += metrics.CLS <= this.thresholds.CLS ? 0 : -15;
            count++;
        }
        
        if (metrics.FCP) {
            score += metrics.FCP <= this.thresholds.FCP ? 0 : -10;
            count++;
        }
        
        // Add navigation metrics
        if (this.navigationData) {
            score += this.navigationData.loadTime <= this.thresholds.loadTime ? 0 : -10;
            score += this.navigationData.domReady <= this.thresholds.domReady ? 0 : -10;
            count += 2;
        }
        
        const finalScore = Math.max(0, Math.min(100, score));
        const scoreElement = document.getElementById('overall-score');
        
        if (scoreElement) {
            scoreElement.textContent = Math.round(finalScore);
            scoreElement.className = finalScore >= 90 ? 'score-value excellent' :
                                   finalScore >= 70 ? 'score-value good' : 'score-value poor';
        }
    }
    
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.perf-tab').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Activate corresponding button
        const buttons = document.querySelectorAll('.perf-tab');
        buttons.forEach((button, index) => {
            if (button.textContent.toLowerCase().includes(tabName.toLowerCase())) {
                button.classList.add('active');
            }
        });
    }
    
    updateTestStatus(testId, status, value = '') {
        const statusElement = document.getElementById(testId);
        if (statusElement) {
            const statusText = status === true ? 'PASS' : 
                              status === false ? 'FAIL' : 
                              status === 'warning' ? 'WARN' : value || 'PENDING';
            
            statusElement.textContent = statusText;
            statusElement.className = `test-status status-${status === true ? 'pass' : 
                                      status === false ? 'fail' : 
                                      status === 'warning' ? 'warning' : 'pending'}`;
            
            if (status === true) {
                this.testResults.passed++;
            } else if (status === false) {
                this.testResults.failed++;
            } else if (status === 'warning') {
                this.testResults.warnings++;
            }
            
            if (status !== 'pending') {
                this.testResults.total++;
            }
        }
    }
    
    async runCoreWebVitalsTests() {
        console.log('⚡ Running Core Web Vitals Tests...');
        
        // Test page load time
        if (this.navigationData) {
            const loadTime = this.navigationData.loadTime;
            this.updateTestStatus('page-load', loadTime <= this.thresholds.loadTime, 
                loadTime < 1000 ? `${Math.round(loadTime)}ms` : `${(loadTime / 1000).toFixed(1)}s`);
            
            // Test DOM ready time
            const domReady = this.navigationData.domReady;
            this.updateTestStatus('dom-loaded', domReady <= this.thresholds.domReady,
                domReady < 1000 ? `${Math.round(domReady)}ms` : `${(domReady / 1000).toFixed(1)}s`);
            
            // Test TTFB
            const ttfb = this.navigationData.ttfb;
            this.updateTestStatus('ttfb', ttfb <= 600, // 600ms threshold for TTFB
                ttfb < 1000 ? `${Math.round(ttfb)}ms` : `${(ttfb / 1000).toFixed(1)}s`);
        }
        
        // Test render blocking resources
        const renderBlockingResources = this.resourceData.filter(resource => 
            resource.type === 'stylesheet' || 
            (resource.type === 'script' && !resource.name.includes('async') && !resource.name.includes('defer'))
        );
        
        this.updateTestStatus('render-blocking', renderBlockingResources.length <= 3,
            `${renderBlockingResources.length} resources`);
        
        // Re-collect paint metrics
        this.collectBasicMetrics();
    }
    
    analyzeResources() {
        console.log('📦 Analyzing Resources...');
        
        const totalResources = this.resourceData.length;
        this.updateTestStatus('total-resources', totalResources <= this.thresholds.resourceCount,
            `${totalResources} resources`);
        
        // Analyze JavaScript bundle size
        const jsResources = this.resourceData.filter(r => r.type === 'script');
        const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0) / 1024; // KB
        this.updateTestStatus('js-bundle-size', totalJSSize <= this.thresholds.bundleSize,
            `${Math.round(totalJSSize)}KB`);
        
        // Analyze CSS bundle size
        const cssResources = this.resourceData.filter(r => r.type === 'stylesheet');
        const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0) / 1024; // KB
        this.updateTestStatus('css-bundle-size', totalCSSSize <= this.thresholds.bundleSize / 2,
            `${Math.round(totalCSSSize)}KB`);
        
        // Analyze images
        const imageResources = this.resourceData.filter(r => r.type === 'image');
        const avgImageSize = imageResources.length > 0 ? 
            imageResources.reduce((sum, r) => sum + r.size, 0) / imageResources.length / 1024 : 0;
        this.updateTestStatus('image-optimization', avgImageSize <= this.thresholds.imageOptimization,
            `${Math.round(avgImageSize)}KB avg`);
        
        // Test font loading
        const fontResources = this.resourceData.filter(r => r.type === 'font');
        this.updateTestStatus('font-loading', fontResources.length <= 4,
            `${fontResources.length} fonts`);
        
        // Update waterfall chart
        this.updateWaterfallChart();
        
        // Update resource table
        this.updateResourceTable();
    }
    
    updateWaterfallChart() {
        const container = document.getElementById('waterfall-container');
        if (!container) return;
        
        const maxDuration = Math.max(...this.resourceData.map(r => r.startTime + r.duration));
        
        container.innerHTML = '';
        
        this.resourceData.slice(0, 10).forEach(resource => { // Show top 10 resources
            const item = document.createElement('div');
            item.className = 'waterfall-item';
            
            const fileName = resource.name.split('/').pop() || resource.name;
            const shortName = fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName;
            
            item.innerHTML = `
                <div class="waterfall-label">${shortName}</div>
                <div class="waterfall-bar">
                    <div class="waterfall-fill" style="width: ${((resource.startTime + resource.duration) / maxDuration) * 100}%"></div>
                </div>
                <div class="waterfall-time">${Math.round(resource.duration)}ms</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    updateResourceTable() {
        const tbody = document.getElementById('resource-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.resourceData.slice(0, 20).forEach(resource => { // Show top 20 resources
            const row = tbody.insertRow();
            const fileName = resource.name.split('/').pop() || resource.name;
            const shortName = fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName;
            
            row.innerHTML = `
                <td title="${resource.name}">${shortName}</td>
                <td>${resource.type}</td>
                <td>${resource.size > 0 ? Math.round(resource.size / 1024) + 'KB' : '--'}</td>
                <td>${Math.round(resource.duration)}ms</td>
                <td><span class="status-pass">OK</span></td>
            `;
        });
    }
    
    testMemoryUsage() {
        console.log('🧠 Testing Memory Usage...');
        
        if (performance.memory) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
            
            // Update memory display
            document.getElementById('memory-used').textContent = `${usedMB}MB`;
            document.getElementById('memory-total').textContent = `${totalMB}MB`;
            document.getElementById('memory-limit').textContent = `${limitMB}MB`;
            
            // Update memory usage bar
            const usagePercentage = (usedMB / limitMB) * 100;
            document.getElementById('memory-usage-bar').style.height = `${usagePercentage}%`;
            
            // Test thresholds
            this.updateTestStatus('heap-size', usedMB <= this.thresholds.memoryUsage, `${usedMB}MB`);
            this.updateTestStatus('memory-usage', usagePercentage <= 80, `${Math.round(usagePercentage)}%`);
            
            // Basic memory leak detection (simplified)
            this.testMemoryLeaks();
        } else {
            this.updateTestStatus('heap-size', 'warning', 'Not available');
            this.updateTestStatus('memory-usage', 'warning', 'Not available');
        }
        
        this.updateTestStatus('garbage-collection', 'warning', 'Manual check required');
    }
    
    testMemoryLeaks() {
        // Simple memory leak detection
        let initialMemory = 0;
        let finalMemory = 0;
        
        if (performance.memory) {
            initialMemory = performance.memory.usedJSHeapSize;
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            setTimeout(() => {
                finalMemory = performance.memory.usedJSHeapSize;
                const memoryGrowth = finalMemory - initialMemory;
                const hasLeak = memoryGrowth > 1024 * 1024; // 1MB growth
                
                this.updateTestStatus('memory-leaks', !hasLeak, 
                    hasLeak ? 'Potential leak' : 'No leaks detected');
            }, 1000);
        }
    }
    
    startMemoryMonitoring() {
        if (!performance.memory) {
            console.warn('Memory API not available');
            return;
        }
        
        const updateMemoryDisplay = () => {
            this.testMemoryUsage();
        };
        
        // Update memory display every 2 seconds
        setInterval(updateMemoryDisplay, 2000);
        updateMemoryDisplay();
    }
    
    testNetworkPerformance() {
        console.log('🌐 Testing Network Performance...');
        
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Update network display
            document.getElementById('network-downlink').textContent = 
                connection.downlink ? `${connection.downlink}` : '--';
            document.getElementById('network-rtt').textContent = 
                connection.rtt ? `${connection.rtt}` : '--';
            document.getElementById('network-type').textContent = 
                connection.effectiveType || '--';
            document.getElementById('network-savedata').textContent = 
                connection.saveData ? 'Yes' : 'No';
            
            // Test connection quality
            this.updateTestStatus('connection-type', true, connection.effectiveType || 'Unknown');
            this.updateTestStatus('bandwidth', connection.downlink >= 1, 
                connection.downlink ? `${connection.downlink}Mbps` : 'Unknown');
            this.updateTestStatus('rtt', connection.rtt <= 200, 
                connection.rtt ? `${connection.rtt}ms` : 'Unknown');
        } else {
            this.updateTestStatus('connection-type', 'warning', 'Not available');
            this.updateTestStatus('bandwidth', 'warning', 'Not available');
            this.updateTestStatus('rtt', 'warning', 'Not available');
        }
        
        // Test cache hit rate (simplified)
        const cachedResources = this.resourceData.filter(r => r.duration < 10); // Very fast = likely cached
        const cacheHitRate = this.resourceData.length > 0 ? 
            cachedResources.length / this.resourceData.length : 0;
        
        this.updateTestStatus('cache-hit-rate', cacheHitRate >= this.thresholds.cacheHitRate,
            `${Math.round(cacheHitRate * 100)}%`);
    }
    
    runOptimizationTests() {
        console.log('🔧 Running Optimization Tests...');
        
        // Test image compression (check file sizes)
        const images = this.resourceData.filter(r => r.type === 'image');
        const wellOptimizedImages = images.filter(img => img.size <= this.thresholds.imageOptimization * 1024);
        const imageOptimization = images.length === 0 || wellOptimizedImages.length / images.length >= 0.8;
        
        this.updateTestStatus('image-compression', imageOptimization,
            `${wellOptimizedImages.length}/${images.length} optimized`);
        
        // Test CSS minification (check if stylesheets are minified)
        const cssResources = this.resourceData.filter(r => r.type === 'stylesheet');
        const minifiedCSS = cssResources.some(css => css.name.includes('.min.') || css.size < 50000);
        this.updateTestStatus('css-minification', minifiedCSS || cssResources.length === 0,
            minifiedCSS ? 'Detected' : 'Not detected');
        
        // Test JavaScript minification
        const jsResources = this.resourceData.filter(r => r.type === 'script');
        const minifiedJS = jsResources.some(js => js.name.includes('.min.') || js.size < 100000);
        this.updateTestStatus('js-minification', minifiedJS || jsResources.length === 0,
            minifiedJS ? 'Detected' : 'Not detected');
        
        // Test GZIP compression (check response headers if possible)
        this.updateTestStatus('gzip-compression', 'warning', 'Manual verification required');
        
        // Test lazy loading (check for loading="lazy" attributes)
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const allImages = document.querySelectorAll('img');
        const hasLazyLoading = allImages.length === 0 || lazyImages.length > 0;
        
        this.updateTestStatus('lazy-loading', hasLazyLoading,
            `${lazyImages.length}/${allImages.length} images`);
        
        // Test critical CSS (simplified check)
        const hasInlineCSS = document.querySelector('style') !== null;
        this.updateTestStatus('critical-css', hasInlineCSS,
            hasInlineCSS ? 'Detected' : 'Not detected');
    }
    
    async runAllTests() {
        console.log('🚀 Running all performance tests...');
        
        // Reset results
        this.testResults = { passed: 0, failed: 0, warnings: 0, total: 0, metrics: {} };
        
        // Run all test suites
        await this.runCoreWebVitalsTests();
        await this.sleep(1000);
        
        this.analyzeResources();
        await this.sleep(1000);
        
        this.testMemoryUsage();
        await this.sleep(1000);
        
        this.testNetworkPerformance();
        await this.sleep(1000);
        
        this.runOptimizationTests();
        
        console.log('Performance tests completed:', this.testResults);
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.testResults.metrics,
            navigation: this.navigationData,
            resources: {
                total: this.resourceData.length,
                byType: this.getResourceBreakdown(),
                totalSize: this.getTotalResourceSize()
            },
            results: this.testResults,
            recommendations: this.generateRecommendations()
        };
        
        // Create downloadable report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Performance report generated');
    }
    
    getResourceBreakdown() {
        const breakdown = {};
        this.resourceTypes.forEach(type => {
            breakdown[type] = this.resourceData.filter(r => r.type === type).length;
        });
        return breakdown;
    }
    
    getTotalResourceSize() {
        return this.resourceData.reduce((sum, r) => sum + r.size, 0);
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.metrics.LCP > this.thresholds.LCP) {
            recommendations.push('Optimize Largest Contentful Paint by reducing image sizes and server response times');
        }
        
        if (this.testResults.metrics.CLS > this.thresholds.CLS) {
            recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and ads');
        }
        
        if (this.navigationData && this.navigationData.loadTime > this.thresholds.loadTime) {
            recommendations.push('Reduce page load time by optimizing resources and enabling compression');
        }
        
        const jsSize = this.resourceData.filter(r => r.type === 'script')
                                       .reduce((sum, r) => sum + r.size, 0) / 1024;
        if (jsSize > this.thresholds.bundleSize) {
            recommendations.push('Reduce JavaScript bundle size through code splitting and tree shaking');
        }
        
        return recommendations;
    }
    
    clearResults() {
        this.testResults = { passed: 0, failed: 0, warnings: 0, total: 0, metrics: {} };
        
        // Reset all status indicators
        document.querySelectorAll('.test-status').forEach(status => {
            status.textContent = 'Pending';
            status.className = 'test-status status-pending';
        });
        
        // Reset metric cards
        document.querySelectorAll('.metric-value').forEach(value => {
            value.textContent = '--';
            value.className = 'metric-value';
        });
        
        document.querySelectorAll('.metric-card').forEach(card => {
            card.className = 'metric-card';
        });
        
        // Reset overall score
        const scoreElement = document.getElementById('overall-score');
        if (scoreElement) {
            scoreElement.textContent = '--';
            scoreElement.className = 'score-value';
        }
        
        console.log('Performance test results cleared');
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API
    getTestResults() {
        return this.testResults;
    }
    
    getResourceData() {
        return this.resourceData;
    }
    
    getNavigationData() {
        return this.navigationData;
    }
    
    getCoreWebVitals() {
        return {
            LCP: this.testResults.metrics.LCP,
            FID: this.testResults.metrics.FID,
            CLS: this.testResults.metrics.CLS,
            FCP: this.testResults.metrics.FCP
        };
    }
}

// Auto-initialize if not in test environment
let perfTests;
if (typeof window !== 'undefined' && !window.perfTestsDisabled) {
    perfTests = new PerformanceTestSuite();
}

// Export for testing frameworks
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceTestSuite;
}