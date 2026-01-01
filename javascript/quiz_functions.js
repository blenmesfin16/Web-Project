// quiz_functions.js - Real functionality for quiz buttons

// Global quiz state
window.quizState = {
    currentQuiz: null,
    userAnswers: {},
    currentQuestionIndex: 0,
    timer: null,
    timeRemaining: 0
};

// Initialize quiz functionality
function initQuizFunctions() {
    // Add real functionality to all quiz buttons
    document.addEventListener('click', function(e) {
        // Handle Start Quiz buttons
        if (e.target.closest('.start-btn') || e.target.closest('.primary-btn')) {
            const btn = e.target.closest('.start-btn') || e.target.closest('.primary-btn');
            const quizId = btn.dataset.id || btn.closest('.quiz-card').dataset.id;
            if (quizId) {
                startQuiz(quizId);
            }
        }
        
        // Handle Retake Quiz buttons
        if (e.target.closest('.retake-btn')) {
            const btn = e.target.closest('.retake-btn');
            const quizId = btn.dataset.id || btn.closest('.quiz-card').dataset.id;
            if (quizId) {
                retakeQuiz(quizId);
            }
        }
        
        // Handle Details buttons
        if (e.target.closest('.details-btn') || e.target.closest('.secondary-btn')) {
            const btn = e.target.closest('.details-btn') || e.target.closest('.secondary-btn');
            const quizId = btn.dataset.id || btn.closest('.quiz-card').dataset.id;
            if (quizId) {
                showQuizDetails(quizId);
            }
        }
        
        // Handle Quick Action buttons
        if (e.target.closest('.action-btn')) {
            const btn = e.target.closest('.action-btn');
            const action = btn.textContent.trim();
            handleQuickAction(action, btn);
        }
        
        // Handle Filter Tabs
        if (e.target.closest('.filter-tab')) {
            const tab = e.target.closest('.filter-tab');
            const filter = tab.dataset.filter;
            handleQuizFilter(filter);
        }
    });
}

// Start a new quiz
async function startQuiz(quizId) {
    try {
        // Show loading state
        showLoading('Loading quiz...');
        
        // Get quiz data (in real app, this would be from your backend)
        const quizData = await getQuizData(quizId);
        
        if (quizData) {
            // Store quiz data
            window.quizState.currentQuiz = quizData;
            window.quizState.currentQuestionIndex = 0;
            window.quizState.userAnswers = {};
            window.quizState.timeRemaining = quizData.time * 60; // Convert to seconds
            
            // Redirect to quiz taking page
            window.location.href = `take-quiz.html?id=${quizId}`;
        } else {
            throw new Error('Quiz not found');
        }
    } catch (error) {
        console.error('Error starting quiz:', error);
        showError('Failed to load quiz. Please try again.');
    } finally {
        hideLoading();
    }
}

// Retake a quiz
function retakeQuiz(quizId) {
    if (confirm('Are you sure you want to retake this quiz? Your previous score will be saved.')) {
        startQuiz(quizId);
    }
}

