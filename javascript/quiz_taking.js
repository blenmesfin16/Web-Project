// Quiz Taking functionality for GeniusGuide Quiz App
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a quiz taking page
    if (window.location.pathname.includes('take-quiz') || 
        window.location.search.includes('take-quiz')) {
        initQuizTaking();
    }
});

async function initQuizTaking() {
    try {
        // Get quiz ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id');
        
        if (!quizId) {
            showError('No quiz ID provided');
            return;
        }
        
        // Load quiz details
        const quizResponse = await API.getQuizById(quizId);
        if (!quizResponse.success) {
            showError('Quiz not found');
            return;
        }
        
        const quiz = quizResponse.data;
        
        // Load quiz questions
        const questionsResponse = await API.getQuizQuestions(quizId);
        if (!questionsResponse.success) {
            showError('Failed to load questions');
            return;
        }
        
        const questions = questionsResponse.data;
        
        // Initialize quiz interface
        initializeQuizInterface(quiz, questions);
        
    } catch (error) {
        console.error('Error initializing quiz:', error);
        showError('Failed to load quiz');
    }
}

function initializeQuizInterface(quiz, questions) {
    // Create quiz container
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-taking-container';
    quizContainer.style.cssText = `
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: var(--dark-surface);
        border-radius: var(--radius-lg);
        border: 1px solid rgba(255,255,255,0.1);
    `;
    
    // Quiz header
    const quizHeader = document.createElement('div');
    quizHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;
    
    quizHeader.innerHTML = `
        <div>
            <h2 style="margin: 0;">${quiz.title}</h2>
            <p style="color: var(--text-secondary); margin: 0.5rem 0 0 0;">${quiz.subtitle}</p>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="text-align: right;">
                <div style="font-size: 0.875rem; color: var(--text-secondary);">Time</div>
                <div id="quizTimer" style="font-size: 1.5rem; font-weight: bold; color: var(--water-blue);">${quiz.time}:00</div>
            </div>
            <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
        </div>
    `;
    
    // Questions container
    const questionsContainer = document.createElement('div');
    questionsContainer.id = 'questionsContainer';
    
    // Render questions
    questions.forEach((question, index) => {
        const questionElement = createQuestionElement(question, index);
        questionsContainer.appendChild(questionElement);
    });
    
    // Navigation and submit buttons
    const navContainer = document.createElement('div');
    navContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255,255,255,0.1);
    `;
    
    navContainer.innerHTML = `
        <div style="display: flex; gap: 1rem;">
            <button id="prevBtn" class="quiz-btn secondary-btn" style="padding: 0.75rem 1.5rem;">
                <i class="fas fa-arrow-left"></i>
                Previous
            </button>
            <button id="nextBtn" class="quiz-btn primary-btn" style="padding: 0.75rem 1.5rem;">
                Next
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
        <div>
            <button id="submitBtn" class="quiz-btn primary-btn" style="padding: 0.75rem 2rem; background: linear-gradient(135deg, var(--success), #059669);">
                <i class="fas fa-paper-plane"></i>
                Submit Quiz
            </button>
        </div>
    `;
    
    // Progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        margin-bottom: 2rem;
    `;
    
    progressContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                Question <span id="currentQuestion">1</span> of ${questions.length}
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                <span id="answeredCount">0</span>/${questions.length} answered
            </div>
        </div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--purple), var(--water-blue)); transition: width 0.3s;"></div>
        </div>
    `;
    
    // Assemble the quiz
    quizContainer.appendChild(quizHeader);
    quizContainer.appendChild(progressContainer);
    quizContainer.appendChild(questionsContainer);
    quizContainer.appendChild(navContainer);
    
    // Clear body and add quiz
    document.body.innerHTML = '';
    document.body.appendChild(quizContainer);
    
    // Initialize quiz state
    window.quizState = {
        currentQuestionIndex: 0,
        answers: {},
        quizId: quiz.id,
        totalQuestions: questions.length,
        timeRemaining: quiz.time * 60, // Convert to seconds
        timer: null
    };
    
    // Show first question
    showQuestion(0);
    
    // Start timer
    startTimer();
    
    // Add event listeners
    document.getElementById('prevBtn').addEventListener('click', showPreviousQuestion);
    document.getElementById('nextBtn').addEventListener('click', showNextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
}

function createQuestionElement(question, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    questionDiv.dataset.index = index;
    questionDiv.style.cssText = `
        display: none;
        padding: 1.5rem;
        background: rgba(255,255,255,0.05);
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
    `;
    
    // Question text
    const questionText = document.createElement('h3');
    questionText.style.cssText = `
        margin: 0 0 1.5rem 0;
        color: var(--text-primary);
        font-size: 1.2rem;
        line-height: 1.4;
    `;
    questionText.innerHTML = `<span style="color: var(--water-blue); margin-right: 0.5rem;">Q${index + 1}.</span> ${question.question}`;
    
    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    optionsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    `;
    
    // Create options
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.style.cssText = `
            padding: 1rem 1.25rem;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 1rem;
        `;
        
        optionDiv.innerHTML = `
            <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 0.75rem;
                font-weight: bold;
            ">${String.fromCharCode(65 + optionIndex)}</div>
            <div style="flex: 1;">${option}</div>
            <div class="option-checkmark" style="
                opacity: 0;
                color: var(--success);
                font-size: 1.25rem;
            "><i class="fas fa-check-circle"></i></div>
        `;
        
        // Add click event
        optionDiv.addEventListener('click', () => {
            selectOption(question.id, optionIndex, index);
        });
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Points indicator
    const pointsIndicator = document.createElement('div');
    pointsIndicator.style.cssText = `
        margin-top: 1rem;
        font-size: 0.875rem;
        color: var(--water-blue);
        font-weight: 500;
    `;
    pointsIndicator.textContent = `Points: ${question.points}`;
    
    questionDiv.appendChild(questionText);
    questionDiv.appendChild(optionsContainer);
    questionDiv.appendChild(pointsIndicator);
    
    return questionDiv;
}

