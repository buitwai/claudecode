/**
 * AutoZone Claude Code Training Exercise Library
 * Interactive coding challenges and hands-on exercises
 * 
 * This library provides structured coding exercises for AutoZone developers
 * to practice real-world scenarios using Claude Code
 */

class AutoZoneExerciseLibrary {
    constructor() {
        this.exercises = {
            ecommerce: this.getEcommerceExercises(),
            storeOps: this.getStoreOpsExercises(),
            analytics: this.getAnalyticsExercises(),
            modernization: this.getModernizationExercises(),
            blackFriday: this.getBlackFridayExercises(),
            newStore: this.getNewStoreExercises()
        };
        
        this.difficulty = {
            BEGINNER: 'beginner',
            INTERMEDIATE: 'intermediate',
            ADVANCED: 'advanced'
        };
        
        this.timeEstimate = {
            QUICK: '30-60 min',
            MEDIUM: '2-4 hours',
            DEEP: '4-8 hours',
            PROJECT: '1-3 days'
        };
    }

    /**
     * E-commerce Platform Exercises
     */
    getEcommerceExercises() {
        return [
            {
                id: 'ecom-001',
                title: 'Product Search Autocomplete',
                difficulty: this.difficulty.BEGINNER,
                timeEstimate: this.timeEstimate.QUICK,
                category: 'Frontend',
                description: 'Implement intelligent search suggestions for AutoZone\'s product catalog',
                objectives: [
                    'Build autocomplete component with debounced API calls',
                    'Include product categories and vehicle compatibility',
                    'Handle edge cases like typos and empty results',
                    'Add keyboard navigation and accessibility'
                ],
                claudePrompt: `
Build an intelligent product search autocomplete for AutoZone's e-commerce site:

Requirements:
- Real-time search suggestions as user types
- Include product names, brands, and categories
- Vehicle-specific results (e.g., "brake pads 2018 Honda Civic")
- Handle misspellings and partial matches
- Keyboard navigation (arrow keys, enter, escape)
- Mobile-friendly touch interface
- Performance optimization (debouncing, caching)

Technical specs:
- React component with TypeScript
- Elasticsearch integration for search
- Local state management
- Accessibility compliant (ARIA labels)
- Responsive design for mobile/desktop

Sample data structure for suggestions:
{
  "suggestions": [
    {
      "type": "product",
      "name": "Duralast Brake Pads",
      "category": "Brakes",
      "partNumber": "BP123",
      "compatibility": ["2018 Honda Civic"]
    },
    {
      "type": "category", 
      "name": "Brake Pads",
      "productCount": 245
    }
  ]
}
                `,
                starterFiles: [
                    'components/ProductSearch.tsx',
                    'hooks/useSearch.ts',
                    'types/Search.ts',
                    'api/searchApi.ts'
                ],
                testCriteria: [
                    'Search suggestions appear within 300ms',
                    'Handles 1000+ concurrent users',
                    'Mobile responsive on all devices',
                    'Accessibility score 95+ on Lighthouse'
                ]
            },
            
            {
                id: 'ecom-002',
                title: 'Shopping Cart with Vehicle Context',
                difficulty: this.difficulty.INTERMEDIATE,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'Full Stack',
                description: 'Build intelligent shopping cart that tracks vehicle compatibility',
                objectives: [
                    'Implement persistent cart across sessions',
                    'Vehicle compatibility checking',
                    'Intelligent part recommendations',
                    'Inventory availability integration'
                ],
                claudePrompt: `
Create an intelligent shopping cart for AutoZone that maintains vehicle context:

Core features:
1. Add/remove/update cart items
2. Vehicle compatibility warnings
3. Related product suggestions
4. Real-time inventory checking
5. Price calculation with taxes/shipping
6. Save cart for logged-in users
7. Guest cart persistence

Vehicle context integration:
- Customer selects their vehicle (Year/Make/Model/Engine)
- Cart validates all items are compatible
- Show warnings for incompatible parts
- Suggest correct alternatives
- Bundle recommendations (brake pads + rotors)

Technical implementation:
- Redux for state management
- Local storage for guest carts
- Database persistence for user carts
- Real-time inventory API integration
- Vehicle compatibility database

API endpoints needed:
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove
- GET /api/cart/compatibility
- GET /api/cart/recommendations

Handle edge cases:
- Item becomes out of stock while in cart
- Price changes during checkout
- Vehicle compatibility changes
- Session timeout and recovery
                `,
                starterFiles: [
                    'components/ShoppingCart.tsx',
                    'store/cartSlice.ts',
                    'api/cartApi.ts',
                    'services/compatibilityService.ts',
                    'types/Cart.ts'
                ],
                testCriteria: [
                    'Cart persists across browser sessions',
                    'Vehicle compatibility warnings accurate',
                    'Real-time inventory updates',
                    'Handles 10,000+ SKUs efficiently'
                ]
            },

            {
                id: 'ecom-003',
                title: 'Dynamic Product Recommendations',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.DEEP,
                category: 'Machine Learning',
                description: 'Implement ML-powered product recommendation engine',
                objectives: [
                    'Collaborative filtering for similar customers',
                    'Content-based filtering for product attributes',
                    'Real-time personalization',
                    'A/B testing framework for recommendations'
                ],
                claudePrompt: `
Build ML-powered product recommendation engine for AutoZone:

Recommendation types:
1. "Customers who bought this also bought"
2. "Complete your repair project" (bundled items)
3. "Upgrade options" (premium alternatives)
4. "Frequently bought together"
5. "Based on your vehicle" (compatibility-driven)

Machine learning approaches:
- Collaborative filtering (user-item matrix)
- Content-based filtering (product attributes)
- Matrix factorization (SVD, NMF)
- Deep learning embeddings
- Real-time online learning

Data sources:
- Purchase history
- Browse behavior
- Cart additions/removals
- Product catalog attributes
- Vehicle compatibility data
- Seasonal patterns

Technical architecture:
- Python/TensorFlow for ML models
- Apache Kafka for real-time events
- Redis for fast lookups
- PostgreSQL for historical data
- REST API for recommendations

Performance requirements:
- <100ms recommendation response time
- Update models with new data hourly
- Handle 50,000+ concurrent users
- A/B testing for recommendation algorithms

Implement recommendation service with model training pipeline, real-time serving, and comprehensive analytics.
                `,
                starterFiles: [
                    'ml/recommendation_model.py',
                    'api/recommendationApi.ts',
                    'services/RecommendationService.ts',
                    'components/ProductRecommendations.tsx'
                ],
                testCriteria: [
                    'Recommendations improve conversion by 15%',
                    'Response time <100ms at 95th percentile',
                    'Model accuracy >80% on test set',
                    'Successfully A/B tests different algorithms'
                ]
            },

            {
                id: 'ecom-004',
                title: 'Fraud Detection System',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.PROJECT,
                category: 'Security',
                description: 'Real-time fraud detection for payment processing',
                objectives: [
                    'Machine learning fraud scoring',
                    'Real-time transaction analysis',
                    'Risk-based authentication',
                    'Manual review workflow'
                ],
                claudePrompt: `
Implement real-time fraud detection for AutoZone payments:

Risk factors to analyze:
1. Transaction velocity (multiple orders quickly)
2. Geographic anomalies (IP vs billing address)
3. Device fingerprinting and behavior
4. High-value orders from new accounts
5. Unusual product combinations
6. Payment method patterns

ML model features:
- Customer profile (age, history, location)
- Transaction details (amount, items, time)
- Device characteristics (browser, OS, screen)
- Network information (IP, VPN detection)
- Behavioral patterns (time between clicks)

Implementation:
- Real-time scoring pipeline
- Rule engine for immediate blocking
- Machine learning models for risk scoring
- Manual review queue for borderline cases
- Feedback loop for model improvement

Architecture:
- Apache Kafka for real-time events
- Python/scikit-learn for ML models
- Redis for feature caching
- PostgreSQL for historical data
- Node.js API for real-time scoring

Business requirements:
- <0.1% false positive rate
- >95% fraud detection accuracy
- <500ms scoring time
- Configurable risk thresholds

Build comprehensive fraud prevention system with real-time scoring, review workflows, and continuous model improvement.
                `,
                starterFiles: [
                    'ml/fraud_detection_model.py',
                    'services/FraudDetectionService.ts',
                    'api/fraudApi.ts',
                    'workflows/ManualReviewWorkflow.ts'
                ],
                testCriteria: [
                    'False positive rate <0.1%',
                    'Fraud detection rate >95%',
                    'Scoring latency <500ms',
                    'Reduces chargebacks by 80%'
                ]
            }
        ];
    }

