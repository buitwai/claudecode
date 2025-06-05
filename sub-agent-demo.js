/**
 * Sub-Agent Demo System
 * Handles interactive demonstrations of sub-agent functionality
 */

class SubAgentDemo {
    constructor() {
        this.currentScenario = null;
        this.demoState = {
            isRunning: false,
            isPaused: false,
            currentStep: 0,
            agents: [],
            timeline: []
        };
        this.scenarios = {};
        this.initializeScenarios();
    }

    initializeScenarios() {
        // Load scenarios from agent-scenarios.js when available
        if (window.agentScenarios) {
            this.scenarios = window.agentScenarios;
        }
    }

    async startDemo(scenarioName) {
        if (this.demoState.isRunning) return;
        
        this.currentScenario = scenarioName;
        this.demoState.isRunning = true;
        this.demoState.isPaused = false;
        this.demoState.currentStep = 0;
        
        const scenario = this.scenarios[scenarioName];
        if (!scenario) {
            console.error(`Scenario ${scenarioName} not found`);
            return;
        }
        
        // Reset the visualization
        this.resetVisualization();
        
        // Start the demo sequence
        await this.runDemoSequence(scenario);
        
        return {
            pause: () => this.pauseDemo(),
            reset: () => this.resetDemo(),
            resume: () => this.resumeDemo()
        };
    }

    async runDemoSequence(scenario) {
        const steps = [
            () => this.showProjectBriefing(scenario),
            () => this.spawnAgents(scenario.agents),
            () => this.distributeInitialTasks(scenario.agents),
            () => this.simulateParallelWork(scenario.agents),
            () => this.showAgentCommunication(scenario.agents),
            () => this.completeProject(scenario),
            () => this.showResults(scenario)
        ];
        
        for (let i = 0; i < steps.length; i++) {
            if (!this.demoState.isRunning || this.demoState.isPaused) break;
            
            this.demoState.currentStep = i;
            await steps[i]();
            
            // Wait between steps
            await this.delay(1000);
        }
        
        this.demoState.isRunning = false;
    }

    async showProjectBriefing(scenario) {
        // Update timeline with project start
        this.addTimelineItem({
            icon: '🎯',
            title: 'Project Initiated',
            description: scenario.description,
            timestamp: this.getCurrentTimestamp()
        });
        
        // Show project stats
        this.updateStats({
            complexity: scenario.complexity,
            estimatedTime: scenario.estimatedTime,
            agentCount: scenario.agents.length
        });
    }

    async spawnAgents(agents) {
        const container = document.getElementById('sub-agents-container');
        container.innerHTML = '';
        
        // Create agent elements
        agents.forEach((agent, index) => {
            const agentElement = this.createAgentElement(agent, index);
            container.appendChild(agentElement);
        });
        
        // Animate agents spawning
        const agentElements = container.querySelectorAll('.sub-agent');
        for (let i = 0; i < agentElements.length; i++) {
            if (!this.demoState.isRunning) break;
            
            await window.agentAnimator.animateAgentSpawn(agentElements[i], i * 300);
            this.updateAgentCount(i + 1);
        }
        
        this.addTimelineItem({
            icon: '🤖',
            title: 'Sub-Agents Deployed',
            description: `${agents.length} specialized agents ready for work`,
            timestamp: this.getCurrentTimestamp()
        });
    }

    createAgentElement(agent, index) {
        const element = document.createElement('div');
        element.className = 'sub-agent';
        element.dataset.agentType = agent.type;
        element.dataset.agentIndex = index;
        
        element.innerHTML = `
            <div class="sub-agent-icon">
                ${agent.icon}
            </div>
            <div class="sub-agent-title">${agent.name}</div>
            <div class="sub-agent-description">${agent.description}</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="task-list">
                ${agent.tasks.map(task => `
                    <div class="task-item">
                        <span>⏳</span> ${task}
                    </div>
                `).join('')}
            </div>
        `;
        
        return element;
    }

