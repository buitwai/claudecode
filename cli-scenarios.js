/**
 * Claude Code CLI Training Scenarios
 * Provides guided exercises and tutorials for different skill levels
 */

class CLIScenarios {
    constructor() {
        this.scenarios = this.initializeScenarios();
        this.currentScenario = null;
        this.currentStep = 0;
        this.progress = {};
        this.hints = {};
        
        // Bind methods for global access
        window.cliScenarios = {
            loadScenario: this.loadScenario.bind(this),
            getCurrentScenario: this.getCurrentScenario.bind(this),
            getProgress: this.getProgress.bind(this),
            resetProgress: this.resetProgress.bind(this)
        };
    }

    initializeScenarios() {
        return {
            basic: {
                name: "Basic Commands",
                description: "Learn essential Claude Code commands",
                difficulty: "Beginner",
                estimatedTime: "10 minutes",
                steps: [
                    {
                        title: "Getting Help",
                        description: "Learn how to get help and view available commands",
                        instruction: "Type '/help' to see all available commands",
                        expectedCommand: "/help",
                        successMessage: "Great! You can always use /help to see available commands.",
                        hint: "The help command shows you all the commands you can use in Claude Code."
                    },
                    {
                        title: "Check Status",
                        description: "View your current Claude Code configuration",
                        instruction: "Type '/status' to see your current setup",
                        expectedCommand: "/status",
                        successMessage: "Perfect! The status command shows your configuration, model, and environment details.",
                        hint: "Use /status to verify your setup is working correctly."
                    },
                    {
                        title: "View Memory",
                        description: "Understand how Claude Code uses project memory",
                        instruction: "Type '/memory' to view your project's memory file",
                        expectedCommand: "/memory",
                        successMessage: "Excellent! CLAUDE.md is where Claude Code stores project context and memory.",
                        hint: "The memory file helps Claude understand your project better."
                    },
                    {
                        title: "Natural Language",
                        description: "Practice conversational AI interaction",
                        instruction: "Try asking a natural language question like 'How do I optimize my React components?'",
                        expectedCommand: "any",
                        successMessage: "Great! Claude Code understands natural language questions and requests.",
                        hint: "You can ask questions in plain English - Claude will understand and help."
                    }
                ]
            },
            memory: {
                name: "Memory Management",
                description: "Master Claude Code's memory and context features",
                difficulty: "Intermediate",
                estimatedTime: "15 minutes",
                steps: [
                    {
                        title: "Initialize Memory",
                        description: "Create a new CLAUDE.md file for your project",
                        instruction: "Type '/init' to initialize project documentation",
                        expectedCommand: "/init",
                        successMessage: "Perfect! You've initialized your project memory with automatic documentation.",
                        hint: "The /init command analyzes your codebase and creates comprehensive documentation."
                    },
                    {
                        title: "View Updated Memory",
                        description: "See the generated project documentation",
                        instruction: "Type '/memory' to view the newly created documentation",
                        expectedCommand: "/memory",
                        successMessage: "Excellent! Notice how much detail Claude Code automatically generated about your project.",
                        hint: "The generated memory includes project structure, dependencies, and development guidelines."
                    },
                    {
                        title: "Understand Context",
                        description: "Learn how memory affects Claude's responses",
                        instruction: "Ask 'What technologies does this project use?' to see contextual understanding",
                        expectedCommand: "any",
                        successMessage: "Great! Claude uses the memory file to provide accurate, project-specific answers.",
                        hint: "The memory file gives Claude deep understanding of your specific project."
                    },
                    {
                        title: "Force Reinitialize",
                        description: "Practice updating project documentation",
                        instruction: "Type '/init --force' to recreate the documentation",
                        expectedCommand: "/init --force",
                        successMessage: "Perfect! You can update your project memory as your codebase evolves.",
                        hint: "Use --force to overwrite existing memory when your project changes significantly."
                    }
                ]
            },
            workflow: {
                name: "Development Workflow",
                description: "Learn efficient development workflows with Claude Code",
                difficulty: "Intermediate",
                estimatedTime: "20 minutes",
                steps: [
                    {
                        title: "Review Simulation",
                        description: "Practice reviewing a pull request",
                        instruction: "Type '/review https://github.com/autozone/demo-project/pull/123' to simulate a PR review",
                        expectedCommand: "/review",
                        successMessage: "Excellent! Claude Code can help review pull requests and provide detailed feedback.",
                        hint: "Claude analyzes code quality, security, and best practices in PR reviews."
                    },
                    {
                        title: "Get PR Comments",
                        description: "Retrieve and analyze pull request comments",
                        instruction: "Type '/pr-comments https://github.com/autozone/demo-project/pull/123' to see comments",
                        expectedCommand: "/pr-comments",
                        successMessage: "Great! You can quickly gather all PR feedback and discussion.",
                        hint: "This helps you understand team feedback and discussion points."
                    },
                    {
                        title: "Check Session Cost",
                        description: "Monitor your usage and costs",
                        instruction: "Type '/cost' to see your session usage statistics",
                        expectedCommand: "/cost",
                        successMessage: "Perfect! Always monitor your API usage to manage costs effectively.",
                        hint: "Regular cost checking helps you stay within budget limits."
                    },
                    {
                        title: "Task Management",
                        description: "Practice pausing and resuming work",
                        instruction: "Type '/pause' to pause your current work, then '/resume' to continue",
                        expectedCommand: "/pause",
                        successMessage: "Great! Claude Code helps manage long-running tasks and context.",
                        hint: "Use pause/resume for managing complex, multi-step development tasks."
                    }
                ]
            },
            troubleshooting: {
                name: "Troubleshooting",
                description: "Learn to diagnose and fix common issues",
                difficulty: "Advanced",
                estimatedTime: "15 minutes",
                steps: [
                    {
                        title: "Configuration Check",
                        description: "Verify your Claude Code configuration",
                        instruction: "Type '/config' to see your current settings",
                        expectedCommand: "/config",
                        successMessage: "Good! Always check configuration when troubleshooting issues.",
                        hint: "Configuration problems are often the root cause of connection issues."
                    },
                    {
                        title: "Model Information",
                        description: "Check which model you're currently using",
                        instruction: "Type '/model' to see your current model configuration",
                        expectedCommand: "/model",
                        successMessage: "Perfect! Knowing your current model helps troubleshoot response issues.",
                        hint: "Different models have different capabilities and cost structures."
                    },
                    {
                        title: "Clear Context",
                        description: "Practice clearing conversation history when needed",
                        instruction: "Type '/clear' to clear your conversation history",
                        expectedCommand: "/clear",
                        successMessage: "Excellent! Clearing context can resolve memory and performance issues.",
                        hint: "Clear context when Claude seems confused or when starting fresh work."
                    },
                    {
                        title: "Get Specific Help",
                        description: "Learn to get detailed help for specific commands",
                        instruction: "Type '/help /status' to get detailed help for the status command",
                        expectedCommand: "/help /status",
                        successMessage: "Great! You can get detailed help for any specific command.",
                        hint: "Use '/help <command>' for detailed usage information and examples."
                    }
                ]
            },
            advanced: {
                name: "Advanced Features",
                description: "Explore powerful advanced Claude Code capabilities",
                difficulty: "Advanced",
                estimatedTime: "25 minutes",
                steps: [
                    {
                        title: "Model Switching",
                        description: "Practice switching between different models",
                        instruction: "Type '/model claude-haiku-3@20240307' to switch to a faster, cheaper model",
                        expectedCommand: "/model",
                        successMessage: "Perfect! Different models are optimized for different use cases.",
                        hint: "Haiku is faster and cheaper for simple tasks, Sonnet for complex reasoning, Opus for the most sophisticated work."
                    },
                    {
                        title: "Configuration Management",
                        description: "Practice modifying configuration settings",
                        instruction: "Type '/config auto_edit enabled' to enable auto-edit mode",
                        expectedCommand: "/config",
                        successMessage: "Excellent! Configuration changes affect how Claude Code behaves.",
                        hint: "Auto-edit mode allows Claude to make file changes without explicit approval for simple tasks."
                    },
                    {
                        title: "Complex Natural Language",
                        description: "Practice complex multi-step requests",
                        instruction: "Try: 'Analyze my project structure and suggest 3 improvements for better maintainability'",
                        expectedCommand: "any",
                        successMessage: "Great! Claude Code excels at complex, multi-part analysis and recommendations.",
                        hint: "Don't hesitate to ask complex questions - Claude can break them down and provide comprehensive answers."
                    },
                    {
                        title: "Session Management",
                        description: "Practice advanced session control",
                        instruction: "Type '/continue' to continue with the current task context",
                        expectedCommand: "/continue",
                        successMessage: "Perfect! Session management helps maintain context across complex workflows.",
                        hint: "Use /continue, /pause, and /resume to manage long-running development sessions."
                    }
                ]
            }
        };
    }