    /**
     * Store Operations Exercises
     */
    getStoreOpsExercises() {
        return [
            {
                id: 'store-001',
                title: 'POS Interface Redesign',
                difficulty: this.difficulty.INTERMEDIATE,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'UI/UX',
                description: 'Modern touch-friendly POS interface for AutoZone stores',
                objectives: [
                    'Touch-optimized interface design',
                    'Barcode scanning integration',
                    'Offline capability for network outages',
                    'Accessibility for all users'
                ],
                claudePrompt: `
Design modern POS interface for AutoZone store associates:

User requirements:
- Fast transaction processing (<30 seconds average)
- Touch-friendly for tablet interface
- Keyboard shortcuts for power users
- Clear visual feedback and error handling
- Support for various transaction types

Transaction types to handle:
1. Regular retail sales
2. Commercial account sales (NET 30 terms)
3. Returns and exchanges
4. Installation service booking
5. Warranty lookups and registrations
6. Special orders and quotes

Key features:
- Barcode scanning with instant product lookup
- Vehicle compatibility checking
- Customer lookup and history
- Multiple payment methods
- Receipt printing and email
- Offline mode with sync when online

Technical requirements:
- React with TypeScript
- Progressive Web App (PWA)
- Local database for offline operation
- Real-time inventory integration
- Responsive design for tablets

UI/UX considerations:
- Large touch targets (44px minimum)
- High contrast for visibility
- Minimal clicks to complete transactions
- Clear navigation and workflow
- Error prevention and recovery

Build modern POS interface that improves efficiency while handling all AutoZone business requirements.
                `,
                starterFiles: [
                    'components/POSInterface.tsx',
                    'components/ProductLookup.tsx',
                    'components/PaymentProcessing.tsx',
                    'hooks/useOfflineSync.ts'
                ],
                testCriteria: [
                    'Transaction time reduced by 30%',
                    'Accessibility score 95+',
                    'Works offline for 4+ hours',
                    'Error rate <1% in usability testing'
                ]
            },

            {
                id: 'store-002',
                title: 'Real-time Store Locator',
                difficulty: this.difficulty.BEGINNER,
                timeEstimate: this.timeEstimate.QUICK,
                category: 'Frontend',
                description: 'Interactive store locator with live inventory',
                objectives: [
                    'Google Maps integration',
                    'Real-time inventory checking',
                    'Store hours and services display',
                    'Mobile-first responsive design'
                ],
                claudePrompt: `
Build interactive store locator for AutoZone customers:

Core functionality:
1. Find stores near customer location
2. Display real-time inventory for specific parts
3. Show store hours, phone, and services
4. Get directions and estimated drive time
5. Filter by services (installation, commercial)

Features:
- Geolocation API for current location
- Search by ZIP code or address
- Interactive map with store markers
- Store detail cards with key information
- Real-time inventory status indicators
- Click-to-call phone numbers
- Integration with navigation apps

Technical implementation:
- Google Maps JavaScript API
- Geolocation API for user location
- Real-time inventory API integration
- Responsive design for mobile
- Performance optimization for map rendering

Store information to display:
- Address and phone number
- Hours of operation (including holidays)
- Services offered (installation, tool rental)
- Current inventory for searched parts
- Customer ratings and reviews
- Parking and accessibility information

Handle edge cases:
- Location permission denied
- No stores in search radius
- Inventory API unavailable
- Slow network connections

Create user-friendly store locator that helps customers find exactly what they need.
                `,
                starterFiles: [
                    'components/StoreLocator.tsx',
                    'components/StoreMap.tsx',
                    'services/mapsService.ts',
                    'hooks/useGeolocation.ts'
                ],
                testCriteria: [
                    'Loads store data in <2 seconds',
                    'Accurate inventory information',
                    'Mobile responsive design',
                    'Works offline with cached data'
                ]
            },

            {
                id: 'store-003',
                title: 'Staff Scheduling Optimization',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.DEEP,
                category: 'Optimization',
                description: 'AI-powered staff scheduling system',
                objectives: [
                    'Constraint optimization for scheduling',
                    'Employee preference integration',
                    'Labor cost optimization',
                    'Compliance with labor laws'
                ],
                claudePrompt: `
Create intelligent staff scheduling system for AutoZone stores:

Scheduling constraints:
1. Minimum staffing levels (2 people minimum)
2. Required skills coverage (certified mechanics)
3. Employee availability and preferences
4. Labor law compliance (max hours, breaks)
5. Overtime budget limits
6. Fair distribution of preferred shifts

Optimization objectives:
- Minimize labor costs
- Maximize employee satisfaction
- Ensure adequate customer service coverage
- Balance workload distribution
- Reduce scheduling conflicts

AI/ML components:
- Traffic prediction for optimal staffing
- Employee performance correlation with schedules
- Optimization algorithms (genetic algorithm, linear programming)
- Learning from schedule effectiveness

Features:
- Automated schedule generation
- Shift swap requests and approvals
- Time-off request management
- Overtime alerts and optimization
- Schedule conflict resolution
- Mobile app for employees

Technical implementation:
- Python optimization libraries (PULP, OR-Tools)
- Database for employee data and constraints
- REST API for schedule management
- React frontend for managers
- Mobile app for employees

Business rules:
- No employee works more than 40 hours/week
- Minimum 8 hours between shifts
- At least one certified mechanic per shift
- Coverage for all operating hours
- Fair rotation of weekend shifts

Build comprehensive scheduling system that balances business needs with employee satisfaction.
                `,
                starterFiles: [
                    'optimization/scheduler.py',
                    'api/schedulingApi.ts',
                    'components/ScheduleManager.tsx',
                    'mobile/EmployeeScheduleApp.tsx'
                ],
                testCriteria: [
                    'Reduces scheduling time by 75%',
                    'Improves employee satisfaction scores',
                    'Optimizes labor costs within budget',
                    'Maintains required coverage levels'
                ]
            }
        ];
    }

