/**
 * Screen Reader Utilities for Claude Code Training Website
 * Provides optimized screen reader experience with descriptive text,
 * content structure enhancements, and alternative text for visual elements
 * WCAG 2.1 AA compliance focused
 */

class ScreenReaderUtils {
    constructor() {
        this.landmarks = new Map();
        this.headingStructure = [];
        this.contentDescriptions = new Map();
        this.visualElements = new Map();
        this.init();
    }

    init() {
        this.enhanceSemanticStructure();
        this.addAlternativeText();
        this.createContentDescriptions();
        this.enhanceHeadingHierarchy();
        this.addLandmarkNavigation();
        this.enhanceDataVisualization();
        this.setupContentSummaries();
        this.addOrientationSupport();
        this.enhanceCodeBlockAccessibility();
    }

    /**
     * Enhance semantic structure for better screen reader navigation
     */
    enhanceSemanticStructure() {
        // Add main landmark if missing
        let main = document.querySelector('main');
        if (!main) {
            const mainContent = document.querySelector('.main-content, #main-content');
            if (mainContent) {
                mainContent.setAttribute('role', 'main');
                mainContent.setAttribute('aria-label', 'Main content');
            }
        } else {
            main.setAttribute('aria-label', 'Claude Code training content');
        }

        // Enhance header structure
        const header = document.querySelector('header, .header');
        if (header) {
            header.setAttribute('role', 'banner');
            header.setAttribute('aria-label', 'Site header with navigation');
        }

        // Enhance footer structure
        const footer = document.querySelector('footer, .footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
            footer.setAttribute('aria-label', 'Site footer with additional resources');
        }

        // Add complementary landmarks for sidebars
        document.querySelectorAll('.sidebar, .aside').forEach((sidebar, index) => {
            sidebar.setAttribute('role', 'complementary');
            sidebar.setAttribute('aria-label', `Sidebar ${index + 1}`);
        });

        // Enhance navigation structure
        document.querySelectorAll('nav, .nav').forEach((nav, index) => {
            if (!nav.getAttribute('aria-label')) {
                const label = index === 0 ? 'Main navigation' : `Navigation ${index + 1}`;
                nav.setAttribute('aria-label', label);
            }
        });

        // Add search landmark
        const searchForm = document.querySelector('form[role="search"], .search-form');
        if (searchForm) {
            searchForm.setAttribute('role', 'search');
            searchForm.setAttribute('aria-label', 'Search Claude Code documentation');
        }
    }

    /**
     * Add comprehensive alternative text for visual elements
     */
    addAlternativeText() {
        // Icons with semantic meaning
        const iconMappings = {
            'fa-shield-alt': 'Security',
            'fa-download': 'Download',
            'fa-brain': 'Memory management',
            'fa-terminal': 'Command line',
            'fa-exclamation-triangle': 'Warning',
            'fa-robot': 'AI assistant',
            'fa-tools': 'Troubleshooting',
            'fa-users': 'Team collaboration',
            'fa-cogs': 'Configuration',
            'fa-desktop': 'Frontend development',
            'fa-database': 'Database management',
            'fa-code': 'Code examples',
            'fa-tasks': 'Task management',
            'fa-magic': 'Auto-edit feature',
            'fa-keyboard': 'Keyboard shortcuts',
            'fa-copy': 'Copy to clipboard',
            'fa-check': 'Copied successfully',
            'fa-play': 'Run demo',
            'fa-chevron-down': 'Expand section',
            'fa-chevron-up': 'Collapse section'
        };

        document.querySelectorAll('i[class*="fa-"]').forEach(icon => {
            if (icon.getAttribute('aria-hidden') === 'true') return;
            
            let altText = '';
            for (const [className, description] of Object.entries(iconMappings)) {
                if (icon.classList.contains(className)) {
                    altText = description;
                    break;
                }
            }
            
            if (altText) {
                icon.setAttribute('aria-label', altText);
                icon.setAttribute('role', 'img');
            } else {
                icon.setAttribute('aria-hidden', 'true');
            }
        });

        // Logo and branding elements
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.setAttribute('aria-label', 'AutoZone Claude Code Training Hub logo');
        }

        // Badge elements
        document.querySelectorAll('.badge').forEach(badge => {
            const badgeText = badge.textContent.trim();
            if (badge.classList.contains('required')) {
                badge.setAttribute('aria-label', `${badgeText} - This is a required configuration`);
            } else if (badge.classList.contains('warning')) {
                badge.setAttribute('aria-label', `${badgeText} - Important warning information`);
            }
        });