    loadScenario(scenarioName) {
        if (!this.scenarios[scenarioName]) {
            console.error(`Scenario '${scenarioName}' not found`);
            return false;
        }

        this.currentScenario = scenarioName;
        this.currentStep = 0;
        
        // Initialize progress tracking
        if (!this.progress[scenarioName]) {
            this.progress[scenarioName] = {
                started: Date.now(),
                completed: false,
                currentStep: 0,
                stepsCompleted: [],
                timeSpent: 0
            };
        }

        // Update session manager
        if (window.sessionManager) {
            sessionManager.setCurrentScenario(scenarioName, this.scenarios[scenarioName]);
        }

        // Display scenario introduction
        this.displayScenarioIntro(scenarioName);
        
        return true;
    }

    displayScenarioIntro(scenarioName) {
        const scenario = this.scenarios[scenarioName];
        const intro = `
🎯 Training Scenario: ${scenario.name}

${scenario.description}

📊 Difficulty: ${scenario.difficulty}
⏱️  Estimated Time: ${scenario.estimatedTime}
📝 Steps: ${scenario.steps.length}

Ready to begin? Follow the instructions below to complete each step.

`;

        // Add intro to terminal output
        if (window.addOutput) {
            addOutput('info-output', intro);
        }

        // Start first step
        this.showCurrentStep();
    }

