/**
 * Agent Explanations System
 * Provides contextual help and educational content about sub-agents
 */

class AgentExplanationSystem {
    constructor() {
        this.explanations = {
            concepts: {},
            agentTypes: {},
            scenarios: {},
            comparisons: {}
        };
        this.initializeExplanations();
    }

    initializeExplanations() {
        this.setupConceptExplanations();
        this.setupAgentTypeExplanations();
        this.setupScenarioExplanations();
        this.setupComparisonExplanations();
    }

    setupConceptExplanations() {
        this.explanations.concepts = {
            'sub-agents': {
                title: 'What are Sub-Agents?',
                content: `
                    <p>Sub-agents are specialized instances of Claude Code that work together to solve complex development tasks. Think of them as a team of expert developers, each focused on a specific domain.</p>
                    
                    <h4>Key Benefits:</h4>
                    <ul>
                        <li><strong>Parallel Processing:</strong> Multiple tasks execute simultaneously</li>
                        <li><strong>Domain Expertise:</strong> Each agent specializes in specific technologies</li>
                        <li><strong>Coordinated Execution:</strong> Agents communicate and share context</li>
                        <li><strong>Faster Delivery:</strong> Complex projects complete in fraction of the time</li>
                    </ul>
                    
                    <h4>When to Use Sub-Agents:</h4>
                    <ul>
                        <li>Building full-stack applications</li>
                        <li>Modernizing legacy systems</li>
                        <li>Creating comprehensive feature sets</li>
                        <li>Projects requiring multiple technology stacks</li>
                    </ul>
                `,
                examples: [
                    'Authentication system with frontend, backend, and database components',
                    'E-commerce platform with multiple microservices',
                    'Legacy system modernization across multiple layers'
                ]
            },
            
            'parallel-processing': {
                title: 'Parallel Processing Explained',
                content: `
                    <p>Unlike traditional sequential development, sub-agents work simultaneously on different parts of your project. This dramatically reduces development time and improves efficiency.</p>
                    
                    <div class="comparison-grid">
                        <div class="comparison-item">
                            <h4>Sequential (Traditional)</h4>
                            <div class="timeline-visual">
                                <div class="task-block">Frontend</div>
                                <div class="task-block">Backend</div>
                                <div class="task-block">Database</div>
                                <div class="task-block">Testing</div>
                            </div>
                            <p><strong>Total Time:</strong> 8-12 hours</p>
                        </div>
                        
                        <div class="comparison-item">
                            <h4>Parallel (Sub-Agents)</h4>
                            <div class="timeline-visual parallel">
                                <div class="task-block">Frontend</div>
                                <div class="task-block">Backend</div>
                                <div class="task-block">Database</div>
                                <div class="task-block">Testing</div>
                            </div>
                            <p><strong>Total Time:</strong> 2-4 hours</p>
                        </div>
                    </div>
                `,
                examples: [
                    'While one agent designs the database schema, another creates the frontend mockups',
                    'API development happens simultaneously with security implementation',
                    'Testing strategies are planned while core features are being built'
                ]
            },
            
            'agent-coordination': {
                title: 'How Agents Coordinate',
                content: `
                    <p>Sub-agents don't work in isolation. They communicate, share context, and coordinate their efforts to ensure a cohesive final product.</p>
                    
                    <h4>Coordination Mechanisms:</h4>
                    <ul>
                        <li><strong>Shared Project Context:</strong> All agents understand the overall goals</li>
                        <li><strong>Inter-Agent Communication:</strong> Agents exchange information about dependencies</li>
                        <li><strong>Consistent Standards:</strong> Coding standards and patterns are maintained across agents</li>
                        <li><strong>Conflict Resolution:</strong> Automatic detection and resolution of conflicting implementations</li>
                    </ul>
                    
                    <h4>Real-Time Coordination Examples:</h4>
                    <ul>
                        <li>Frontend agent requests API endpoints from backend agent</li>
                        <li>Database agent shares schema with all dependent agents</li>
                        <li>Security agent reviews and approves authentication flows</li>
                        <li>Testing agent validates integration points between components</li>
                    </ul>
                `,
                examples: [
                    'API contracts automatically shared between frontend and backend agents',
                    'Database migrations coordinated with application code changes',
                    'Security reviews integrated into the development workflow'
                ]
            }
        };
    }

