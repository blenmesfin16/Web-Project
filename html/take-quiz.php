<?php
// take-quiz.php
require_once 'config/session.php';
require_once 'config/database.php';

Auth::requireLogin();
$user = Auth::getUser();

$quizId = $_GET['id'] ?? 0;

$database = new Database();
$db = $database->getConnection();

if ($quizId == 'random') {
    // Get a random quiz
    $query = "SELECT id FROM quizzes ORDER BY RAND() LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $randomQuiz = $stmt->fetch(PDO::FETCH_ASSOC);
    $quizId = $randomQuiz['id'] ?? 1;
}

// Get quiz details
$query = "SELECT * FROM quizzes WHERE id = :quiz_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':quiz_id', $quizId);
$stmt->execute();
$quiz = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$quiz) {
    die('Quiz not found!');
}

// Get questions for this quiz
$query = "SELECT q.*, 
                 GROUP_CONCAT(o.option_text ORDER BY o.option_index SEPARATOR '|||') as options_text
          FROM questions q
          LEFT JOIN question_options o ON q.id = o.question_id
          WHERE q.quiz_id = :quiz_id
          GROUP BY q.id
          ORDER BY q.id";
          
$stmt = $db->prepare($query);
$stmt->bindParam(':quiz_id', $quizId);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Format questions for JavaScript
$formattedQuestions = [];
foreach ($questions as $question) {
    $options = explode('|||', $question['options_text']);
    $formattedQuestions[] = [
        'id' => $question['id'],
        'question' => $question['question_text'],
        'points' => $question['points'],
        'correct_option_index' => $question['correct_option_index'],
        'options' => $options
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GeniusGuide - Take Quiz</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/quiz.css">
    <link rel="stylesheet" href="/css/quiz_taking.css">
    <link rel="stylesheet" href="/css/modal.css">
    
    <style>
        .quiz-instructions {
            max-width: 900px;
            margin: 2rem auto;
            padding: 2rem;
            background: var(--dark-surface);
            border-radius: var(--radius-lg);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .start-quiz-btn {
            display: block;
            width: 200px;
            margin: 2rem auto;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--purple), var(--purple-dark));
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            text-align: center;
        }
        
        .start-quiz-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
        }
        
        .option-item.selected {
            border-color: var(--water-blue);
            background: rgba(56, 189, 248, 0.1);
        }
        
        .option-item.selected .option-check {
            display: block;
            color: var(--water-blue);
        }
        
        .question-indicator {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            background: var(--dark-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .question-indicator.current {
            border-color: var(--water-blue);
            background: var(--water-blue);
            color: white;
        }
        
        .question-indicator.answered {
            border-color: var(--success);
            background: rgba(34, 197, 94, 0.1);
        }
        
        .question-indicator.marked {
            border-color: var(--warning);
            background: rgba(245, 158, 11, 0.1);
        }
        
        .timer-warning {
            color: var(--warning) !important;
        }
    </style>
</head>
<body class="quiz-taking-body">
    <!-- Quiz Header -->
    <header class="quiz-header">
        <div class="quiz-nav">
            <div class="nav-left">
                <i class="fa-solid fa-brain logo-icon"></i>
                <span class="logo-text">GeniusGuide</span>
                <span class="page-title">Take Quiz</span>
            </div>
            
            <div class="nav-right">
                <div class="user-menu">
                    <img src="<?php echo htmlspecialchars($user['avatar_url']); ?>" 
                         alt="Avatar" 
                         class="user-avatar-small">
                    <span><?php echo htmlspecialchars($user['full_name']); ?></span>
                </div>
                <a href="quiz.php" class="btn-outline">
                    <i class="fas fa-arrow-left"></i>
                    Back to Dashboard
                </a>
            </div>
        </div>
    </header>

    <main class="quiz-taking-container">
        <!-- Quiz Info (Initial State) -->
        <div id="quizInfo" class="quiz-instructions">
            <h2 id="quizTitle"><?php echo htmlspecialchars($quiz['title']); ?></h2>
            <p id="quizDescription" style="color: var(--text-secondary); margin: 1rem 0;">
                <?php echo htmlspecialchars($quiz['description']); ?>
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Questions</div>
                    <div id="quizQuestions" style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">
                        <?php echo $quiz['total_questions']; ?>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Time</div>
                    <div id="quizTime" style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">
                        <?php echo $quiz['time_limit_minutes']; ?> min
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Difficulty</div>
                    <div id="quizDifficulty" style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">
                        <?php echo $quiz['difficulty']; ?>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Points</div>
                    <div id="quizPoints" style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">
                        <?php echo $quiz['total_points']; ?>
                    </div>
                </div>
            </div>
            
            <h3 style="margin: 2rem 0 1rem 0; color: var(--text-primary);">
                <i class="fas fa-info-circle" style="color: var(--water-blue);"></i>
                Instructions
            </h3>
            
            <ul style="color: var(--text-secondary); line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin-bottom: 0.5rem;">Read each question carefully before answering</li>
                <li style="margin-bottom: 0.5rem;">You can navigate between questions using the Previous/Next buttons</li>
                <li style="margin-bottom: 0.5rem;">Time will be tracked - complete before the timer runs out</li>
                <li style="margin-bottom: 0.5rem;">Once submitted, you cannot change your answers</li>
                <li style="margin-bottom: 0.5rem;">Each correct answer earns points based on difficulty</li>
            </ul>
            
            <button id="startQuizBtn" class="start-quiz-btn">
                <i class="fas fa-play"></i>
                Start Quiz
            </button>
        </div>

        <!-- Quiz Interface (Hidden Initially) -->
        <div id="quizInterface" style="display: none;">
            <!-- Quiz Header -->
            <div class="quiz-header-bar">
                <div class="quiz-title-section">
                    <h2 id="currentQuizTitle"><?php echo htmlspecialchars($quiz['title']); ?></h2>
                    <p class="quiz-subtitle" id="currentQuizSubtitle"><?php echo htmlspecialchars($quiz['category']); ?></p>
                </div>
                
                <div class="quiz-info-section">
                    <div class="quiz-timer">
                        <div class="timer-label">Time Remaining</div>
                        <div id="timerValue" class="timer-value"><?php echo sprintf('%02d:00', $quiz['time_limit_minutes']); ?></div>
                    </div>
                    <span id="difficultyBadge" class="quiz-difficulty-badge <?php echo strtolower($quiz['difficulty']); ?>">
                        <?php echo $quiz['difficulty']; ?>
                    </span>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="quiz-progress-section">
                <div class="progress-header">
                    <div class="progress-info">
                        Question <span id="currentQuestionNumber">1</span> of 
                        <span id="totalQuestions"><?php echo count($formattedQuestions); ?></span>
                    </div>
                    <div class="progress-percentage" id="progressPercentage">0%</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                </div>
            </div>

            <!-- Question Container -->
            <div id="questionContainer" class="question-container">
                <div class="question-header">
                    <span class="question-number">Question 1</span>
                    <h3 class="question-text" id="questionText"></h3>
                    <span class="question-points" id="questionPoints">0 points</span>
                </div>
                
                <div class="options-grid" id="optionsContainer">
                    <!-- Options will be dynamically inserted here -->
                </div>
            </div>

            <!-- Question Navigation -->
            <div class="question-indicators" id="questionIndicators">
                <!-- Question indicators will be dynamically inserted here -->
            </div>

            <!-- Navigation Buttons -->
            <div class="quiz-navigation">
                <button id="prevBtn" class="nav-btn prev" disabled>
                    <i class="fas fa-arrow-left"></i>
                    Previous
                </button>
                
                <div style="display: flex; gap: 0.5rem;">
                    <button id="markReviewBtn" class="nav-btn secondary">
                        <i class="fas fa-flag"></i>
                        Mark for Review
                    </button>
                    <button id="nextBtn" class="nav-btn next">
                        Next Question
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                
                <button id="submitQuizBtn" class="nav-btn submit">
                    <i class="fas fa-paper-plane"></i>
                    Submit Quiz
                </button>
            </div>
        </div>
    </main>

    <!-- Modal for Quiz Submission -->
    <div id="submitModal" class="modal-overlay" style="display: none;">
        <div class="modal-container modal-sm">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-paper-plane"></i>
                    Submit Quiz
                </h3>
                <button class="modal-close" id="closeSubmitModal">&times;</button>
            </div>
            
            <div class="modal-body">
                <p>Are you sure you want to submit your quiz?</p>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">
                    You have answered <span id="answeredCount">0</span> out of 
                    <span id="totalQuestionsModal"><?php echo count($formattedQuestions); ?></span> questions.
                </p>
                <p style="color: var(--warning); margin-top: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Once submitted, you cannot change your answers.
                </p>
            </div>
            
            <div class="modal-footer">
                <button id="cancelSubmitBtn" class="btn-outline">Cancel</button>
                <button id="confirmSubmitBtn" class="btn-primary">Submit Quiz</button>
            </div>
        </div>
    </div>

    <script>
        // Quiz data from PHP
        const quizData = <?php echo json_encode($quiz); ?>;
        const questions = <?php echo json_encode($formattedQuestions); ?>;
        
        // Quiz state
        let quizState = {
            quizId: <?php echo $quizId; ?>,
            currentQuestion: 0,
            answers: {},
            markedForReview: new Set(),
            startTime: null,
            timeRemaining: <?php echo $quiz['time_limit_minutes'] * 60; ?>,
            timer: null
        };
        
        // DOM Elements
        const quizInfo = document.getElementById('quizInfo');
        const quizInterface = document.getElementById('quizInterface');
        const startQuizBtn = document.getElementById('startQuizBtn');
        const submitQuizBtn = document.getElementById('submitQuizBtn');
        const submitModal = document.getElementById('submitModal');
        const closeSubmitModal = document.getElementById('closeSubmitModal');
        const cancelSubmitBtn = document.getElementById('cancelSubmitBtn');
        const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
        
        // Start quiz
        startQuizBtn.addEventListener('click', function() {
            quizInfo.style.display = 'none';
            quizInterface.style.display = 'block';
            
            // Initialize quiz timer
            startTimer();
            
            // Initialize first question
            loadQuestion(0);
            
            // Initialize question indicators
            initializeQuestionIndicators();
            
            // Store start time
            quizState.startTime = new Date();
        });
        
        // Timer functions
        function startTimer() {
            updateTimerDisplay();
            
            quizState.timer = setInterval(() => {
                quizState.timeRemaining--;
                
                if (quizState.timeRemaining <= 0) {
                    clearInterval(quizState.timer);
                    submitQuiz();
                }
                
                updateTimerDisplay();
            }, 1000);
        }
        
        function updateTimerDisplay() {
            const minutes = Math.floor(quizState.timeRemaining / 60);
            const seconds = quizState.timeRemaining % 60;
            
            const timerElement = document.getElementById('timerValue');
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Add warning class when less than 5 minutes
            if (quizState.timeRemaining <= 300) {
                timerElement.classList.add('timer-warning');
            }
        }
        
        // Load question
        function loadQuestion(index) {
            if (index < 0 || index >= questions.length) return;
            
            quizState.currentQuestion = index;
            const question = questions[index];
            
            // Update question number
            document.getElementById('currentQuestionNumber').textContent = index + 1;
            document.getElementById('totalQuestions').textContent = questions.length;
            
            // Update progress
            const progress = ((index + 1) / questions.length) * 100;
            document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
            document.getElementById('progressBar').style.width = `${progress}%`;
            
            // Update question text
            document.getElementById('questionText').textContent = question.question;
            
            // Update points
            document.getElementById('questionPoints').textContent = `${question.points} points`;
            
            // Update options
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option-item';
                if (quizState.answers[index] === optionIndex) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.innerHTML = `
                    <div class="option-letter">${String.fromCharCode(65 + optionIndex)}</div>
                    <div class="option-text">${option}</div>
                    <div class="option-check"><i class="fas fa-check-circle"></i></div>
                `;
                
                optionElement.addEventListener('click', () => selectOption(optionIndex));
                optionsContainer.appendChild(optionElement);
            });
            
            // Update navigation buttons
            document.getElementById('prevBtn').disabled = index === 0;
            document.getElementById('nextBtn').textContent = index === questions.length - 1 ? 'Finish' : 'Next Question';
            
            // Update mark for review button
            const markReviewBtn = document.getElementById('markReviewBtn');
            if (quizState.markedForReview.has(index)) {
                markReviewBtn.innerHTML = '<i class="fas fa-flag"></i> Remove Review Mark';
                markReviewBtn.classList.add('secondary');
            } else {
                markReviewBtn.innerHTML = '<i class="fas fa-flag"></i> Mark for Review';
                markReviewBtn.classList.remove('secondary');
            }
            
            // Update question indicator
            updateQuestionIndicators();
        }
        
        // Select option
        function selectOption(optionIndex) {
            const questionIndex = quizState.currentQuestion;
            quizState.answers[questionIndex] = optionIndex;
            
            // Update UI
            const options = document.querySelectorAll('.option-item');
            options.forEach((option, index) => {
                if (index === optionIndex) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            
            // Update question indicator
            updateQuestionIndicators();
        }
        
        // Initialize question indicators
        function initializeQuestionIndicators() {
            const container = document.getElementById('questionIndicators');
            container.innerHTML = '';
            
            for (let i = 0; i < questions.length; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'question-indicator';
                indicator.textContent = i + 1;
                indicator.addEventListener('click', () => loadQuestion(i));
                container.appendChild(indicator);
            }
            updateQuestionIndicators();
        }
        
        // Update question indicators
        function updateQuestionIndicators() {
            const indicators = document.querySelectorAll('.question-indicator');
            
            indicators.forEach((indicator, index) => {
                indicator.className = 'question-indicator';
                
                if (index === quizState.currentQuestion) {
                    indicator.classList.add('current');
                }
                
                if (quizState.answers[index] !== undefined) {
                    indicator.classList.add('answered');
                }
                
                if (quizState.markedForReview.has(index)) {
                    indicator.classList.add('marked');
                }
            });
        }
        
        // Mark for review
        document.getElementById('markReviewBtn').addEventListener('click', function() {
            const questionIndex = quizState.currentQuestion;
            
            if (quizState.markedForReview.has(questionIndex)) {
                quizState.markedForReview.delete(questionIndex);
                this.innerHTML = '<i class="fas fa-flag"></i> Mark for Review';
                this.classList.remove('secondary');
            } else {
                quizState.markedForReview.add(questionIndex);
                this.innerHTML = '<i class="fas fa-flag"></i> Remove Review Mark';
                this.classList.add('secondary');
            }
            
            updateQuestionIndicators();
        });
        
        // Navigation
        document.getElementById('prevBtn').addEventListener('click', function() {
            if (quizState.currentQuestion > 0) {
                loadQuestion(quizState.currentQuestion - 1);
            }
        });
        
        document.getElementById('nextBtn').addEventListener('click', function() {
            if (quizState.currentQuestion < questions.length - 1) {
                loadQuestion(quizState.currentQuestion + 1);
            } else {
                // Show submit modal if on last question
                showSubmitModal();
            }
        });
        
        // Submit quiz
        submitQuizBtn.addEventListener('click', showSubmitModal);
        
        function showSubmitModal() {
            // Calculate answered questions
            const answeredCount = Object.keys(quizState.answers).length;
            document.getElementById('answeredCount').textContent = answeredCount;
            document.getElementById('totalQuestionsModal').textContent = questions.length;
            
            submitModal.style.display = 'flex';
        }
        
        // Modal controls
        closeSubmitModal.addEventListener('click', () => {
            submitModal.style.display = 'none';
        });
        
        cancelSubmitBtn.addEventListener('click', () => {
            submitModal.style.display = 'none';
        });
        
        confirmSubmitBtn.addEventListener('click', submitQuiz);
        
        async function submitQuiz() {
            // Stop timer
            clearInterval(quizState.timer);
            
            // Calculate time taken
            const timeTaken = Math.floor((new Date() - quizState.startTime) / 1000);
            
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
            
            try {
                // Submit quiz using Fetch API
                const formData = new FormData();
                formData.append('quiz_id', quizState.quizId);
                formData.append('answers', JSON.stringify(quizState.answers));
                formData.append('time_taken', timeTaken);
                formData.append('marked_review', JSON.stringify([...quizState.markedForReview]));
                
                const response = await fetch('api/submit_quiz.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Redirect to results page
                    window.location.href = `results.php?attempt_id=${result.attempt_id}`;
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error submitting quiz:', error);
                alert('Failed to submit quiz. Please try again.');
                window.location.href = 'quiz.php';
            }
        }
        
        // Close modal on outside click
        window.addEventListener('click', function(event) {
            if (event.target == submitModal) {
                submitModal.style.display = 'none';
            }
        });
    </script>
</body>
</html>