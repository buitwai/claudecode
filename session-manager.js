/**
 * Claude Code Session Manager
 * Handles session state, command history, and persistence
 */

class SessionManager {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.sessionData = {
            startTime: Date.now(),
            commands: [],
            scenarios: [],
            progress: {},
            settings: this.getDefaultSettings()
        };
        this.maxHistorySize = 100;
        this.autoSaveInterval = 30000; // 30 seconds
        
        this.loadSession();
        this.startAutoSave();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDefaultSettings() {
        return {
            theme: 'dark',
            fontSize: 14,
            autoComplete: true,
            showTypingIndicator: true,
            saveHistory: true,
            maxHistorySize: 100,
            autoSaveInterval: 30000
        };
    }

    // Command History Management
    addToHistory(command) {
        if (!command || command.trim() === '') return;
        
        // Remove duplicate if it's the same as the last command
        if (this.commandHistory.length > 0 && 
            this.commandHistory[this.commandHistory.length - 1] === command) {
            return;
        }

        this.commandHistory.push(command);
        
        // Maintain max history size
        if (this.commandHistory.length > this.maxHistorySize) {
            this.commandHistory.shift();
        }

        // Reset history index
        this.historyIndex = this.commandHistory.length;

        // Add to session data
        this.sessionData.commands.push({
            command: command,
            timestamp: Date.now(),
            sessionId: this.sessionId
        });
    }

    getPreviousCommand() {
        if (this.commandHistory.length === 0) return null;
        
        if (this.historyIndex > 0) {
            this.historyIndex--;
        }
        
        return this.commandHistory[this.historyIndex] || null;
    }

    getNextCommand() {
        if (this.commandHistory.length === 0) return null;
        
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        } else if (this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            return ''; // Return empty string to clear input
        }
        