    /**
     * Analytics and Business Intelligence Exercises
     */
    getAnalyticsExercises() {
        return [
            {
                id: 'analytics-001',
                title: 'Sales Dashboard for Executives',
                difficulty: this.difficulty.INTERMEDIATE,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'Data Visualization',
                description: 'Real-time executive dashboard with key business metrics',
                objectives: [
                    'Real-time data visualization',
                    'Interactive drilling capabilities',
                    'Mobile-responsive design',
                    'Automated alerting system'
                ],
                claudePrompt: `
Build executive sales dashboard for AutoZone leadership:

Key metrics to display:
1. Real-time sales vs targets (daily/monthly/yearly)
2. Top performing products and categories
3. Regional and store performance comparisons
4. Channel performance (retail, commercial, online)
5. Customer acquisition and retention metrics
6. Profit margin analysis

Visualizations needed:
- Sales speedometer with target indicators
- Interactive heat map of store performance
- Trend charts for historical comparisons
- Top/bottom performers ranking tables
- Geographic sales distribution map
- Product category performance matrix

Technical requirements:
- React with D3.js for visualizations
- Real-time data updates (WebSocket)
- Responsive design for mobile/tablet
- Export capabilities (PDF, Excel)
- Drill-down functionality
- Performance optimization for large datasets

Data sources:
- POS transaction data (6,000+ stores)
- E-commerce sales data
- Commercial account sales
- Inventory and cost data
- Customer demographic data

Features:
- Auto-refresh every 15 minutes
- Customizable date ranges
- Alert system for target deviations
- Role-based access control
- Bookmark favorite views

Create comprehensive dashboard that provides actionable insights for executive decision-making.
                `,
                starterFiles: [
                    'components/ExecutiveDashboard.tsx',
                    'components/SalesSpeedometer.tsx',
                    'services/realtimeDataService.ts',
                    'utils/chartHelpers.ts'
                ],
                testCriteria: [
                    'Loads data in <3 seconds',
                    'Updates in real-time',
                    'Mobile responsive',
                    'Handles 1M+ data points'
                ]
            },

            {
                id: 'analytics-002',
                title: 'Customer Segmentation Engine',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.DEEP,
                category: 'Machine Learning',
                description: 'ML-powered customer segmentation and persona development',
                objectives: [
                    'Unsupervised learning for segmentation',
                    'Dynamic persona assignment',
                    'Actionable marketing insights',
                    'Segment performance tracking'
                ],
                claudePrompt: `
Build customer segmentation engine for AutoZone marketing:

Segmentation data sources:
- Purchase history and frequency
- Product categories and brands
- Average order value and margins
- Channel preferences (store vs online)
- Geographic and demographic data
- Seasonal buying patterns
- Customer service interactions

Expected customer segments:
1. DIY Enthusiasts (weekend projects, mid-range spend)
2. Professional Mechanics (frequent, high-value purchases)
3. Fleet Operators (bulk orders, commercial accounts)
4. Occasional Buyers (emergency repairs, price-sensitive)
5. Performance Enthusiasts (premium parts, modifications)

ML approach:
- K-means clustering for initial segmentation
- RFM analysis (Recency, Frequency, Monetary)
- Feature engineering for behavioral patterns
- Silhouette analysis for optimal cluster count
- Segment stability monitoring

Business applications:
- Personalized marketing campaigns
- Product recommendation tuning
- Inventory planning by segment
- Customer lifetime value prediction
- Retention strategy development

Technical implementation:
- Python with scikit-learn for ML
- Apache Spark for large-scale processing
- PostgreSQL for data storage
- REST API for segment lookup
- Dashboard for segment analysis

Deliverables:
- Segment definitions and characteristics
- Customer assignment API
- Marketing recommendation engine
- Performance tracking dashboard
- Automated segment refresh pipeline

Create comprehensive segmentation system that enables targeted marketing and personalized customer experiences.
                `,
                starterFiles: [
                    'ml/customer_segmentation.py',
                    'api/segmentationApi.ts',
                    'components/SegmentAnalysis.tsx',
                    'services/personalizationService.ts'
                ],
                testCriteria: [
                    'Identifies meaningful customer segments',
                    'Improves marketing campaign ROI',
                    'Processes customer base in <4 hours',
                    'Maintains segment stability >85%'
                ]
            },

            {
                id: 'analytics-003',
                title: 'Inventory Optimization Analytics',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.PROJECT,
                category: 'Operations Research',
                description: 'Advanced analytics for inventory optimization across stores',
                objectives: [
                    'Demand forecasting models',
                    'Multi-location optimization',
                    'Seasonal trend analysis',
                    'Cost-benefit optimization'
                ],
                claudePrompt: `
Build inventory optimization analytics for AutoZone:

Optimization objectives:
1. Minimize carrying costs
2. Maximize service levels (>98% fill rate)
3. Reduce stockouts and overstock
4. Optimize safety stock levels
5. Improve inventory turnover

Analytics components:
- Demand forecasting by SKU and location
- Seasonal pattern recognition
- Lead time variability analysis
- ABC/XYZ inventory classification
- Economic order quantity (EOQ) calculation
- Safety stock optimization

Machine learning models:
- Time series forecasting (ARIMA, Prophet)
- Demand sensing from external factors
- Anomaly detection for unusual patterns
- Clustering for similar products/stores
- Optimization algorithms for allocation

Data sources:
- Sales transaction history
- Inventory movements
- Supplier lead times
- Promotional calendar
- Weather and economic data
- Competitive pricing data

Key features:
- Store-specific demand patterns
- Product lifecycle management
- Seasonal adjustment factors
- Supplier performance integration
- Cost optimization algorithms
- Scenario planning capabilities

Technical architecture:
- Python for ML and optimization
- Apache Airflow for pipeline orchestration
- Time series databases for historical data
- Real-time streaming for current data
- Interactive dashboards for insights

Business impact:
- Reduce inventory costs by 15%
- Improve service levels to 98%+
- Decrease stockouts by 25%
- Optimize working capital usage

Create comprehensive inventory optimization system with predictive analytics and automated recommendations.
                `,
                starterFiles: [
                    'ml/demand_forecasting.py',
                    'optimization/inventory_optimizer.py',
                    'api/inventoryAnalyticsApi.ts',
                    'components/InventoryDashboard.tsx'
                ],
                testCriteria: [
                    'Reduces inventory costs by 15%',
                    'Improves service levels to 98%',
                    'Forecast accuracy >85%',
                    'Processes 1M+ SKUs efficiently'
                ]
            }
        ];
    }