        // Status indicators
        document.querySelectorAll('.status-indicator, .connection-status').forEach(status => {
            const isConnected = status.classList.contains('connected');
            status.setAttribute('aria-label', `Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
        });
    }

    /**
     * Create detailed content descriptions for complex sections
     */
    createContentDescriptions() {
        // Quick navigation cards
        const quickNavSection = document.querySelector('#overview, .quick-nav');
        if (quickNavSection) {
            this.addSectionDescription(quickNavSection, 
                'Quick navigation cards for different user types: Essential setup for everyone, team collaboration features, and advanced configuration options.'
            );
        }

        // Installation section
        const installationSection = document.querySelector('#installation');
        if (installationSection) {
            this.addSectionDescription(installationSection,
                'Step-by-step installation instructions with tabbed interface for different operating systems: Mac, Linux, and Windows.'
            );
        }

        // Commands reference
        const commandsSection = document.querySelector('#commands');
        if (commandsSection) {
            this.addSectionDescription(commandsSection,
                'Comprehensive reference of Claude Code commands organized by category: Core commands, development tools, and task management.'
            );
        }

        // Sub-agents section
        const subAgentsSection = document.querySelector('#sub-agents');
        if (subAgentsSection) {
            this.addSectionDescription(subAgentsSection,
                'Interactive explanation of Claude Code sub-agents with visual diagram showing how multiple AI agents work together on complex tasks.'
            );
        }

        // Troubleshooting section
        const troubleshootingSection = document.querySelector('#troubleshooting');
        if (troubleshootingSection) {
            this.addSectionDescription(troubleshootingSection,
                'Accordion-style troubleshooting guide with expandable sections for common issues: authentication problems, VS Code integration, and memory management.'
            );
        }
    }

    /**
     * Enhance heading hierarchy and structure
     */
    enhanceHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            // Add heading level information for screen readers
            if (!heading.id) {
                heading.id = this.generateHeadingId(heading.textContent);
            }
            
            // Store heading structure
            this.headingStructure.push({
                element: heading,
                level: level,
                text: heading.textContent.trim(),
                id: heading.id
            });
            
            // Add section information
            const section = heading.closest('section');
            if (section && !section.getAttribute('aria-labelledby')) {
                section.setAttribute('aria-labelledby', heading.id);
            }
        });

        // Create heading navigation
        this.createHeadingNavigation();
    }

    /**
     * Add landmark navigation for screen readers
     */
    addLandmarkNavigation() {
        // Create landmarks map
        const landmarks = [
            { selector: 'header, [role="banner"]', name: 'Header' },
            { selector: 'nav, [role="navigation"]', name: 'Navigation' },
            { selector: 'main, [role="main"]', name: 'Main content' },
            { selector: 'aside, [role="complementary"]', name: 'Sidebar' },
            { selector: 'footer, [role="contentinfo"]', name: 'Footer' },
            { selector: '[role="search"]', name: 'Search' }
        ];

        landmarks.forEach(landmark => {
            const elements = document.querySelectorAll(landmark.selector);
            elements.forEach((element, index) => {
                const key = `${landmark.name}${elements.length > 1 ? ` ${index + 1}` : ''}`;
                this.landmarks.set(key, element);
            });
        });
    }

    /**
     * Enhance data visualization accessibility
     */
    enhanceDataVisualization() {
        // Sub-agents diagram
        const diagram = document.querySelector('.sub-agents-diagram');
        if (diagram) {
            const description = this.createDiagramDescription();
            this.addDetailedDescription(diagram, description);
        }

        // Capabilities grid
        const capabilitiesGrid = document.querySelector('.capabilities-grid');
        if (capabilitiesGrid) {
            const capabilities = Array.from(capabilitiesGrid.querySelectorAll('.capability'))
                .map(cap => {
                    const title = cap.querySelector('h4')?.textContent;
                    const desc = cap.querySelector('p')?.textContent;
                    return `${title}: ${desc}`;
                }).join('. ');
            
            this.addDetailedDescription(capabilitiesGrid, 
                `Key capabilities of Claude Code sub-agents: ${capabilities}`
            );
        }

        // Requirements grid
        const requirementsGrid = document.querySelector('.requirements-grid');
        if (requirementsGrid) {
            const requirements = Array.from(requirementsGrid.querySelectorAll('.requirement'))
                .map(req => req.textContent.trim())
                .join(', ');
            
            this.addDetailedDescription(requirementsGrid,
                `System requirements: ${requirements}`
            );
        }
    }

    /**
     * Setup content summaries for complex sections
     */
    setupContentSummaries() {
        // Add summary for each major section
        document.querySelectorAll('section[id]').forEach(section => {
            const heading = section.querySelector('h2');
            if (!heading) return;

            const summary = this.generateSectionSummary(section);
            if (summary) {
                this.addSectionSummary(section, summary);
            }
        });
    }

    /**
     * Add orientation and navigation support
     */
    addOrientationSupport() {
        // Add page structure description
        const pageStructure = document.createElement('div');
        pageStructure.className = 'sr-only page-structure';
        pageStructure.setAttribute('aria-label', 'Page structure');
        
        const structureText = this.generatePageStructure();
        pageStructure.textContent = structureText;
        
        document.body.insertBefore(pageStructure, document.body.firstChild);

        // Add current location indicator
        const currentLocation = document.createElement('div');
        currentLocation.id = 'current-location';
        currentLocation.className = 'sr-only';
        currentLocation.setAttribute('aria-live', 'polite');
        currentLocation.setAttribute('aria-atomic', 'true');
        document.body.appendChild(currentLocation);

        // Update location on navigation
        this.setupLocationTracking();
    }

    /**
     * Enhance code block accessibility
     */
    enhanceCodeBlockAccessibility() {
        document.querySelectorAll('.code-block').forEach((block, index) => {
            const header = block.querySelector('.code-header span');
            const code = block.querySelector('pre code');
            const copyBtn = block.querySelector('.copy-btn');
            
            if (code) {
                const language = this.detectCodeLanguage(code);
                const lineCount = code.textContent.split('\n').length;
                
                // Add detailed description
                const description = `${language} code block with ${lineCount} lines`;
                if (header) {
                    const fullDescription = `${header.textContent} - ${description}`;
                    block.setAttribute('aria-label', fullDescription);
                } else {
                    block.setAttribute('aria-label', description);
                }

                // Add code content description
                const codeDescription = this.generateCodeDescription(code);
                if (codeDescription) {
                    const descId = `code-desc-${index}`;
                    const descElement = document.createElement('div');
                    descElement.id = descId;
                    descElement.className = 'sr-only';
                    descElement.textContent = codeDescription;
                    block.appendChild(descElement);
                    
                    code.setAttribute('aria-describedby', descId);
                }
            }

            if (copyBtn) {
                copyBtn.setAttribute('aria-describedby', block.id || '');
                
                // Enhance copy feedback
                copyBtn.addEventListener('click', () => {
                    const announcement = 'Code copied to clipboard. You can now paste it in your terminal or editor.';
                    window.accessibilityEnhancer?.announce(announcement);
                });
            }
        });
    }

    /**
     * Helper methods
     */
    addSectionDescription(section, description) {
        const descId = `desc-${section.id || Math.random().toString(36).substr(2, 9)}`;
        const descElement = document.createElement('div');
        descElement.id = descId;
        descElement.className = 'sr-only section-description';
        descElement.textContent = description;
        
        section.insertBefore(descElement, section.firstChild);
        section.setAttribute('aria-describedby', descId);
    }

    addDetailedDescription(element, description) {
        const descId = `detailed-desc-${Math.random().toString(36).substr(2, 9)}`;
        const descElement = document.createElement('div');
        descElement.id = descId;
        descElement.className = 'sr-only detailed-description';
        descElement.textContent = description;
        
        element.appendChild(descElement);
        element.setAttribute('aria-describedby', descId);
    }

    addSectionSummary(section, summary) {
        const summaryElement = document.createElement('div');
        summaryElement.className = 'sr-only section-summary';
        summaryElement.textContent = `Section summary: ${summary}`;
        
        const heading = section.querySelector('h2, h3');
        if (heading) {
            heading.insertAdjacentElement('afterend', summaryElement);
        }
    }

    generateHeadingId(text) {
        return text.toLowerCase()
                  .replace(/[^\w\s]/g, '')
                  .replace(/\s+/g, '-')
                  .substring(0, 50);
    }

    createDiagramDescription() {
        return 'Diagram showing Claude Code main instance connected to four sub-agents: Planning Agent for architecture and timeline, Frontend Agent for user interface, Database Agent for data management, and Security Agent for authentication and security. The agents work in parallel and coordinate their efforts.';
    }

    generateSectionSummary(section) {
        const sectionId = section.id;
        const summaries = {
            'security': 'Required security setup using Google Vertex AI for enterprise compliance.',
            'installation': 'Step-by-step installation guide for Mac, Linux, and Windows systems.',
            'memory': 'Memory management configuration and status checking.',
            'commands': 'Comprehensive command reference organized by functionality.',
            'pitfalls': 'Common mistakes to avoid when using Claude Code.',
            'sub-agents': 'Understanding how multiple AI agents work together.',
            'troubleshooting': 'Solutions for common technical issues.'
        };
        
        return summaries[sectionId] || null;
    }

    generatePageStructure() {
        const structure = [
            'Page contains: header with navigation,',
            'hero section with getting started buttons,',
            'quick navigation cards for different user types,',
            'main content with security setup, installation, commands reference, and troubleshooting,',
            'footer with additional resources and links.'
        ].join(' ');
        
        return `Claude Code Training Hub. ${structure}`;
    }

    detectCodeLanguage(codeElement) {
        const className = codeElement.className;
        if (className.includes('language-bash')) return 'Bash';
        if (className.includes('language-javascript')) return 'JavaScript';
        if (className.includes('language-python')) return 'Python';
        if (className.includes('language-json')) return 'JSON';
        if (className.includes('language-yaml')) return 'YAML';
        return 'Code';
    }

    generateCodeDescription(codeElement) {
        const text = codeElement.textContent.trim();
        
        // Environment variables setup
        if (text.includes('export') && text.includes('CLAUDE_CODE')) {
            return 'Environment variables configuration for Claude Code with Vertex AI';
        }
        
        // Installation commands
        if (text.includes('npm install') || text.includes('nvm install')) {
            return 'Installation commands for Node.js and Claude Code CLI';
        }
        
        // Git commands
        if (text.includes('git worktree') || text.includes('git')) {
            return 'Git commands for repository management';
        }
        
        // Authentication commands
        if (text.includes('gcloud auth')) {
            return 'Google Cloud authentication commands';
        }
        
        return null;
    }

    setupLocationTracking() {
        // Track section visibility
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const heading = entry.target.querySelector('h2, h3');
                    if (heading) {
                        const location = `Currently viewing: ${heading.textContent.trim()}`;
                        const locationElement = document.getElementById('current-location');
                        if (locationElement) {
                            locationElement.textContent = location;
                        }
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    createHeadingNavigation() {
        // Create a screen reader accessible heading navigation
        const nav = document.createElement('nav');
        nav.className = 'sr-only heading-navigation';
        nav.setAttribute('aria-label', 'Page headings navigation');
        
        const navList = document.createElement('ul');
        navList.setAttribute('role', 'list');
        
        this.headingStructure.forEach(heading => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = `Level ${heading.level}: ${heading.text}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.element.focus();
                heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            
            listItem.appendChild(link);
            navList.appendChild(listItem);
        });
        
        nav.appendChild(navList);
        document.body.insertBefore(nav, document.body.firstChild);
    }

    /**
     * Public methods for external use
     */
    announceContent(message) {
        if (window.accessibilityEnhancer) {
            window.accessibilityEnhancer.announce(message);
        }
    }

    announceNavigation(from, to) {
        const message = `Navigated from ${from} to ${to}`;
        this.announceContent(message);
    }

    describeCurrentSection() {
        const activeSection = document.querySelector('section:target, section.active');
        if (activeSection) {
            const heading = activeSection.querySelector('h2, h3');
            const description = activeSection.querySelector('.section-description');
            
            if (heading && description) {
                return `${heading.textContent.trim()}. ${description.textContent}`;
            }
        }
        return null;
    }

    getLandmarks() {
        return Array.from(this.landmarks.keys());
    }

    navigateToLandmark(landmarkName) {
        const element = this.landmarks.get(landmarkName);
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.announceContent(`Navigated to ${landmarkName}`);
            return true;
        }
        return false;
    }
}

// Initialize screen reader utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.screenReaderUtils = new ScreenReaderUtils();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScreenReaderUtils;
}