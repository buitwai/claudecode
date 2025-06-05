/**
 * User Data Management System for Claude Code Training Platform
 * Handles local storage, data persistence, privacy compliance, and enterprise LMS integration
 */

class UserData {
    constructor() {
        this.storageKeys = {
            PROGRESS: 'claudeCodeProgress',
            PREFERENCES: 'claudeCodePreferences',
            ACHIEVEMENTS: 'userAchievements',
            SYNC_QUEUE: 'syncQueue',
            OFFLINE_DATA: 'offlineData',
            PRIVACY_SETTINGS: 'privacySettings',
            SESSION_DATA: 'sessionData'
        };
        
        this.defaultPrivacySettings = {
            dataCollection: true,
            analytics: true,
            shareWithTeam: false,
            exportAllowed: true,
            retentionPeriod: 365, // days
            anonymizeData: false
        };

        this.compressionEnabled = true;
        this.encryptionEnabled = false; // Set to true in production
        this.syncEnabled = false; // Will be enabled when LMS integration is available
        
        this.init();
    }

    /**
     * Initialize the user data management system
     */
    init() {
        this.initializePrivacySettings();
        this.initializeStorageQuotaMonitoring();
        this.initializeDataRetentionPolicy();
        this.setupEventListeners();
        this.startPeriodicCleanup();
        
        // Check for pending sync operations
        if (this.syncEnabled) {
            this.processSyncQueue();
        }
    }

    /**
     * Get current user profile and data
     */
    static getUser() {
        const instance = new UserData();
        return instance.getUser();
    }

    getUser() {
        const userData = this.getProgressData();
        const preferences = this.getPreferences();
        
        return {
            profile: userData.profile || this.createDefaultProfile(),
            preferences,
            lastLogin: userData.lastLogin || new Date().toISOString(),
            createdAt: userData.createdAt || new Date().toISOString(),
            dataVersion: userData.dataVersion || '1.0'
        };
    }

    /**
     * Create default user profile
     */
    createDefaultProfile() {
        return {
            id: this.generateUserId(),
            name: 'Claude Code User',
            email: '',
            department: '',
            role: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language || 'en-US',
            avatar: null
        };
    }