    setupAgentTypeExplanations() {
        this.explanations.agentTypes = {
            'planning': {
                title: 'Planning Agent',
                icon: '🎯',
                description: 'Architects the overall solution and coordinates other agents',
                capabilities: [
                    'Project architecture design',
                    'Task breakdown and distribution',
                    'Timeline and milestone planning',
                    'Resource allocation optimization',
                    'Risk assessment and mitigation'
                ],
                whenToUse: [
                    'Complex multi-component projects',
                    'Projects with unclear requirements',
                    'Large-scale system design',
                    'Team coordination needs'
                ],
                example: `
                    <h4>Example: E-commerce Platform Planning</h4>
                    <p>The Planning Agent would:</p>
                    <ul>
                        <li>Analyze requirements and create system architecture</li>
                        <li>Identify core components (user management, product catalog, payment processing)</li>
                        <li>Plan development phases and dependencies</li>
                        <li>Coordinate between frontend, backend, and infrastructure agents</li>
                    </ul>
                `
            },
            
            'frontend': {
                title: 'Frontend Agent',
                icon: '💻',
                description: 'Specializes in user interface and user experience development',
                capabilities: [
                    'React, Vue, Angular development',
                    'Responsive design implementation',
                    'State management (Redux, Vuex)',
                    'API integration and error handling',
                    'Performance optimization'
                ],
                whenToUse: [
                    'Web application development',
                    'Mobile-responsive interfaces',
                    'Progressive Web Apps (PWAs)',
                    'Complex UI/UX requirements'
                ],
                example: `
                    <h4>Example: Dashboard Development</h4>
                    <p>The Frontend Agent would:</p>
                    <ul>
                        <li>Create responsive dashboard layout</li>
                        <li>Implement data visualization components</li>
                        <li>Set up routing and navigation</li>
                        <li>Integrate with API endpoints</li>
                        <li>Add loading states and error handling</li>
                    </ul>
                `
            },
            
            'backend': {
                title: 'Backend Agent',
                icon: '⚙️',
                description: 'Handles server-side logic, APIs, and business rules',
                capabilities: [
                    'REST/GraphQL API development',
                    'Database integration and ORM setup',
                    'Authentication and authorization',
                    'Business logic implementation',
                    'Microservices architecture'
                ],
                whenToUse: [
                    'API development',
                    'Server-side application logic',
                    'Database-driven applications',
                    'Microservices implementation'
                ],
                example: `
                    <h4>Example: User Management API</h4>
                    <p>The Backend Agent would:</p>
                    <ul>
                        <li>Design RESTful user management endpoints</li>
                        <li>Implement JWT-based authentication</li>
                        <li>Create user registration and login flows</li>
                        <li>Set up password hashing and validation</li>
                        <li>Add rate limiting and security middleware</li>
                    </ul>
                `
            },
            
            'database': {
                title: 'Database Agent',
                icon: '🗄️',
                description: 'Designs and optimizes database schemas and queries',
                capabilities: [
                    'Database schema design',
                    'Migration script creation',
                    'Query optimization',
                    'Indexing strategies',
                    'Data modeling and relationships'
                ],
                whenToUse: [
                    'Data-intensive applications',
                    'Complex relational models',
                    'Performance-critical queries',
                    'Large-scale data storage'
                ],
                example: `
                    <h4>Example: E-commerce Database</h4>
                    <p>The Database Agent would:</p>
                    <ul>
                        <li>Design product catalog schema</li>
                        <li>Create user and order management tables</li>
                        <li>Set up inventory tracking relationships</li>
                        <li>Optimize queries for product search</li>
                        <li>Implement audit trails and soft deletes</li>
                    </ul>
                `
            },
            
            'security': {
                title: 'Security Agent',
                icon: '🔒',
                description: 'Ensures application security and compliance',
                capabilities: [
                    'Security vulnerability assessment',
                    'Authentication system design',
                    'Data encryption and protection',
                    'OWASP compliance checking',
                    'Security testing and validation'
                ],
                whenToUse: [
                    'Applications handling sensitive data',
                    'Financial or healthcare systems',
                    'Public-facing applications',
                    'Compliance-required projects'
                ],
                example: `
                    <h4>Example: Payment System Security</h4>
                    <p>The Security Agent would:</p>
                    <ul>
                        <li>Implement PCI DSS compliance measures</li>
                        <li>Set up encryption for payment data</li>
                        <li>Add security headers and CSRF protection</li>
                        <li>Implement secure session management</li>
                        <li>Conduct security code review</li>
                    </ul>
                `
            },
            
            'testing': {
                title: 'Testing Agent',
                icon: '🧪',
                description: 'Creates comprehensive test suites and quality assurance',
                capabilities: [
                    'Unit test creation',
                    'Integration test development',
                    'End-to-end test automation',
                    'Performance testing',
                    'Test coverage analysis'
                ],
                whenToUse: [
                    'Quality-critical applications',
                    'Continuous integration setups',
                    'Large codebases',
                    'Regulatory compliance needs'
                ],
                example: `
                    <h4>Example: API Testing Suite</h4>
                    <p>The Testing Agent would:</p>
                    <ul>
                        <li>Create unit tests for all API endpoints</li>
                        <li>Set up integration tests for database operations</li>
                        <li>Implement authentication flow testing</li>
                        <li>Add performance benchmarks</li>
                        <li>Configure automated test execution</li>
                    </ul>
                `
            }
        };
    }

