/**
 * Cognitive Aids for Claude Code Training Website
 * Provides learning support features, progress indicators, clear error messages,
 * and cognitive accessibility enhancements for users with varying learning styles
 * WCAG 2.1 AA compliance focused
 */

class CognitiveAids {
    constructor() {
        this.userProgress = new Map();
        this.learningPreferences = {};
        this.contextualHelp = new Map();
        this.simplificationLevel = 'standard';
        this.readingLevel = 'intermediate';
        this.init();
    }

    init() {
        this.setupProgressTracking();
        this.addContextualHelp();
        this.createLearningSupports();
        this.enhanceErrorMessages();
        this.addProgressIndicators();
        this.setupSimplifiedLanguage();
        this.createLearningPath();
        this.addMemoryAids();
        this.setupPersonalization();
        this.addConfirmationDialogs();
    }

    /**
     * Setup progress tracking for learning journey
     */
    setupProgressTracking() {
        // Define learning sections and their completion criteria
        const learningSections = [
            { id: 'security', title: 'Security Setup', required: true },
            { id: 'installation', title: 'Installation', required: true },
            { id: 'memory', title: 'Memory Management', required: false },
            { id: 'commands', title: 'Commands Reference', required: false },
            { id: 'pitfalls', title: 'Common Pitfalls', required: false },
            { id: 'sub-agents', title: 'Sub-Agents', required: false },
            { id: 'troubleshooting', title: 'Troubleshooting', required: false }
        ];

        // Create progress tracking structure
        this.userProgress = new Map();
        learningSections.forEach(section => {
            this.userProgress.set(section.id, {
                ...section,
                visited: false,
                completed: false,
                timeSpent: 0,
                startTime: null,
                interactions: 0
            });
        });

        // Track section visits and interactions
        this.setupSectionTracking();
        this.createProgressDisplay();
        this.loadSavedProgress();
    }

    /**
     * Add contextual help throughout the interface
     */
    addContextualHelp() {
        // Create help tooltips for complex terms
        const complexTerms = {
            'Vertex AI': 'Google Cloud\'s machine learning platform that provides secure AI services for enterprise use.',
            'Sub-Agents': 'Multiple AI assistants that work together on different aspects of your project simultaneously.',
            'REPL': 'Read-Eval-Print Loop - An interactive programming environment where you can enter commands and see immediate results.',
            'Git Worktrees': 'A feature that allows you to check out multiple branches of a repository simultaneously in different directories.',
            'CLAUDE.md': 'A special file that stores project context and memory for Claude Code to understand your codebase better.',
            'Roving Tabindex': 'A keyboard navigation pattern where only one element in a group can receive focus at a time.'
        };

        Object.entries(complexTerms).forEach(([term, definition]) => {
            this.addTermDefinition(term, definition);
        });

        // Add contextual help buttons
        this.addHelpButtons();
        
        // Create help overlay system
        this.createHelpOverlay();
    }

    /**
     * Create learning supports for different cognitive needs
     */
    createLearningSupports() {
        // Add reading aids
        this.addReadingAids();
        
        // Create step-by-step guides
        this.createStepGuides();
        
        // Add visual learning aids
        this.addVisualAids();
        
        // Create checklist interfaces
        this.createChecklists();
        
        // Add time estimation for tasks
        this.addTimeEstimates();
    }

    /**
     * Enhance error messages with clear, actionable guidance
     */
    enhanceErrorMessages() {
        // Define common errors and their enhanced messages
        const errorEnhancements = {
            'authentication': {
                simple: 'Cannot connect to Google Cloud.',
                detailed: 'Your computer cannot connect to Google Cloud. This usually means you need to log in again.',
                solution: 'Try running the command: gcloud auth application-default login',
                prevention: 'This happens when your login expires. You may need to do this every few weeks.'
            },
            'installation': {
                simple: 'Claude Code installation failed.',
                detailed: 'The Claude Code program could not be installed on your computer.',
                solution: 'Check that you have Node.js version 18 or higher installed first.',
                prevention: 'Make sure you have administrator permissions and a stable internet connection.'
            },
            'memory': {
                simple: 'Claude Code seems confused about your project.',
                detailed: 'Claude Code cannot understand your project structure or has forgotten previous context.',
                solution: 'Update your CLAUDE.md file with current project information.',
                prevention: 'Regularly update your CLAUDE.md file when you make major changes to your project.'
            }
        };

        // Enhance existing error displays
        this.setupErrorEnhancement(errorEnhancements);
        
        // Add error recovery suggestions
        this.addErrorRecovery();
        
        // Create error prevention tips
        this.addPreventionTips();
    }

