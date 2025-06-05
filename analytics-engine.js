/**
 * Analytics Engine for Claude Code Training Platform
 * Tracks user interactions, learning progress, and provides personalized recommendations
 */

class AnalyticsEngine {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.interactions = [];
        this.currentModule = null;
        this.moduleStartTime = null;
        this.knowledgeGraph = new Map();
        this.learningPatterns = {};
        
        this.initializeTracking();
    }

    /**
     * Initialize tracking systems
     */
    initializeTracking() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackVisibilityChange();
        });

        // Track user interactions
        this.setupInteractionTracking();
        
        // Initialize knowledge graph
        this.initializeKnowledgeGraph();
        
        // Start session
        this.trackAction('session_start', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionId: this.sessionId
        });
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track user actions and interactions
     */
    trackAction(action, data = {}) {
        const interaction = {
            id: this.generateInteractionId(),
            sessionId: this.sessionId,
            action,
            timestamp: Date.now(),
            module: this.currentModule,
            data: {
                ...data,
                url: window.location.href,
                referrer: document.referrer
            }
        };

        this.interactions.push(interaction);
        this.saveInteraction(interaction);
        this.updateLearningPatterns(interaction);
        
        // Real-time analysis for immediate feedback
        this.analyzeInteraction(interaction);
    }

    /**
     * Track module completion and progress
     */
    trackModuleProgress(moduleId, progress, timeSpent = null) {
        const moduleData = {
            moduleId,
            progress: Math.min(100, Math.max(0, progress)),
            timeSpent: timeSpent || (this.moduleStartTime ? Date.now() - this.moduleStartTime : 0),
            completedAt: progress >= 100 ? new Date().toISOString() : null,
            attempts: this.getModuleAttempts(moduleId) + 1
        };

        this.trackAction('module_progress', moduleData);
        
        // Update knowledge retention scoring
        this.updateKnowledgeRetention(moduleId, progress);
        
        // Generate personalized recommendations
        if (progress >= 100) {
            this.generateNextRecommendations(moduleId);
        }
        
        return moduleData;
    }

    /**
     * Track assessment results and performance
     */
    trackAssessment(assessmentId, results) {
        const assessmentData = {
            assessmentId,
            score: results.score,
            totalQuestions: results.totalQuestions,
            correctAnswers: results.correctAnswers,
            timeSpent: results.timeSpent,
            questionResults: results.questionResults,
            difficulty: results.difficulty,
            topics: results.topics,
            retakes: this.getAssessmentRetakes(assessmentId)
        };

        this.trackAction('assessment_completed', assessmentData);
        
        // Analyze performance patterns
        this.analyzeAssessmentPerformance(assessmentData);
        
        // Update skill assessments
        this.updateSkillAssessments(assessmentData);
        
        return assessmentData;
    }

    /**
     * Track time spent on modules and activities
     */
    trackTimeOnTask(moduleId, duration, activityType = 'reading') {
        const timeData = {
            moduleId,
            duration,
            activityType,
            efficiency: this.calculateLearningEfficiency(moduleId, duration),
            focusScore: this.calculateFocusScore(duration)
        };

        this.trackAction('time_on_task', timeData);
        
        // Update learning velocity metrics
        this.updateLearningVelocity(timeData);
        
        return timeData;
    }

    /**
     * Set current module for context tracking
     */
    setCurrentModule(moduleId) {
        if (this.currentModule && this.moduleStartTime) {
            // Track time spent on previous module
            const timeSpent = Date.now() - this.moduleStartTime;
            this.trackTimeOnTask(this.currentModule, timeSpent);
        }
        
        this.currentModule = moduleId;
        this.moduleStartTime = Date.now();
        
        this.trackAction('module_start', { moduleId });
    }

    /**
     * Get overall learning statistics
     */
    getOverallStats() {
        const userData = this.getUserProgressData();
        const weeklyData = this.getWeeklyStats();
        
        return {
            completionRate: this.calculateOverallCompletion(),
            totalStudyTime: Math.round(this.getTotalStudyTime() / 3600000), // Convert to hours
            badgesEarned: this.getTotalBadges(),
            averageScore: this.getAverageAssessmentScore(),
            weeklyProgress: weeklyData.progressIncrease,
            weeklyStudyTime: Math.round(weeklyData.studyTime / 3600000),
            weeklyBadges: weeklyData.newBadges,
            scoreImprovement: weeklyData.scoreImprovement,
            learningStreak: this.getCurrentStreak(),
            knowledgeRetention: this.getAverageRetention()
        };
    }

    /**
     * Get learning progress history for charts
     */
    getProgressHistory(days = 30) {
        const history = this.getHistoricalData(days);
        
        return {
            labels: history.map(d => d.date),
            completion: history.map(d => d.completionRate),
            scores: history.map(d => d.averageScore),
            studyTime: history.map(d => d.studyTime),
            retention: history.map(d => d.retentionScore)
        };
    }

    /**
     * Get skills distribution for pie chart
     */
    getSkillsDistribution() {
        const skills = this.aggregateSkillProgress();
        
        return {
            labels: Object.keys(skills),
            values: Object.values(skills).map(skill => skill.completionRate)
        };
    }

    /**
     * Get personalized learning path
     */
    getLearningPath() {
        const modules = this.getAllModules();
        const userProgress = this.getUserProgressData();
        
        return modules.map(module => {
            const progress = userProgress.modules[module.id] || { completion: 0, unlocked: false };
            const prerequisites = this.checkPrerequisites(module.id);
            
            return {
                id: module.id,
                title: module.title,
                description: module.description,
                icon: module.icon,
                progress: progress.completion,
                status: this.getModuleStatus(module.id, progress, prerequisites),
                estimatedTime: this.getEstimatedCompletionTime(module.id),
                difficulty: module.difficulty,
                prerequisites: module.prerequisites
            };
        });
    }

    /**
     * Get recent user activity
     */
    getRecentActivity(limit = 10) {
        return this.interactions
            .filter(i => ['module_progress', 'assessment_completed', 'badge_earned'].includes(i.action))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .map(interaction => ({
                type: this.getActivityType(interaction.action),
                icon: this.getActivityIcon(interaction.action),
                title: this.getActivityTitle(interaction),
                time: this.formatRelativeTime(interaction.timestamp)
            }));
    }

    /**
     * Get next recommended module
     */
    getNextRecommendedModule() {
        const recommendations = this.generatePersonalizedRecommendations();
        return recommendations.length > 0 ? recommendations[0] : null;
    }

    /**
     * Calculate overall learning progress
     */
    getOverallProgress() {
        const totalModules = this.getAllModules().length;
        const completedModules = this.getCompletedModules().length;
        
        return Math.round((completedModules / totalModules) * 100);
    }

    /**
     * Export comprehensive progress report
     */
    exportProgressReport() {
        const userData = this.getUserProgressData();
        const analytics = this.getOverallStats();
        const skillsData = this.getDetailedSkillsAnalysis();
        const learningPath = this.getLearningPath();
        const assessmentHistory = this.getAssessmentHistory();
        
        return {
            exportDate: new Date().toISOString(),
            user: userData.profile,
            summary: analytics,
            skills: skillsData,
            learningPath,
            assessments: assessmentHistory,
            timeTracking: this.getTimeTrackingReport(),
            achievements: this.getAchievementHistory(),
            recommendations: this.generatePersonalizedRecommendations(),
            learningAnalytics: {
                preferredLearningTimes: this.getPreferredLearningTimes(),
                learningVelocity: this.getLearningVelocity(),
                knowledgeRetention: this.getKnowledgeRetentionReport(),
                difficultyPreferences: this.getDifficultyPreferences()
            }
        };
    }

    // Private helper methods

    /**
     * Setup interaction tracking for various UI elements
     */
    setupInteractionTracking() {
        // Track clicks on navigation elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-track]')) {
                this.trackAction('click', {
                    element: e.target.tagName,
                    id: e.target.id,
                    class: e.target.className,
                    text: e.target.textContent?.substring(0, 50),
                    trackingData: e.target.dataset.track
                });
            }
        });

        // Track scroll behavior
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackAction('scroll', {
                    scrollPosition: window.scrollY,
                    documentHeight: document.body.scrollHeight,
                    viewportHeight: window.innerHeight,
                    scrollPercentage: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
                });
            }, 1000);
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-track]')) {
                this.trackAction('form_submit', {
                    formId: e.target.id,
                    trackingData: e.target.dataset.track
                });
            }
        });
    }

    /**
     * Initialize knowledge graph for prerequisite tracking
     */
    initializeKnowledgeGraph() {
        const modules = this.getAllModules();
        
        modules.forEach(module => {
            this.knowledgeGraph.set(module.id, {
                prerequisites: module.prerequisites || [],
                dependents: modules.filter(m => m.prerequisites?.includes(module.id)).map(m => m.id),
                concepts: module.concepts || [],
                difficulty: module.difficulty || 'medium'
            });
        });
    }

    /**
     * Analyze interaction patterns for insights
     */
    analyzeInteraction(interaction) {
        // Detect learning patterns
        this.detectLearningPatterns(interaction);
        
        // Check for struggling indicators
        this.checkStruggleIndicators(interaction);
        
        // Update engagement metrics
        this.updateEngagementMetrics(interaction);
    }

    /**
     * Update knowledge retention scoring
     */
    updateKnowledgeRetention(moduleId, progress) {
        const userData = this.getUserProgressData();
        const module = userData.modules[moduleId] || {};
        
        const retentionScore = this.calculateRetentionScore(moduleId, progress);
        
        userData.modules[moduleId] = {
            ...module,
            retentionScore,
            lastReviewed: Date.now(),
            reviewCount: (module.reviewCount || 0) + 1
        };
        
        this.saveUserData(userData);
    }

    /**
     * Calculate learning efficiency metrics
     */
    calculateLearningEfficiency(moduleId, timeSpent) {
        const averageTime = this.getAverageModuleTime(moduleId);
        const userTime = timeSpent;
        
        if (averageTime === 0) return 1;
        
        return Math.max(0.1, Math.min(2, averageTime / userTime));
    }

    /**
     * Calculate focus score based on interaction patterns
     */
    calculateFocusScore(duration) {
        const interactions = this.getRecentInteractions(duration);
        const expectedInteractions = Math.ceil(duration / 30000); // Expected interaction every 30s
        
        return Math.min(1, interactions.length / expectedInteractions);
    }

    /**
     * Generate personalized recommendations
     */
    generatePersonalizedRecommendations() {
        const userProgress = this.getUserProgressData();
        const learningPatterns = this.learningPatterns;
        const availableModules = this.getAvailableModules();
        
        return availableModules
            .map(module => ({
                ...module,
                score: this.calculateRecommendationScore(module, userProgress, learningPatterns)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    /**
     * Track visibility changes for accurate time tracking
     */
    trackVisibilityChange() {
        if (document.hidden) {
            this.trackAction('page_hidden');
        } else {
            this.trackAction('page_visible');
        }
    }

    /**
     * Save interaction to local storage and potentially to server
     */
    saveInteraction(interaction) {
        const userData = this.getUserProgressData();
        userData.interactions = userData.interactions || [];
        userData.interactions.push(interaction);
        
        // Keep only last 1000 interactions in local storage
        if (userData.interactions.length > 1000) {
            userData.interactions = userData.interactions.slice(-1000);
        }
        
        this.saveUserData(userData);
        
        // Queue for server sync if available
        this.queueForSync(interaction);
    }

    /**
     * Generate unique interaction ID
     */
    generateInteractionId() {
        return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get user progress data from storage
     */
    getUserProgressData() {
        try {
            return JSON.parse(localStorage.getItem('claudeCodeProgress')) || {
                profile: {},
                modules: {},
                assessments: {},
                achievements: {},
                interactions: [],
                preferences: {},
                analytics: {}
            };
        } catch (error) {
            console.error('Error loading user progress data:', error);
            return {
                profile: {},
                modules: {},
                assessments: {},
                achievements: {},
                interactions: [],
                preferences: {},
                analytics: {}
            };
        }
    }

    /**
     * Save user data to local storage
     */
    saveUserData(data) {
        try {
            localStorage.setItem('claudeCodeProgress', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user progress data:', error);
        }
    }

    /**
     * Queue data for server synchronization
     */
    queueForSync(data) {
        const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        syncQueue.push({
            data,
            timestamp: Date.now(),
            type: 'interaction'
        });
        
        // Keep queue manageable
        if (syncQueue.length > 100) {
            syncQueue.splice(0, syncQueue.length - 100);
        }
        
        localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    }

    // Mock data methods for demonstration
    getAllModules() {
        return [
            { id: 'security', title: 'Security Setup', description: 'Learn secure enterprise usage', icon: 'fa-shield-alt', difficulty: 'beginner', concepts: ['vertex-ai', 'authentication'], prerequisites: [] },
            { id: 'installation', title: 'Installation', description: 'Install and configure Claude Code', icon: 'fa-download', difficulty: 'beginner', concepts: ['setup', 'configuration'], prerequisites: ['security'] },
            { id: 'memory', title: 'Memory Management', description: 'Understand Claude Code memory', icon: 'fa-brain', difficulty: 'intermediate', concepts: ['context', 'memory'], prerequisites: ['installation'] },
            { id: 'commands', title: 'Commands Reference', description: 'Master core commands', icon: 'fa-terminal', difficulty: 'intermediate', concepts: ['commands', 'cli'], prerequisites: ['installation'] },
            { id: 'workflows', title: 'Development Workflows', description: 'Integrate into development process', icon: 'fa-project-diagram', difficulty: 'advanced', concepts: ['git', 'workflows'], prerequisites: ['commands', 'memory'] },
            { id: 'sub-agents', title: 'Sub-Agents Deep Dive', description: 'Advanced sub-agent usage', icon: 'fa-robot', difficulty: 'advanced', concepts: ['sub-agents', 'coordination'], prerequisites: ['workflows'] }
        ];
    }

    getCompletedModules() {
        const userData = this.getUserProgressData();
        return Object.entries(userData.modules)
            .filter(([id, data]) => data.completion >= 100)
            .map(([id]) => id);
    }

    calculateOverallCompletion() {
        const total = this.getAllModules().length;
        const completed = this.getCompletedModules().length;
        return Math.round((completed / total) * 100);
    }

    getTotalStudyTime() {
        const userData = this.getUserProgressData();
        return Object.values(userData.modules).reduce((total, module) => total + (module.timeSpent || 0), 0);
    }

    getTotalBadges() {
        const userData = this.getUserProgressData();
        return Object.keys(userData.achievements).length;
    }

    getAverageAssessmentScore() {
        const userData = this.getUserProgressData();
        const scores = Object.values(userData.assessments).map(a => a.score);
        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    formatRelativeTime(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    getActivityType(action) {
        const types = {
            'module_progress': 'completed',
            'assessment_completed': 'assessment',
            'badge_earned': 'badge'
        };
        return types[action] || 'activity';
    }

    getActivityIcon(action) {
        const icons = {
            'module_progress': 'fa-check-circle',
            'assessment_completed': 'fa-clipboard-check',
            'badge_earned': 'fa-trophy'
        };
        return icons[action] || 'fa-activity';
    }

    getActivityTitle(interaction) {
        switch (interaction.action) {
            case 'module_progress':
                return `Completed ${interaction.data.moduleId} module`;
            case 'assessment_completed':
                return `Scored ${interaction.data.score}% on ${interaction.data.assessmentId}`;
            case 'badge_earned':
                return `Earned ${interaction.data.badgeTitle} badge`;
            default:
                return 'Activity recorded';
        }
    }

    // Additional helper methods would continue here...
    // This is a comprehensive foundation for the analytics engine
}

// Create global instance
const AnalyticsEngine = new AnalyticsEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsEngine;
}