    /**
     * Legacy System Modernization Exercises
     */
    getModernizationExercises() {
        return [
            {
                id: 'modern-001',
                title: 'API Gateway for Legacy Systems',
                difficulty: this.difficulty.INTERMEDIATE,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'System Integration',
                description: 'Create modern API layer for AS/400 mainframe systems',
                objectives: [
                    'REST API design for legacy systems',
                    'Authentication and rate limiting',
                    'Error handling and monitoring',
                    'Documentation and developer portal'
                ],
                claudePrompt: `
Build API gateway for AutoZone's AS/400 mainframe systems:

Legacy systems to wrap:
1. Inventory management (COBOL programs)
2. Customer data (DB2 databases)
3. Product catalog (hierarchical data)
4. Pricing engine (RPG programs)
5. Store operations (batch processes)

Modern API requirements:
- RESTful API design with OpenAPI specs
- JSON request/response format
- OAuth 2.0 authentication
- Rate limiting and throttling
- Comprehensive error handling
- Request/response logging
- Performance monitoring

API endpoints to create:
- GET /api/products/{sku}/inventory
- GET /api/customers/{id}/profile
- POST /api/orders
- GET /api/stores/{id}/hours
- GET /api/pricing/{sku}

Technical challenges:
- Mainframe connectivity (IBM MQ, CICS)
- Data format conversion (EBCDIC to ASCII)
- Performance optimization (caching)
- Error translation and handling
- Authentication bridge

Architecture:
- API Gateway (Kong or AWS API Gateway)
- Microservices for mainframe integration
- Redis for caching frequently accessed data
- PostgreSQL for API metadata
- ELK stack for logging and monitoring

Features:
- Developer portal with API documentation
- API key management
- Usage analytics and billing
- SLA monitoring and alerting
- Versioning and backward compatibility

Create production-ready API gateway that modernizes access to legacy systems while maintaining reliability and performance.
                `,
                starterFiles: [
                    'gateway/apiGateway.ts',
                    'services/mainframeConnector.ts',
                    'middleware/authMiddleware.ts',
                    'docs/apiDocumentation.yaml'
                ],
                testCriteria: [
                    'API response time <500ms',
                    'Handles 10,000+ requests/minute',
                    'Comprehensive API documentation',
                    'Zero downtime deployment'
                ]
            },

            {
                id: 'modern-002',
                title: 'Microservices Migration Strategy',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.PROJECT,
                category: 'Architecture',
                description: 'Strangler Fig pattern for gradual microservices migration',
                objectives: [
                    'Domain-driven design principles',
                    'Service boundary identification',
                    'Data migration strategies',
                    'Circuit breaker patterns'
                ],
                claudePrompt: `
Design microservices migration strategy for AutoZone monolith:

Current monolith structure:
- Inventory management module
- Customer management module
- Order processing module
- Product catalog module
- Pricing engine module
- Reporting module

Target microservices:
1. Inventory Service
2. Customer Service
3. Order Service
4. Product Service
5. Pricing Service
6. Notification Service

Migration approach (Strangler Fig pattern):
1. Identify service boundaries using Domain-Driven Design
2. Create new microservices alongside monolith
3. Route traffic gradually to new services
4. Maintain data synchronization during transition
5. Decommission monolith modules incrementally

Technical considerations:
- Service communication patterns (sync vs async)
- Data consistency and transaction management
- Service discovery and load balancing
- Monitoring and distributed tracing
- Security and authentication

Implementation plan:
Phase 1: Extract Inventory Service
- Create new service with PostgreSQL
- Implement dual-write pattern
- Route read operations to new service
- Validate data consistency

Phase 2: Extract Customer Service
- Migrate customer data
- Implement event-driven updates
- Update authentication flow

Phase 3: Extract Order Service
- Implement saga pattern for distributed transactions
- Handle order workflow across services

Tools and technologies:
- Docker and Kubernetes for containerization
- Service mesh (Istio) for communication
- Event streaming (Apache Kafka)
- Distributed tracing (Jaeger)
- API gateway for routing

Create comprehensive migration plan with risk mitigation, rollback strategies, and success metrics.
                `,
                starterFiles: [
                    'architecture/migrationPlan.md',
                    'services/inventoryService.ts',
                    'patterns/stranglerFig.ts',
                    'monitoring/serviceMonitoring.ts'
                ],
                testCriteria: [
                    'Zero downtime during migration',
                    'Maintains data consistency',
                    'Improves deployment frequency',
                    'Reduces system coupling'
                ]
            }
        ];
    }

