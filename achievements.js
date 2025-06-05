/**
 * Achievement System for Claude Code Training Platform
 * Manages gamification elements, certification levels, skill badges, and leaderboards
 */

class AchievementSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.certificationLevels = this.initializeCertificationLevels();
        this.skillBadges = this.initializeSkillBadges();
        this.userAchievements = this.loadUserAchievements();
        this.leaderboard = this.initializeLeaderboard();
        
        this.init();
    }

    /**
     * Initialize the achievement system
     */
    init() {
        this.setupEventListeners();
        this.checkForNewAchievements();
    }

    /**
     * Award achievement to user
     */
    awardAchievement(achievementId, context = {}) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) {
            console.error(`Achievement ${achievementId} not found`);
            return false;
        }

        // Check if already earned
        if (this.userAchievements.some(ua => ua.achievementId === achievementId)) {
            return false; // Already earned
        }

        const userAchievement = {
            achievementId,
            earnedAt: new Date().toISOString(),
            context,
            notified: false
        };

        this.userAchievements.push(userAchievement);
        this.saveUserAchievements();

        // Show achievement notification
        this.showAchievementNotification(achievement, userAchievement);

        // Update leaderboard
        this.updateLeaderboard(achievementId, achievement.points);

        // Track achievement earning
        if (window.AnalyticsEngine) {
            AnalyticsEngine.trackAction('achievement_earned', {
                achievementId,
                title: achievement.title,
                category: achievement.category,
                points: achievement.points,
                context
            });
        }

        // Check for certification level upgrades
        this.checkCertificationLevelUp();

        return true;
    }

    /**
     * Check if user qualifies for any new achievements
     */
    checkForNewAchievements() {
        if (!window.AnalyticsEngine) return;

        const userProgress = this.getUserProgressData();
        const analytics = AnalyticsEngine.getOverallStats();

        this.achievements.forEach(achievement => {
            if (this.hasEarnedAchievement(achievement.id)) return;

            if (this.checkAchievementCriteria(achievement, userProgress, analytics)) {
                this.awardAchievement(achievement.id, { auto: true });
            }
        });
    }

    /**
     * Check if achievement criteria is met
     */
    checkAchievementCriteria(achievement, userProgress, analytics) {
        const criteria = achievement.criteria;

        switch (achievement.type) {
            case 'progress':
                return this.checkProgressCriteria(criteria, userProgress, analytics);
            case 'streak':
                return this.checkStreakCriteria(criteria, analytics);
            case 'assessment':
                return this.checkAssessmentCriteria(criteria, userProgress);
            case 'time':
                return this.checkTimeCriteria(criteria, analytics);
            case 'skill':
                return this.checkSkillCriteria(criteria, userProgress);
            case 'social':
                return this.checkSocialCriteria(criteria, userProgress);
            case 'special':
                return this.checkSpecialCriteria(criteria, userProgress, analytics);
            default:
                return false;
        }
    }

    /**
     * Check progress-based achievement criteria
     */
    checkProgressCriteria(criteria, userProgress, analytics) {
        if (criteria.overallCompletion && analytics.completionRate < criteria.overallCompletion) {
            return false;
        }
        
        if (criteria.modulesCompleted) {
            const completed = Object.values(userProgress.modules).filter(m => m.completion >= 100).length;
            if (completed < criteria.modulesCompleted) return false;
        }

        if (criteria.specificModules) {
            return criteria.specificModules.every(moduleId => 
                userProgress.modules[moduleId]?.completion >= 100
            );
        }

        return true;
    }

    /**
     * Check streak-based achievement criteria
     */
    checkStreakCriteria(criteria, analytics) {
        return analytics.learningStreak >= criteria.streakDays;
    }

    /**
     * Check assessment-based achievement criteria
     */
    checkAssessmentCriteria(criteria, userProgress) {
        const assessments = Object.values(userProgress.assessments || {});
        
        if (criteria.averageScore) {
            const avgScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length;
            if (avgScore < criteria.averageScore) return false;
        }

        if (criteria.perfectScores) {
            const perfectScores = assessments.filter(a => a.score === 100).length;
            if (perfectScores < criteria.perfectScores) return false;
        }

        if (criteria.assessmentsPassed) {
            const passed = assessments.filter(a => a.passed).length;
            if (passed < criteria.assessmentsPassed) return false;
        }

        return true;
    }

    /**
     * Award skill badge for specific competency
     */
    awardSkillBadge(skillId, level = 'bronze') {
        const skillBadge = this.skillBadges.find(b => b.skillId === skillId);
        if (!skillBadge) return false;

        const badgeLevel = skillBadge.levels.find(l => l.name === level);
        if (!badgeLevel) return false;

        const userBadge = {
            skillId,
            level,
            earnedAt: new Date().toISOString(),
            criteria: badgeLevel.criteria
        };

        // Remove lower level badges for same skill
        this.userAchievements = this.userAchievements.filter(ua => 
            !(ua.skillId === skillId && this.getLevelRank(ua.level) < this.getLevelRank(level))
        );

        this.userAchievements.push(userBadge);
        this.saveUserAchievements();

        this.showSkillBadgeNotification(skillBadge, level);
        return true;
    }

    /**
     * Check and update certification levels
     */
    checkCertificationLevelUp() {
        const userProgress = this.getUserProgressData();
        const currentLevel = this.getCurrentCertificationLevel();
        const analytics = AnalyticsEngine.getOverallStats();

        for (const level of this.certificationLevels) {
            if (level.rank <= currentLevel.rank) continue;

            if (this.checkCertificationCriteria(level, userProgress, analytics)) {
                this.awardCertification(level);
                break; // Award only the next level
            }
        }
    }

    /**
     * Check certification level criteria
     */
    checkCertificationCriteria(level, userProgress, analytics) {
        const criteria = level.criteria;
        
        // Check overall completion
        if (criteria.overallCompletion && analytics.completionRate < criteria.overallCompletion) {
            return false;
        }

        // Check required modules
        if (criteria.requiredModules) {
            const hasRequired = criteria.requiredModules.every(moduleId => 
                userProgress.modules[moduleId]?.completion >= 100
            );
            if (!hasRequired) return false;
        }

        // Check assessment requirements
        if (criteria.averageAssessmentScore) {
            if (analytics.averageScore < criteria.averageAssessmentScore) return false;
        }

        // Check skill badge requirements
        if (criteria.skillBadges) {
            const userSkillBadges = this.getUserSkillBadges();
            const hasRequiredBadges = criteria.skillBadges.every(required => 
                userSkillBadges.some(badge => 
                    badge.skillId === required.skillId && 
                    this.getLevelRank(badge.level) >= this.getLevelRank(required.level)
                )
            );
            if (!hasRequiredBadges) return false;
        }

        // Check practical requirements
        if (criteria.practicalProjects && criteria.practicalProjects > 0) {
            const projects = this.getCompletedProjects(userProgress);
            if (projects.length < criteria.practicalProjects) return false;
        }

        return true;
    }

    /**
     * Award certification level
     */
    awardCertification(level) {
        const certification = {
            levelId: level.id,
            earnedAt: new Date().toISOString(),
            certificate: this.generateCertificate(level),
            validUntil: this.calculateExpirationDate(level)
        };

        const userData = this.getUserProgressData();
        userData.certifications = userData.certifications || [];
        userData.certifications.push(certification);
        this.saveUserData(userData);

        this.showCertificationNotification(level, certification);

        // Track certification earning
        if (window.AnalyticsEngine) {
            AnalyticsEngine.trackAction('certification_earned', {
                levelId: level.id,
                title: level.title,
                rank: level.rank
            });
        }
    }

    /**
     * Get current certification level
     */
    getCurrentCertificationLevel() {
        const userData = this.getUserProgressData();
        const certifications = userData.certifications || [];
        
        if (certifications.length === 0) {
            return this.certificationLevels.find(l => l.rank === 0) || this.certificationLevels[0];
        }

        const latestCert = certifications.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))[0];
        return this.certificationLevels.find(l => l.id === latestCert.levelId);
    }

    /**
     * Get user's skill badges
     */
    getUserSkillBadges() {
        return this.userAchievements.filter(ua => ua.skillId);
    }

    /**
     * Get leaderboard data
     */
    getLeaderboard(type = 'overall', limit = 10) {
        const leaderboardData = this.loadLeaderboardData();
        
        switch (type) {
            case 'weekly':
                return this.getWeeklyLeaderboard(leaderboardData, limit);
            case 'monthly':
                return this.getMonthlyLeaderboard(leaderboardData, limit);
            case 'achievements':
                return this.getAchievementLeaderboard(leaderboardData, limit);
            default:
                return this.getOverallLeaderboard(leaderboardData, limit);
        }
    }

    /**
     * Update user's position on leaderboard
     */
    updateLeaderboard(achievementId, points) {
        const userData = this.getUserProgressData();
        const leaderboardData = this.loadLeaderboardData();
        
        const userId = userData.profile.id || 'current_user';
        const userName = userData.profile.name || 'Anonymous';

        if (!leaderboardData[userId]) {
            leaderboardData[userId] = {
                name: userName,
                totalPoints: 0,
                achievements: [],
                weeklyPoints: 0,
                monthlyPoints: 0,
                lastActivity: new Date().toISOString()
            };
        }

        leaderboardData[userId].totalPoints += points;
        leaderboardData[userId].achievements.push({
            achievementId,
            points,
            earnedAt: new Date().toISOString()
        });
        leaderboardData[userId].lastActivity = new Date().toISOString();

        // Update weekly/monthly points
        this.updatePeriodPoints(leaderboardData[userId]);

        this.saveLeaderboardData(leaderboardData);
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement, userAchievement) {
        const notification = this.createNotificationElement('achievement', {
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            rarity: achievement.rarity
        });

        this.displayNotification(notification);
        this.markAsNotified(userAchievement);
    }

    /**
     * Show skill badge notification
     */
    showSkillBadgeNotification(skillBadge, level) {
        const notification = this.createNotificationElement('skill_badge', {
            title: `${skillBadge.title} - ${level.toUpperCase()}`,
            description: `You've demonstrated ${level} level proficiency in ${skillBadge.title}`,
            icon: skillBadge.icon,
            level: level
        });

        this.displayNotification(notification);
    }

    /**
     * Show certification notification
     */
    showCertificationNotification(level, certification) {
        const notification = this.createNotificationElement('certification', {
            title: `${level.title} Certification`,
            description: level.description,
            icon: level.icon,
            certificate: certification.certificate
        });

        this.displayNotification(notification);
    }

    /**
     * Create notification element
     */
    createNotificationElement(type, data) {
        const notification = document.createElement('div');
        notification.className = `achievement-notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${data.icon}"></i>
                </div>
                <div class="notification-text">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    ${data.points ? `<span class="points">+${data.points} points</span>` : ''}
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return notification;
    }

    /**
     * Display notification to user
     */
    displayNotification(notification) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remove after delay
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Add entrance animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    /**
     * Get recent achievements for dashboard
     */
    getRecentAchievements(limit = 6) {
        const all = [...this.achievements, ...this.skillBadges];
        const earned = this.userAchievements.map(ua => {
            const achievement = all.find(a => a.id === ua.achievementId || a.skillId === ua.skillId);
            return {
                ...achievement,
                earned: true,
                earnedAt: ua.earnedAt
            };
        });

        const notEarned = all.filter(a => 
            !this.userAchievements.some(ua => ua.achievementId === a.id || ua.skillId === a.skillId)
        ).map(a => ({
            ...a,
            earned: false
        }));

        // Sort by earned status and recency
        const sorted = [
            ...earned.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)),
            ...notEarned.sort((a, b) => a.title.localeCompare(b.title))
        ];

        return sorted.slice(0, limit);
    }

    /**
     * Export achievements and certifications
     */
    exportAchievements() {
        const userData = this.getUserProgressData();
        const earned = this.userAchievements;
        const certifications = userData.certifications || [];
        const skillBadges = this.getUserSkillBadges();

        return {
            exportDate: new Date().toISOString(),
            summary: {
                totalAchievements: earned.length,
                totalPoints: this.getTotalPoints(),
                currentCertification: this.getCurrentCertificationLevel(),
                skillBadges: skillBadges.length
            },
            achievements: earned.map(ua => {
                const achievement = this.achievements.find(a => a.id === ua.achievementId);
                return {
                    ...achievement,
                    earnedAt: ua.earnedAt,
                    context: ua.context
                };
            }),
            certifications: certifications.map(cert => {
                const level = this.certificationLevels.find(l => l.id === cert.levelId);
                return {
                    ...level,
                    earnedAt: cert.earnedAt,
                    validUntil: cert.validUntil,
                    certificate: cert.certificate
                };
            }),
            skillBadges: skillBadges.map(badge => {
                const skill = this.skillBadges.find(s => s.skillId === badge.skillId);
                return {
                    ...skill,
                    level: badge.level,
                    earnedAt: badge.earnedAt
                };
            })
        };
    }

    // Initialize achievement definitions
    initializeAchievements() {
        return [
            // Progress Achievements
            {
                id: 'first_steps',
                title: 'First Steps',
                description: 'Complete your first module',
                icon: 'fa-baby',
                category: 'progress',
                type: 'progress',
                points: 10,
                rarity: 'common',
                criteria: { modulesCompleted: 1 }
            },
            {
                id: 'security_master',
                title: 'Security Master',
                description: 'Complete the Security Setup module',
                icon: 'fa-shield-alt',
                category: 'progress',
                type: 'progress',
                points: 25,
                rarity: 'common',
                criteria: { specificModules: ['security'] }
            },
            {
                id: 'halfway_there',
                title: 'Halfway There',
                description: 'Complete 50% of all modules',
                icon: 'fa-chart-line',
                category: 'progress',
                type: 'progress',
                points: 50,
                rarity: 'uncommon',
                criteria: { overallCompletion: 50 }
            },
            {
                id: 'completionist',
                title: 'Completionist',
                description: 'Complete 100% of all modules',
                icon: 'fa-trophy',
                category: 'progress',
                type: 'progress',
                points: 100,
                rarity: 'rare',
                criteria: { overallCompletion: 100 }
            },

            // Assessment Achievements
            {
                id: 'first_perfect',
                title: 'Perfect Score',
                description: 'Score 100% on any assessment',
                icon: 'fa-star',
                category: 'assessment',
                type: 'assessment',
                points: 30,
                rarity: 'uncommon',
                criteria: { perfectScores: 1 }
            },
            {
                id: 'assessment_ace',
                title: 'Assessment Ace',
                description: 'Maintain 90%+ average on assessments',
                icon: 'fa-graduation-cap',
                category: 'assessment',
                type: 'assessment',
                points: 75,
                rarity: 'rare',
                criteria: { averageScore: 90 }
            },

            // Streak Achievements
            {
                id: 'learning_streak_7',
                title: 'Week Warrior',
                description: 'Learn for 7 consecutive days',
                icon: 'fa-fire',
                category: 'streak',
                type: 'streak',
                points: 40,
                rarity: 'uncommon',
                criteria: { streakDays: 7 }
            },
            {
                id: 'learning_streak_30',
                title: 'Month Master',
                description: 'Learn for 30 consecutive days',
                icon: 'fa-flame',
                category: 'streak',
                type: 'streak',
                points: 100,
                rarity: 'legendary',
                criteria: { streakDays: 30 }
            },

            // Time Achievements
            {
                id: 'dedicated_learner',
                title: 'Dedicated Learner',
                description: 'Spend 10+ hours learning',
                icon: 'fa-clock',
                category: 'time',
                type: 'time',
                points: 50,
                rarity: 'uncommon',
                criteria: { totalHours: 10 }
            },

            // Special Achievements
            {
                id: 'early_adopter',
                title: 'Early Adopter',
                description: 'One of the first 100 users',
                icon: 'fa-rocket',
                category: 'special',
                type: 'special',
                points: 200,
                rarity: 'legendary',
                criteria: { specialCondition: 'early_adopter' }
            }
        ];
    }

    // Initialize certification levels
    initializeCertificationLevels() {
        return [
            {
                id: 'bronze',
                title: 'Claude Code Bronze',
                description: 'Basic proficiency in Claude Code usage',
                icon: 'fa-medal',
                color: '#CD7F32',
                rank: 1,
                criteria: {
                    overallCompletion: 25,
                    requiredModules: ['security', 'installation'],
                    averageAssessmentScore: 70
                }
            },
            {
                id: 'silver',
                title: 'Claude Code Silver',
                description: 'Intermediate skills in Claude Code development',
                icon: 'fa-medal',
                color: '#C0C0C0',
                rank: 2,
                criteria: {
                    overallCompletion: 60,
                    requiredModules: ['security', 'installation', 'memory', 'commands'],
                    averageAssessmentScore: 80,
                    skillBadges: [
                        { skillId: 'security', level: 'bronze' },
                        { skillId: 'commands', level: 'bronze' }
                    ]
                }
            },
            {
                id: 'gold',
                title: 'Claude Code Gold',
                description: 'Advanced expertise in Claude Code workflows',
                icon: 'fa-medal',
                color: '#FFD700',
                rank: 3,
                criteria: {
                    overallCompletion: 90,
                    requiredModules: ['security', 'installation', 'memory', 'commands', 'workflows'],
                    averageAssessmentScore: 85,
                    skillBadges: [
                        { skillId: 'security', level: 'silver' },
                        { skillId: 'commands', level: 'silver' },
                        { skillId: 'workflows', level: 'bronze' }
                    ],
                    practicalProjects: 2
                }
            },
            {
                id: 'platinum',
                title: 'Claude Code Platinum',
                description: 'Master-level expertise and teaching capability',
                icon: 'fa-crown',
                color: '#E5E4E2',
                rank: 4,
                criteria: {
                    overallCompletion: 100,
                    averageAssessmentScore: 90,
                    skillBadges: [
                        { skillId: 'security', level: 'gold' },
                        { skillId: 'commands', level: 'gold' },
                        { skillId: 'workflows', level: 'gold' },
                        { skillId: 'sub-agents', level: 'silver' }
                    ],
                    practicalProjects: 5
                }
            }
        ];
    }

    // Initialize skill badges
    initializeSkillBadges() {
        return [
            {
                skillId: 'security',
                title: 'Security Setup',
                description: 'Vertex AI configuration and secure enterprise usage',
                icon: 'fa-shield-alt',
                levels: [
                    {
                        name: 'bronze',
                        criteria: { moduleCompletion: 'security', assessmentScore: 70 }
                    },
                    {
                        name: 'silver',
                        criteria: { moduleCompletion: 'security', assessmentScore: 85, practicalUse: true }
                    },
                    {
                        name: 'gold',
                        criteria: { moduleCompletion: 'security', assessmentScore: 95, helpOthers: 3 }
                    }
                ]
            },
            {
                skillId: 'commands',
                title: 'Command Mastery',
                description: 'Proficiency with Claude Code commands and CLI',
                icon: 'fa-terminal',
                levels: [
                    {
                        name: 'bronze',
                        criteria: { moduleCompletion: 'commands', commandsUsed: 10 }
                    },
                    {
                        name: 'silver',
                        criteria: { moduleCompletion: 'commands', commandsUsed: 25, advancedCommands: 5 }
                    },
                    {
                        name: 'gold',
                        criteria: { moduleCompletion: 'commands', commandsUsed: 50, scriptingAbility: true }
                    }
                ]
            },
            {
                skillId: 'workflows',
                title: 'Workflow Integration',
                description: 'Integration of Claude Code into development workflows',
                icon: 'fa-project-diagram',
                levels: [
                    {
                        name: 'bronze',
                        criteria: { moduleCompletion: 'workflows', workflowsCreated: 1 }
                    },
                    {
                        name: 'silver',
                        criteria: { moduleCompletion: 'workflows', workflowsCreated: 3, teamCollaboration: true }
                    },
                    {
                        name: 'gold',
                        criteria: { moduleCompletion: 'workflows', workflowsCreated: 5, optimization: true }
                    }
                ]
            },
            {
                skillId: 'sub-agents',
                title: 'Sub-Agent Coordination',
                description: 'Advanced usage of Claude Code sub-agents',
                icon: 'fa-robot',
                levels: [
                    {
                        name: 'bronze',
                        criteria: { moduleCompletion: 'sub-agents', subAgentsUsed: 1 }
                    },
                    {
                        name: 'silver',
                        criteria: { moduleCompletion: 'sub-agents', subAgentsUsed: 5, complexProjects: 1 }
                    },
                    {
                        name: 'gold',
                        criteria: { moduleCompletion: 'sub-agents', subAgentsUsed: 10, teachOthers: true }
                    }
                ]
            }
        ];
    }

    // Utility methods
    hasEarnedAchievement(achievementId) {
        return this.userAchievements.some(ua => ua.achievementId === achievementId);
    }

    getTotalPoints() {
        return this.userAchievements.reduce((total, ua) => {
            const achievement = this.achievements.find(a => a.id === ua.achievementId);
            return total + (achievement?.points || 0);
        }, 0);
    }

    getLevelRank(level) {
        const ranks = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return ranks[level] || 0;
    }

    generateCertificate(level) {
        return {
            certificateId: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: level.title,
            recipientName: this.getUserProgressData().profile?.name || 'Claude Code User',
            issuedDate: new Date().toISOString(),
            issuer: 'AutoZone Claude Code Training Hub',
            verificationCode: this.generateVerificationCode()
        };
    }

    generateVerificationCode() {
        return Math.random().toString(36).substr(2, 10).toUpperCase();
    }

    calculateExpirationDate(level) {
        // Certifications expire after 1 year
        const expiration = new Date();
        expiration.setFullYear(expiration.getFullYear() + 1);
        return expiration.toISOString();
    }

    // Storage methods
    loadUserAchievements() {
        try {
            return JSON.parse(localStorage.getItem('userAchievements') || '[]');
        } catch (error) {
            console.error('Error loading user achievements:', error);
            return [];
        }
    }

    saveUserAchievements() {
        try {
            localStorage.setItem('userAchievements', JSON.stringify(this.userAchievements));
        } catch (error) {
            console.error('Error saving user achievements:', error);
        }
    }

    loadLeaderboardData() {
        try {
            return JSON.parse(localStorage.getItem('leaderboardData') || '{}');
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            return {};
        }
    }

    saveLeaderboardData(data) {
        try {
            localStorage.setItem('leaderboardData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving leaderboard data:', error);
        }
    }

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
            return { profile: {}, modules: {}, assessments: {}, achievements: {}, interactions: [], preferences: {}, analytics: {} };
        }
    }

    saveUserData(data) {
        try {
            localStorage.setItem('claudeCodeProgress', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    setupEventListeners() {
        // Listen for module completions
        document.addEventListener('moduleCompleted', (e) => {
            this.checkForNewAchievements();
        });

        // Listen for assessment completions
        document.addEventListener('assessmentCompleted', (e) => {
            this.checkForNewAchievements();
        });
    }

    initializeLeaderboard() {
        // Initialize with mock data for demonstration
        return {
            weekly: [],
            monthly: [],
            overall: []
        };
    }

    // Additional helper methods would continue here...
}

// Create global instance
const AchievementSystem = new AchievementSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}