// Dashboard functionality for GeniusGuide Quiz App
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Set current date
    const dateDisplay = document.querySelector('.date-display');
    if (dateDisplay) {
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // User menu toggle
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            alert('User menu would open here. Name: John Doe\nEmail: john.doe@example.com');
        });
    }
    
    // Quick navigation buttons
    const quickNav = document.querySelector('.quick-nav');
    if (quickNav) {
        quickNav.innerHTML = `
            <a href="#" class="nav-btn active" onclick="navigateTo('all')">
                <i class="fas fa-th-large"></i>
                All Quizzes
            </a>
            <a href="#" class="nav-btn" onclick="navigateTo('recent')">
                <i class="fas fa-history"></i>
                Recent
            </a>
            <a href="#" class="nav-btn" onclick="navigateTo('favorites')">
                <i class="fas fa-star"></i>
                Favorites
            </a>
            <a href="#" class="nav-btn" onclick="navigateTo('trending')">
                <i class="fas fa-fire"></i>
                Trending
            </a>
            <a href="#" class="nav-btn" onclick="navigateTo('recommended')">
                <i class="fas fa-lightbulb"></i>
                Recommended
            </a>
        `;
        
        // Add click handlers to nav buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                navBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const target = this.textContent.trim().toLowerCase();
                handleNavigation(target);
            });
        });
    }
    
    // Quiz filter tabs
    const quizFilterTabs = document.querySelector('.quiz-filter-tabs');
    if (quizFilterTabs) {
        quizFilterTabs.innerHTML = `
            <button class="filter-tab active" data-filter="all">All Quizzes</button>
            <button class="filter-tab" data-filter="completed">Completed</button>
            <button class="filter-tab" data-filter="pending">Pending</button>
            <button class="filter-tab" data-filter="easy">Easy</button>
            <button class="filter-tab" data-filter="medium">Medium</button>
            <button class="filter-tab" data-filter="hard">Hard</button>
        `;
        
        // Add click handlers to filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                filterQuizzes(filter);
            });
        });
    }
    
    // Quick actions buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleQuickAction(action);
        });
    });
});

