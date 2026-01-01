// Quiz Dashboard Functionality - Simple Version
document.addEventListener('DOMContentLoaded', function() {
    // Sample quiz data
    const quizzes = [
        {
            id: 1,
            title: "Data Structures Fundamentals",
            subtitle: "Data Structures & Algorithms",
            questions: "20 questions",
            time: "30 mins",
            difficulty: "medium",
            score: "92%",
            completed: true,
            bestScore: true,
            progress: 92
        },
        {
            id: 2,
            title: "Python Basics Assessment",
            subtitle: "Python Programming",
            questions: "15 questions",
            time: "20 mins",
            difficulty: "easy",
            score: "88%",
            completed: true,
            bestScore: true,
            progress: 88
        },
        {
            id: 3,
            title: "Web Development Quiz",
            subtitle: "Web Development Fundamentals",
            questions: "25 questions",
            time: "40 mins",
            difficulty: "medium",
            score: "95%",
            completed: true,
            bestScore: true,
            progress: 95
        },
        {
            id: 4,
            title: "Database Systems",
            subtitle: "SQL & NoSQL Fundamentals",
            questions: "18 questions",
            time: "25 mins",
            difficulty: "medium",
            score: "0%",
            completed: false,
            bestScore: false,
            progress: 0
        },
        {
            id: 5,
            title: "Machine Learning",
            subtitle: "Algorithms & Models",
            questions: "30 questions",
            time: "45 mins",
            difficulty: "hard",
            score: "0%",
            completed: false,
            bestScore: false,
            progress: 0
        },
        {
            id: 6,
            title: "Network Security",
            subtitle: "Security Protocols",
            questions: "22 questions",
            time: "35 mins",
            difficulty: "medium",
            score: "0%",
            completed: false,
            bestScore: false,
            progress: 0
        }
    ];

    // DOM Elements
    const quizzesGrid = document.getElementById('quizzesGrid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('quizSearch');

    // Initialize quizzes
    renderQuizzes(quizzes);

    // Filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter quizzes
            const filter = tab.dataset.filter;
            let filteredQuizzes = [...quizzes];
            
            switch(filter) {
                case 'completed':
                    filteredQuizzes = quizzes.filter(q => q.completed);
                    break;
                case 'pending':
                    filteredQuizzes = quizzes.filter(q => !q.completed);
                    break;
                case 'difficulty':
                    // Sort by difficulty
                    filteredQuizzes.sort((a, b) => {
                        const difficultyOrder = { 'hard': 3, 'medium': 2, 'easy': 1 };
                        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
                    });
                    break;
            }
            
            renderQuizzes(filteredQuizzes);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredQuizzes = quizzes.filter(quiz => 
            quiz.title.toLowerCase().includes(searchTerm) ||
            quiz.subtitle.toLowerCase().includes(searchTerm)
        );
        renderQuizzes(filteredQuizzes);
    });

    // Quiz button handlers
    quizzesGrid.addEventListener('click', (e) => {
        if (e.target.closest('.retake-btn')) {
            const btn = e.target.closest('.retake-btn');
            const quizId = btn.dataset.id;
            startQuiz(quizId);
        } else if (e.target.closest('.start-btn')) {
            const btn = e.target.closest('.start-btn');
            const quizId = btn.dataset.id;
            startQuiz(quizId);
        } else if (e.target.closest('.details-btn')) {
            const btn = e.target.closest('.details-btn');
            const quizId = btn.onclick.toString().match(/showQuizDetails\((\d+)\)/)[1];
            showQuizDetails(quizId);
        }
    });

    // Render quizzes to the grid
    function renderQuizzes(quizzesArray) {
        if (quizzesArray.length === 0) {
            quizzesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">No quizzes found</h3>
                    <p style="color: var(--text-secondary);">Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

        quizzesGrid.innerHTML = quizzesArray.map(quiz => `
            <div class="quiz-card ${quiz.completed ? 'completed' : ''}">
                <div class="quiz-header">
                    <h3 class="quiz-title">${quiz.title}</h3>
                    <p class="quiz-subtitle">${quiz.subtitle}</p>
                    <div class="quiz-meta">
                        <span><i class="far fa-question-circle"></i> ${quiz.questions}</span>
                        <span><i class="far fa-clock"></i> ${quiz.time}</span>
                    </div>
                    <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
                </div>
                
                ${quiz.completed ? `
                    <div class="quiz-progress">
                        <div class="progress-info">
                            <span>Best Score</span>
                            <span class="quiz-score">${quiz.score}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${quiz.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
                
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
    }

    // Start quiz function
    function startQuiz(quizId) {
        const quiz = quizzes.find(q => q.id == quizId);
        if (!quiz) return;
        
        // Show confirmation modal
        const confirmed = confirm(`Start "${quiz.title}"?\n\n${quiz.questions} • ${quiz.time}\nDifficulty: ${quiz.difficulty}`);
        
        if (confirmed) {
            alert(`Starting quiz: ${quiz.title}\n\nThis would redirect to the quiz interface in a real application.`);
            // window.location.href = `take-quiz.php?id=${quizId}`;
        }
    }

    // Show quiz details
    window.showQuizDetails = function(quizId) {
        const quiz = quizzes.find(q => q.id == quizId);
        if (!quiz) return;
        
        const details = `
            Quiz: ${quiz.title}
            Topic: ${quiz.subtitle}
            Difficulty: ${quiz.difficulty}
            Questions: ${quiz.questions}
            Time: ${quiz.time}
            ${quiz.completed ? `Best Score: ${quiz.score}` : 'Not attempted yet'}
        `;
        
        alert(details);
    };
});