    /**
     * Update user profile information
     */
    updateProfile(profileData) {
        const userData = this.getProgressData();
        userData.profile = {
            ...userData.profile,
            ...profileData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveProgressData(userData);
        this.queueForSync('profile_update', profileData);
        
        return userData.profile;
    }

    /**
     * Get user preferences
     */
    getPreferences() {
        try {
            const preferences = localStorage.getItem(this.storageKeys.PREFERENCES);
            return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
        } catch (error) {
            console.error('Error loading preferences:', error);
            return this.getDefaultPreferences();
        }
    }

    /**
     * Get default preferences
     */
    getDefaultPreferences() {
        return {
            theme: 'light',
            language: 'en',
            notifications: {
                achievements: true,
                assessments: true,
                reminders: true,
                weekly_summary: true
            },
            dashboard: {
                defaultView: 'overview',
                chartsEnabled: true,
                autoRefresh: true
            },
            learning: {
                autoSave: true,
                showHints: true,
                difficulty: 'adaptive',
                pacing: 'self'
            },
            privacy: this.defaultPrivacySettings
        };
    }

    /**
     * Update user preferences
     */
    updatePreferences(preferences) {
        const current = this.getPreferences();
        const updated = this.deepMerge(current, preferences);
        
        this.saveData(this.storageKeys.PREFERENCES, updated);
        this.queueForSync('preferences_update', preferences);
        
        // Trigger preference change event
        this.dispatchEvent('preferencesChanged', updated);
        
        return updated;
    }

    /**
     * Get progress data
     */
    getProgressData() {
        try {
            let data = localStorage.getItem(this.storageKeys.PROGRESS);
            
            if (data) {
                // Decompress if needed
                if (this.compressionEnabled && data.startsWith('compressed:')) {
                    data = this.decompress(data.substring(11));
                }
                
                // Decrypt if needed
                if (this.encryptionEnabled && data.startsWith('encrypted:')) {
                    data = this.decrypt(data.substring(10));
                }
                
                return JSON.parse(data);
            }
            
            return this.getDefaultProgressData();
        } catch (error) {
            console.error('Error loading progress data:', error);
            return this.getDefaultProgressData();
        }
    }

    /**
     * Get default progress data structure
     */
    getDefaultProgressData() {
        return {
            profile: this.createDefaultProfile(),
            modules: {},
            assessments: {},
            achievements: {},
            interactions: [],
            preferences: {},
            analytics: {
                totalStudyTime: 0,
                sessionsCount: 0,
                lastSessionDate: null,
                streakDays: 0
            },
            certifications: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            dataVersion: '1.0'
        };
    }

    /**
     * Save progress data
     */
    saveProgressData(data) {
        try {
            data.lastModified = new Date().toISOString();
            data.dataVersion = '1.0';
            
            let serialized = JSON.stringify(data);
            
            // Encrypt if enabled
            if (this.encryptionEnabled) {
                serialized = 'encrypted:' + this.encrypt(serialized);
            }
            
            // Compress if enabled and data is large
            if (this.compressionEnabled && serialized.length > 10000) {
                serialized = 'compressed:' + this.compress(serialized);
            }
            
            localStorage.setItem(this.storageKeys.PROGRESS, serialized);
            
            // Update storage usage
            this.updateStorageUsage();
            
            // Queue for sync if enabled
            if (this.syncEnabled) {
                this.queueForSync('progress_update', data);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving progress data:', error);
            
            // Handle quota exceeded
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            }
            
            return false;
        }
    }

    /**
     * Export user data for backup or transfer
     */
    exportData(options = {}) {
        const {
            includePersonalData = true,
            includeLearningData = true,
            includeAnalytics = true,
            format = 'json',
            anonymize = false
        } = options;

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            source: 'Claude Code Training Platform'
        };

        if (includePersonalData) {
            const profile = this.getUser().profile;
            exportData.profile = anonymize ? this.anonymizeProfile(profile) : profile;
            exportData.preferences = this.getPreferences();
        }

        if (includeLearningData) {
            const progressData = this.getProgressData();
            exportData.modules = progressData.modules;
            exportData.assessments = progressData.assessments;
            exportData.certifications = progressData.certifications;
            
            if (window.AchievementSystem) {
                exportData.achievements = AchievementSystem.exportAchievements();
            }
        }

        if (includeAnalytics && window.AnalyticsEngine) {
            exportData.analytics = AnalyticsEngine.exportProgressReport();
        }

        // Privacy compliance check
        if (!this.checkExportPermissions()) {
            throw new Error('Export not allowed based on current privacy settings');
        }

        // Log export activity
        this.logDataAccess('export', { anonymized: anonymize, includePersonalData });

        switch (format) {
            case 'csv':
                return this.convertToCSV(exportData);
            case 'xml':
                return this.convertToXML(exportData);
            default:
                return JSON.stringify(exportData, null, 2);
        }
    }

    /**
     * Import user data from backup or transfer
     */
    importData(importData, options = {}) {
        const {
            mergeMode = 'replace', // 'replace', 'merge', 'skip_existing'
            validateData = true,
            backupExisting = true
        } = options;

        try {
            // Parse import data if it's a string
            if (typeof importData === 'string') {
                importData = JSON.parse(importData);
            }

            // Validate import data
            if (validateData && !this.validateImportData(importData)) {
                throw new Error('Invalid import data format');
            }

            // Backup existing data if requested
            if (backupExisting) {
                this.createBackup('pre_import_backup');
            }

            // Import based on merge mode
            switch (mergeMode) {
                case 'replace':
                    this.replaceUserData(importData);
                    break;
                case 'merge':
                    this.mergeUserData(importData);
                    break;
                case 'skip_existing':
                    this.mergeUserDataSkipExisting(importData);
                    break;
            }

            // Log import activity
            this.logDataAccess('import', { mergeMode, recordsImported: this.countImportedRecords(importData) });

            return {
                success: true,
                message: 'Data imported successfully',
                recordsImported: this.countImportedRecords(importData)
            };

        } catch (error) {
            console.error('Error importing data:', error);
            return {
                success: false,
                message: error.message,
                recordsImported: 0
            };
        }
    }