function selectOption(questionId, optionIndex, questionIndex) {
    // Store answer
    window.quizState.answers[questionId] = optionIndex;
    
    // Update UI
    const questionContainer = document.querySelector(`.question-container[data-index="${questionIndex}"]`);
    const options = questionContainer.querySelectorAll('.option-item');
    
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.style.background = 'rgba(56, 189, 248, 0.2)';
            option.style.borderColor = 'var(--water-blue)';
            option.querySelector('.option-checkmark').style.opacity = '1';
        } else {
            option.style.background = 'rgba(255,255,255,0.1)';
            option.style.borderColor = 'rgba(255,255,255,0.2)';
            option.querySelector('.option-checkmark').style.opacity = '0';
        }
    });
    
    // Update answered count
    updateProgress();
}

function showQuestion(index) {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Show current question
    const currentQuestion = document.querySelector(`.question-container[data-index="${index}"]`);
    if (currentQuestion) {
        currentQuestion.style.display = 'block';
    }
    
    // Update current question indicator
    document.getElementById('currentQuestion').textContent = index + 1;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').textContent = index === window.quizState.totalQuestions - 1 ? 'Review' : 'Next';
    
    // Store current index
    window.quizState.currentQuestionIndex = index;
}

function showPreviousQuestion() {
    if (window.quizState.currentQuestionIndex > 0) {
        showQuestion(window.quizState.currentQuestionIndex - 1);
    }
}

function showNextQuestion() {
    if (window.quizState.currentQuestionIndex < window.quizState.totalQuestions - 1) {
        showQuestion(window.quizState.currentQuestionIndex + 1);
    } else {
        // If on last question and click "Review", show first question
        showQuestion(0);
    }
}