    /**
     * Black Friday Preparation Exercises
     */
    getBlackFridayExercises() {
        return [
            {
                id: 'bf-001',
                title: 'Load Testing and Performance Optimization',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.DEEP,
                category: 'Performance',
                description: 'Prepare systems for 20x normal Black Friday traffic',
                objectives: [
                    'Load testing strategy and execution',
                    'Performance bottleneck identification',
                    'Auto-scaling configuration',
                    'Database optimization'
                ],
                claudePrompt: `
Prepare AutoZone systems for Black Friday traffic surge:

Expected load increase:
- Normal: 1,000 orders/hour
- Black Friday: 20,000 orders/hour
- Peak period: 8am-10am (50,000 concurrent users)
- Hot deals: Limited quantity items with high demand

Performance requirements:
- Page load time <2 seconds
- API response time <500ms
- Cart abandonment rate <15%
- Zero downtime during peak

Load testing strategy:
1. Baseline performance measurement
2. Gradual load increase testing
3. Spike testing for sudden traffic
4. Endurance testing for sustained load
5. Chaos engineering for failure scenarios

Areas to optimize:
- Database query performance
- CDN configuration for static assets
- Redis caching for frequently accessed data
- Auto-scaling policies for compute resources
- Load balancer configuration

Tools and technologies:
- Artillery.js or JMeter for load testing
- New Relic or DataDog for monitoring
- AWS Auto Scaling or Kubernetes HPA
- Redis for session and catalog caching
- CloudFront CDN for asset delivery

Critical scenarios to test:
- Homepage with promotional banners
- Product search with filtering
- Shopping cart and checkout process
- Payment processing pipeline
- Inventory availability checking

Optimization techniques:
- Database connection pooling
- Query optimization and indexing
- Microservice circuit breakers
- Graceful degradation strategies
- CDN cache warming

Create comprehensive performance testing suite and optimization plan for Black Friday readiness.
                `,
                starterFiles: [
                    'testing/loadTests.js',
                    'monitoring/performanceMonitoring.ts',
                    'optimization/cachingStrategy.ts',
                    'infrastructure/autoScaling.yaml'
                ],
                testCriteria: [
                    'Handles 50,000 concurrent users',
                    'Page load time <2 seconds',
                    'Zero downtime during testing',
                    'Auto-scales within 2 minutes'
                ]
            },

            {
                id: 'bf-002',
                title: 'Inventory Allocation for Flash Sales',
                difficulty: this.difficulty.ADVANCED,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'System Design',
                description: 'Fair allocation system for high-demand limited inventory',
                objectives: [
                    'Queue-based allocation system',
                    'Fairness algorithms',
                    'Real-time inventory tracking',
                    'Overflow handling strategies'
                ],
                claudePrompt: `
Design inventory allocation system for AutoZone's Black Friday flash sales:

Flash sale scenarios:
- 500 brake pad sets at 50% off (8am release)
- 1,000 car batteries at $49 each (10am release)
- 200 tool sets at 60% off (12pm release)

Challenges:
- High demand within seconds of release
- Fair allocation among customers
- Prevent overselling
- Handle system failures gracefully
- Customer frustration management

Allocation strategies:
1. Queue-based system (first-come, first-served)
2. Lottery system for fairness
3. Customer tier preferences (loyalty members)
4. Geographic distribution
5. Cart reservation with time limits

Technical implementation:
- Redis for real-time inventory tracking
- Message queues for order processing
- Distributed locks for inventory allocation
- WebSocket for real-time updates
- Circuit breakers for system protection

Features:
- Virtual waiting room for high demand
- Real-time inventory countdown
- Cart reservation (10-minute hold)
- Automatic overflow to similar products
- Customer notification system

System design:
- Load balancer with sticky sessions
- Microservice for allocation logic
- Event-driven architecture
- Database sharding for performance
- Monitoring and alerting

Fairness mechanisms:
- Maximum quantity per customer
- Prevent bot purchases
- CAPTCHA for human verification
- IP-based rate limiting
- Account verification

Build robust allocation system that handles flash sale demand while ensuring fair customer experience.
                `,
                starterFiles: [
                    'services/inventoryAllocation.ts',
                    'queues/orderQueue.ts',
                    'components/VirtualWaitingRoom.tsx',
                    'utils/fairnessAlgorithms.ts'
                ],
                testCriteria: [
                    'Allocates inventory fairly',
                    'Prevents overselling',
                    'Handles 10,000+ concurrent requests',
                    'Maintains system stability'
                ]
            }
        ];
    }