    async distributeInitialTasks(agents) {
        const mainAgent = document.querySelector('.main-agent');
        const subAgents = document.querySelectorAll('.sub-agent');
        
        // Show task distribution animation
        await window.agentAnimator.animateTaskDistribution(mainAgent, Array.from(subAgents));
        
        this.addTimelineItem({
            icon: '📋',
            title: 'Tasks Distributed',
            description: 'Work packages assigned to specialized agents',
            timestamp: this.getCurrentTimestamp()
        });
    }

    async simulateParallelWork(agents) {
        const agentElements = document.querySelectorAll('.sub-agent');
        
        // Start parallel work simulation
        const workPromises = Array.from(agentElements).map(async (element, index) => {
            const agent = agents[index];
            await this.simulateAgentWork(element, agent);
        });
        
        // Wait for all agents to complete their work
        await Promise.all(workPromises);
        
        this.addTimelineItem({
            icon: '⚡',
            title: 'Parallel Processing Complete',
            description: 'All agents finished their assigned tasks',
            timestamp: this.getCurrentTimestamp()
        });
    }

    async simulateAgentWork(element, agent) {
        if (!this.demoState.isRunning) return;
        
        element.classList.add('working');
        const taskItems = element.querySelectorAll('.task-item');
        const progressBar = element.querySelector('.progress-fill');
        
        // Simulate working through tasks
        for (let i = 0; i < taskItems.length; i++) {
            if (!this.demoState.isRunning) break;
            
            // Wait for realistic work time
            await this.delay(800 + Math.random() * 1200);
            
            // Mark task as completed
            taskItems[i].innerHTML = '<span style="color: var(--success-color);">✅</span> ' + 
                                   taskItems[i].textContent.substring(2);
            taskItems[i].classList.add('completed');
            
            // Update progress
            const progress = ((i + 1) / taskItems.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            this.updateTasksCompleted();
        }
        
        // Mark agent as completed
        element.classList.remove('working');
        element.classList.add('completed');
        
        // Celebration animation
        window.agentAnimator.celebrateCompletion(element);
    }

    async showAgentCommunication(agents) {
        const agentElements = document.querySelectorAll('.sub-agent');
        
        // Simulate inter-agent communication
        const communications = [
            { from: 0, to: 1, message: "API spec ready for frontend" },
            { from: 1, to: 2, message: "UI mockups approved" },
            { from: 2, to: 3, message: "Database schema finalized" },
            { from: 3, to: 0, message: "Security audit complete" }
        ];
        
        for (const comm of communications) {
            if (!this.demoState.isRunning) break;
            
            await window.agentAnimator.animateCommunication(
                agentElements[comm.from],
                agentElements[comm.to],
                comm.message
            );
            
            await this.delay(500);
        }
        
        this.addTimelineItem({
            icon: '💬',
            title: 'Agent Coordination',
            description: 'Cross-team communication and dependency resolution',
            timestamp: this.getCurrentTimestamp()
        });
    }

    async completeProject(scenario) {
        // Show final integration phase
        this.addTimelineItem({
            icon: '🔧',
            title: 'Integration Phase',
            description: 'Combining all agent outputs into final solution',
            timestamp: this.getCurrentTimestamp()
        });
        
        await this.delay(2000);
        
        this.addTimelineItem({
            icon: '✅',
            title: 'Project Complete',
            description: scenario.completionMessage || 'All requirements successfully implemented',
            timestamp: this.getCurrentTimestamp()
        });
    }

    async showResults(scenario) {
        // Update final statistics
        const efficiencyGain = Math.round((1 - (scenario.multiAgentTime / scenario.singleAgentTime)) * 100);
        const timeSaved = scenario.singleAgentTime - scenario.multiAgentTime;
        
        window.agentAnimator.animateStatsCounter(
            document.getElementById('efficiency-gain'), 
            efficiencyGain, 
            '%'
        );
        
        window.agentAnimator.animateStatsCounter(
            document.getElementById('time-saved'), 
            timeSaved, 
            'h'
        );
        
        // Show efficiency comparison
        setTimeout(() => {
            window.agentAnimator.showEfficiencyComparison();
        }, 1000);
        
        this.addTimelineItem({
            icon: '📊',
            title: 'Results Summary',
            description: `${efficiencyGain}% efficiency gain, ${timeSaved} hours saved`,
            timestamp: this.getCurrentTimestamp()
        });
    }

    pauseDemo() {
        this.demoState.isPaused = true;
    }

    resumeDemo() {
        this.demoState.isPaused = false;
    }

    resetDemo() {
        this.demoState.isRunning = false;
        this.demoState.isPaused = false;
        this.demoState.currentStep = 0;
        this.resetVisualization();
    }

    resetVisualization() {
        // Reset agents
        const agents = document.querySelectorAll('.sub-agent');
        agents.forEach(agent => {
            agent.classList.remove('active', 'working', 'completed');
            agent.style.opacity = '0';
            agent.style.transform = 'translateY(20px)';
            
            const progressBar = agent.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            const taskItems = agent.querySelectorAll('.task-item');
            taskItems.forEach(task => {
                task.classList.remove('completed');
                task.innerHTML = task.innerHTML.replace('✅', '⏳');
            });
        });
        
        // Reset stats
        document.getElementById('agents-count').textContent = '0';
        document.getElementById('tasks-completed').textContent = '0';
        document.getElementById('efficiency-gain').textContent = '0%';
        document.getElementById('time-saved').textContent = '0h';
        
        // Reset timeline
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = '';
        }
    }

    addTimelineItem(item) {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-title">
                    ${item.icon} ${item.title}
                </div>
                <div class="timeline-description">${item.description}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    ${item.timestamp}
                </div>
            </div>
        `;
        
        timeline.appendChild(timelineItem);
        
        // Animate in
        setTimeout(() => {
            timelineItem.classList.add('show');
        }, 100);
        
        // Scroll to latest item
        timelineItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    updateAgentCount(count) {
        window.agentAnimator.animateStatsCounter(
            document.getElementById('agents-count'),
            count
        );
    }

    updateTasksCompleted() {
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        const totalTasks = document.querySelectorAll('.task-item').length;
        
        window.agentAnimator.animateStatsCounter(
            document.getElementById('tasks-completed'),
            completedTasks
        );
    }

    updateStats(stats) {
        // Could update additional statistics display
        console.log('Updating stats:', stats);
    }

    getCurrentTimestamp() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    delay(ms) {
        return new Promise(resolve => {
            const checkPause = () => {
                if (!this.demoState.isPaused && this.demoState.isRunning) {
                    setTimeout(resolve, ms);
                } else if (!this.demoState.isRunning) {
                    resolve(); // Exit if demo stopped
                } else {
                    setTimeout(checkPause, 100); // Check again if paused
                }
            };
            checkPause();
        });
    }

    // Real-time demo controls
    setSpeed(multiplier) {
        this.animationSpeed = multiplier;
    }

    getProgress() {
        const totalSteps = 7; // Number of demo steps
        return (this.demoState.currentStep / totalSteps) * 100;
    }

    getDemoState() {
        return {
            ...this.demoState,
            scenario: this.currentScenario,
            progress: this.getProgress()
        };
    }
}

// Global demo instance
window.subAgentDemo = new SubAgentDemo();

// Global functions for HTML integration
window.startScenarioDemo = function(scenarioName) {
    return window.subAgentDemo.startDemo(scenarioName);
};

window.loadScenarioData = function(scenarioName) {
    // This will be called when scenarios are loaded
    if (window.agentScenarios && window.agentScenarios[scenarioName]) {
        const scenario = window.agentScenarios[scenarioName];
        
        // Pre-populate agents without animation
        const container = document.getElementById('sub-agents-container');
        container.innerHTML = '';
        
        scenario.agents.forEach((agent, index) => {
            const agentElement = window.subAgentDemo.createAgentElement(agent, index);
            container.appendChild(agentElement);
        });
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubAgentDemo;
}