    /**
     * Clear all user data (GDPR compliance)
     */
    clearAllData(confirmationCode) {
        // Require confirmation for data deletion
        const expectedCode = this.generateDataDeletionCode();
        if (confirmationCode !== expectedCode) {
            throw new Error('Invalid confirmation code');
        }

        // Log data deletion
        this.logDataAccess('delete_all', { timestamp: new Date().toISOString() });

        // Clear all storage
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });

        // Clear any cached data
        this.clearCache();

        // Notify of data deletion
        this.dispatchEvent('dataDeleted', { timestamp: new Date().toISOString() });

        return true;
    }

    /**
     * Get data deletion confirmation code
     */
    generateDataDeletionCode() {
        const userData = this.getUser();
        const hash = this.simpleHash(userData.profile.id + userData.createdAt);
        return hash.substring(0, 8).toUpperCase();
    }

    /**
     * Privacy settings management
     */
    getPrivacySettings() {
        try {
            const settings = localStorage.getItem(this.storageKeys.PRIVACY_SETTINGS);
            return settings ? JSON.parse(settings) : this.defaultPrivacySettings;
        } catch (error) {
            console.error('Error loading privacy settings:', error);
            return this.defaultPrivacySettings;
        }
    }

    updatePrivacySettings(settings) {
        const current = this.getPrivacySettings();
        const updated = { ...current, ...settings };
        
        this.saveData(this.storageKeys.PRIVACY_SETTINGS, updated);
        
        // Apply privacy settings immediately
        this.applyPrivacySettings(updated);
        
        return updated;
    }

    /**
     * Apply privacy settings
     */
    applyPrivacySettings(settings) {
        // Disable analytics if not allowed
        if (!settings.analytics && window.AnalyticsEngine) {
            AnalyticsEngine.disableTracking();
        }

        // Clear data if retention period exceeded
        if (settings.retentionPeriod) {
            this.enforceDataRetention(settings.retentionPeriod);
        }

        // Anonymize data if required
        if (settings.anonymizeData) {
            this.anonymizeStoredData();
        }
    }

    /**
     * LMS Integration hooks
     */
    initializeLMSIntegration(config) {
        this.lmsConfig = config;
        this.syncEnabled = true;
        
        // Setup sync intervals
        this.startSyncInterval();
        
        // Process any pending sync operations
        this.processSyncQueue();
    }

    /**
     * Queue data for LMS synchronization
     */
    queueForSync(operation, data) {
        if (!this.syncEnabled) return;

        const syncQueue = this.getSyncQueue();
        syncQueue.push({
            id: this.generateId(),
            operation,
            data,
            timestamp: new Date().toISOString(),
            attempts: 0,
            maxAttempts: 3
        });

        this.saveSyncQueue(syncQueue);
    }

    /**
     * Process synchronization queue
     */
    async processSyncQueue() {
        if (!this.syncEnabled || !this.lmsConfig) return;

        const syncQueue = this.getSyncQueue();
        const processed = [];

        for (const item of syncQueue) {
            try {
                const success = await this.syncToLMS(item);
                if (success) {
                    processed.push(item.id);
                } else {
                    item.attempts++;
                    if (item.attempts >= item.maxAttempts) {
                        processed.push(item.id); // Remove failed items after max attempts
                        this.logSyncError(item);
                    }
                }
            } catch (error) {
                console.error('Sync error:', error);
                item.attempts++;
            }
        }

        // Remove processed items
        const remainingQueue = syncQueue.filter(item => !processed.includes(item.id));
        this.saveSyncQueue(remainingQueue);
    }

    /**
     * Sync item to LMS
     */
    async syncToLMS(item) {
        // This would integrate with actual LMS systems like:
        // - Cornerstone OnDemand
        // - Workday Learning
        // - SAP SuccessFactors
        // - Custom enterprise LMS
        
        const payload = {
            userId: this.getUser().profile.id,
            operation: item.operation,
            data: item.data,
            timestamp: item.timestamp
        };

        try {
            const response = await fetch(this.lmsConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.lmsConfig.token}`,
                    'X-LMS-Integration': 'claude-code-training'
                },
                body: JSON.stringify(payload)
            });

            return response.ok;
        } catch (error) {
            console.error('LMS sync error:', error);
            return false;
        }
    }

    /**
     * Storage management and cleanup
     */
    updateStorageUsage() {
        const usage = this.calculateStorageUsage();
        const quota = this.getStorageQuota();
        
        if (usage > quota * 0.9) { // 90% of quota
            this.performStorageCleanup();
        }
    }

    calculateStorageUsage() {
        let totalSize = 0;
        
        Object.values(this.storageKeys).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalSize += item.length;
            }
        });
        
        return totalSize;
    }

    getStorageQuota() {
        // Estimate localStorage quota (usually 5-10MB)
        return 5 * 1024 * 1024; // 5MB
    }

    performStorageCleanup() {
        // Clean old interactions
        this.cleanupOldInteractions();
        
        // Compress large data
        this.compressLargeData();
        
        // Remove expired session data
        this.cleanupExpiredSessions();
        
        console.log('Storage cleanup completed');
    }

    cleanupOldInteractions() {
        const userData = this.getProgressData();
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        if (userData.interactions) {
            userData.interactions = userData.interactions.filter(interaction => 
                interaction.timestamp > oneWeekAgo
            );
            this.saveProgressData(userData);
        }
    }

    /**
     * Data validation and integrity
     */
    validateImportData(data) {
        const requiredFields = ['exportDate', 'version'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    validateDataIntegrity() {
        const userData = this.getProgressData();
        const issues = [];

        // Check for data corruption
        if (!userData.profile || !userData.profile.id) {
            issues.push('Missing or corrupted user profile');
        }

        // Check for invalid dates
        if (userData.createdAt && isNaN(new Date(userData.createdAt))) {
            issues.push('Invalid creation date');
        }

        // Check module data consistency
        Object.entries(userData.modules || {}).forEach(([moduleId, moduleData]) => {
            if (typeof moduleData.completion !== 'number' || moduleData.completion < 0 || moduleData.completion > 100) {
                issues.push(`Invalid completion data for module ${moduleId}`);
            }
        });

        return {
            isValid: issues.length === 0,
            issues
        };
    }

    /**
     * Utility methods
     */
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    deepMerge(target, source) {
        const result = { ...target };
        
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        
        return result;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Compression methods (simplified)
    compress(data) {
        // In a real implementation, you'd use a proper compression library
        // This is a simplified version for demonstration
        return btoa(data);
    }

    decompress(data) {
        try {
            return atob(data);
        } catch (error) {
            console.error('Decompression error:', error);
            return data; // Return as-is if decompression fails
        }
    }

    // Encryption methods (simplified - use proper encryption in production)
    encrypt(data) {
        // This is a placeholder - use proper encryption like AES in production
        return btoa(data);
    }

    decrypt(data) {
        try {
            return atob(data);
        } catch (error) {
            console.error('Decryption error:', error);
            return data;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            return false;
        }
    }

    // Event management
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`userData:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    setupEventListeners() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (Object.values(this.storageKeys).includes(e.key)) {
                this.handleStorageChange(e);
            }
        });

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.performPeriodicSave();
            }
        });

        // Listen for page unload
        window.addEventListener('beforeunload', () => {
            this.performPeriodicSave();
        });
    }

    handleStorageChange(event) {
        this.dispatchEvent('storageChanged', {
            key: event.key,
            oldValue: event.oldValue,
            newValue: event.newValue
        });
    }

    // Additional helper methods
    initializePrivacySettings() {
        const settings = this.getPrivacySettings();
        this.applyPrivacySettings(settings);
    }

    initializeStorageQuotaMonitoring() {
        this.updateStorageUsage();
    }

    initializeDataRetentionPolicy() {
        const settings = this.getPrivacySettings();
        if (settings.retentionPeriod) {
            this.enforceDataRetention(settings.retentionPeriod);
        }
    }

    startPeriodicCleanup() {
        // Run cleanup every hour
        setInterval(() => {
            this.performStorageCleanup();
        }, 60 * 60 * 1000);
    }

    performPeriodicSave() {
        // Ensure all data is saved
        const userData = this.getProgressData();
        this.saveProgressData(userData);
    }

    getSyncQueue() {
        try {
            const queue = localStorage.getItem(this.storageKeys.SYNC_QUEUE);
            return queue ? JSON.parse(queue) : [];
        } catch (error) {
            console.error('Error loading sync queue:', error);
            return [];
        }
    }

    saveSyncQueue(queue) {
        this.saveData(this.storageKeys.SYNC_QUEUE, queue);
    }

    startSyncInterval() {
        // Sync every 5 minutes
        setInterval(() => {
            this.processSyncQueue();
        }, 5 * 60 * 1000);
    }

    // Mock methods for demonstration
    handleStorageQuotaExceeded() {
        console.warn('Storage quota exceeded, performing emergency cleanup');
        this.performStorageCleanup();
    }

    checkExportPermissions() {
        const settings = this.getPrivacySettings();
        return settings.exportAllowed;
    }

    logDataAccess(action, details) {
        const log = {
            action,
            timestamp: new Date().toISOString(),
            details,
            userId: this.getUser().profile.id
        };
        
        // In production, this would be sent to an audit logging system
        console.log('Data access logged:', log);
    }

    anonymizeProfile(profile) {
        return {
            ...profile,
            name: 'Anonymous User',
            email: '',
            id: this.simpleHash(profile.id)
        };
    }

    convertToCSV(data) {
        // Simplified CSV conversion
        return JSON.stringify(data); // Would implement proper CSV conversion
    }

    convertToXML(data) {
        // Simplified XML conversion
        return JSON.stringify(data); // Would implement proper XML conversion
    }

    createBackup(backupName) {
        const backupData = {
            name: backupName,
            timestamp: new Date().toISOString(),
            data: this.getProgressData()
        };
        
        localStorage.setItem(`backup_${backupName}`, JSON.stringify(backupData));
        return backupName;
    }

    replaceUserData(importData) {
        if (importData.profile) this.updateProfile(importData.profile);
        if (importData.preferences) this.updatePreferences(importData.preferences);
        // Additional replacement logic...
    }

    mergeUserData(importData) {
        const current = this.getProgressData();
        const merged = this.deepMerge(current, importData);
        this.saveProgressData(merged);
    }

    mergeUserDataSkipExisting(importData) {
        // Implementation for skip existing merge mode
        this.mergeUserData(importData);
    }

    countImportedRecords(importData) {
        let count = 0;
        if (importData.modules) count += Object.keys(importData.modules).length;
        if (importData.assessments) count += Object.keys(importData.assessments).length;
        if (importData.achievements) count += importData.achievements.length || 0;
        return count;
    }

    clearCache() {
        // Clear any cached data
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('claude-code')) {
                        caches.delete(name);
                    }
                });
            });
        }
    }

    enforceDataRetention(retentionDays) {
        const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
        const userData = this.getProgressData();
        
        // Remove old interactions
        if (userData.interactions) {
            userData.interactions = userData.interactions.filter(interaction => 
                interaction.timestamp > cutoffDate
            );
        }
        
        this.saveProgressData(userData);
    }

    anonymizeStoredData() {
        const userData = this.getProgressData();
        userData.profile = this.anonymizeProfile(userData.profile);
        this.saveProgressData(userData);
    }

    logSyncError(item) {
        console.error('Failed to sync item after max attempts:', item);
    }

    cleanupExpiredSessions() {
        // Remove expired session data
        const sessionData = localStorage.getItem(this.storageKeys.SESSION_DATA);
        if (sessionData) {
            try {
                const sessions = JSON.parse(sessionData);
                const validSessions = sessions.filter(session => 
                    Date.now() - new Date(session.timestamp).getTime() < 24 * 60 * 60 * 1000 // 24 hours
                );
                localStorage.setItem(this.storageKeys.SESSION_DATA, JSON.stringify(validSessions));
            } catch (error) {
                console.error('Error cleaning up sessions:', error);
            }
        }
    }

    compressLargeData() {
        // Compress data if it's getting large
        const userData = this.getProgressData();
        if (JSON.stringify(userData).length > 100000) { // 100KB threshold
            this.compressionEnabled = true;
            this.saveProgressData(userData);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserData;
}