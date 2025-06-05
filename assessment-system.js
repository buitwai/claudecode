/**
 * Assessment System for Claude Code Training Platform
 * Handles quizzes, coding exercises, automated scoring, and detailed feedback
 */

class AssessmentSystem {
    constructor() {
        this.currentAssessment = null;
        this.assessmentState = {};
        this.timer = null;
        this.results = {};
        this.questionBank = this.initializeQuestionBank();
        this.codingExercises = this.initializeCodingExercises();
        
        this.init();
    }

    /**
     * Initialize the assessment system
     */
    init() {
        this.setupEventListeners();
        this.loadSavedState();
    }

    /**
     * Start a new assessment
     */
    startAssessment(assessmentConfig) {
        this.currentAssessment = {
            id: assessmentConfig.id,
            title: assessmentConfig.title,
            type: assessmentConfig.type, // 'quiz', 'coding', 'mixed', 'scenario'
            timeLimit: assessmentConfig.timeLimit, // in minutes
            passingScore: assessmentConfig.passingScore || 70,
            questions: this.generateQuestions(assessmentConfig),
            startTime: Date.now(),
            attempts: this.getAssessmentAttempts(assessmentConfig.id) + 1
        };

        this.assessmentState = {
            currentQuestionIndex: 0,
            answers: {},
            timeSpent: {},
            startTime: Date.now(),
            status: 'in_progress'
        };

        this.saveAssessmentState();
        this.renderAssessment();
        this.startTimer();
        
        // Track assessment start
        if (window.AnalyticsEngine) {
            AnalyticsEngine.trackAction('assessment_started', {
                assessmentId: this.currentAssessment.id,
                type: this.currentAssessment.type,
                questionsCount: this.currentAssessment.questions.length
            });
        }

        return this.currentAssessment;
    }

    /**
     * Generate questions for assessment based on configuration
     */
    generateQuestions(config) {
        const questions = [];
        
        // Get questions by difficulty and topic
        const filteredQuestions = this.questionBank.filter(q => 
            (!config.topics || config.topics.includes(q.topic)) &&
            (!config.difficulty || q.difficulty === config.difficulty)
        );

        // Shuffle and select questions
        const shuffled = this.shuffleArray([...filteredQuestions]);
        const selectedQuestions = shuffled.slice(0, config.questionCount || 10);

        // Add coding exercises if needed
        if (config.type === 'coding' || config.type === 'mixed') {
            const codingQuestions = this.generateCodingQuestions(config);
            questions.push(...codingQuestions);
        }

        questions.push(...selectedQuestions);
        return this.shuffleArray(questions);
    }

    /**
     * Generate coding exercise questions
     */
    generateCodingQuestions(config) {
        const exercises = this.codingExercises.filter(ex => 
            (!config.topics || config.topics.some(topic => ex.topics.includes(topic))) &&
            (!config.difficulty || ex.difficulty === config.difficulty)
        );

        return exercises.slice(0, config.codingQuestionCount || 2).map(exercise => ({
            ...exercise,
            type: 'coding',
            id: `coding_${exercise.id}`,
            timeLimit: exercise.timeLimit || 15 // minutes per coding question
        }));
    }