    /**
     * Add comprehensive progress indicators
     */
    addProgressIndicators() {
        // Create overall progress bar
        this.createOverallProgress();
        
        // Add section completion indicators
        this.addSectionIndicators();
        
        // Create learning milestone celebrations
        this.setupMilestoneCelebrations();
        
        // Add estimated completion time
        this.addTimeEstimates();
    }

    /**
     * Setup simplified language options
     */
    setupSimplifiedLanguage() {
        // Create language simplification levels
        const simplificationLevels = {
            'beginner': {
                'authentication': 'logging in',
                'repository': 'project folder',
                'CLI': 'command line program',
                'API': 'connection to service',
                'configuration': 'settings',
                'environment variables': 'system settings',
                'terminal': 'command window',
                'execute': 'run',
                'instantiate': 'create'
            },
            'intermediate': {
                'instantiate': 'create',
                'repository': 'code repository',
                'API': 'programming interface'
            }
        };

        // Add language toggle
        this.createLanguageToggle(simplificationLevels);
        
        // Apply simplifications
        this.applyLanguageSimplification();
    }

    /**
     * Create guided learning path
     */
    createLearningPath() {
        const learningPath = [
            {
                step: 1,
                title: 'Security First',
                description: 'Set up secure connection to protect your code',
                section: 'security',
                estimatedTime: '5 minutes',
                difficulty: 'Easy',
                required: true
            },
            {
                step: 2,
                title: 'Install Claude Code',
                description: 'Download and install the Claude Code program',
                section: 'installation',
                estimatedTime: '10 minutes',
                difficulty: 'Easy',
                required: true
            },
            {
                step: 3,
                title: 'Learn Basic Commands',
                description: 'Master the essential commands you\'ll use daily',
                section: 'commands',
                estimatedTime: '15 minutes',
                difficulty: 'Medium',
                required: false
            },
            {
                step: 4,
                title: 'Avoid Common Mistakes',
                description: 'Learn what not to do to save time and frustration',
                section: 'pitfalls',
                estimatedTime: '10 minutes',
                difficulty: 'Easy',
                required: false
            },
            {
                step: 5,
                title: 'Advanced Features',
                description: 'Explore powerful features like sub-agents',
                section: 'sub-agents',
                estimatedTime: '20 minutes',
                difficulty: 'Hard',
                required: false
            }
        ];

        this.createPathNavigation(learningPath);
    }

    /**
     * Add memory aids and mnemonics
     */
    addMemoryAids() {
        // Command mnemonics
        const commandMnemonics = {
            '/status': 'S for Status - See what\'s happening',
            '/memory': 'M for Memory - Manage project context',
            '/help': 'H for Help - Get assistance',
            '/clear': 'C for Clear - Clean the slate',
            'Ctrl+H': 'H for Help - Show keyboard shortcuts'
        };

        // Add mnemonic tooltips
        Object.entries(commandMnemonics).forEach(([command, mnemonic]) => {
            this.addMnemonic(command, mnemonic);
        });

        // Create summary cards
        this.createSummaryCards();
        
        // Add bookmark system
        this.createBookmarkSystem();
    }

    /**
     * Setup user personalization options
     */
    setupPersonalization() {
        // Create preferences panel
        this.createPreferencesPanel();
        
        // Save and load user preferences
        this.setupPreferencePersistence();
        
        // Adaptive interface based on usage patterns
        this.setupAdaptiveInterface();
    }

    /**
     * Add confirmation dialogs for destructive actions
     */
    addConfirmationDialogs() {
        // Define actions that need confirmation
        const destructiveActions = [
            { selector: '.clear-data', message: 'This will clear all your progress. Are you sure?' },
            { selector: '.reset-preferences', message: 'This will reset all your preferences to default. Continue?' },
            { selector: '.clear-memory', message: 'This will clear Claude Code\'s memory of your project. Proceed?' }
        ];

        destructiveActions.forEach(action => {
            this.addConfirmationDialog(action.selector, action.message);
        });
    }