function updateProgress() {
    const answeredCount = Object.keys(window.quizState.answers).length;
    const progress = (answeredCount / window.quizState.totalQuestions) * 100;
    
    document.getElementById('answeredCount').textContent = answeredCount;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function startTimer() {
    const timerElement = document.getElementById('quizTimer');
    
    window.quizState.timer = setInterval(() => {
        window.quizState.timeRemaining--;
        
        const minutes = Math.floor(window.quizState.timeRemaining / 60);
        const seconds = window.quizState.timeRemaining % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (window.quizState.timeRemaining <= 300) { // 5 minutes
            timerElement.style.color = '#ef4444';
        }
        
        if (window.quizState.timeRemaining <= 0) {
            clearInterval(window.quizState.timer);
            submitQuiz();
        }
    }, 1000);
}

async function submitQuiz() {
    const confirmed = confirm('Are you sure you want to submit your quiz?\n\nYou cannot change your answers after submission.');
    
    if (!confirmed) return;
    
    try {
        // Stop timer
        clearInterval(window.quizState.timer);
        
        // Show loading state
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: var(--dark-bg);
                color: var(--text-primary);
                text-align: center;
                padding: 2rem;
            ">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1.5rem; color: var(--water-blue);"></i>
                <h2>Submitting Quiz...</h2>
                <p>Please wait while we calculate your results.</p>
            </div>
        `;
        
        // Submit quiz
        const response = await API.submitQuiz(window.quizState.quizId, window.quizState.answers);
        
        if (response.success) {
            // Show results
            showQuizResults(response.data);
        } else {
            throw new Error('Failed to submit quiz');
        }
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError('Failed to submit quiz. Please try again.');
        
        // Return to quiz page
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

function showQuizResults(results) {
    document.body.innerHTML = `
        <div style="
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: var(--dark-surface);
            border-radius: var(--radius-lg);
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        ">
            <div style="margin-bottom: 3rem;">
                <i class="fas fa-trophy" style="font-size: 4rem; color: #f59e0b; margin-bottom: 1.5rem;"></i>
                <h1 style="margin-bottom: 1rem;">Quiz Completed!</h1>
                <p style="color: var(--text-secondary); font-size: 1.125rem;">Here are your results</p>
            </div>
            
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 3rem;
            ">
                <div style="
                    position: relative;
                    width: 200px;
                    height: 200px;
                    margin-bottom: 2rem;
                ">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10"/>
                        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#gradient)" stroke-width="10" 
                                stroke-linecap="round" stroke-dasharray="565.48" 
                                stroke-dashoffset="${565.48 - (565.48 * results.percentage / 100)}"/>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--purple);" />
                                <stop offset="100%" style="stop-color:var(--water-blue);" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                    ">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--water-blue);">
                            ${results.percentage}%
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            Score
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; max-width: 400px;">
                    <div style="
                        padding: 1.5rem;
                        background: rgba(255,255,255,0.05);
                        border-radius: var(--radius-md);
                    ">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--water-blue);">
                            ${results.score}/${results.totalPoints}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Points</div>
                    </div>
                    <div style="
                        padding: 1.5rem;
                        background: rgba(255,255,255,0.05);
                        border-radius: var(--radius-md);
                    ">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--water-blue);">
                            ${Math.round(Object.keys(window.quizState.answers).length / window.quizState.totalQuestions * 100)}%
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Completion</div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="reviewBtn" class="quiz-btn secondary-btn" style="padding: 1rem 2rem;">
                    <i class="fas fa-chart-bar"></i>
                    Review Answers
                </button>
                <button id="dashboardBtn" class="quiz-btn primary-btn" style="padding: 1rem 2rem;">
                    <i class="fas fa-home"></i>
                    Back to Dashboard
                </button>
                <button id="retakeBtn" class="quiz-btn primary-btn" style="padding: 1rem 2rem; background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <i class="fas fa-redo"></i>
                    Retake Quiz
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('reviewBtn').addEventListener('click', () => {
        alert('Review feature would show detailed results here.');
    });
    
    document.getElementById('dashboardBtn').addEventListener('click', () => {
        window.location.href = 'quiz.html';
    });
    
    document.getElementById('retakeBtn').addEventListener('click', () => {
        window.location.reload();
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease;
    `;
    
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
}

// Add animation style
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