    /**
     * New Store Launch Exercises
     */
    getNewStoreExercises() {
        return [
            {
                id: 'store-launch-001',
                title: 'Store System Deployment Pipeline',
                difficulty: this.difficulty.INTERMEDIATE,
                timeEstimate: this.timeEstimate.MEDIUM,
                category: 'DevOps',
                description: 'Automated deployment system for new AutoZone store openings',
                objectives: [
                    'Infrastructure as Code',
                    'Automated configuration management',
                    'Health checks and monitoring',
                    'Rollback capabilities'
                ],
                claudePrompt: `
Create automated deployment pipeline for new AutoZone store openings:

Store technology stack:
- POS systems (tablets and terminals)
- Inventory management systems
- Customer WiFi network
- Security camera systems
- Installation bay equipment
- Digital signage displays

Deployment requirements:
1. Remote configuration of all systems
2. Automated software installation
3. Data synchronization with headquarters
4. Network connectivity testing
5. Security compliance verification
6. Staff training material deployment

Infrastructure components:
- Network setup and VLAN configuration
- Firewall rules and security policies
- Wi-Fi access point configuration
- Printer and scanner setup
- Credit card terminal activation
- Backup systems and UPS configuration

Automation tools:
- Ansible for configuration management
- Terraform for infrastructure provisioning
- Docker containers for application deployment
- Jenkins for CI/CD pipeline
- Monitoring with Prometheus/Grafana

Deployment process:
1. Pre-deployment validation
2. Infrastructure provisioning
3. Application deployment
4. Configuration verification
5. Data synchronization
6. Testing and validation
7. Go-live procedures

Monitoring and alerts:
- System health checks
- Network connectivity monitoring
- Application performance metrics
- Security compliance verification
- Automated alert escalation

Recovery procedures:
- Rollback mechanisms
- Disaster recovery plans
- Support escalation procedures
- Remote troubleshooting tools

Build comprehensive deployment system that enables rapid, reliable new store launches.
                `,
                starterFiles: [
                    'infrastructure/storeInfrastructure.tf',
                    'ansible/storePlaybook.yml',
                    'pipelines/deploymentPipeline.yaml',
                    'monitoring/storeHealthChecks.ts'
                ],
                testCriteria: [
                    'Deploys new store in <4 hours',
                    'Zero manual configuration steps',
                    'Comprehensive health monitoring',
                    'Reliable rollback capabilities'
                ]
            }
        ];
    }