    setupScenarioExplanations() {
        this.explanations.scenarios = {
            'authentication': {
                title: 'Authentication System Development',
                description: 'Building a comprehensive user authentication and authorization system',
                complexity: 'Medium-High',
                duration: '2-4 hours with sub-agents vs 8-12 hours single-agent',
                breakdown: `
                    <h4>Agent Responsibilities:</h4>
                    <ul>
                        <li><strong>Planning Agent:</strong> Architecture design and security requirements</li>
                        <li><strong>Frontend Agent:</strong> Login/signup forms and user dashboard</li>
                        <li><strong>Backend Agent:</strong> JWT implementation and user management APIs</li>
                        <li><strong>Database Agent:</strong> User schema and session management</li>
                        <li><strong>Security Agent:</strong> Password hashing and vulnerability assessment</li>
                    </ul>
                `,
                benefits: [
                    'Parallel development of frontend and backend components',
                    'Security review integrated throughout development',
                    'Consistent authentication patterns across application',
                    'Comprehensive testing of security flows'
                ]
            },
            
            'ecommerce': {
                title: 'E-commerce Platform Development',
                description: 'Creating a full-featured online store with product management, shopping cart, and payment processing',
                complexity: 'High',
                duration: '4-8 hours with sub-agents vs 20-30 hours single-agent',
                breakdown: `
                    <h4>Agent Responsibilities:</h4>
                    <ul>
                        <li><strong>Planning Agent:</strong> System architecture and feature prioritization</li>
                        <li><strong>Frontend Agent:</strong> Product catalog, shopping cart, and checkout UI</li>
                        <li><strong>Backend Agent:</strong> Product management, order processing APIs</li>
                        <li><strong>Database Agent:</strong> Product, user, and order schemas</li>
                        <li><strong>Payment Agent:</strong> Payment gateway integration</li>
                        <li><strong>Security Agent:</strong> PCI compliance and data protection</li>
                    </ul>
                `,
                benefits: [
                    'Massive time savings through parallel development',
                    'Specialized expertise for complex domains like payments',
                    'Consistent data models across all components',
                    'Built-in security and compliance measures'
                ]
            },
            
            'legacy': {
                title: 'Legacy System Modernization',
                description: 'Modernizing outdated systems with current technologies and best practices',
                complexity: 'Very High',
                duration: '6-12 hours with sub-agents vs 30-50 hours single-agent',
                breakdown: `
                    <h4>Agent Responsibilities:</h4>
                    <ul>
                        <li><strong>Analysis Agent:</strong> Legacy code review and migration planning</li>
                        <li><strong>Architecture Agent:</strong> Modern system design and patterns</li>
                        <li><strong>Migration Agent:</strong> Data migration and system transition</li>
                        <li><strong>Frontend Agent:</strong> Modern UI replacement</li>
                        <li><strong>Backend Agent:</strong> API modernization and refactoring</li>
                        <li><strong>Testing Agent:</strong> Comprehensive testing for regression prevention</li>
                    </ul>
                `,
                benefits: [
                    'Systematic approach to complex migrations',
                    'Risk mitigation through specialized agents',
                    'Parallel modernization of different system layers',
                    'Comprehensive testing ensures system stability'
                ]
            }
        };
    }