    /**
     * Render the current assessment
     */
    renderAssessment() {
        if (!this.currentAssessment) return;

        const container = document.getElementById('assessment-container') || this.createAssessmentContainer();
        
        container.innerHTML = `
            <div class="assessment-header">
                <h2>${this.currentAssessment.title}</h2>
                <div class="assessment-info">
                    <span class="question-counter">
                        Question ${this.assessmentState.currentQuestionIndex + 1} of ${this.currentAssessment.questions.length}
                    </span>
                    <span class="timer" id="assessment-timer">
                        ${this.formatTime(this.getRemainingTime())}
                    </span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.assessmentState.currentQuestionIndex / this.currentAssessment.questions.length) * 100}%"></div>
                </div>
            </div>
            <div class="question-container" id="question-container">
                ${this.renderCurrentQuestion()}
            </div>
            <div class="assessment-controls">
                <button class="btn-secondary" onclick="assessmentSystem.previousQuestion()" 
                        ${this.assessmentState.currentQuestionIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                <button class="btn-primary" onclick="assessmentSystem.nextQuestion()">
                    ${this.assessmentState.currentQuestionIndex === this.currentAssessment.questions.length - 1 ? 'Submit Assessment' : 'Next'} 
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }

    /**
     * Render the current question based on its type
     */
    renderCurrentQuestion() {
        const question = this.getCurrentQuestion();
        if (!question) return '';

        switch (question.type) {
            case 'multiple_choice':
                return this.renderMultipleChoice(question);
            case 'multiple_select':
                return this.renderMultipleSelect(question);
            case 'true_false':
                return this.renderTrueFalse(question);
            case 'coding':
                return this.renderCodingExercise(question);
            case 'scenario':
                return this.renderScenario(question);
            case 'fill_blank':
                return this.renderFillBlank(question);
            default:
                return this.renderMultipleChoice(question);
        }
    }

    /**
     * Render multiple choice question
     */
    renderMultipleChoice(question) {
        const savedAnswer = this.assessmentState.answers[question.id];
        
        return `
            <div class="question">
                <div class="question-text">
                    <h3>${question.question}</h3>
                    ${question.code ? `<div class="code-block"><pre><code>${question.code}</code></pre></div>` : ''}
                    ${question.image ? `<img src="${question.image}" alt="Question image" class="question-image">` : ''}
                </div>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <label class="option-label">
                            <input type="radio" name="question_${question.id}" value="${index}" 
                                   ${savedAnswer === index ? 'checked' : ''}
                                   onchange="assessmentSystem.saveAnswer('${question.id}', ${index})">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
                ${question.hint ? `<div class="question-hint"><i class="fas fa-lightbulb"></i> ${question.hint}</div>` : ''}
            </div>
        `;
    }

    /**
     * Render multiple select question
     */
    renderMultipleSelect(question) {
        const savedAnswers = this.assessmentState.answers[question.id] || [];
        
        return `
            <div class="question">
                <div class="question-text">
                    <h3>${question.question}</h3>
                    <p class="instruction">Select all that apply</p>
                    ${question.code ? `<div class="code-block"><pre><code>${question.code}</code></pre></div>` : ''}
                </div>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <label class="option-label">
                            <input type="checkbox" name="question_${question.id}" value="${index}" 
                                   ${savedAnswers.includes(index) ? 'checked' : ''}
                                   onchange="assessmentSystem.saveMultiSelectAnswer('${question.id}', ${index})">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render coding exercise
     */
    renderCodingExercise(question) {
        const savedCode = this.assessmentState.answers[question.id] || '';
        
        return `
            <div class="question coding-question">
                <div class="question-text">
                    <h3>${question.question}</h3>
                    <div class="requirements">
                        <h4>Requirements:</h4>
                        <ul>
                            ${question.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    ${question.starterCode ? `
                        <div class="starter-code">
                            <h4>Starter Code:</h4>
                            <div class="code-block">
                                <pre><code>${question.starterCode}</code></pre>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="coding-interface">
                    <div class="code-editor">
                        <div class="editor-header">
                            <span>Your Solution</span>
                            <div class="editor-controls">
                                <button onclick="assessmentSystem.runCode('${question.id}')" class="btn-run">
                                    <i class="fas fa-play"></i> Run Code
                                </button>
                                <button onclick="assessmentSystem.submitCode('${question.id}')" class="btn-submit">
                                    <i class="fas fa-check"></i> Submit
                                </button>
                            </div>
                        </div>
                        <textarea id="code-editor-${question.id}" class="code-textarea" 
                                  placeholder="Write your code here..."
                                  oninput="assessmentSystem.saveCode('${question.id}', this.value)">${savedCode}</textarea>
                    </div>
                    <div class="test-results" id="test-results-${question.id}">
                        <div class="results-header">Test Results</div>
                        <div class="results-content">
                            Run your code to see test results
                        </div>
                    </div>
                </div>
                ${question.examples ? `
                    <div class="examples">
                        <h4>Examples:</h4>
                        ${question.examples.map(ex => `
                            <div class="example">
                                <strong>Input:</strong> <code>${ex.input}</code><br>
                                <strong>Output:</strong> <code>${ex.output}</code>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render scenario-based question
     */
    renderScenario(question) {
        const savedAnswer = this.assessmentState.answers[question.id];
        
        return `
            <div class="question scenario-question">
                <div class="scenario-context">
                    <h3>Scenario</h3>
                    <div class="scenario-description">${question.scenario}</div>
                </div>
                <div class="question-text">
                    <h4>${question.question}</h4>
                </div>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <label class="option-label scenario-option">
                            <input type="radio" name="question_${question.id}" value="${index}" 
                                   ${savedAnswer === index ? 'checked' : ''}
                                   onchange="assessmentSystem.saveAnswer('${question.id}', ${index})">
                            <div class="option-content">
                                <div class="option-title">${option.title}</div>
                                <div class="option-description">${option.description}</div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Save answer for current question
     */
    saveAnswer(questionId, answer) {
        this.assessmentState.answers[questionId] = answer;
        this.assessmentState.timeSpent[questionId] = (this.assessmentState.timeSpent[questionId] || 0) + 1;
        this.saveAssessmentState();
    }

    /**
     * Save multiple select answers
     */
    saveMultiSelectAnswer(questionId, optionIndex) {
        if (!this.assessmentState.answers[questionId]) {
            this.assessmentState.answers[questionId] = [];
        }
        
        const answers = this.assessmentState.answers[questionId];
        const index = answers.indexOf(optionIndex);
        
        if (index > -1) {
            answers.splice(index, 1);
        } else {
            answers.push(optionIndex);
        }
        
        this.saveAssessmentState();
    }

    /**
     * Save coding solution
     */
    saveCode(questionId, code) {
        this.assessmentState.answers[questionId] = code;
        this.saveAssessmentState();
    }

    /**
     * Run coding exercise tests
     */
    runCode(questionId) {
        const question = this.currentAssessment.questions.find(q => q.id === questionId);
        const code = this.assessmentState.answers[questionId] || '';
        
        if (!code.trim()) {
            this.showTestResults(questionId, {
                success: false,
                message: 'Please write some code first',
                tests: []
            });
            return;
        }

        // Simulate code execution and testing
        const results = this.executeCodeTests(question, code);
        this.showTestResults(questionId, results);
        
        // Track code execution
        if (window.AnalyticsEngine) {
            AnalyticsEngine.trackAction('code_executed', {
                questionId,
                codeLength: code.length,
                testsPass: results.testsPass,
                totalTests: results.totalTests
            });
        }
    }

    /**
     * Execute code tests (simulated)
     */
    executeCodeTests(question, code) {
        const results = {
            success: false,
            testsPass: 0,
            totalTests: question.testCases.length,
            tests: [],
            output: '',
            errors: []
        };

        try {
            // This would integrate with a real code execution environment
            // For now, we'll simulate test results
            question.testCases.forEach((testCase, index) => {
                const passed = this.simulateTestExecution(code, testCase);
                results.tests.push({
                    index: index + 1,
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: passed ? testCase.expected : 'Wrong output',
                    passed
                });
                
                if (passed) results.testsPass++;
            });

            results.success = results.testsPass === results.totalTests;
            
        } catch (error) {
            results.errors.push(error.message);
        }

        return results;
    }

    /**
     * Simulate test execution (would be replaced with real execution)
     */
    simulateTestExecution(code, testCase) {
        // This is a simplified simulation
        // In a real implementation, this would execute the code safely
        const codeQuality = this.analyzeCodeQuality(code, testCase);
        return codeQuality.score > 0.7; // Simplified scoring
    }

    /**
     * Analyze code quality and correctness
     */
    analyzeCodeQuality(code, testCase) {
        const metrics = {
            hasCorrectKeywords: this.checkRequiredKeywords(code, testCase.keywords),
            hasCorrectStructure: this.checkCodeStructure(code, testCase.structure),
            followsBestPractices: this.checkBestPractices(code),
            score: 0
        };

        // Calculate overall score
        const weights = { hasCorrectKeywords: 0.4, hasCorrectStructure: 0.4, followsBestPractices: 0.2 };
        metrics.score = Object.keys(weights).reduce((score, key) => 
            score + (metrics[key] ? weights[key] : 0), 0);

        return metrics;
    }

    /**
     * Show test results in the UI
     */
    showTestResults(questionId, results) {
        const container = document.getElementById(`test-results-${questionId}`);
        if (!container) return;

        container.innerHTML = `
            <div class="results-header">
                <span>Test Results</span>
                <span class="results-score ${results.success ? 'pass' : 'fail'}">
                    ${results.testsPass}/${results.totalTests} tests passed
                </span>
            </div>
            <div class="results-content">
                ${results.tests.map(test => `
                    <div class="test-result ${test.passed ? 'pass' : 'fail'}">
                        <div class="test-header">
                            <span>Test ${test.index}</span>
                            <i class="fas ${test.passed ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                        <div class="test-details">
                            <div><strong>Input:</strong> ${test.input}</div>
                            <div><strong>Expected:</strong> ${test.expected}</div>
                            <div><strong>Actual:</strong> ${test.actual}</div>
                        </div>
                    </div>
                `).join('')}
                ${results.errors.length > 0 ? `
                    <div class="test-errors">
                        <strong>Errors:</strong>
                        ${results.errors.map(error => `<div class="error">${error}</div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Navigate to next question
     */
    nextQuestion() {
        if (this.assessmentState.currentQuestionIndex < this.currentAssessment.questions.length - 1) {
            this.assessmentState.currentQuestionIndex++;
            this.renderAssessment();
        } else {
            this.submitAssessment();
        }
        this.saveAssessmentState();
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        if (this.assessmentState.currentQuestionIndex > 0) {
            this.assessmentState.currentQuestionIndex--;
            this.renderAssessment();
        }
        this.saveAssessmentState();
    }

    /**
     * Submit the complete assessment
     */
    submitAssessment() {
        this.stopTimer();
        this.assessmentState.status = 'completed';
        this.assessmentState.completedTime = Date.now();
        
        const results = this.calculateResults();
        this.showResults(results);
        this.saveResults(results);
        
        // Track assessment completion
        if (window.AnalyticsEngine) {
            AnalyticsEngine.trackAssessment(this.currentAssessment.id, results);
        }
        
        return results;
    }

    /**
     * Calculate assessment results and scoring
     */
    calculateResults() {
        const totalQuestions = this.currentAssessment.questions.length;
        let correctAnswers = 0;
        const questionResults = [];
        const totalTime = Date.now() - this.assessmentState.startTime;

        this.currentAssessment.questions.forEach(question => {
            const userAnswer = this.assessmentState.answers[question.id];
            const isCorrect = this.checkAnswer(question, userAnswer);
            
            if (isCorrect) correctAnswers++;
            
            questionResults.push({
                questionId: question.id,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer || question.solution,
                isCorrect,
                timeSpent: this.assessmentState.timeSpent[question.id] || 0,
                points: isCorrect ? (question.points || 1) : 0,
                feedback: this.generateQuestionFeedback(question, userAnswer, isCorrect)
            });
        });

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = score >= this.currentAssessment.passingScore;

        const results = {
            assessmentId: this.currentAssessment.id,
            score,
            totalQuestions,
            correctAnswers,
            passed,
            timeSpent: totalTime,
            questionResults,
            feedback: this.generateOverallFeedback(score, passed),
            recommendations: this.generateRecommendations(questionResults),
            attempts: this.currentAssessment.attempts,
            completedAt: new Date().toISOString()
        };

        return results;
    }

    /**
     * Check if an answer is correct
     */
    checkAnswer(question, userAnswer) {
        if (userAnswer === undefined || userAnswer === null) return false;

        switch (question.type) {
            case 'multiple_choice':
            case 'true_false':
                return userAnswer === question.correctAnswer;
            
            case 'multiple_select':
                if (!Array.isArray(userAnswer)) return false;
                const correct = question.correctAnswers.sort();
                const user = userAnswer.sort();
                return JSON.stringify(correct) === JSON.stringify(user);
            
            case 'coding':
                return this.checkCodingSolution(question, userAnswer);
            
            case 'fill_blank':
                return this.checkFillBlankAnswer(question, userAnswer);
            
            default:
                return false;
        }
    }

    /**
     * Check coding solution
     */
    checkCodingSolution(question, code) {
        if (!code || !code.trim()) return false;
        
        // Run all test cases
        let passedTests = 0;
        for (const testCase of question.testCases) {
            if (this.simulateTestExecution(code, testCase)) {
                passedTests++;
            }
        }
        
        // Require all tests to pass for full credit
        return passedTests === question.testCases.length;
    }

    /**
     * Generate feedback for individual questions
     */
    generateQuestionFeedback(question, userAnswer, isCorrect) {
        if (isCorrect) {
            return question.correctFeedback || "Correct! Well done.";
        }
        
        // Provide specific feedback based on the wrong answer
        if (question.answerFeedback && question.answerFeedback[userAnswer]) {
            return question.answerFeedback[userAnswer];
        }
        
        return question.incorrectFeedback || "That's not correct. Please review the material.";
    }

    /**
     * Generate overall assessment feedback
     */
    generateOverallFeedback(score, passed) {
        const feedback = {
            message: '',
            strengths: [],
            improvements: [],
            nextSteps: []
        };

        if (passed) {
            feedback.message = `Congratulations! You passed with a score of ${score}%.`;
            feedback.nextSteps.push("Continue to the next module");
            feedback.nextSteps.push("Consider taking advanced assessments");
        } else {
            feedback.message = `You scored ${score}%. You need ${this.currentAssessment.passingScore}% to pass.`;
            feedback.improvements.push("Review the course materials");
            feedback.improvements.push("Practice with additional exercises");
            feedback.nextSteps.push("Retake the assessment when ready");
        }

        return feedback;
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(questionResults) {
        const recommendations = [];
        const topicPerformance = {};
        
        // Analyze performance by topic
        questionResults.forEach(result => {
            const question = this.currentAssessment.questions.find(q => q.id === result.questionId);
            if (question.topic) {
                if (!topicPerformance[question.topic]) {
                    topicPerformance[question.topic] = { correct: 0, total: 0 };
                }
                topicPerformance[question.topic].total++;
                if (result.isCorrect) {
                    topicPerformance[question.topic].correct++;
                }
            }
        });

        // Generate recommendations for weak areas
        Object.entries(topicPerformance).forEach(([topic, performance]) => {
            const percentage = (performance.correct / performance.total) * 100;
            if (percentage < 70) {
                recommendations.push({
                    type: 'review',
                    topic,
                    message: `Consider reviewing ${topic} - you scored ${Math.round(percentage)}% in this area`,
                    priority: percentage < 50 ? 'high' : 'medium'
                });
            }
        });

        return recommendations;
    }

    /**
     * Show results to the user
     */
    showResults(results) {
        const container = document.getElementById('assessment-container');
        if (!container) return;

        container.innerHTML = `
            <div class="assessment-results">
                <div class="results-header ${results.passed ? 'pass' : 'fail'}">
                    <div class="score-circle">
                        <span class="score-value">${results.score}%</span>
                        <span class="score-label">${results.passed ? 'Passed' : 'Failed'}</span>
                    </div>
                    <h2>${this.currentAssessment.title} - Results</h2>
                </div>
                
                <div class="results-summary">
                    <div class="summary-stats">
                        <div class="stat">
                            <span class="stat-value">${results.correctAnswers}</span>
                            <span class="stat-label">Correct</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${results.totalQuestions - results.correctAnswers}</span>
                            <span class="stat-label">Incorrect</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${this.formatTime(results.timeSpent)}</span>
                            <span class="stat-label">Time Spent</span>
                        </div>
                    </div>
                </div>

                <div class="feedback-section">
                    <h3>Feedback</h3>
                    <p>${results.feedback.message}</p>
                    
                    ${results.recommendations.length > 0 ? `
                        <div class="recommendations">
                            <h4>Recommendations</h4>
                            <ul>
                                ${results.recommendations.map(rec => `
                                    <li class="recommendation ${rec.priority}">
                                        <i class="fas fa-lightbulb"></i>
                                        ${rec.message}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="results-actions">
                    <button class="btn-primary" onclick="assessmentSystem.viewDetailedResults()">
                        <i class="fas fa-chart-line"></i> View Detailed Results
                    </button>
                    ${!results.passed ? `
                        <button class="btn-secondary" onclick="assessmentSystem.retakeAssessment()">
                            <i class="fas fa-redo"></i> Retake Assessment
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="assessmentSystem.returnToDashboard()">
                        <i class="fas fa-dashboard"></i> Return to Dashboard
                    </button>
                </div>
            </div>
        `;
    }

    // Timer management
    startTimer() {
        if (this.currentAssessment.timeLimit) {
            this.timer = setInterval(() => {
                const remaining = this.getRemainingTime();
                this.updateTimerDisplay(remaining);
                
                if (remaining <= 0) {
                    this.timeUp();
                }
            }, 1000);
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    getRemainingTime() {
        if (!this.currentAssessment.timeLimit) return Infinity;
        
        const elapsed = Date.now() - this.assessmentState.startTime;
        const limit = this.currentAssessment.timeLimit * 60 * 1000; // Convert to milliseconds
        return Math.max(0, limit - elapsed);
    }

    updateTimerDisplay(remaining) {
        const timerElement = document.getElementById('assessment-timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(remaining);
            
            // Add warning styles when time is running low
            if (remaining < 300000) { // 5 minutes
                timerElement.classList.add('time-warning');
            }
            if (remaining < 60000) { // 1 minute
                timerElement.classList.add('time-critical');
            }
        }
    }

    timeUp() {
        this.stopTimer();
        alert('Time is up! Submitting your assessment...');
        this.submitAssessment();
    }

    // Utility methods
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    getCurrentQuestion() {
        return this.currentAssessment?.questions[this.assessmentState.currentQuestionIndex];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Storage methods
    saveAssessmentState() {
        localStorage.setItem('currentAssessment', JSON.stringify(this.currentAssessment));
        localStorage.setItem('assessmentState', JSON.stringify(this.assessmentState));
    }

    loadSavedState() {
        try {
            const savedAssessment = localStorage.getItem('currentAssessment');
            const savedState = localStorage.getItem('assessmentState');
            
            if (savedAssessment && savedState) {
                this.currentAssessment = JSON.parse(savedAssessment);
                this.assessmentState = JSON.parse(savedState);
                
                if (this.assessmentState.status === 'in_progress') {
                    this.renderAssessment();
                    this.startTimer();
                }
            }
        } catch (error) {
            console.error('Error loading saved assessment state:', error);
        }
    }

    saveResults(results) {
        const allResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
        allResults.push(results);
        localStorage.setItem('assessmentResults', JSON.stringify(allResults));
    }

    // Initialize question bank and exercises
    initializeQuestionBank() {
        return [
            {
                id: 'security_1',
                type: 'multiple_choice',
                topic: 'security',
                difficulty: 'beginner',
                question: 'Which environment variable is required to use Vertex AI with Claude Code?',
                options: [
                    'CLAUDE_CODE_API_KEY',
                    'CLAUDE_CODE_USE_VERTEX',
                    'ANTHROPIC_API_KEY',
                    'VERTEX_AI_ENABLED'
                ],
                correctAnswer: 1,
                correctFeedback: 'Correct! CLAUDE_CODE_USE_VERTEX=1 enables Vertex AI integration.',
                incorrectFeedback: 'Review the security setup section for the correct environment variable.'
            },
            {
                id: 'commands_1',
                type: 'multiple_choice',
                topic: 'commands',
                difficulty: 'beginner',
                question: 'Which command shows your current Claude Code configuration?',
                options: ['/config', '/status', '/info', '/show'],
                correctAnswer: 1,
                correctFeedback: 'Correct! /status displays configuration and environment details.',
                incorrectFeedback: 'Try the /status command to see your configuration.'
            },
            {
                id: 'memory_1',
                type: 'true_false',
                topic: 'memory',
                difficulty: 'intermediate',
                question: 'The CLAUDE.md file in your project directory takes precedence over the global ~/.claude/CLAUDE.md file.',
                correctAnswer: true,
                correctFeedback: 'Correct! Project-specific CLAUDE.md files override global settings.',
                incorrectFeedback: 'Project-specific files have higher precedence than global ones.'
            }
            // More questions would be added here...
        ];
    }

    initializeCodingExercises() {
        return [
            {
                id: 'git_workflow',
                title: 'Git Workflow with Claude Code',
                topics: ['git', 'workflows'],
                difficulty: 'intermediate',
                question: 'Write a bash script that creates a git worktree for a new feature branch',
                requirements: [
                    'Create a new worktree in a parallel directory',
                    'Use the feature branch name provided as an argument',
                    'Switch to the new worktree directory'
                ],
                starterCode: '#!/bin/bash\n# Create git worktree for feature development\n',
                testCases: [
                    {
                        input: 'new-authentication',
                        expected: 'Worktree created successfully',
                        keywords: ['git', 'worktree', 'add'],
                        structure: ['#!/bin/bash', 'git worktree add']
                    }
                ],
                examples: [
                    {
                        input: './create-worktree.sh user-dashboard',
                        output: 'Creates ../project-user-dashboard worktree'
                    }
                ],
                timeLimit: 10
            }
        ];
    }

    // Event listeners setup
    setupEventListeners() {
        // Prevent accidental page navigation during assessment
        window.addEventListener('beforeunload', (e) => {
            if (this.assessmentState.status === 'in_progress') {
                e.preventDefault();
                e.returnValue = 'You have an assessment in progress. Are you sure you want to leave?';
            }
        });
    }

    // Additional helper methods for code analysis
    checkRequiredKeywords(code, keywords) {
        return keywords?.every(keyword => code.includes(keyword)) || true;
    }

    checkCodeStructure(code, structure) {
        return structure?.every(pattern => code.includes(pattern)) || true;
    }

    checkBestPractices(code) {
        // Simple best practices check
        const practices = [
            code.includes('#!/bin/bash'), // Shebang for bash scripts
            !code.includes('rm -rf /'), // Dangerous commands
            code.split('\n').some(line => line.trim().startsWith('#')) // Comments
        ];
        return practices.filter(Boolean).length >= practices.length * 0.5;
    }
}

// Initialize assessment system
const assessmentSystem = new AssessmentSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssessmentSystem;
}