// Initialize dashboard
async function initDashboard() {
    try {
        // Load user stats
        await loadUserStats();
        
        // Load quizzes
        await loadQuizzes();
        
        // Load upcoming quizzes
        await loadUpcomingQuizzes();
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('Failed to load dashboard data');
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;
        
        // Get stats from API
        const response = await API.getUserStats();
        if (response.success) {
            const stats = response.data;
            
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2));">
                        <i class="fas fa-trophy" style="color: var(--water-blue);"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.completedQuizzes}</div>
                        <div class="stat-label">Quizzes Completed</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            +2 this week
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));">
                        <i class="fas fa-chart-line" style="color: #10b981;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.averageScore}%</div>
                        <div class="stat-label">Average Score</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            +5%
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));">
                        <i class="fas fa-fire" style="color: #f59e0b;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.streakDays}</div>
                        <div class="stat-label">Day Streak</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-flame"></i>
                            Keep going!
                        </div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));">
                        <i class="fas fa-clock" style="color: #ef4444;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${Math.round(stats.totalTime / 60)}h</div>
                        <div class="stat-label">Time Spent</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-brain"></i>
                            Learning
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load quizzes
async function loadQuizzes(filter = 'all') {
    try {
        const quizzesGrid = document.getElementById('quizzesGrid');
        if (!quizzesGrid) return;
        
        // Show loading state
        quizzesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <h3>Loading quizzes...</h3>
            </div>
        `;
        
        // Get quizzes from API
        const filters = {};
        if (filter !== 'all') {
            if (['easy', 'medium', 'hard'].includes(filter)) {
                filters.difficulty = filter;
            } else if (filter === 'completed') {
                filters.completed = true;
            } else if (filter === 'pending') {
                filters.completed = false;
            }
        }
        
        const response = await API.getQuizzes(filters);
        
        if (response.success && response.data.length > 0) {
            renderQuizzes(response.data);
        } else {
            quizzesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No quizzes found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading quizzes:', error);
        showError('Failed to load quizzes');
    }
}

// Render quizzes to grid
function renderQuizzes(quizzes) {
    const quizzesGrid = document.getElementById('quizzesGrid');
    if (!quizzesGrid) return;
    
    quizzesGrid.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card ${quiz.completed ? 'completed' : ''}">
            <div class="quiz-header">
                <h3 class="quiz-title">${quiz.title}</h3>
                <p class="quiz-subtitle">${quiz.subtitle}</p>
                <div class="quiz-meta">
                    <span><i class="far fa-question-circle"></i> ${quiz.questions} questions</span>
                    <span><i class="far fa-clock"></i> ${quiz.time} mins</span>
                </div>
                <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
            </div>
            
            ${quiz.completed ? `
                <div class="quiz-progress">
                    <div class="progress-info">
                        <span>Best Score</span>
                        <span class="quiz-score">${quiz.bestScore}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${quiz.bestScore}%"></div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        Attempts: ${quiz.attempts} | Last: ${quiz.lastAttempt ? new Date(quiz.lastAttempt).toLocaleDateString() : 'Never'}
                    </p>
                </div>
            ` : `
                <div class="quiz-progress">
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">
                        ${quiz.description}
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: auto;">
                        ${quiz.tags.map(tag => `<span style="padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.1); border-radius: 999px; font-size: 0.75rem;">${tag}</span>`).join('')}
                    </div>
                </div>
            `}
            
            <div class="quiz-footer">
                ${quiz.completed ? `
                    <button class="quiz-btn primary-btn retake-btn" data-id="${quiz.id}">
                        <i class="fas fa-redo"></i>
                        Retake Quiz
                    </button>
                ` : `
                    <button class="quiz-btn primary-btn start-btn" data-id="${quiz.id}">
                        <i class="fas fa-play"></i>
                        Start Quiz
                    </button>
                `}
                <button class="quiz-btn secondary-btn details-btn" onclick="showQuizDetails(${quiz.id})">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to buttons
    const startBtns = quizzesGrid.querySelectorAll('.start-btn');
    startBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.dataset.id;
            startQuiz(quizId);
        });
    });
    
    const retakeBtns = quizzesGrid.querySelectorAll('.retake-btn');
    retakeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.dataset.id;
            startQuiz(quizId);
        });
    });
}

// Filter quizzes
function filterQuizzes(filter) {
    loadQuizzes(filter);
}

// Handle navigation
function handleNavigation(target) {
    console.log(`Navigating to: ${target}`);
    // In a real app, this would update the URL or load different content
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'Random Quiz':
            startRandomQuiz();
            break;
        case 'Review History':
            showQuizHistory();
            break;
        case 'Download Results':
            downloadResults();
            break;
        case 'Share Progress':
            shareProgress();
            break;
    }
}

// Start quiz
async function startQuiz(quizId) {
    try {
        // Get quiz details
        const response = await API.getQuizById(quizId);
        if (response.success) {
            const quiz = response.data;
            
            // Show confirmation
            const confirmed = confirm(`Start "${quiz.title}"?\n\n${quiz.questions} questions • ${quiz.time} minutes\nDifficulty: ${quiz.difficulty}\n\nClick OK to begin.`);
            
            if (confirmed) {
                // Redirect to quiz taking page
                window.location.href = `take-quiz.html?id=${quizId}`;
            }
        }
    } catch (error) {
        console.error('Error starting quiz:', error);
        showError('Failed to start quiz');
    }
}

// Start random quiz
async function startRandomQuiz() {
    try {
        const response = await API.getQuizzes();
        if (response.success && response.data.length > 0) {
            const randomQuiz = response.data[Math.floor(Math.random() * response.data.length)];
            startQuiz(randomQuiz.id);
        }
    } catch (error) {
        console.error('Error starting random quiz:', error);
    }
}

// Show quiz details
async function showQuizDetails(quizId) {
    try {
        const response = await API.getQuizById(quizId);
        if (response.success) {
            const quiz = response.data;
            
            const details = `
                <strong>${quiz.title}</strong>
                <p>${quiz.subtitle}</p>
                
                <div style="margin: 1rem 0;">
                    <p><strong>Category:</strong> ${quiz.category}</p>
                    <p><strong>Difficulty:</strong> <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span></p>
                    <p><strong>Questions:</strong> ${quiz.questions}</p>
                    <p><strong>Time:</strong> ${quiz.time} minutes</p>
                    ${quiz.completed ? `<p><strong>Best Score:</strong> ${quiz.bestScore}%</p>` : ''}
                </div>
                
                <p><strong>Description:</strong> ${quiz.description}</p>
                
                <div style="margin-top: 1rem;">
                    <strong>Tags:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                        ${quiz.tags.map(tag => `<span style="padding: 0.25rem 0.75rem; background: rgba(56, 189, 248, 0.1); border-radius: 999px; font-size: 0.75rem; color: var(--water-blue);">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Create modal
            showModal('Quiz Details', details);
        }
    } catch (error) {
        console.error('Error showing quiz details:', error);
    }
}

// Show quiz history
function showQuizHistory() {
    const history = `
        <h3>Quiz History</h3>
        <div style="max-height: 300px; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <strong>Data Structures</strong>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">Score: 92% • 15 Dec 2024</p>
                </div>
                <button class="quiz-btn primary-btn" style="padding: 0.5rem 1rem;">Review</button>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <strong>Python Basics</strong>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">Score: 88% • 10 Dec 2024</p>
                </div>
                <button class="quiz-btn primary-btn" style="padding: 0.5rem 1rem;">Review</button>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <strong>Web Development</strong>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">Score: 95% • 18 Dec 2024</p>
                </div>
                <button class="quiz-btn primary-btn" style="padding: 0.5rem 1rem;">Review</button>
            </div>
        </div>
    `;
    
    showModal('Quiz History', history);
}

// Download results
function downloadResults() {
    alert('Downloading quiz results...\n\nThis would generate a PDF report with all your quiz scores and progress.');
    // In a real app, this would generate and download a PDF
}

// Share progress
function shareProgress() {
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Progress - GeniusGuide',
            text: 'Check out my quiz progress on GeniusGuide!',
            url: window.location.href
        });
    } else {
        alert('Share your progress:\n\nCopy this link: ' + window.location.href);
    }
}

// Load upcoming quizzes
async function loadUpcomingQuizzes() {
    try {
        const response = await API.getUpcomingQuizzes();
        if (response.success) {
            const upcomingList = document.querySelector('.upcoming-list');
            if (upcomingList) {
                upcomingList.innerHTML = response.data.map(quiz => {
                    const date = new Date(quiz.date);
                    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                    const day = date.getDate();
                    
                    return `
                        <div class="upcoming-item">
                            <div class="upcoming-date">
                                <span class="date-day">${day}</span>
                                <span class="date-month">${month}</span>
                            </div>
                            <div class="upcoming-info">
                                <h4>${quiz.title}</h4>
                                <p>${quiz.subtitle}</p>
                                <span class="upcoming-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Error loading upcoming quizzes:', error);
    }
}

// Show modal
function showModal(title, content) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: var(--dark-surface);
        border-radius: var(--radius-lg);
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0;">${title}</h3>
            <button class="close-modal" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div>${content}</div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal on X click
    modalContent.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);