    setupComparisonExplanations() {
        this.explanations.comparisons = {
            'single-vs-multi': {
                title: 'Single Agent vs Multi-Agent Development',
                content: `
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Aspect</th>
                                    <th>Single Agent</th>
                                    <th>Multi-Agent</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Development Speed</td>
                                    <td>Sequential, slower</td>
                                    <td>Parallel, 3-5x faster</td>
                                </tr>
                                <tr>
                                    <td>Expertise</td>
                                    <td>Generalist approach</td>
                                    <td>Specialized domain knowledge</td>
                                </tr>
                                <tr>
                                    <td>Code Quality</td>
                                    <td>Consistent but limited</td>
                                    <td>High quality with specialized patterns</td>
                                </tr>
                                <tr>
                                    <td>Best For</td>
                                    <td>Simple, single-component tasks</td>
                                    <td>Complex, multi-component projects</td>
                                </tr>
                                <tr>
                                    <td>Coordination</td>
                                    <td>Not applicable</td>
                                    <td>Automatic inter-agent communication</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `
            },
            
            'when-to-use': {
                title: 'When to Use Sub-Agents',
                content: `
                    <h4>✅ Use Sub-Agents When:</h4>
                    <ul class="use-cases">
                        <li>Building full-stack applications (frontend + backend + database)</li>
                        <li>Projects requiring multiple technology specializations</li>
                        <li>Complex features with 5+ interconnected components</li>
                        <li>Time-sensitive projects needing rapid development</li>
                        <li>Enterprise applications requiring security and compliance</li>
                        <li>Legacy system modernization projects</li>
                    </ul>
                    
                    <h4>❌ Stick with Single Agent When:</h4>
                    <ul class="avoid-cases">
                        <li>Simple, single-file modifications</li>
                        <li>Quick bug fixes or small feature additions</li>
                        <li>Learning exercises or experimentation</li>
                        <li>Projects with fewer than 3 major components</li>
                        <li>Prototyping and proof-of-concept work</li>
                    </ul>
                    
                    <h4>💡 Pro Tips:</h4>
                    <ul class="tips">
                        <li>Start with sub-agents for any project you estimate will take more than 4 hours</li>
                        <li>Use the planning agent first to assess if sub-agents would be beneficial</li>
                        <li>Sub-agents excel when components can be developed independently</li>
                        <li>The coordination overhead is minimal compared to the time savings</li>
                    </ul>
                `
            }
        };
    }

    // Method to get explanation content
    getExplanation(category, key) {
        return this.explanations[category] && this.explanations[category][key];
    }

    // Method to show contextual help
    showContextualHelp(element, contentKey) {
        const explanation = this.getExplanation('concepts', contentKey);
        if (!explanation) return;

        this.createHelpOverlay(explanation, element);
    }

