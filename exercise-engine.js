/**
 * Interactive Exercise Engine for Claude Code Training
 * Provides hands-on exercises with validation, hints, and progress tracking
 */

class ExerciseEngine {
    constructor(simulator) {
        this.simulator = simulator;
        this.currentExercise = null;
        this.exerciseHistory = [];
        this.userProgress = {
            completedExercises: [],
            currentStreak: 0,
            totalPoints: 0,
            badges: [],
            startTime: Date.now()
        };
        
        // Initialize exercise catalog
        this.exercises = this.initializeExercises();
        this.exerciseCategories = this.initializeCategories();
        
        // Validation patterns
        this.validationPatterns = this.initializeValidationPatterns();
        
        // Event callbacks
        this.callbacks = {};
    }

    /**
     * Initialize exercise catalog
     */
    initializeExercises() {
        return {
            // Beginner Level Exercises
            'setup-check': {
                id: 'setup-check',
                title: 'Claude Code Setup Verification',
                category: 'setup',
                difficulty: 'beginner',
                estimatedTime: 5,
                points: 10,
                description: 'Verify your Claude Code installation and configuration',
                objectives: [
                    'Check Claude Code status',
                    'Verify Vertex AI configuration',
                    'Confirm VS Code integration'
                ],
                instructions: [
                    'Start by checking your Claude Code status',
                    'Use the /status command to see your configuration',
                    'Verify that Vertex AI is properly configured',
                    'Check that VS Code extension is connected'
                ],
                hints: [
                    'Type /status to check your current configuration',
                    'Look for the Vertex AI configuration in the output',
                    'The VS Code connection should show as "Connected"'
                ],
                validationSteps: [
                    {
                        command: '/status',
                        expectedOutput: ['API Provider: Google Vertex AI', 'Connected to VS Code'],
                        points: 10
                    }
                ],
                successMessage: 'Excellent! Your Claude Code setup is properly configured.',
                nextExercise: 'basic-commands'
            },

            'basic-commands': {
                id: 'basic-commands',
                title: 'Essential Claude Code Commands',
                category: 'commands',
                difficulty: 'beginner',
                estimatedTime: 10,
                points: 20,
                description: 'Learn the fundamental Claude Code commands',
                objectives: [
                    'Use help command to explore features',
                    'Check memory management',
                    'Practice clearing conversation'
                ],
                instructions: [
                    'Explore available commands using /help',
                    'Check your current memory with /memory',
                    'Clear the conversation history with /clear',
                    'View cost tracking with /cost'
                ],
                hints: [
                    'Start with /help to see all available commands',
                    'Memory shows your current project context',
                    'Clearing conversation helps manage context size'
                ],
                validationSteps: [
                    {
                        command: '/help',
                        expectedOutput: ['Available Commands', 'Core Commands'],
                        points: 5
                    },
                    {
                        command: '/memory',
                        expectedOutput: ['Project Memory', 'CLAUDE.md'],
                        points: 5
                    },
                    {
                        command: '/clear',
                        expectedOutput: ['Conversation history cleared'],
                        points: 5
                    },
                    {
                        command: '/cost',
                        expectedOutput: ['Session Cost', 'tokens'],
                        points: 5
                    }
                ],
                successMessage: 'Great! You\'ve mastered the basic Claude Code commands.',
                nextExercise: 'project-init'
            },

            'project-init': {
                id: 'project-init',
                title: 'Initialize Project Memory',
                category: 'project-setup',
                difficulty: 'beginner',
                estimatedTime: 15,
                points: 30,
                description: 'Learn to initialize and manage project memory with CLAUDE.md',
                objectives: [
                    'Initialize a new project with /init',
                    'Understand CLAUDE.md structure',
                    'Customize project documentation'
                ],
                instructions: [
                    'Initialize your project using /init command',
                    'Review the generated CLAUDE.md content',
                    'Check the memory with /memory to see changes',
                    'Understand how project context helps Claude Code'
                ],
                hints: [
                    'The /init command creates a CLAUDE.md file with project structure',
                    'CLAUDE.md contains project overview, architecture, and guidelines',
                    'Good project memory leads to better assistance from Claude'
                ],
                validationSteps: [
                    {
                        command: '/init',
                        expectedOutput: ['Project initialized successfully', 'CLAUDE.md'],
                        points: 15
                    },
                    {
                        command: '/memory',
                        expectedOutput: ['Project Overview', 'Architecture', 'Development Guidelines'],
                        points: 15
                    }
                ],
                successMessage: 'Perfect! You understand how to set up project memory for optimal Claude Code assistance.',
                nextExercise: 'simple-component'
            },

            // Intermediate Level Exercises
            'simple-component': {
                id: 'simple-component',
                title: 'Create a React Component',
                category: 'development',
                difficulty: 'intermediate',
                estimatedTime: 20,
                points: 50,
                description: 'Use Claude Code to create a React component following AutoZone standards',
                objectives: [
                    'Request component creation using natural language',
                    'Verify TypeScript usage',
                    'Ensure AutoZone coding standards'
                ],
                instructions: [
                    'Ask Claude to create a React component for user profile display',
                    'Specify that it should use TypeScript',
                    'Request AutoZone coding standards compliance',
                    'Ask for proper prop interfaces and error handling'
                ],
                hints: [
                    'Use natural language like "Create a React component for..."',
                    'Mention TypeScript and AutoZone standards in your request',
                    'Look for proper interface definitions in the response'
                ],
                validationSteps: [
                    {
                        userInput: 'create react component',
                        expectedOutput: ['React.FC', 'interface', 'TypeScript'],
                        points: 25,
                        freeform: true
                    },
                    {
                        followUp: 'typescript interfaces',
                        expectedOutput: ['interface', 'Props', 'React.FC'],
                        points: 25,
                        freeform: true
                    }
                ],
                successMessage: 'Excellent! You can effectively communicate with Claude Code to generate quality React components.',
                nextExercise: 'code-review'
            },

            'code-review': {
                id: 'code-review',
                title: 'Pull Request Review',
                category: 'review',
                difficulty: 'intermediate',
                estimatedTime: 15,
                points: 40,
                description: 'Learn to use Claude Code for code review tasks',
                objectives: [
                    'Use /review command for PR analysis',
                    'Understand review feedback',
                    'Get PR comments using /pr-comments'
                ],
                instructions: [
                    'Use /review command with a sample PR URL',
                    'Analyze the review feedback provided',
                    'Use /pr-comments to see existing feedback',
                    'Understand the different types of feedback'
                ],
                hints: [
                    '/review analyzes code changes and provides feedback',
                    'Look for security, performance, and style suggestions',
                    '/pr-comments shows existing reviewer feedback'
                ],
                validationSteps: [
                    {
                        command: '/review https://github.com/sample/repo/pull/1',
                        expectedOutput: ['Pull Request Review', 'Analysis Results', 'suggestions'],
                        points: 20
                    },
                    {
                        command: '/pr-comments',
                        expectedOutput: ['Pull Request Comments', 'reviewers'],
                        points: 20
                    }
                ],
                successMessage: 'Great! You can now use Claude Code effectively for code reviews.',
                nextExercise: 'debugging-assistance'
            },

            // Advanced Level Exercises
            'debugging-assistance': {
                id: 'debugging-assistance',
                title: 'Debugging with Claude Code',
                category: 'debugging',
                difficulty: 'advanced',
                estimatedTime: 25,
                points: 60,
                description: 'Use Claude Code to debug and solve complex issues',
                objectives: [
                    'Describe debugging scenarios effectively',
                    'Get targeted debugging advice',
                    'Implement suggested solutions'
                ],
                instructions: [
                    'Describe a debugging scenario to Claude Code',
                    'Ask for help with authentication errors',
                    'Request step-by-step debugging guidance',
                    'Follow the provided debugging methodology'
                ],
                hints: [
                    'Be specific about error messages and symptoms',
                    'Claude can provide systematic debugging approaches',
                    'Ask for both immediate fixes and preventive measures'
                ],
                validationSteps: [
                    {
                        userInput: 'help debug authentication error',
                        expectedOutput: ['Debug Analysis', 'Common Issues', 'Solutions'],
                        points: 30,
                        freeform: true
                    },
                    {
                        followUp: 'debugging steps',
                        expectedOutput: ['debugging', 'steps', 'methodology'],
                        points: 30,
                        freeform: true
                    }
                ],
                successMessage: 'Excellent debugging skills! You can leverage Claude Code for complex problem-solving.',
                nextExercise: 'advanced-workflow'
            },

            'advanced-workflow': {
                id: 'advanced-workflow',
                title: 'Complete Development Workflow',
                category: 'workflow',
                difficulty: 'advanced',
                estimatedTime: 30,
                points: 80,
                description: 'Execute a complete development workflow using Claude Code',
                objectives: [
                    'Plan feature implementation',
                    'Generate code with testing',
                    'Review and optimize',
                    'Document the solution'
                ],
                instructions: [
                    'Plan a complete authentication feature',
                    'Request component creation, testing, and documentation',
                    'Ask for code review and optimization suggestions',
                    'Generate comprehensive documentation'
                ],
                hints: [
                    'Break complex tasks into smaller, manageable pieces',
                    'Ask for testing alongside implementation',
                    'Request both implementation and maintenance guidance'
                ],
                validationSteps: [
                    {
                        userInput: 'plan authentication feature implementation',
                        expectedOutput: ['Implementation Plan', 'Phase', 'components'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'create authentication component with tests',
                        expectedOutput: ['component', 'test', 'TypeScript'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'review authentication code for optimization',
                        expectedOutput: ['review', 'optimization', 'recommendations'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'generate documentation for authentication',
                        expectedOutput: ['documentation', 'README', 'API'],
                        points: 20,
                        freeform: true
                    }
                ],
                successMessage: 'Outstanding! You\'ve mastered the complete Claude Code development workflow.',
                nextExercise: null
            }
        };
    }

    /**
     * Initialize exercise categories
     */
    initializeCategories() {
        return {
            'setup': {
                name: 'Setup & Configuration',
                description: 'Learn to configure Claude Code for AutoZone development',
                icon: '⚙️',
                color: '#2196F3'
            },
            'commands': {
                name: 'Core Commands',
                description: 'Master essential Claude Code commands',
                icon: '💻',
                color: '#4CAF50'
            },
            'project-setup': {
                name: 'Project Setup',
                description: 'Initialize and manage project memory',
                icon: '📁',
                color: '#FF9800'
            },
            'development': {
                name: 'Development',
                description: 'Use Claude Code for coding tasks',
                icon: '🏗️',
                color: '#9C27B0'
            },
            'review': {
                name: 'Code Review',
                description: 'Learn code review workflows',
                icon: '🔍',
                color: '#F44336'
            },
            'debugging': {
                name: 'Debugging',
                description: 'Debug and troubleshoot with Claude Code',
                icon: '🐛',
                color: '#FF5722'
            },
            'workflow': {
                name: 'Complete Workflows',
                description: 'End-to-end development workflows',
                icon: '🔄',
                color: '#607D8B'
            }
        };
    }

    /**
     * Initialize validation patterns
     */
    initializeValidationPatterns() {
        return {
            commandExecution: {
                '/status': ['API Provider', 'Working Directory', 'Model'],
                '/help': ['Available Commands', 'Core Commands'],
                '/memory': ['Project Memory', 'CLAUDE.md'],
                '/clear': ['cleared', 'Starting fresh'],
                '/init': ['initialized successfully', 'CLAUDE.md'],
                '/cost': ['Session Cost', 'tokens', 'cost']
            },
            naturalLanguage: {
                'react component': ['React.FC', 'interface', 'props'],
                'typescript': ['interface', 'type', 'TypeScript'],
                'authentication': ['auth', 'login', 'JWT', 'token'],
                'debugging': ['debug', 'error', 'troubleshoot'],
                'testing': ['test', 'jest', 'spec', 'coverage']
            }
        };
    }

    /**
     * Start an exercise
     */
    startExercise(exerciseId) {
        const exercise = this.exercises[exerciseId];
        if (!exercise) {
            throw new Error(`Exercise ${exerciseId} not found`);
        }

        this.currentExercise = {
            ...exercise,
            startTime: Date.now(),
            currentStep: 0,
            attemptsCount: 0,
            hintsUsed: 0,
            userActions: [],
            validationResults: []
        };

        this.emit('exerciseStarted', this.currentExercise);
        return this.getExerciseIntroduction();
    }

    /**
     * Get exercise introduction
     */
    getExerciseIntroduction() {
        const ex = this.currentExercise;
        const category = this.exerciseCategories[ex.category];
        
        return `🎯 **${ex.title}**
${category.icon} ${category.name} • ${ex.difficulty} • ${ex.estimatedTime} min • ${ex.points} points

**Description:**
${ex.description}

**Learning Objectives:**
${ex.objectives.map(obj => `• ${obj}`).join('\n')}

**Instructions:**
${ex.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

💡 **Available Actions:**
• Type your command or request
• Use "hint" for guidance
• Use "skip" to move to next step
• Use "restart" to start over

Ready to begin? Start with step 1!`;
    }

    /**
     * Process user action during exercise
     */
    async processExerciseAction(userInput) {
        if (!this.currentExercise) {
            return 'No active exercise. Use startExercise() to begin.';
        }

        const input = userInput.trim().toLowerCase();
        
        // Handle special commands
        if (input === 'hint') {
            return this.provideHint();
        } else if (input === 'skip') {
            return this.skipCurrentStep();
        } else if (input === 'restart') {
            return this.restartExercise();
        } else if (input === 'status') {
            return this.getExerciseStatus();
        }

        // Process actual exercise input
        return await this.validateUserAction(userInput);
    }

    /**
     * Validate user action against exercise requirements
     */
    async validateUserAction(userInput) {
        const ex = this.currentExercise;
        const currentStepIndex = ex.currentStep;
        const validationStep = ex.validationSteps[currentStepIndex];

        if (!validationStep) {
            return this.completeExercise();
        }

        ex.attemptsCount++;
        ex.userActions.push({
            input: userInput,
            timestamp: Date.now(),
            stepIndex: currentStepIndex
        });

        // Execute command through simulator
        let simulatorResponse;
        try {
            simulatorResponse = await this.simulator.execute(userInput);
        } catch (error) {
            simulatorResponse = `Error: ${error.message}`;
        }

        // Validate the response
        const validation = this.validateResponse(validationStep, userInput, simulatorResponse);
        ex.validationResults.push(validation);

        if (validation.passed) {
            ex.currentStep++;
            this.userProgress.totalPoints += validation.pointsEarned;
            
            const response = `✅ **Step ${currentStepIndex + 1} Complete!** (+${validation.pointsEarned} points)

${simulatorResponse}

${validation.feedback}

${this.getNextStepPrompt()}`;

            this.emit('stepCompleted', {
                exercise: ex,
                step: currentStepIndex,
                validation: validation
            });

            return response;
        } else {
            const response = `❌ **Step ${currentStepIndex + 1} - Try Again**

${simulatorResponse}

${validation.feedback}

💡 **Hint:** ${this.getContextualHint(validationStep, userInput)}

Try again or type "hint" for more guidance.`;

            return response;
        }
    }

    /**
     * Validate response against expected patterns
     */
    validateResponse(validationStep, userInput, simulatorResponse) {
        const validation = {
            passed: false,
            pointsEarned: 0,
            feedback: '',
            matchedPatterns: []
        };

        if (validationStep.freeform) {
            // Freeform validation - check for key concepts
            const matches = validationStep.expectedOutput.filter(pattern => 
                simulatorResponse.toLowerCase().includes(pattern.toLowerCase()) ||
                userInput.toLowerCase().includes(pattern.toLowerCase())
            );

            if (matches.length >= Math.ceil(validationStep.expectedOutput.length * 0.6)) {
                validation.passed = true;
                validation.pointsEarned = validationStep.points;
                validation.matchedPatterns = matches;
                validation.feedback = `Great! Your request covered the key concepts: ${matches.join(', ')}`;
            } else {
                validation.feedback = `Make sure to include these concepts: ${validationStep.expectedOutput.join(', ')}`;
            }
        } else {
            // Exact command validation
            const inputMatches = validationStep.command ? 
                userInput.toLowerCase().includes(validationStep.command.toLowerCase()) : true;
            
            const outputMatches = validationStep.expectedOutput.filter(pattern =>
                simulatorResponse.toLowerCase().includes(pattern.toLowerCase())
            );

            if (inputMatches && outputMatches.length >= Math.ceil(validationStep.expectedOutput.length * 0.7)) {
                validation.passed = true;
                validation.pointsEarned = validationStep.points;
                validation.matchedPatterns = outputMatches;
                validation.feedback = `Perfect! Command executed correctly and produced expected output.`;
            } else if (!inputMatches) {
                validation.feedback = `Try using the "${validationStep.command}" command.`;
            } else {
                validation.feedback = `Command executed but check the output for: ${validationStep.expectedOutput.join(', ')}`;
            }
        }

        return validation;
    }

    /**
     * Provide hint for current step
     */
    provideHint() {
        const ex = this.currentExercise;
        const currentStepIndex = ex.currentStep;
        
        if (currentStepIndex >= ex.hints.length) {
            return '💡 You\'re doing great! Follow the instructions to complete this step.';
        }

        ex.hintsUsed++;
        const hint = ex.hints[currentStepIndex];
        
        return `💡 **Hint for Step ${currentStepIndex + 1}:**
${hint}

Remember: Using hints is part of learning! Don't hesitate to ask for help.`;
    }

    /**
     * Get contextual hint based on user's attempt
     */
    getContextualHint(validationStep, userInput) {
        if (validationStep.freeform) {
            const missing = validationStep.expectedOutput.filter(pattern =>
                !userInput.toLowerCase().includes(pattern.toLowerCase())
            );
            return `Try mentioning: ${missing.slice(0, 2).join(', ')}`;
        } else if (validationStep.command) {
            if (!userInput.toLowerCase().includes(validationStep.command.toLowerCase())) {
                return `Use the "${validationStep.command}" command`;
            } else {
                return `The command is correct, check the output for the expected information`;
            }
        } else {
            return 'Review the instructions and try a different approach';
        }
    }

    /**
     * Skip current step
     */
    skipCurrentStep() {
        const ex = this.currentExercise;
        ex.currentStep++;
        
        return `⏭️ **Step Skipped**

Moving to the next step. You can always come back to practice this later.

${this.getNextStepPrompt()}`;
    }

    /**
     * Restart current exercise
     */
    restartExercise() {
        const exerciseId = this.currentExercise.id;
        return this.startExercise(exerciseId);
    }

    /**
     * Get next step prompt
     */
    getNextStepPrompt() {
        const ex = this.currentExercise;
        const nextStepIndex = ex.currentStep;
        
        if (nextStepIndex >= ex.validationSteps.length) {
            return this.completeExercise();
        }

        const nextStep = ex.validationSteps[nextStepIndex];
        return `🎯 **Step ${nextStepIndex + 1}:**
${ex.instructions[nextStepIndex]}

${nextStep.freeform ? 
    'Use natural language to make your request.' : 
    `Try the "${nextStep.command}" command.`}`;
    }

    /**
     * Complete current exercise
     */
    completeExercise() {
        const ex = this.currentExercise;
        const timeSpent = Math.floor((Date.now() - ex.startTime) / 1000);
        const efficiency = timeSpent <= (ex.estimatedTime * 60) ? 1.2 : 1.0;
        const hintPenalty = Math.max(0, 1 - (ex.hintsUsed * 0.1));
        const finalPoints = Math.floor(ex.points * efficiency * hintPenalty);

        // Update progress
        this.userProgress.completedExercises.push(ex.id);
        this.userProgress.totalPoints += finalPoints;
        this.userProgress.currentStreak++;

        // Add to history
        this.exerciseHistory.push({
            ...ex,
            completedTime: Date.now(),
            timeSpent: timeSpent,
            finalPoints: finalPoints,
            efficiency: efficiency
        });

        // Check for badges
        const badges = this.checkForNewBadges();

        this.emit('exerciseCompleted', {
            exercise: ex,
            finalPoints: finalPoints,
            badges: badges
        });

        this.currentExercise = null;

        const badgeText = badges.length > 0 ? 
            `\n🏆 **New Badges Earned:** ${badges.map(b => b.name).join(', ')}` : '';

        const nextExerciseText = ex.nextExercise ? 
            `\n🎯 **Next Exercise:** ${this.exercises[ex.nextExercise].title}
Type "next" to continue or choose from the exercise menu.` : 
            `\n🎉 **Congratulations!** You've completed all exercises in this series.`;

        return `🎉 **Exercise Complete!**

${ex.successMessage}

📊 **Results:**
• Points earned: ${finalPoints}/${ex.points}
• Time: ${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s
• Efficiency bonus: ${efficiency > 1 ? '✅' : '⏹️'}
• Attempts: ${ex.attemptsCount}
• Hints used: ${ex.hintsUsed}${badgeText}${nextExerciseText}`;
    }

    /**
     * Check for new badges
     */
    checkForNewBadges() {
        const newBadges = [];
        const progress = this.userProgress;

        // Define badge criteria
        const badgeCriteria = [
            {
                id: 'first-steps',
                name: 'First Steps',
                description: 'Complete your first exercise',
                condition: () => progress.completedExercises.length === 1
            },
            {
                id: 'command-master',
                name: 'Command Master',
                description: 'Complete all command exercises',
                condition: () => {
                    const commandExercises = ['setup-check', 'basic-commands'];
                    return commandExercises.every(id => progress.completedExercises.includes(id));
                }
            },
            {
                id: 'developer',
                name: 'Developer',
                description: 'Complete a development exercise',
                condition: () => progress.completedExercises.includes('simple-component')
            },
            {
                id: 'reviewer',
                name: 'Code Reviewer',
                description: 'Complete code review exercises',
                condition: () => progress.completedExercises.includes('code-review')
            },
            {
                id: 'debugger',
                name: 'Bug Hunter',
                description: 'Complete debugging exercise',
                condition: () => progress.completedExercises.includes('debugging-assistance')
            },
            {
                id: 'expert',
                name: 'Claude Code Expert',
                description: 'Complete all exercises',
                condition: () => progress.completedExercises.length >= Object.keys(this.exercises).length
            },
            {
                id: 'efficient',
                name: 'Efficiency Expert',
                description: 'Complete 3 exercises under time limit',
                condition: () => {
                    const efficientCount = this.exerciseHistory.filter(ex => ex.efficiency > 1).length;
                    return efficientCount >= 3;
                }
            },
            {
                id: 'persistent',
                name: 'Persistent Learner',
                description: 'Complete 5 exercises in a row',
                condition: () => progress.currentStreak >= 5
            }
        ];

        // Check which badges are newly earned
        badgeCriteria.forEach(badge => {
            if (!progress.badges.some(b => b.id === badge.id) && badge.condition()) {
                newBadges.push(badge);
                progress.badges.push(badge);
            }
        });

        return newBadges;
    }

    /**
     * Get exercise status
     */
    getExerciseStatus() {
        if (!this.currentExercise) {
            return 'No active exercise. Use the exercise menu to start one.';
        }

        const ex = this.currentExercise;
        const timeElapsed = Math.floor((Date.now() - ex.startTime) / 1000);
        const progress = Math.floor((ex.currentStep / ex.validationSteps.length) * 100);

        return `📊 **Exercise Status**

**${ex.title}**
• Progress: ${ex.currentStep}/${ex.validationSteps.length} steps (${progress}%)
• Time elapsed: ${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s
• Attempts: ${ex.attemptsCount}
• Hints used: ${ex.hintsUsed}
• Points possible: ${ex.points}

**Current Step:** ${ex.currentStep + 1}
${ex.instructions[ex.currentStep]}`;
    }

    /**
     * Get user progress summary
     */
    getUserProgress() {
        const progress = this.userProgress;
        const totalExercises = Object.keys(this.exercises).length;
        const completionRate = Math.floor((progress.completedExercises.length / totalExercises) * 100);

        return `📈 **Your Progress**

**Overall Statistics:**
• Exercises completed: ${progress.completedExercises.length}/${totalExercises} (${completionRate}%)
• Total points: ${progress.totalPoints}
• Current streak: ${progress.currentStreak}
• Time spent: ${Math.floor((Date.now() - progress.startTime) / 60000)} minutes

**Badges Earned:** ${progress.badges.length > 0 ? 
    progress.badges.map(b => `🏆 ${b.name}`).join('\n') : 
    'None yet - keep practicing!'}

**Recent Exercises:**
${this.exerciseHistory.slice(-3).map(ex => 
    `• ${ex.title} (${ex.finalPoints} points)`
).join('\n')}`;
    }

    /**
     * Get exercise menu
     */
    getExerciseMenu() {
        const categories = Object.entries(this.exerciseCategories);
        
        let menu = `🎯 **Claude Code Training Exercises**\n\n`;

        categories.forEach(([catId, category]) => {
            const exercisesInCategory = Object.values(this.exercises)
                .filter(ex => ex.category === catId);
            
            if (exercisesInCategory.length > 0) {
                menu += `${category.icon} **${category.name}**\n${category.description}\n\n`;
                
                exercisesInCategory.forEach(ex => {
                    const completed = this.userProgress.completedExercises.includes(ex.id) ? '✅' : '⏳';
                    const difficulty = ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1);
                    
                    menu += `${completed} **${ex.title}**\n`;
                    menu += `   ${difficulty} • ${ex.estimatedTime}min • ${ex.points}pts\n`;
                    menu += `   ${ex.description}\n\n`;
                });
            }
        });

        menu += `💡 **How to start:**\n`;
        menu += `• Type "start [exercise-id]" to begin an exercise\n`;
        menu += `• Type "progress" to see your progress\n`;
        menu += `• Type "help" for exercise commands\n`;

        return menu;
    }

    /**
     * Get next recommended exercise
     */
    getNextRecommendedExercise() {
        const completed = this.userProgress.completedExercises;
        
        // Find the first incomplete exercise
        for (const exerciseId of Object.keys(this.exercises)) {
            if (!completed.includes(exerciseId)) {
                return this.exercises[exerciseId];
            }
        }
        
        return null; // All exercises completed
    }

    /**
     * Event handling
     */
    on(event, callback) {
        this.callbacks[event] = callback;
    }

    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    /**
     * Reset progress (for demo purposes)
     */
    resetProgress() {
        this.userProgress = {
            completedExercises: [],
            currentStreak: 0,
            totalPoints: 0,
            badges: [],
            startTime: Date.now()
        };
        this.exerciseHistory = [];
        this.currentExercise = null;
        
        return 'Progress reset successfully! Ready to start fresh.';
    }

    /**
     * Export progress data
     */
    exportProgress() {
        return {
            progress: this.userProgress,
            history: this.exerciseHistory,
            completedAt: new Date().toISOString()
        };
    }

    /**
     * Import progress data
     */
    importProgress(data) {
        if (data.progress) {
            this.userProgress = data.progress;
        }
        if (data.history) {
            this.exerciseHistory = data.history;
        }
        
        return 'Progress imported successfully!';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExerciseEngine;
} else {
    window.ExerciseEngine = ExerciseEngine;
}