    showCurrentStep() {
        if (!this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        const step = scenario.steps[this.currentStep];
        
        if (!step) {
            this.completeScenario();
            return;
        }

        const stepInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Step ${this.currentStep + 1}/${scenario.steps.length}: ${step.title}

${step.description}

💡 Instructions: ${step.instruction}

${step.hint ? `💡 Hint: ${step.hint}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

        if (window.addOutput) {
            addOutput('warning-output', stepInfo);
        }
    }

    checkStepCompletion(command) {
        if (!this.currentScenario) return false;

        const scenario = this.scenarios[this.currentScenario];
        const step = scenario.steps[this.currentStep];
        
        if (!step) return false;

        let isMatch = false;
        
        if (step.expectedCommand === "any") {
            // Accept any non-slash command for natural language steps
            isMatch = !command.startsWith('/');
        } else if (step.expectedCommand.startsWith('/')) {
            // Check for specific slash command
            isMatch = command.toLowerCase().startsWith(step.expectedCommand.toLowerCase());
        } else {
            // Check for partial command match
            isMatch = command.toLowerCase().includes(step.expectedCommand.toLowerCase());
        }

        if (isMatch) {
            this.completeStep();
            return true;
        }

        return false;
    }

    completeStep() {
        if (!this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        const step = scenario.steps[this.currentStep];
        
        // Update progress
        this.progress[this.currentScenario].stepsCompleted.push(this.currentStep);
        this.progress[this.currentScenario].currentStep = this.currentStep + 1;

        // Show success message
        if (window.addOutput) {
            addOutput('success-output', `✅ ${step.successMessage}`);
        }

        // Move to next step
        this.currentStep++;
        
        // Small delay before showing next step
        setTimeout(() => {
            this.showCurrentStep();
        }, 1500);
    }

    completeScenario() {
        if (!this.currentScenario) return;

        const scenario = this.scenarios[this.currentScenario];
        
        // Mark scenario as completed
        this.progress[this.currentScenario].completed = true;
        this.progress[this.currentScenario].completedAt = Date.now();
        this.progress[this.currentScenario].timeSpent = 
            Date.now() - this.progress[this.currentScenario].started;

        const completionMessage = `
🎉 Congratulations! You've completed the "${scenario.name}" scenario!

📊 Summary:
• Steps completed: ${scenario.steps.length}/${scenario.steps.length}
• Time taken: ${this.formatTime(this.progress[this.currentScenario].timeSpent)}
• Difficulty: ${scenario.difficulty}

🚀 What's next?
Try another scenario from the sidebar to continue learning!

Available scenarios:
${Object.entries(this.scenarios)
    .filter(([name]) => name !== this.currentScenario)
    .map(([name, s]) => `• ${s.name} (${s.difficulty})`)
    .join('\n')}
`;

        if (window.addOutput) {
            addOutput('success-output', completionMessage);
        }

        // Update session manager
        if (window.sessionManager) {
            sessionManager.updateScenarioProgress(this.currentScenario, this.progress[this.currentScenario]);
        }

        // Reset current scenario
        this.currentScenario = null;
        this.currentStep = 0;
    }

    getCurrentScenario() {
        return this.currentScenario ? {
            name: this.currentScenario,
            scenario: this.scenarios[this.currentScenario],
            currentStep: this.currentStep,
            progress: this.progress[this.currentScenario]
        } : null;
    }

    getProgress() {
        return this.progress;
    }

    resetProgress(scenarioName = null) {
        if (scenarioName) {
            delete this.progress[scenarioName];
        } else {
            this.progress = {};
        }
        
        if (scenarioName === this.currentScenario) {
            this.currentScenario = null;
            this.currentStep = 0;
        }
    }

    getScenarioStats() {
        const stats = {
            totalScenarios: Object.keys(this.scenarios).length,
            completedScenarios: 0,
            totalSteps: 0,
            completedSteps: 0,
            totalTime: 0
        };

        Object.values(this.scenarios).forEach(scenario => {
            stats.totalSteps += scenario.steps.length;
        });

        Object.values(this.progress).forEach(progress => {
            if (progress.completed) {
                stats.completedScenarios++;
            }
            stats.completedSteps += progress.stepsCompleted.length;
            stats.totalTime += progress.timeSpent || 0;
        });

        return stats;
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Hook into command execution to check step completion
    static interceptCommand(command) {
        if (window.cliScenarios && window.cliScenarios.scenarios) {
            const scenarios = new CLIScenarios();
            scenarios.checkStepCompletion(command);
        }
    }
}

// Initialize scenarios
const cliScenarios = new CLIScenarios();

// Hook into command execution
if (typeof window !== 'undefined') {
    const originalExecuteCommand = window.executeCommand;
    if (originalExecuteCommand) {
        window.executeCommand = function(command) {
            // Check scenario completion first
            if (cliScenarios.currentScenario) {
                cliScenarios.checkStepCompletion(command);
            }
            
            // Execute original command
            return originalExecuteCommand.call(this, command);
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLIScenarios;
}