    /**
     * Implementation methods
     */
    setupSectionTracking() {
        // Use Intersection Observer to track section visits
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.markSectionVisited(sectionId);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });

        // Track interactions
        document.addEventListener('click', (e) => {
            const section = e.target.closest('section[id]');
            if (section) {
                this.incrementInteractions(section.id);
            }
        });
    }

    createProgressDisplay() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'learning-progress-container';
        progressContainer.setAttribute('role', 'region');
        progressContainer.setAttribute('aria-label', 'Learning progress');

        progressContainer.innerHTML = `
            <div class="progress-header">
                <h3>Your Learning Progress</h3>
                <button class="toggle-progress" aria-expanded="false" aria-controls="progress-details">
                    <span>Show Details</span>
                    <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </button>
            </div>
            <div class="overall-progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">0% Complete</div>
            </div>
            <div class="progress-details" id="progress-details" hidden>
                <div class="section-progress-list"></div>
                <div class="learning-stats">
                    <div class="stat">
                        <span class="stat-label">Sections Visited:</span>
                        <span class="stat-value" id="sections-visited">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total Time:</span>
                        <span class="stat-value" id="total-time">0 minutes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Next Step:</span>
                        <span class="stat-value" id="next-step">Start with Security Setup</span>
                    </div>
                </div>
            </div>
        `;

        // Insert after hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.insertAdjacentElement('afterend', progressContainer);
        }

        // Setup toggle functionality
        const toggleBtn = progressContainer.querySelector('.toggle-progress');
        const details = progressContainer.querySelector('.progress-details');
        
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            details.hidden = isExpanded;
            toggleBtn.querySelector('span').textContent = isExpanded ? 'Show Details' : 'Hide Details';
            toggleBtn.querySelector('i').className = `fas fa-chevron-${isExpanded ? 'down' : 'up'}`;
        });
    }

    addTermDefinition(term, definition) {
        // Find all instances of the term in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return node.parentElement.tagName !== 'SCRIPT' && 
                           node.parentElement.tagName !== 'STYLE' &&
                           node.textContent.includes(term) ? 
                           NodeFilter.FILTER_ACCEPT : 
                           NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            if (parent.querySelector('.term-definition')) return; // Already processed

            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            const matches = textNode.textContent.match(regex);
            
            if (matches) {
                const newHTML = textNode.textContent.replace(regex, (match) => {
                    const id = `term-${Math.random().toString(36).substr(2, 9)}`;
                    return `<span class="term-with-definition" 
                                  id="${id}" 
                                  role="button" 
                                  tabindex="0" 
                                  aria-describedby="${id}-def"
                                  title="${definition}">${match}
                            <span class="term-definition sr-only" id="${id}-def">${definition}</span>
                            </span>`;
                });
                
                parent.innerHTML = parent.innerHTML.replace(textNode.textContent, newHTML);
            }
        });

        // Add click and keyboard handlers for term definitions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('term-with-definition')) {
                this.showDefinitionPopup(e.target, definition);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('term-with-definition') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.showDefinitionPopup(e.target, definition);
            }
        });
    }

    addReadingAids() {
        // Add reading level indicators
        document.querySelectorAll('section').forEach(section => {
            const readingLevel = this.calculateReadingLevel(section);
            const indicator = document.createElement('div');
            indicator.className = 'reading-level-indicator';
            indicator.innerHTML = `
                <span class="reading-level-label">Reading Level:</span>
                <span class="reading-level-value ${readingLevel.class}">${readingLevel.text}</span>
            `;
            
            const header = section.querySelector('.section-header, h2');
            if (header) {
                header.appendChild(indicator);
            }
        });

        // Add reading tools
        this.addReadingTools();
    }

    addReadingTools() {
        const readingTools = document.createElement('div');
        readingTools.className = 'reading-tools';
        readingTools.setAttribute('role', 'toolbar');
        readingTools.setAttribute('aria-label', 'Reading assistance tools');

        readingTools.innerHTML = `
            <button class="reading-tool" id="increase-text" title="Increase text size">
                <i class="fas fa-plus" aria-hidden="true"></i>
                <span class="sr-only">Increase text size</span>
            </button>
            <button class="reading-tool" id="decrease-text" title="Decrease text size">
                <i class="fas fa-minus" aria-hidden="true"></i>
                <span class="sr-only">Decrease text size</span>
            </button>
            <button class="reading-tool" id="reading-ruler" title="Toggle reading ruler">
                <i class="fas fa-ruler-horizontal" aria-hidden="true"></i>
                <span class="sr-only">Toggle reading ruler</span>
            </button>
            <button class="reading-tool" id="simplify-language" title="Simplify language">
                <i class="fas fa-language" aria-hidden="true"></i>
                <span class="sr-only">Simplify language</span>
            </button>
        `;

        document.body.appendChild(readingTools);

        // Add functionality
        this.setupReadingToolsLogic(readingTools);
    }

    createStepGuides() {
        // Add step-by-step overlays for complex sections
        const complexSections = ['installation', 'security', 'sub-agents'];
        
        complexSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                this.addStepGuide(section);
            }
        });
    }

    addStepGuide(section) {
        const stepGuideBtn = document.createElement('button');
        stepGuideBtn.className = 'step-guide-trigger';
        stepGuideBtn.innerHTML = `
            <i class="fas fa-route" aria-hidden="true"></i>
            Step-by-Step Guide
        `;
        stepGuideBtn.setAttribute('aria-label', 'Open step-by-step guide for this section');

        const header = section.querySelector('.section-header, h2');
        if (header) {
            header.appendChild(stepGuideBtn);
        }

        stepGuideBtn.addEventListener('click', () => {
            this.showStepGuide(section);
        });
    }

    markSectionVisited(sectionId) {
        const progress = this.userProgress.get(sectionId);
        if (progress && !progress.visited) {
            progress.visited = true;
            progress.startTime = Date.now();
            this.updateProgressDisplay();
            this.saveProgress();
        }
    }

    incrementInteractions(sectionId) {
        const progress = this.userProgress.get(sectionId);
        if (progress) {
            progress.interactions++;
            this.saveProgress();
        }
    }

    updateProgressDisplay() {
        const visitedSections = Array.from(this.userProgress.values()).filter(p => p.visited).length;
        const totalSections = this.userProgress.size;
        const progressPercentage = Math.round((visitedSections / totalSections) * 100);

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressBar && progressFill && progressText) {
            progressBar.setAttribute('aria-valuenow', progressPercentage);
            progressFill.style.width = `${progressPercentage}%`;
            progressText.textContent = `${progressPercentage}% Complete`;
        }

        // Update stats
        const sectionsVisitedEl = document.getElementById('sections-visited');
        if (sectionsVisitedEl) {
            sectionsVisitedEl.textContent = visitedSections;
        }

        // Update next step
        this.updateNextStep();
    }

    updateNextStep() {
        const nextStepEl = document.getElementById('next-step');
        if (!nextStepEl) return;

        const unvisitedRequired = Array.from(this.userProgress.values())
            .find(p => p.required && !p.visited);

        if (unvisitedRequired) {
            nextStepEl.textContent = unvisitedRequired.title;
        } else {
            const unvisitedOptional = Array.from(this.userProgress.values())
                .find(p => !p.required && !p.visited);
            
            if (unvisitedOptional) {
                nextStepEl.textContent = `Optional: ${unvisitedOptional.title}`;
            } else {
                nextStepEl.textContent = 'All sections completed!';
            }
        }
    }

    saveProgress() {
        try {
            const progressData = Object.fromEntries(this.userProgress);
            localStorage.setItem('claude-training-progress', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Could not save progress to localStorage:', error);
        }
    }

    loadSavedProgress() {
        try {
            const savedData = localStorage.getItem('claude-training-progress');
            if (savedData) {
                const progressData = JSON.parse(savedData);
                Object.entries(progressData).forEach(([sectionId, data]) => {
                    if (this.userProgress.has(sectionId)) {
                        this.userProgress.set(sectionId, { ...this.userProgress.get(sectionId), ...data });
                    }
                });
                this.updateProgressDisplay();
            }
        } catch (error) {
            console.warn('Could not load saved progress:', error);
        }
    }

    calculateReadingLevel(section) {
        const text = section.textContent;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);

        // Flesch Reading Ease calculation (simplified)
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

        if (score >= 70) return { text: 'Easy', class: 'easy' };
        if (score >= 50) return { text: 'Medium', class: 'medium' };
        return { text: 'Advanced', class: 'hard' };
    }

    countSyllables(word) {
        // Simple syllable counting algorithm
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    showDefinitionPopup(element, definition) {
        // Remove existing popup
        const existingPopup = document.querySelector('.definition-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'definition-popup';
        popup.setAttribute('role', 'tooltip');
        popup.innerHTML = `
            <div class="definition-content">
                <button class="close-definition" aria-label="Close definition">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                <p>${definition}</p>
            </div>
        `;

        document.body.appendChild(popup);

        // Position popup
        const rect = element.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        // Close functionality
        const closeBtn = popup.querySelector('.close-definition');
        closeBtn.addEventListener('click', () => popup.remove());

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 10000);

        // Announce to screen readers
        window.accessibilityEnhancer?.announce(`Definition: ${definition}`);
    }

    announceProgress(message) {
        if (window.accessibilityEnhancer) {
            window.accessibilityEnhancer.announce(message);
        }
    }

    // Export for external use
    getProgress() {
        return Object.fromEntries(this.userProgress);
    }

    resetProgress() {
        this.userProgress.forEach(progress => {
            progress.visited = false;
            progress.completed = false;
            progress.timeSpent = 0;
            progress.interactions = 0;
        });
        this.updateProgressDisplay();
        this.saveProgress();
        this.announceProgress('Learning progress has been reset');
    }
}

// Initialize cognitive aids when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cognitiveAids = new CognitiveAids();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CognitiveAids;
}