// Show quiz details
async function showQuizDetails(quizId) {
    try {
        const quizData = await getQuizData(quizId);
        if (!quizData) return;
        
        // Create modal with quiz details
        const modalHTML = `
            <div class="quiz-details-modal">
                <h3>${quizData.title}</h3>
                <p><strong>Category:</strong> ${quizData.category || 'General'}</p>
                <p><strong>Difficulty:</strong> <span class="difficulty-${quizData.difficulty}">${quizData.difficulty}</span></p>
                <p><strong>Questions:</strong> ${quizData.questions}</p>
                <p><strong>Time Limit:</strong> ${quizData.time} minutes</p>
                <p><strong>Description:</strong> ${quizData.description || 'Test your knowledge on this topic.'}</p>
                
                ${quizData.completed ? `
                    <div class="previous-results">
                        <h4>Your Previous Results</h4>
                        <p><strong>Best Score:</strong> ${quizData.bestScore || 0}%</p>
                        <p><strong>Attempts:</strong> ${quizData.attempts || 0}</p>
                        <p><strong>Last Attempt:</strong> ${quizData.lastAttempt || 'Never'}</p>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">Close</button>
                    <button class="btn-primary" onclick="startQuiz(${quizId})">Start Quiz</button>
                </div>
            </div>
        `;
        
        showModal('Quiz Details', modalHTML);
    } catch (error) {
        console.error('Error showing quiz details:', error);
        showError('Failed to load quiz details.');
    }
}

// Handle quick actions
function handleQuickAction(action, button) {
    switch(action) {
        case 'Random Quiz':
            startRandomQuiz();
            break;
        case 'Review History':
            showQuizHistory();
            break;
        case 'Download Results':
            downloadQuizResults();
            break;
        case 'Share Progress':
            shareProgress();
            break;
        default:
            console.log('Action:', action);
    }
}

// Handle quiz filtering
function handleQuizFilter(filter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter quizzes based on selection
    const quizzes = document.querySelectorAll('.quiz-card');
    
    quizzes.forEach(quiz => {
        const difficulty = quiz.querySelector('.quiz-difficulty').className.includes('easy') ? 'easy' :
                         quiz.querySelector('.quiz-difficulty').className.includes('medium') ? 'medium' : 'hard';
        const isCompleted = quiz.classList.contains('completed');
        
        let shouldShow = true;
        
        switch(filter) {
            case 'completed':
                shouldShow = isCompleted;
                break;
            case 'pending':
                shouldShow = !isCompleted;
                break;
            case 'easy':
                shouldShow = difficulty === 'easy';
                break;
            case 'medium':
                shouldShow = difficulty === 'medium';
                break;
            case 'hard':
                shouldShow = difficulty === 'hard';
                break;
            default:
                shouldShow = true;
        }
        
        quiz.style.display = shouldShow ? 'block' : 'none';
    });
}

// Get quiz data (mock function - replace with your API call)
async function getQuizData(quizId) {
    // Mock data - replace with your actual API call
    const mockQuizzes = {
        '1': {
            id: 1,
            title: "Data Structures Fundamentals",
            category: "Computer Science",
            difficulty: "medium",
            questions: 20,
            time: 30,
            description: "Test your knowledge on arrays, linked lists, stacks, queues, trees, and graphs.",
            completed: true,
            bestScore: 92,
            attempts: 3,
            lastAttempt: "2024-12-15"
        },
        '2': {
            id: 2,
            title: "Python Basics Assessment",
            category: "Programming",
            difficulty: "easy",
            questions: 15,
            time: 20,
            description: "Basic Python syntax, data types, control structures, and functions.",
            completed: true,
            bestScore: 88,
            attempts: 2,
            lastAttempt: "2024-12-10"
        },
        '3': {
            id: 3,
            title: "Web Development Quiz",
            category: "Web Development",
            difficulty: "medium",
            questions: 25,
            time: 40,
            description: "HTML, CSS, JavaScript, and modern web development concepts.",
            completed: true,
            bestScore: 95,
            attempts: 4,
            lastAttempt: "2024-12-18"
        },
        '4': {
            id: 4,
            title: "Database Systems",
            category: "Database",
            difficulty: "medium",
            questions: 18,
            time: 25,
            description: "Relational databases, SQL queries, and NoSQL database concepts.",
            completed: false,
            bestScore: null,
            attempts: 0,
            lastAttempt: null
        },
        '5': {
            id: 5,
            title: "Machine Learning",
            category: "AI/ML",
            difficulty: "hard",
            questions: 30,
            time: 45,
            description: "Supervised and unsupervised learning algorithms, neural networks basics.",
            completed: false,
            bestScore: null,
            attempts: 0,
            lastAttempt: null
        },
        '6': {
            id: 6,
            title: "Network Security",
            category: "Cybersecurity",
            difficulty: "medium",
            questions: 22,
            time: 35,
            description: "Network security protocols, encryption, and security best practices.",
            completed: false,
            bestScore: null,
            attempts: 0,
            lastAttempt: null
        }
    };
    
    return mockQuizzes[quizId] || null;
}

// Start random quiz
async function startRandomQuiz() {
    const quizzes = [1, 2, 3, 4, 5, 6];
    const randomQuizId = quizzes[Math.floor(Math.random() * quizzes.length)];
    startQuiz(randomQuizId);
}

// Show quiz history
function showQuizHistory() {
    const historyHTML = `
        <div class="quiz-history-modal">
            <h3>Your Quiz History</h3>
            <div class="history-list">
                <div class="history-item">
                    <div class="history-quiz">Data Structures Fundamentals</div>
                    <div class="history-score">92%</div>
                    <div class="history-date">Dec 15, 2024</div>
                    <button class="btn-small" onclick="startQuiz(1)">Retake</button>
                </div>
                <div class="history-item">
                    <div class="history-quiz">Python Basics Assessment</div>
                    <div class="history-score">88%</div>
                    <div class="history-date">Dec 10, 2024</div>
                    <button class="btn-small" onclick="startQuiz(2)">Retake</button>
                </div>
                <div class="history-item">
                    <div class="history-quiz">Web Development Quiz</div>
                    <div class="history-score">95%</div>
                    <div class="history-date">Dec 18, 2024</div>
                    <button class="btn-small" onclick="startQuiz(3)">Retake</button>
                </div>
            </div>
        </div>
    `;
    
    showModal('Quiz History', historyHTML);
}

// Download quiz results
function downloadQuizResults() {
    // Create a simple CSV with quiz results
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Quiz,Score,Date,Time Taken\n"
        + "Data Structures Fundamentals,92%,2024-12-15,28:30\n"
        + "Python Basics Assessment,88%,2024-12-10,18:45\n"
        + "Web Development Quiz,95%,2024-12-18,35:20";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Quiz results downloaded successfully!', 'success');
}

// Share progress
function shareProgress() {
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Progress',
            text: 'Check out my quiz scores on GeniusGuide!',
            url: window.location.href,
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// Utility functions
function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
        <div class="custom-modal">
            <div class="modal-overlay" onclick="closeModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.custom-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function showLoading(message = 'Loading...') {
    // Remove existing loading if any
    const existingLoading = document.querySelector('.loading-overlay');
    if (existingLoading) existingLoading.remove();
    
    const loadingHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) loading.remove();
}

function showError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.error-notification');
    if (existingError) existingError.remove();
    
    const errorHTML = `
        <div class="error-notification">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="error-close" onclick="this.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const error = document.querySelector('.error-notification');
        if (error) error.remove();
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notificationHTML = `
        <div class="notification notification-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', notificationHTML);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        const notification = document.querySelector('.notification');
        if (notification) notification.remove();
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuizFunctions);