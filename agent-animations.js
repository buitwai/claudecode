/**
 * Agent Animations System
 * Handles smooth, professional animations for the sub-agent visualization
 */

class AgentAnimator {
    constructor() {
        this.animationQueue = [];
        this.isRunning = false;
        this.currentStep = 0;
        this.animationSpeed = 1; // Can be adjusted for faster/slower demos
    }

    // Core animation methods
    async animateAgentSpawn(agentElement, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                agentElement.style.opacity = '0';
                agentElement.style.transform = 'translateY(30px) scale(0.8)';
                agentElement.classList.add('active');
                
                // Trigger animation
                requestAnimationFrame(() => {
                    agentElement.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    agentElement.style.opacity = '1';
                    agentElement.style.transform = 'translateY(0) scale(1)';
                });
                
                setTimeout(resolve, 600);
            }, delay);
        });
    }

    async animateTaskDistribution(mainAgent, subAgents) {
        const connections = [];
        
        for (let i = 0; i < subAgents.length; i++) {
            const subAgent = subAgents[i];
            const connection = this.createConnectionLine(mainAgent, subAgent);
            connections.push(connection);
            
            // Animate connection appearing
            setTimeout(() => {
                connection.style.opacity = '1';
                connection.style.animation = 'drawLine 1s ease forwards';
            }, i * 200);
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                // Remove connections after animation
                connections.forEach(conn => conn.remove());
                resolve();
            }, subAgents.length * 200 + 1000);
        });
    }

    async animateProgressBars(agents, targetProgress) {
        const promises = agents.map((agent, index) => {
            return new Promise(resolve => {
                const progressBar = agent.querySelector('.progress-fill');
                if (!progressBar) return resolve();
                
                setTimeout(() => {
                    const progress = targetProgress[index] || Math.random() * 80 + 20;
                    progressBar.style.width = `${progress}%`;
                    
                    // Add working state
                    if (progress < 100) {
                        agent.classList.add('working');
                        agent.classList.remove('completed');
                    } else {
                        agent.classList.remove('working');
                        agent.classList.add('completed');
                    }
                    
                    setTimeout(resolve, 1000);
                }, index * 150);
            });
        });
        
        return Promise.all(promises);
    }

    async animateAgentWorking(agent, tasks = []) {
        agent.classList.add('working');
        
        const taskElements = agent.querySelectorAll('.task-item');
        
        for (let i = 0; i < taskElements.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    taskElements[i].classList.add('completed');
                    taskElements[i].style.color = 'var(--success-color)';
                    
                    // Update progress
                    const progressBar = agent.querySelector('.progress-fill');
                    if (progressBar) {
                        const progress = ((i + 1) / taskElements.length) * 100;
                        progressBar.style.width = `${progress}%`;
                    }
                    
                    resolve();
                }, 800 + Math.random() * 400); // Randomize timing for realism
            });
        }
        
        // Mark as completed
        setTimeout(() => {
            agent.classList.remove('working');
            agent.classList.add('completed');
            this.celebrateCompletion(agent);
        }, 500);
    }

    celebrateCompletion(agent) {
        // Create celebration particles
        const particles = [];
        const rect = agent.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--success-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(${x}px, ${y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
        
        // Agent bounce animation
        agent.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
    }

    createConnectionLine(fromElement, toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        line.style.cssText = `
            position: fixed;
            left: ${fromX}px;
            top: ${fromY}px;
            width: ${length}px;
            height: 2px;
            transform-origin: 0 50%;
            transform: rotate(${angle}deg) scaleX(0);
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 1;
            opacity: 0;
            pointer-events: none;
        `;
        
        document.body.appendChild(line);
        return line;
    }

    // Statistics animations
    animateStatsCounter(element, targetValue, suffix = '', duration = 2000) {
        const startValue = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth counting
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Timeline animations
    async animateTimeline(timelineItems, stagger = 300) {
        for (let i = 0; i < timelineItems.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    timelineItems[i].classList.add('show');
                    resolve();
                }, stagger);
            });
        }
    }

    // Parallel processing visualization
    async showParallelProcessing(agents) {
        // All agents start working simultaneously
        const workPromises = agents.map((agent, index) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    agent.classList.add('working');
                    const icon = agent.querySelector('.sub-agent-icon');
                    icon.style.animation = 'spin 2s linear infinite';
                    resolve();
                }, index * 100); // Slight stagger for visual appeal
            });
        });
        
        await Promise.all(workPromises);
        
        // Simulate work completion at different times
        const completionPromises = agents.map((agent, index) => {
            return new Promise(resolve => {
                const workTime = 2000 + Math.random() * 3000; // 2-5 seconds
                setTimeout(() => {
                    agent.classList.remove('working');
                    agent.classList.add('completed');
                    const icon = agent.querySelector('.sub-agent-icon');
                    icon.style.animation = '';
                    this.celebrateCompletion(agent);
                    resolve();
                }, workTime);
            });
        });
        
        return Promise.all(completionPromises);
    }

    // Communication flow animation
    async showAgentCommunication(agents) {
        const communications = [
            { from: 0, to: 1, message: "Frontend requirements ready" },
            { from: 1, to: 2, message: "API endpoints defined" },
            { from: 2, to: 3, message: "Database schema complete" },
            { from: 3, to: 0, message: "Security review passed" }
        ];
        
        for (const comm of communications) {
            await this.animateCommunication(
                agents[comm.from], 
                agents[comm.to], 
                comm.message
            );
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    async animateCommunication(fromAgent, toAgent, message) {
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            transform: scale(0);
        `;
        messageElement.textContent = message;
        
        const fromRect = fromAgent.getBoundingClientRect();
        const toRect = toAgent.getBoundingClientRect();
        
        messageElement.style.left = (fromRect.left + fromRect.width / 2 - 50) + 'px';
        messageElement.style.top = (fromRect.top + fromRect.height / 2 - 15) + 'px';
        
        document.body.appendChild(messageElement);
        
        // Animate message
        messageElement.animate([
            { 
                transform: 'scale(0)',
                left: (fromRect.left + fromRect.width / 2 - 50) + 'px',
                top: (fromRect.top + fromRect.height / 2 - 15) + 'px'
            },
            { 
                transform: 'scale(1)',
                left: (toRect.left + toRect.width / 2 - 50) + 'px',
                top: (toRect.top + toRect.height / 2 - 15) + 'px'
            },
            { 
                transform: 'scale(0)',
                left: (toRect.left + toRect.width / 2 - 50) + 'px',
                top: (toRect.top + toRect.height / 2 - 15) + 'px'
            }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            messageElement.remove();
        };
        
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Efficiency comparison animation
    async showEfficiencyComparison() {
        // This would show a before/after comparison
        // Create a split-screen view showing single agent vs multi-agent approach
        const comparisonOverlay = document.createElement('div');
        comparisonOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        comparisonOverlay.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 800px; width: 90%;">
                <h2 style="text-align: center; margin-bottom: 2rem;">Efficiency Comparison</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div style="text-align: center;">
                        <h3 style="color: var(--danger-color);">Single Agent</h3>
                        <div style="font-size: 3rem; margin: 1rem 0;">🐌</div>
                        <p><strong>8 hours</strong><br>Sequential processing</p>
                    </div>
                    <div style="text-align: center;">
                        <h3 style="color: var(--success-color);">Multi-Agent</h3>
                        <div style="font-size: 3rem; margin: 1rem 0;">⚡</div>
                        <p><strong>2 hours</strong><br>Parallel processing</p>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="display: block; margin: 2rem auto 0; padding: 0.75rem 2rem; 
                               background: var(--primary-color); color: white; border: none; 
                               border-radius: 8px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(comparisonOverlay);
        
        // Animate in
        comparisonOverlay.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration: 300 });
    }
}

// Create global instance
window.agentAnimator = new AgentAnimator();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentAnimator;
}