    createHelpOverlay(explanation, triggerElement) {
        // Remove any existing overlay
        const existingOverlay = document.querySelector('.help-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'help-overlay';
        overlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h2>${explanation.title}</h2>
                    <button class="help-close" onclick="this.closest('.help-overlay').remove()">×</button>
                </div>
                <div class="help-body">
                    ${explanation.content}
                    ${explanation.examples ? `
                        <h4>Examples:</h4>
                        <ul>
                            ${explanation.examples.map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
                <div class="help-footer">
                    <button class="btn btn-primary" onclick="this.closest('.help-overlay').remove()">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        // Add overlay styles
        const style = document.createElement('style');
        style.textContent = `
            .help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .help-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
            }
            
            .help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .help-header h2 {
                margin: 0;
                color: var(--primary-color);
            }
            
            .help-close {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .help-body {
                padding: 2rem;
                line-height: 1.6;
            }
            
            .help-body h4 {
                color: var(--primary-color);
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
            }
            
            .help-body ul {
                margin-left: 1.5rem;
            }
            
            .help-body li {
                margin-bottom: 0.5rem;
            }
            
            .help-footer {
                padding: 1rem 2rem 2rem;
                text-align: center;
            }
            
            .comparison-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin: 1.5rem 0;
            }
            
            .comparison-item {
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 1rem;
            }
            
            .timeline-visual {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .timeline-visual.parallel {
                flex-direction: row;
                height: 40px;
                align-items: center;
            }
            
            .task-block {
                background: var(--primary-color);
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
                text-align: center;
                font-size: 0.875rem;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Animate in
        overlay.animate([
            { opacity: 0, transform: 'scale(0.9)' },
            { opacity: 1, transform: 'scale(1)' }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
    }

    // Method to create interactive tooltips
    createTooltip(element, content) {
        element.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'interactive-tooltip';
            tooltip.innerHTML = content;
            
            // Position tooltip
            const rect = element.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                background: var(--dark-bg);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                z-index: 1000;
                max-width: 300px;
                line-height: 1.4;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top - 10}px;
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            // Animate in
            tooltip.animate([
                { opacity: 0, transform: 'translateX(-50%) translateY(-100%) scale(0.9)' },
                { opacity: 1, transform: 'translateX(-50%) translateY(-100%) scale(1)' }
            ], { duration: 200 });
            
            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    }

    // Method to add help buttons to agent cards
    addHelpButtons() {
        const agentCards = document.querySelectorAll('.sub-agent');
        agentCards.forEach(card => {
            const agentType = card.dataset.agentType;
            if (agentType && this.explanations.agentTypes[agentType]) {
                const helpButton = document.createElement('button');
                helpButton.innerHTML = '?';
                helpButton.className = 'agent-help-btn';
                helpButton.style.cssText = `
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 1px solid var(--border-color);
                    background: white;
                    color: var(--primary-color);
                    font-size: 0.75rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                helpButton.onclick = (e) => {
                    e.stopPropagation();
                    this.showAgentHelp(agentType);
                };
                
                card.style.position = 'relative';
                card.appendChild(helpButton);
            }
        });
    }

    showAgentHelp(agentType) {
        const agentInfo = this.explanations.agentTypes[agentType];
        if (!agentInfo) return;

        const helpContent = {
            title: agentInfo.title,
            content: `
                <div style="text-align: center; font-size: 3rem; margin-bottom: 1rem;">
                    ${agentInfo.icon}
                </div>
                <p><strong>${agentInfo.description}</strong></p>
                
                <h4>Key Capabilities:</h4>
                <ul>
                    ${agentInfo.capabilities.map(cap => `<li>${cap}</li>`).join('')}
                </ul>
                
                <h4>When to Use:</h4>
                <ul>
                    ${agentInfo.whenToUse.map(use => `<li>${use}</li>`).join('')}
                </ul>
                
                ${agentInfo.example}
            `
        };
        
        this.createHelpOverlay(helpContent);
    }
}

// Create global instance
window.agentExplanations = new AgentExplanationSystem();

// Initialize help system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add help buttons after agents are loaded
    setTimeout(() => {
        window.agentExplanations.addHelpButtons();
    }, 1000);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentExplanationSystem;
}