    /**
     * Get exercises by category
     */
    getExercisesByCategory(category) {
        const allExercises = Object.values(this.exercises).flat();
        return allExercises.filter(exercise => 
            exercise.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get exercises by difficulty
     */
    getExercisesByDifficulty(difficulty) {
        const allExercises = Object.values(this.exercises).flat();
        return allExercises.filter(exercise => 
            exercise.difficulty === difficulty
        );
    }

    /**
     * Get exercises by time estimate
     */
    getExercisesByTime(timeEstimate) {
        const allExercises = Object.values(this.exercises).flat();
        return allExercises.filter(exercise => 
            exercise.timeEstimate === timeEstimate
        );
    }

    /**
     * Search exercises by keyword
     */
    searchExercises(keyword) {
        const allExercises = Object.values(this.exercises).flat();
        const searchTerm = keyword.toLowerCase();
        
        return allExercises.filter(exercise => 
            exercise.title.toLowerCase().includes(searchTerm) ||
            exercise.description.toLowerCase().includes(searchTerm) ||
            exercise.objectives.some(obj => obj.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Get random exercise
     */
    getRandomExercise() {
        const allExercises = Object.values(this.exercises).flat();
        const randomIndex = Math.floor(Math.random() * allExercises.length);
        return allExercises[randomIndex];
    }

    /**
     * Get exercise learning path
     */
    getLearningPath(userLevel = 'beginner') {
        const pathMap = {
            beginner: [
                'ecom-001', 'store-001', 'store-002', 'analytics-001'
            ],
            intermediate: [
                'ecom-002', 'store-003', 'analytics-002', 'modern-001'
            ],
            advanced: [
                'ecom-003', 'ecom-004', 'analytics-003', 'modern-002', 'bf-001'
            ]
        };

        const exerciseIds = pathMap[userLevel] || pathMap.beginner;
        const allExercises = Object.values(this.exercises).flat();
        
        return exerciseIds.map(id => 
            allExercises.find(exercise => exercise.id === id)
        ).filter(Boolean);
    }

    /**
     * Export exercises for external use
     */
    exportExercises() {
        return {
            metadata: {
                version: '1.0.0',
                totalExercises: Object.values(this.exercises).flat().length,
                categories: Object.keys(this.exercises),
                lastUpdated: new Date().toISOString()
            },
            exercises: this.exercises
        };
    }
}

// Initialize and export the exercise library
const autoZoneExerciseLibrary = new AutoZoneExerciseLibrary();

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = autoZoneExerciseLibrary;
} else if (typeof window !== 'undefined') {
    window.AutoZoneExerciseLibrary = autoZoneExerciseLibrary;
}

/**
 * Usage Examples:
 * 
 * // Get all e-commerce exercises
 * const ecommerceExercises = autoZoneExerciseLibrary.exercises.ecommerce;
 * 
 * // Get exercises by difficulty
 * const beginnerExercises = autoZoneExerciseLibrary.getExercisesByDifficulty('beginner');
 * 
 * // Search for specific exercises
 * const searchResults = autoZoneExerciseLibrary.searchExercises('inventory');
 * 
 * // Get learning path for intermediate users
 * const learningPath = autoZoneExerciseLibrary.getLearningPath('intermediate');
 * 
 * // Get random exercise for practice
 * const randomExercise = autoZoneExerciseLibrary.getRandomExercise();
 */