        return null;
    }

    getHistoryStats() {
        const totalCommands = this.commandHistory.length;
        const uniqueCommands = new Set(this.commandHistory).size;
        const commandFrequency = {};
        
        this.commandHistory.forEach(cmd => {
            const baseCmd = cmd.split(' ')[0];
            commandFrequency[baseCmd] = (commandFrequency[baseCmd] || 0) + 1;
        });

        const mostUsedCommands = Object.entries(commandFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        return {
            total: totalCommands,
            unique: uniqueCommands,
            mostUsed: mostUsedCommands,
            frequency: commandFrequency
        };
    }

    // Session Management
    startAutoSave() {
        setInterval(() => {
            this.save();
        }, this.autoSaveInterval);
    }

    save() {
        try {
            const sessionData = {
                ...this.sessionData,
                historyIndex: this.historyIndex,
                commandHistory: this.commandHistory,
                lastSaved: Date.now()
            };
            
            localStorage.setItem(`claude_code_session_${this.sessionId}`, JSON.stringify(sessionData));
            localStorage.setItem('claude_code_current_session', this.sessionId);
            
            // Also save to a more persistent format if available
            this.saveToIndexedDB(sessionData);
            
            return true;
        } catch (error) {
            console.error('Failed to save session:', error);
            return false;
        }
    }

    loadSession() {
        try {
            // Try to load the most recent session
            const currentSessionId = localStorage.getItem('claude_code_current_session');
            if (currentSessionId) {
                const sessionData = localStorage.getItem(`claude_code_session_${currentSessionId}`);
                if (sessionData) {
                    const parsed = JSON.parse(sessionData);
                    this.restoreSession(parsed);
                    return true;
                }
            }
            
            // Fallback: load any available session
            const sessions = this.getAllSessions();
            if (sessions.length > 0) {
                const latestSession = sessions.sort((a, b) => b.lastSaved - a.lastSaved)[0];
                this.restoreSession(latestSession);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Failed to load session:', error);
            return false;
        }
    }

    restoreSession(sessionData) {
        this.sessionData = { ...this.sessionData, ...sessionData };
        this.commandHistory = sessionData.commandHistory || [];
        this.historyIndex = sessionData.historyIndex || -1;
        
        // Update session ID if restoring
        if (sessionData.sessionId) {
            this.sessionId = sessionData.sessionId;
        }
    }

    getAllSessions() {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('claude_code_session_')) {
                try {
                    const sessionData = JSON.parse(localStorage.getItem(key));
                    sessions.push(sessionData);
                } catch (error) {
                    console.error('Failed to parse session:', key, error);
                }
            }
        }
        return sessions;
    }

    deleteSession(sessionId = null) {
        const targetSessionId = sessionId || this.sessionId;
        localStorage.removeItem(`claude_code_session_${targetSessionId}`);
        
        if (targetSessionId === this.sessionId) {
            this.reset();
        }
    }

    reset() {
        this.sessionId = this.generateSessionId();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.sessionData = {
            startTime: Date.now(),
            commands: [],
            scenarios: [],
            progress: {},
            settings: this.getDefaultSettings()
        };
    }

    // Scenario Management
    setCurrentScenario(scenarioName, scenarioData = {}) {
        this.sessionData.currentScenario = scenarioName;
        this.sessionData.scenarios.push({
            name: scenarioName,
            startTime: Date.now(),
            data: scenarioData
        });
    }

    updateScenarioProgress(scenarioName, progress) {
        this.sessionData.progress[scenarioName] = {
            ...this.sessionData.progress[scenarioName],
            ...progress,
            lastUpdated: Date.now()
        };
    }

    getScenarioProgress(scenarioName) {
        return this.sessionData.progress[scenarioName] || {};
    }

    // Settings Management
    updateSettings(newSettings) {
        this.sessionData.settings = {
            ...this.sessionData.settings,
            ...newSettings
        };
        this.save();
    }

    getSetting(key) {
        return this.sessionData.settings[key];
    }

    // Export and Import
    export() {
        const exportData = {
            sessionId: this.sessionId,
            exportTime: Date.now(),
            commandHistory: this.commandHistory,
            sessionData: this.sessionData,
            stats: this.getHistoryStats(),
            version: '1.0.0'
        };
        
        return exportData;
    }

    import(exportData) {
        try {
            if (exportData.version !== '1.0.0') {
                throw new Error('Incompatible export version');
            }
            
            this.sessionId = exportData.sessionId || this.generateSessionId();
            this.commandHistory = exportData.commandHistory || [];
            this.sessionData = exportData.sessionData || this.sessionData;
            this.historyIndex = this.commandHistory.length;
            
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import session:', error);
            return false;
        }
    }

    // IndexedDB support for larger data persistence
    async saveToIndexedDB(sessionData) {
        if (!window.indexedDB) return false;
        
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['sessions'], 'readwrite');
            const store = transaction.objectStore('sessions');
            
            await store.put({
                id: this.sessionId,
                data: sessionData,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('IndexedDB save failed:', error);
            return false;
        }
    }

    async loadFromIndexedDB(sessionId = null) {
        if (!window.indexedDB) return null;
        
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['sessions'], 'readonly');
            const store = transaction.objectStore('sessions');
            
            if (sessionId) {
                const result = await store.get(sessionId);
                return result ? result.data : null;
            } else {
                // Get the most recent session
                const sessions = await store.getAll();
                if (sessions.length > 0) {
                    const latest = sessions.sort((a, b) => b.timestamp - a.timestamp)[0];
                    return latest.data;
                }
            }
            
            return null;
        } catch (error) {
            console.error('IndexedDB load failed:', error);
            return null;
        }
    }

    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ClaudeCodeSimulator', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('sessions')) {
                    const store = db.createObjectStore('sessions', { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // Utility Methods
    getSessionDuration() {
        return Date.now() - this.sessionData.startTime;
    }

    getFormattedDuration() {
        const duration = this.getSessionDuration();
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            startTime: this.sessionData.startTime,
            duration: this.getFormattedDuration(),
            commandCount: this.commandHistory.length,
            currentScenario: this.sessionData.currentScenario,
            settings: this.sessionData.settings
        };
    }

    // Command suggestions based on history
    getCommandSuggestions(partialCommand) {
        if (!partialCommand) return [];
        
        const suggestions = [];
        const lowerPartial = partialCommand.toLowerCase();
        
        // Get unique commands from history
        const uniqueCommands = [...new Set(this.commandHistory)];
        
        // Filter commands that start with the partial command
        uniqueCommands.forEach(cmd => {
            if (cmd.toLowerCase().startsWith(lowerPartial)) {
                suggestions.push({
                    command: cmd,
                    type: 'history',
                    usage: this.commandHistory.filter(h => h === cmd).length
                });
            }
        });
        
        // Sort by usage frequency
        suggestions.sort((a, b) => b.usage - a.usage);
        
        return suggestions.slice(0, 10); // Return top 10 suggestions
    }

    // Search command history
    searchHistory(query) {
        if (!query) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.commandHistory
            .map((cmd, index) => ({ command: cmd, index }))
            .filter(({ command }) => command.toLowerCase().includes(lowerQuery))
            .reverse(); // Most recent first
    }
}

// Create global instance
const sessionManager = new SessionManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}