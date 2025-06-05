/**
 * Agent Scenarios Library
 * Contains AutoZone-specific examples and scenarios for sub-agent demonstrations
 */

window.agentScenarios = {
    authentication: {
        name: 'User Authentication System',
        description: 'Comprehensive authentication system with JWT tokens, password hashing, role-based access, and email verification',
        complexity: 'Medium-High',
        singleAgentTime: 10,
        multiAgentTime: 3,
        estimatedTime: '2-4 hours',
        completionMessage: 'Secure authentication system deployed with comprehensive security measures',
        
        agents: [
            {
                type: 'planning',
                name: 'Architecture Planning Agent',
                icon: '🎯',
                description: 'Designs overall authentication architecture and security requirements',
                tasks: [
                    'Define authentication flow architecture',
                    'Plan JWT token strategy and refresh mechanisms',
                    'Design role-based access control system',
                    'Create security requirements specification',
                    'Coordinate agent task distribution'
                ]
            },
            {
                type: 'frontend',
                name: 'Frontend Authentication Agent',
                icon: '💻',
                description: 'Creates login/signup forms and user dashboard components',
                tasks: [
                    'Build responsive login and signup forms',
                    'Implement protected route components',
                    'Create user profile management UI',
                    'Add password strength indicators',
                    'Implement session timeout handling'
                ]
            },
            {
                type: 'backend',
                name: 'Backend API Agent',
                icon: '⚙️',
                description: 'Implements JWT authentication and user management APIs',
                tasks: [
                    'Create user registration and login endpoints',
                    'Implement JWT token generation and validation',
                    'Build password reset functionality',
                    'Add rate limiting for auth endpoints',
                    'Create role and permission management'
                ]
            },
            {
                type: 'database',
                name: 'Database Schema Agent',
                icon: '🗄️',
                description: 'Designs user tables and session management schema',
                tasks: [
                    'Design user and profile tables',
                    'Create role and permission tables',
                    'Set up session and token storage',
                    'Implement audit trail tables',
                    'Optimize queries for authentication flows'
                ]
            },
            {
                type: 'security',
                name: 'Security Review Agent',
                icon: '🔒',
                description: 'Ensures security best practices and vulnerability assessment',
                tasks: [
                    'Implement bcrypt password hashing',
                    'Review JWT implementation for security',
                    'Add CSRF and XSS protection',
                    'Conduct security vulnerability assessment',
                    'Validate OWASP compliance measures'
                ]
            }
        ]
    },

    ecommerce: {
        name: 'AutoZone E-commerce Platform',
        description: 'Full-featured automotive parts e-commerce platform with product catalog, inventory management, and order processing',
        complexity: 'Very High',
        singleAgentTime: 25,
        multiAgentTime: 6,
        estimatedTime: '4-8 hours',
        completionMessage: 'Complete e-commerce platform deployed with integrated payment processing and inventory management',
        
        agents: [
            {
                type: 'planning',
                name: 'E-commerce Architecture Agent',
                icon: '🏗️',
                description: 'Plans microservices architecture and system integration',
                tasks: [
                    'Design microservices architecture',
                    'Plan API gateway and service communication',
                    'Define data flow between services',
                    'Create deployment and scaling strategy',
                    'Coordinate cross-team dependencies'
                ]
            },
            {
                type: 'frontend',
                name: 'Storefront UI Agent',
                icon: '🛒',
                description: 'Creates responsive product catalog and shopping experience',
                tasks: [
                    'Build product search and filtering',
                    'Create shopping cart and checkout flow',
                    'Implement user account and order history',
                    'Add automotive part compatibility checker',
                    'Optimize for mobile AutoZone app users'
                ]
            },
            {
                type: 'backend',
                name: 'Product Management Agent',
                icon: '📦',
                description: 'Handles product catalog, inventory, and order processing',
                tasks: [
                    'Build product catalog management APIs',
                    'Implement inventory tracking system',
                    'Create order processing workflows',
                    'Add automotive fitment data integration',
                    'Build recommendation engine APIs'
                ]
            },
            {
                type: 'database',
                name: 'E-commerce Data Agent',
                icon: '📊',
                description: 'Designs optimized schemas for products, orders, and inventory',
                tasks: [
                    'Design product and category schemas',
                    'Create inventory and warehouse tables',
                    'Build order and fulfillment schemas',
                    'Add automotive fitment data structure',
                    'Optimize for high-volume transactions'
                ]
            },
            {
                type: 'payment',
                name: 'Payment Processing Agent',
                icon: '💳',
                description: 'Integrates secure payment gateways and fraud detection',
                tasks: [
                    'Integrate Stripe/PayPal payment processing',
                    'Implement AutoZone credit card handling',
                    'Add fraud detection and prevention',
                    'Create refund and chargeback workflows',
                    'Ensure PCI DSS compliance'
                ]
            },
            {
                type: 'inventory',
                name: 'Inventory Management Agent',
                icon: '📋',
                description: 'Manages real-time inventory across AutoZone locations',
                tasks: [
                    'Build real-time inventory tracking',
                    'Create store location inventory sync',
                    'Implement low-stock alerts',
                    'Add supplier integration workflows',
                    'Build inventory forecasting reports'
                ]
            }
        ]
    },

    legacy: {
        name: 'AutoZone Legacy System Modernization',
        description: 'Modernizing AutoZone\'s legacy mainframe systems to cloud-native microservices architecture',
        complexity: 'Extreme',
        singleAgentTime: 40,
        multiAgentTime: 8,
        estimatedTime: '6-12 hours',
        completionMessage: 'Legacy systems successfully modernized with zero-downtime migration and improved performance',
        
        agents: [
            {
                type: 'analysis',
                name: 'Legacy Analysis Agent',
                icon: '🔍',
                description: 'Analyzes existing COBOL/mainframe systems and data structures',
                tasks: [
                    'Analyze legacy COBOL business logic',
                    'Map existing data structures and flows',
                    'Identify modernization opportunities',
                    'Assess technical debt and risks',
                    'Create migration complexity assessment'
                ]
            },
            {
                type: 'architecture',
                name: 'Modern Architecture Agent',
                icon: '🏛️',
                description: 'Designs cloud-native replacement architecture',
                tasks: [
                    'Design microservices architecture',
                    'Plan cloud infrastructure on AWS/Azure',
                    'Create API-first integration strategy',
                    'Design event-driven communication',
                    'Plan containerization strategy'
                ]
            },
            {
                type: 'migration',
                name: 'Data Migration Agent',
                icon: '🚚',
                description: 'Handles data extraction, transformation, and migration',
                tasks: [
                    'Extract data from mainframe systems',
                    'Transform legacy data formats',
                    'Implement zero-downtime migration',
                    'Validate data integrity and consistency',
                    'Create rollback procedures'
                ]
            },
            {
                type: 'api',
                name: 'API Modernization Agent',
                icon: '🌐',
                description: 'Creates modern REST APIs replacing legacy interfaces',
                tasks: [
                    'Design RESTful API replacements',
                    'Implement GraphQL for complex queries',
                    'Add API versioning and deprecation',
                    'Create API documentation and testing',
                    'Implement rate limiting and security'
                ]
            },
            {
                type: 'integration',
                name: 'System Integration Agent',
                icon: '🔗',
                description: 'Manages integration with existing AutoZone systems',
                tasks: [
                    'Integrate with POS systems',
                    'Connect to supplier EDI systems',
                    'Sync with store management systems',
                    'Maintain ERP system connections',
                    'Handle real-time data synchronization'
                ]
            },
            {
                type: 'testing',
                name: 'Migration Testing Agent',
                icon: '🧪',
                description: 'Ensures comprehensive testing and validation',
                tasks: [
                    'Create automated regression tests',
                    'Implement load and performance testing',
                    'Validate business logic accuracy',
                    'Test disaster recovery procedures',
                    'Conduct user acceptance testing'
                ]
            }
        ]
    },

    api: {
        name: 'AutoZone Mobile API Platform',
        description: 'Comprehensive API platform supporting AutoZone mobile apps, partner integrations, and IoT devices',
        complexity: 'High',
        singleAgentTime: 15,
        multiAgentTime: 4,
        estimatedTime: '3-6 hours',
        completionMessage: 'Scalable API platform deployed with comprehensive documentation and monitoring',
        
        agents: [
            {
                type: 'planning',
                name: 'API Strategy Agent',
                icon: '📋',
                description: 'Plans API architecture and governance strategy',
                tasks: [
                    'Define API design standards and patterns',
                    'Plan API versioning and lifecycle management',
                    'Create API governance policies',
                    'Design rate limiting and quotas',
                    'Plan API analytics and monitoring'
                ]
            },
            {
                type: 'core-api',
                name: 'Core API Development Agent',
                icon: '⚡',
                description: 'Builds core product and customer APIs',
                tasks: [
                    'Implement product catalog APIs',
                    'Build customer management endpoints',
                    'Create order and fulfillment APIs',
                    'Add vehicle fitment lookup APIs',
                    'Implement search and recommendation APIs'
                ]
            },
            {
                type: 'mobile-api',
                name: 'Mobile API Agent',
                icon: '📱',
                description: 'Creates mobile-optimized APIs for AutoZone apps',
                tasks: [
                    'Build lightweight mobile endpoints',
                    'Implement offline sync capabilities',
                    'Add push notification APIs',
                    'Create location-based services',
                    'Optimize for mobile network conditions'
                ]
            },
            {
                type: 'partner-api',
                name: 'Partner Integration Agent',
                icon: '🤝',
                description: 'Develops APIs for B2B partner integrations',
                tasks: [
                    'Create supplier integration APIs',
                    'Build partner portal endpoints',
                    'Implement B2B pricing and catalog APIs',
                    'Add EDI to API translation layers',
                    'Create partner analytics and reporting'
                ]
            },
            {
                type: 'security',
                name: 'API Security Agent',
                icon: '🛡️',
                description: 'Implements comprehensive API security measures',
                tasks: [
                    'Implement OAuth 2.0 and JWT authentication',
                    'Add API key management system',
                    'Create rate limiting and DDoS protection',
                    'Implement API input validation',
                    'Add security monitoring and alerting'
                ]
            },
            {
                type: 'documentation',
                name: 'API Documentation Agent',
                icon: '📚',
                description: 'Creates comprehensive API documentation and developer tools',
                tasks: [
                    'Generate OpenAPI/Swagger documentation',
                    'Create interactive API explorer',
                    'Build SDK and code samples',
                    'Add developer onboarding guides',
                    'Implement API testing tools'
                ]
            }
        ]
    },

    'performance-optimization': {
        name: 'AutoZone Website Performance Optimization',
        description: 'Comprehensive performance optimization for AutoZone.com to improve Core Web Vitals and user experience',
        complexity: 'Medium',
        singleAgentTime: 12,
        multiAgentTime: 3,
        estimatedTime: '2-4 hours',
        completionMessage: 'Website performance optimized with 40% faster load times and improved search rankings',
        
        agents: [
            {
                type: 'analysis',
                name: 'Performance Analysis Agent',
                icon: '📊',
                description: 'Analyzes current performance bottlenecks and opportunities',
                tasks: [
                    'Audit Core Web Vitals metrics',
                    'Identify JavaScript and CSS bottlenecks',
                    'Analyze image optimization opportunities',
                    'Review database query performance',
                    'Assess CDN and caching strategies'
                ]
            },
            {
                type: 'frontend-optimization',
                name: 'Frontend Optimization Agent',
                icon: '⚡',
                description: 'Optimizes client-side performance and user experience',
                tasks: [
                    'Implement code splitting and lazy loading',
                    'Optimize images with WebP and responsive sizing',
                    'Minimize and compress CSS/JavaScript',
                    'Implement critical CSS inlining',
                    'Add service worker for caching'
                ]
            },
            {
                type: 'backend-optimization',
                name: 'Backend Optimization Agent',
                icon: '🚀',
                description: 'Optimizes server-side performance and API responses',
                tasks: [
                    'Optimize database queries and indexes',
                    'Implement Redis caching layer',
                    'Add API response compression',
                    'Optimize server-side rendering',
                    'Implement efficient pagination'
                ]
            },
            {
                type: 'infrastructure',
                name: 'Infrastructure Optimization Agent',
                icon: '☁️',
                description: 'Optimizes hosting, CDN, and infrastructure performance',
                tasks: [
                    'Configure CloudFlare CDN optimization',
                    'Implement auto-scaling policies',
                    'Optimize load balancer configurations',
                    'Add performance monitoring dashboards',
                    'Set up automated performance alerts'
                ]
            }
        ]
    },

    'mobile-app': {
        name: 'AutoZone Pro Mobile App',
        description: 'Professional mobile app for AutoZone Pro customers with advanced features and B2B capabilities',
        complexity: 'High',
        singleAgentTime: 20,
        multiAgentTime: 5,
        estimatedTime: '4-8 hours',
        completionMessage: 'Feature-rich mobile app deployed with professional-grade tools and seamless integration',
        
        agents: [
            {
                type: 'mobile-architecture',
                name: 'Mobile Architecture Agent',
                icon: '🏗️',
                description: 'Plans cross-platform mobile architecture and technology stack',
                tasks: [
                    'Design React Native or Flutter architecture',
                    'Plan offline-first data synchronization',
                    'Create cross-platform component library',
                    'Design native module integrations',
                    'Plan app store deployment strategy'
                ]
            },
            {
                type: 'ui-ux',
                name: 'Mobile UI/UX Agent',
                icon: '🎨',
                description: 'Creates intuitive mobile interfaces optimized for professional users',
                tasks: [
                    'Design professional user interface',
                    'Create barcode scanning workflows',
                    'Implement advanced search and filtering',
                    'Add quick reorder and favorites',
                    'Design tablet-optimized layouts'
                ]
            },
            {
                type: 'features',
                name: 'Mobile Features Agent',
                icon: '⚙️',
                description: 'Implements core mobile app functionality and business logic',
                tasks: [
                    'Build product catalog and search',
                    'Implement shopping cart and checkout',
                    'Add account and order management',
                    'Create price and availability checking',
                    'Implement push notifications'
                ]
            },
            {
                type: 'integration',
                name: 'Mobile Integration Agent',
                icon: '🔗',
                description: 'Handles integration with AutoZone systems and third-party services',
                tasks: [
                    'Integrate with AutoZone APIs',
                    'Connect to payment processing',
                    'Add GPS and store locator integration',
                    'Implement analytics and tracking',
                    'Connect to loyalty program systems'
                ]
            },
            {
                type: 'testing',
                name: 'Mobile Testing Agent',
                icon: '📱',
                description: 'Ensures comprehensive testing across devices and platforms',
                tasks: [
                    'Create automated UI testing',
                    'Test across multiple device sizes',
                    'Implement performance testing',
                    'Add offline functionality testing',
                    'Conduct accessibility testing'
                ]
            }
        ]
    }
};

// Utility functions for scenario management
window.getScenarioList = function() {
    return Object.keys(window.agentScenarios).map(key => ({
        key,
        name: window.agentScenarios[key].name,
        complexity: window.agentScenarios[key].complexity,
        estimatedTime: window.agentScenarios[key].estimatedTime
    }));
};

window.getScenario = function(scenarioKey) {
    return window.agentScenarios[scenarioKey];
};

window.getRandomScenario = function() {
    const keys = Object.keys(window.agentScenarios);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return window.agentScenarios[randomKey];
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.agentScenarios;
}