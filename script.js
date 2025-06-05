/**
 * AutoZone Claude Code Training Hub - Interactive JavaScript
 * Comprehensive functionality for an engaging learning experience
 */

// ====================================
// 1. CORE INITIALIZATION & CONFIG
// ====================================

class ClaudeCodeTrainingHub {
    constructor() {
        this.state = {
            currentTheme: 'light',
            currentUser: null,
            progress: {},
            achievements: [],
            searchIndex: [],
            analyticsData: {
                pageViews: {},
                timeOnSection: {},
                completedSections: [],
                quizScores: {}
            }
        };
        
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupEventListeners();
        this.initializeComponents();
        this.setupKeyboardShortcuts();
        this.setupAnalytics();
        this.initializeSearch();
        this.setupAccessibility();
        console.log('Claude Code Training Hub initialized successfully');
    }

    // ====================================
    // 2. NAVIGATION & UI INTERACTIONS
    // ====================================

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileNav(navToggle, navList);
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSmoothScroll(e);
            });
        });

        // Copy to clipboard buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.copyCodeToClipboard(btn);
            });
        });

        // Progress tracking
        this.setupScrollTracking();
        
        // Theme toggle setup
        this.setupThemeToggle();

        // Resize handler for responsive features
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    toggleMobileNav(toggle, nav) {
        const isOpen = toggle.classList.contains('active');
        
        if (isOpen) {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            toggle.classList.add('active');
            nav.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
        }

        // Track analytics
        this.trackEvent('navigation', 'mobile_menu_toggle', isOpen ? 'close' : 'open');
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL without causing scroll
            history.pushState(null, null, targetId);
            
            // Track section visit
            this.trackSectionVisit(targetId.substring(1));
            
            // Close mobile nav if open
            const navToggle = document.querySelector('.nav-toggle');
            const navList = document.querySelector('.nav-list');
            if (navToggle && navToggle.classList.contains('active')) {
                this.toggleMobileNav(navToggle, navList);
            }
        }
    }

    // ====================================
    // 3. TAB SWITCHING & ACCORDION FUNCTIONALITY
    // ====================================

    showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Activate selected tab button
        const selectedBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Track tab selection
        this.trackEvent('interaction', 'tab_switch', tabName);
    }

    toggleAccordion(header) {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('.fa-chevron-down');
        
        const isOpen = item.classList.contains('active');
        
        // Close all other accordion items first
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherIcon = otherItem.querySelector('.fa-chevron-down');
                if (otherIcon) {
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        if (isOpen) {
            item.classList.remove('active');
            icon.style.transform = 'rotate(0deg)';
            content.style.maxHeight = '0px';
        } else {
            item.classList.add('active');
            icon.style.transform = 'rotate(180deg)';
            content.style.maxHeight = content.scrollHeight + 'px';
        }

        // Track accordion interaction
        const title = header.querySelector('h3').textContent.trim();
        this.trackEvent('interaction', 'accordion_toggle', title);
    }

    // ====================================
    // 4. COPY TO CLIPBOARD FUNCTIONALITY
    // ====================================

    copyCodeToClipboard(button) {
        const codeBlock = button.closest('.code-block');
        const codeElement = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
        
        if (!codeElement) return;
        
        const codeText = codeElement.textContent;
        
        navigator.clipboard.writeText(codeText).then(() => {
            // Visual feedback
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
            }, 2000);
            
            // Screen reader announcement
            this.announceToScreenReader('Code copied to clipboard');
            
            // Track copy action
            this.trackEvent('interaction', 'code_copy', codeText.substring(0, 50));
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            this.showNotification('Failed to copy code', 'error');
        });
    }

    // ====================================
    // 5. INTERACTIVE DEMOS
    // ====================================

    showStatusDemo() {
        const output = document.getElementById('status-output');
        const button = document.querySelector('[onclick="showStatusDemo()"]');
        
        if (output.style.display === 'none') {
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
            button.disabled = true;
            
            // Simulate command execution
            setTimeout(() => {
                output.style.display = 'block';
                output.style.opacity = '0';
                
                // Fade in effect
                let opacity = 0;
                const fadeIn = setInterval(() => {
                    opacity += 0.1;
                    output.style.opacity = opacity;
                    if (opacity >= 1) {
                        clearInterval(fadeIn);
                    }
                }, 50);
                
                button.innerHTML = '<i class="fas fa-redo"></i> Run Again';
                button.disabled = false;
                
                // Track demo interaction
                this.trackEvent('demo', 'status_command', 'executed');
            }, 1500);
        } else {
            // Reset demo
            output.style.display = 'none';
            button.innerHTML = '<i class="fas fa-play"></i> Run Demo';
        }
    }

    showSubAgentDemo() {
        const demo = document.getElementById('sub-agent-demo');
        const button = document.querySelector('[onclick="showSubAgentDemo()"]');
        
        if (demo.style.display === 'none') {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Agents...';
            button.disabled = true;
            
            demo.style.display = 'block';
            
            // Animate each agent response with delay
            const responses = demo.querySelectorAll('.agent-response');
            responses.forEach((response, index) => {
                response.style.opacity = '0';
                response.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    response.style.transition = 'all 0.5s ease';
                    response.style.opacity = '1';
                    response.style.transform = 'translateY(0)';
                    
                    // Add typing animation to content
                    const content = response.querySelector('.agent-content');
                    this.typeWriter(content, content.textContent, 50);
                }, index * 800);
            });
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-stop"></i> Stop Demo';
                button.disabled = false;
            }, responses.length * 800 + 1000);
            
            this.trackEvent('demo', 'sub_agents', 'started');
        } else {
            demo.style.display = 'none';
            button.innerHTML = '<i class="fas fa-play"></i> See Sub-Agents in Action';
        }
    }

    typeWriter(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // ====================================
    // 6. SEARCH FUNCTIONALITY
    // ====================================

    initializeSearch() {
        this.buildSearchIndex();
        this.createSearchInterface();
    }

    buildSearchIndex() {
        const sections = document.querySelectorAll('.content-section');
        this.state.searchIndex = [];
        
        sections.forEach(section => {
            const id = section.id;
            const title = section.querySelector('h2')?.textContent || '';
            const content = section.textContent.toLowerCase();
            
            this.state.searchIndex.push({
                id,
                title,
                content,
                element: section
            });
        });
    }

    createSearchInterface() {
        const header = document.querySelector('.header .container');
        if (!header) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="search" id="searchInput" placeholder="Search documentation..." aria-label="Search">
                <button id="searchBtn" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div id="searchResults" class="search-results" style="display: none;"></div>
        `;
        
        header.appendChild(searchContainer);
        
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value, searchResults);
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Keyboard navigation for search results
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeyNavigation(e, searchResults);
        });
    }

    performSearch(query, resultsContainer) {
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const results = this.state.searchIndex.filter(item => 
            item.content.includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result" data-target="#${result.id}">
                    <h4>${result.title}</h4>
                    <p>${this.getSearchSnippet(result.content, query)}</p>
                </div>
            `).join('');
            
            // Add click handlers to results
            resultsContainer.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', () => {
                    const target = result.dataset.target;
                    const element = document.querySelector(target);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        resultsContainer.style.display = 'none';
                        this.trackEvent('search', 'result_click', target);
                    }
                });
            });
        }
        
        resultsContainer.style.display = 'block';
        this.trackEvent('search', 'query', query);
    }

    getSearchSnippet(content, query, length = 150) {
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.substring(0, length) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + length);
        
        return '...' + content.substring(start, end) + '...';
    }

    // ====================================
    // 7. THEME SWITCHING (LIGHT/DARK MODE)
    // ====================================

    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        
        const header = document.querySelector('.header .container');
        if (header) {
            header.appendChild(themeToggle);
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('claude-training-theme') || 'light';
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            this.trackEvent('interaction', 'theme_toggle', newTheme);
        });
    }

    setTheme(theme) {
        this.state.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'light' ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
        }
        
        localStorage.setItem('claude-training-theme', theme);
    }

    // ====================================
    // 8. KEYBOARD SHORTCUTS
    // ====================================

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + D for dark mode toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
            
            // Numbers 1-5 for quick navigation
            if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
                const sections = ['overview', 'setup', 'commands', 'workflows', 'troubleshooting'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sectionIndex < sections.length) {
                    const element = document.getElementById(sections[sectionIndex]);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
            
            // Escape to close modals/overlays
            if (e.key === 'Escape') {
                this.closeAllOverlays();
            }
        });
    }

    closeAllOverlays() {
        // Close search results
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        
        // Close mobile nav
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');
        if (navToggle && navToggle.classList.contains('active')) {
            this.toggleMobileNav(navToggle, navList);
        }
    }

    // ====================================
    // 9. PROGRESS TRACKING & LOCAL STORAGE
    // ====================================

    loadUserProgress() {
        const saved = localStorage.getItem('claude-training-progress');
        if (saved) {
            this.state.progress = JSON.parse(saved);
        }
        
        const savedAnalytics = localStorage.getItem('claude-training-analytics');
        if (savedAnalytics) {
            this.state.analyticsData = { ...this.state.analyticsData, ...JSON.parse(savedAnalytics) };
        }
        
        this.updateProgressDisplay();
    }

    saveUserProgress() {
        localStorage.setItem('claude-training-progress', JSON.stringify(this.state.progress));
        localStorage.setItem('claude-training-analytics', JSON.stringify(this.state.analyticsData));
    }

    markSectionComplete(sectionId) {
        this.state.progress[sectionId] = {
            completed: true,
            completedAt: Date.now(),
            visits: (this.state.progress[sectionId]?.visits || 0) + 1
        };
        
        this.saveUserProgress();
        this.updateProgressDisplay();
        this.checkAchievements();
    }

    setupScrollTracking() {
        const sections = document.querySelectorAll('.content-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.trackSectionVisit(sectionId);
                    
                    // Mark as viewed after 5 seconds
                    setTimeout(() => {
                        if (this.isElementInViewport(entry.target)) {
                            this.markSectionViewed(sectionId);
                        }
                    }, 5000);
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    trackSectionVisit(sectionId) {
        if (!this.state.analyticsData.timeOnSection[sectionId]) {
            this.state.analyticsData.timeOnSection[sectionId] = {
                visits: 0,
                totalTime: 0,
                lastVisit: null
            };
        }
        
        this.state.analyticsData.timeOnSection[sectionId].visits++;
        this.state.analyticsData.timeOnSection[sectionId].lastVisit = Date.now();
        this.saveUserProgress();
    }

    markSectionViewed(sectionId) {
        if (!this.state.progress[sectionId]) {
            this.state.progress[sectionId] = {};
        }
        
        this.state.progress[sectionId].viewed = true;
        this.saveUserProgress();
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        const totalSections = document.querySelectorAll('.content-section').length;
        const completedSections = Object.values(this.state.progress).filter(p => p.viewed).length;
        const progressPercentage = Math.round((completedSections / totalSections) * 100);
        
        // Create or update progress bar
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = this.createProgressBar();
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        const progressText = progressBar.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = progressPercentage + '%';
            progressText.textContent = `${progressPercentage}% Complete (${completedSections}/${totalSections} sections)`;
        }
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-fill"></div>
                <div class="progress-text">0% Complete</div>
            </div>
        `;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(progressBar);
        }
        
        return progressBar;
    }

    // ====================================
    // 10. INTERACTIVE QUIZZES & KNOWLEDGE CHECKS
    // ====================================

    initializeQuizzes() {
        this.createQuizzes();
        this.setupQuizEventListeners();
    }

    createQuizzes() {
        const quizData = [
            {
                id: 'security-quiz',
                section: 'security',
                title: 'Security Setup Knowledge Check',
                questions: [
                    {
                        question: 'Which environment variable is required for Vertex AI?',
                        options: [
                            'CLAUDE_CODE_USE_VERTEX=1',
                            'ANTHROPIC_API_KEY',
                            'VERTEX_ENABLED=true',
                            'GCLOUD_AUTH=1'
                        ],
                        correct: 0
                    },
                    {
                        question: 'What GCP project should you use?',
                        options: [
                            'my-personal-project',
                            'azsb-it-genai',
                            'autozone-claude',
                            'vertex-ai-project'
                        ],
                        correct: 1
                    }
                ]
            },
            {
                id: 'commands-quiz',
                section: 'commands',
                title: 'Commands Knowledge Check',
                questions: [
                    {
                        question: 'Which command shows current configuration?',
                        options: ['/help', '/status', '/config', '/info'],
                        correct: 1
                    },
                    {
                        question: 'What keyboard shortcut triggers auto-edit mode?',
                        options: ['Ctrl+Tab', 'Shift+Tab', 'Alt+Tab', 'Cmd+Tab'],
                        correct: 1
                    }
                ]
            }
        ];

        quizData.forEach(quiz => this.createQuiz(quiz));
    }

    createQuiz(quizData) {
        const section = document.getElementById(quizData.section);
        if (!section) return;

        const quizContainer = document.createElement('div');
        quizContainer.className = 'quiz-container';
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <h3><i class="fas fa-question-circle"></i> ${quizData.title}</h3>
                <div class="quiz-progress">
                    <span class="current-question">1</span> / <span class="total-questions">${quizData.questions.length}</span>
                </div>
            </div>
            <div class="quiz-content">
                ${quizData.questions.map((q, index) => `
                    <div class="question ${index === 0 ? 'active' : ''}" data-question="${index}">
                        <h4>${q.question}</h4>
                        <div class="options">
                            ${q.options.map((option, optIndex) => `
                                <label class="option">
                                    <input type="radio" name="q${quizData.id}_${index}" value="${optIndex}">
                                    <span class="option-text">${option}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-controls">
                <button class="quiz-btn prev" disabled>Previous</button>
                <button class="quiz-btn next">Next</button>
                <button class="quiz-btn submit" style="display: none;">Submit Quiz</button>
            </div>
            <div class="quiz-results" style="display: none;"></div>
        `;

        section.appendChild(quizContainer);
        this.setupQuizNavigation(quizContainer, quizData);
    }

    setupQuizNavigation(container, quizData) {
        const questions = container.querySelectorAll('.question');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const submitBtn = container.querySelector('.submit');
        const currentQuestionSpan = container.querySelector('.current-question');
        
        let currentQuestion = 0;

        const updateQuestion = () => {
            questions.forEach((q, index) => {
                q.classList.toggle('active', index === currentQuestion);
            });
            
            currentQuestionSpan.textContent = currentQuestion + 1;
            prevBtn.disabled = currentQuestion === 0;
            
            if (currentQuestion === questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            }
        };

        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                updateQuestion();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                updateQuestion();
            }
        });

        submitBtn.addEventListener('click', () => {
            this.gradeQuiz(container, quizData);
        });
    }

    gradeQuiz(container, quizData) {
        const results = container.querySelector('.quiz-results');
        let score = 0;
        const answers = [];

        quizData.questions.forEach((question, qIndex) => {
            const selectedOption = container.querySelector(`input[name="q${quizData.id}_${qIndex}"]:checked`);
            const selectedValue = selectedOption ? parseInt(selectedOption.value) : -1;
            
            answers.push(selectedValue);
            if (selectedValue === question.correct) {
                score++;
            }
        });

        const percentage = Math.round((score / quizData.questions.length) * 100);
        
        results.innerHTML = `
            <div class="quiz-score ${percentage >= 70 ? 'pass' : 'fail'}">
                <h4>Quiz Results</h4>
                <div class="score">
                    <span class="score-number">${score}/${quizData.questions.length}</span>
                    <span class="score-percentage">(${percentage}%)</span>
                </div>
                ${percentage >= 70 ? 
                    '<p class="success"><i class="fas fa-check-circle"></i> Great job! You passed!</p>' :
                    '<p class="retry"><i class="fas fa-times-circle"></i> Try reviewing the material and retake the quiz.</p>'
                }
                <button class="quiz-btn retry" onclick="location.reload()">Retake Quiz</button>
            </div>
        `;
        
        results.style.display = 'block';
        container.querySelector('.quiz-content').style.display = 'none';
        container.querySelector('.quiz-controls').style.display = 'none';

        // Save quiz results
        this.state.analyticsData.quizScores[quizData.id] = {
            score,
            percentage,
            answers,
            completedAt: Date.now()
        };
        this.saveUserProgress();

        // Check for achievements
        if (percentage >= 70) {
            this.unlockAchievement(`quiz_${quizData.section}_passed`);
        }

        this.trackEvent('quiz', 'completed', `${quizData.id}_${percentage}`);
    }

    // ====================================
    // 11. ACHIEVEMENT BADGE SYSTEM
    // ====================================

    checkAchievements() {
        const achievements = [
            {
                id: 'first_visit',
                name: 'Welcome Aboard',
                description: 'Visited the training hub for the first time',
                condition: () => true
            },
            {
                id: 'security_master',
                name: 'Security Expert',
                description: 'Completed security setup section',
                condition: () => this.state.progress.security?.viewed
            },
            {
                id: 'command_ninja',
                name: 'Command Ninja',
                description: 'Viewed all command references',
                condition: () => this.state.progress.commands?.viewed
            },
            {
                id: 'completionist',
                name: 'Completionist',
                description: 'Viewed all sections',
                condition: () => {
                    const sections = document.querySelectorAll('.content-section');
                    return sections.length === Object.values(this.state.progress).filter(p => p.viewed).length;
                }
            }
        ];

        achievements.forEach(achievement => {
            if (!this.state.achievements.includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement.id, achievement.name, achievement.description);
            }
        });
    }

    unlockAchievement(id, name, description) {
        if (this.state.achievements.includes(id)) return;

        this.state.achievements.push(id);
        this.saveUserProgress();
        
        this.showAchievementNotification(name, description);
        this.trackEvent('achievement', 'unlocked', id);
    }

    showAchievementNotification(name, description) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <strong>${name}</strong>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // ====================================
    // 12. ACCESSIBILITY FEATURES
    // ====================================

    setupAccessibility() {
        // Focus management
        this.setupFocusManagement();
        
        // Screen reader announcements
        this.createAriaLiveRegion();
        
        // Keyboard navigation improvements
        this.improveKeyboardNavigation();
        
        // High contrast mode detection
        this.detectHighContrastMode();
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }

    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                event.preventDefault();
            }
        }
    }

    createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    improveKeyboardNavigation() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Improve focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('click', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    detectHighContrastMode() {
        // Detect Windows high contrast mode
        const highContrast = window.matchMedia('(prefers-contrast: high)');
        
        const updateHighContrast = (e) => {
            document.body.classList.toggle('high-contrast', e.matches);
        };
        
        updateHighContrast(highContrast);
        highContrast.addListener(updateHighContrast);
    }

    // ====================================
    // 13. ANALYTICS & TRACKING
    // ====================================

    setupAnalytics() {
        // Track page load
        this.trackEvent('page', 'load', window.location.pathname);
        
        // Track time on page
        this.pageLoadTime = Date.now();
        
        // Track before unload
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageLoadTime;
            this.trackEvent('page', 'time_on_page', Math.round(timeOnPage / 1000));
        });
        
        // Track scroll depth
        this.setupScrollDepthTracking();
    }

    trackEvent(category, action, label, value) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now()
        };
        
        // Store in local analytics
        if (!this.state.analyticsData.events) {
            this.state.analyticsData.events = [];
        }
        this.state.analyticsData.events.push(event);
        
        // Keep only last 1000 events
        if (this.state.analyticsData.events.length > 1000) {
            this.state.analyticsData.events = this.state.analyticsData.events.slice(-1000);
        }
        
        this.saveUserProgress();
        
        // Console log for debugging (remove in production)
        console.log('Analytics Event:', event);
    }

    setupScrollDepthTracking() {
        let maxScrollDepth = 0;
        const trackingPoints = [25, 50, 75, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
            }
            
            trackingPoints.forEach(point => {
                if (scrollDepth >= point && !tracked.has(point)) {
                    tracked.add(point);
                    this.trackEvent('scroll', 'depth', `${point}%`);
                }
            });
        });
    }

    // ====================================
    // 14. PERFORMANCE & LAZY LOADING
    // ====================================

    initializeComponents() {
        this.setupLazyLoading();
        this.initializeQuizzes();
        this.optimizeImages();
    }

    setupLazyLoading() {
        // Lazy load demo content
        const demoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadDemoContent(entry.target);
                    demoObserver.unobserve(entry.target);
                }
            });
        });
        
        document.querySelectorAll('.interactive-demo, .sub-agent-responses').forEach(demo => {
            demoObserver.observe(demo);
        });
    }

    loadDemoContent(element) {
        // Load heavy interactive content only when needed
        if (element.classList.contains('interactive-demo')) {
            element.classList.add('loaded');
        }
    }

    optimizeImages() {
        // Implement responsive images if any are added
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // ====================================
    // 15. UTILITY FUNCTIONS
    // ====================================

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    handleResize() {
        // Close mobile nav on resize
        if (window.innerWidth > 768) {
            const navToggle = document.querySelector('.nav-toggle');
            const navList = document.querySelector('.nav-list');
            if (navToggle && navToggle.classList.contains('active')) {
                this.toggleMobileNav(navToggle, navList);
            }
        }
        
        // Update search results position
        const searchResults = document.getElementById('searchResults');
        if (searchResults && searchResults.style.display !== 'none') {
            // Reposition if needed
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    handleSearchKeyNavigation(e, resultsContainer) {
        const results = resultsContainer.querySelectorAll('.search-result');
        let currentIndex = Array.from(results).findIndex(result => 
            result.classList.contains('highlighted')
        );
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, results.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            results[currentIndex].click();
            return;
        }
        
        results.forEach((result, index) => {
            result.classList.toggle('highlighted', index === currentIndex);
        });
    }
}

// ====================================
// 16. GLOBAL FUNCTIONS FOR HTML INTEGRATION
// ====================================

// Global functions that are called from HTML onclick attributes
let trainingHub;

function copyCode(button) {
    if (trainingHub) {
        trainingHub.copyCodeToClipboard(button);
    }
}

function showTab(tabName) {
    if (trainingHub) {
        trainingHub.showTab(tabName);
    }
}

function toggleAccordion(header) {
    if (trainingHub) {
        trainingHub.toggleAccordion(header);
    }
}

function showStatusDemo() {
    if (trainingHub) {
        trainingHub.showStatusDemo();
    }
}

function showSubAgentDemo() {
    if (trainingHub) {
        trainingHub.showSubAgentDemo();
    }
}

// ====================================
// 17. INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    trainingHub = new ClaudeCodeTrainingHub();
    
    // Add CSS for JavaScript-dependent features
    const style = document.createElement('style');
    style.textContent = `
        /* Progress Bar Styles */
        .progress-bar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            color: white;
        }
        
        .progress-container {
            position: relative;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            height: 40px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            border-radius: 20px;
            transition: width 0.5s ease;
            width: 0%;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        /* Search Styles */
        .search-container {
            position: relative;
            margin-left: auto;
        }
        
        .search-box {
            display: flex;
            align-items: center;
            background: var(--bg-secondary);
            border-radius: 20px;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
        }
        
        .search-box input {
            border: none;
            background: none;
            padding: 0.5rem;
            color: var(--text-primary);
            width: 200px;
        }
        
        .search-box input:focus {
            outline: none;
        }
        
        .search-box button {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .search-results {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            min-width: 300px;
        }
        
        .search-result {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .search-result:hover,
        .search-result.highlighted {
            background: var(--bg-secondary);
        }
        
        .search-result h4 {
            margin: 0 0 0.5rem 0;
            color: var(--text-primary);
        }
        
        .search-result p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .search-no-results {
            padding: 1rem;
            text-align: center;
            color: var(--text-secondary);
        }
        
        /* Theme Toggle */
        .theme-toggle {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .theme-toggle:hover {
            background: var(--bg-secondary);
        }
        
        /* Quiz Styles */
        .quiz-container {
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
            border: 1px solid var(--border-color);
        }
        
        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .quiz-progress {
            background: var(--bg-primary);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .question {
            display: none;
        }
        
        .question.active {
            display: block;
        }
        
        .question h4 {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .option {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            background: var(--bg-primary);
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .option:hover {
            background: var(--bg-hover);
        }
        
        .option input {
            margin-right: 0.75rem;
        }
        
        .quiz-controls {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .quiz-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.2s;
        }
        
        .quiz-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .quiz-btn.prev {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .quiz-btn.next,
        .quiz-btn.submit {
            background: #3b82f6;
            color: white;
        }
        
        .quiz-btn.next:hover,
        .quiz-btn.submit:hover {
            background: #2563eb;
        }
        
        .quiz-results {
            text-align: center;
            padding: 2rem;
        }
        
        .quiz-score.pass {
            color: #10b981;
        }
        
        .quiz-score.fail {
            color: #ef4444;
        }
        
        .score-number {
            font-size: 2rem;
            font-weight: bold;
        }
        
        .score-percentage {
            font-size: 1.2rem;
            margin-left: 0.5rem;
        }
        
        /* Achievement Notification */
        .achievement-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #1a1a1a;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.5s ease;
        }
        
        .achievement-notification.show {
            transform: translateX(0);
        }
        
        .achievement-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .achievement-icon {
            font-size: 2rem;
        }
        
        .achievement-text h4 {
            margin: 0 0 0.25rem 0;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .achievement-text strong {
            display: block;
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
        }
        
        .achievement-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: #3b82f6;
            color: white;
            padding: 1rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification.error {
            background: #ef4444;
        }
        
        .notification.success {
            background: #10b981;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
        }
        
        /* Skip Link */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 0 0 4px 4px;
            z-index: 100000;
        }
        
        .skip-link:focus {
            top: 0;
        }
        
        /* Keyboard Navigation */
        .keyboard-navigation *:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        /* High Contrast Mode */
        .high-contrast {
            --bg-primary: #000000;
            --bg-secondary: #1a1a1a;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --border-color: #ffffff;
        }
        
        /* Dark Theme Variables */
        [data-theme="dark"] {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --bg-hover: #404040;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --border-color: #404040;
        }
        
        /* Light Theme Variables */
        [data-theme="light"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --bg-hover: #e2e8f0;
            --text-primary: #1a202c;
            --text-secondary: #4a5568;
            --border-color: #e2e8f0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .search-box input {
                width: 150px;
            }
            
            .search-results {
                min-width: 250px;
            }
            
            .achievement-notification {
                right: 10px;
                left: 10px;
                transform: translateY(-100px);
            }
            
            .achievement-notification.show {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeCodeTrainingHub;
}