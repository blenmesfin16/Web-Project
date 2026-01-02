<?php
// results.php
require_once 'config/session.php';
require_once 'config/database.php';

Auth::requireLogin();
$user = Auth::getUser();

$attemptId = $_GET['attempt_id'] ?? 0;

$database = new Database();
$db = $database->getConnection();

// Get attempt details
$query = "SELECT qa.*, q.title, q.category, q.difficulty, q.total_points
          FROM quiz_attempts qa
          JOIN quizzes q ON qa.quiz_id = q.id
          WHERE qa.id = :attempt_id AND qa.user_id = :user_id";
          
$stmt = $db->prepare($query);
$stmt->bindParam(':attempt_id', $attemptId);
$stmt->bindParam(':user_id', $_SESSION['user_id']);
$stmt->execute();
$attempt = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$attempt) {
    die('Attempt not found!');
}

// Get user answers with question details
$query = "SELECT ua.*, q.question_text, q.points, qo.option_text as correct_option
          FROM user_answers ua
          JOIN questions q ON ua.question_id = q.id
          LEFT JOIN question_options qo ON q.id = qo.question_id AND qo.option_index = q.correct_option_index
          WHERE ua.attempt_id = :attempt_id
          GROUP BY ua.id";
          
$stmt = $db->prepare($query);
$stmt->bindParam(':attempt_id', $attemptId);
$stmt->execute();
$answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate percentage
$percentage = round(($attempt['correct_answers'] / $attempt['total_questions']) * 100, 2);

// Determine grade
if ($percentage >= 90) $grade = 'A+';
elseif ($percentage >= 80) $grade = 'A';
elseif ($percentage >= 70) $grade = 'B';
elseif ($percentage >= 60) $grade = 'C';
elseif ($percentage >= 50) $grade = 'D';
else $grade = 'F';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GeniusGuide - Quiz Results</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/quiz.css">
    
    <style>
        .results-container {
            max-width: 900px;
            margin: 2rem auto;
            padding: 2rem;
        }
        
        .result-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .result-grade {
            font-size: 4rem;
            font-weight: 700;
            color: var(--water-blue);
            margin: 1rem 0;
        }
        
        .result-percentage {
            font-size: 2.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .result-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .stat-box {
            background: var(--dark-surface);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--water-blue);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .answers-review {
            margin: 3rem 0;
        }
        
        .answer-item {
            background: var(--dark-surface);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .answer-item.correct {
            border-left: 4px solid var(--success);
        }
        
        .answer-item.incorrect {
            border-left: 4px solid var(--danger);
        }
        
        .question-text {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .answer-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-md);
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .correct-badge {
            background: rgba(34, 197, 94, 0.2);
            color: var(--success);
        }
        
        .incorrect-badge {
            background: rgba(239, 68, 68, 0.2);
            color: var(--danger);
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 3rem;
            flex-wrap: wrap;
        }
    </style>
</head>
<body class="quiz-body">
    <header class="quiz-header">
        <div class="quiz-nav">
            <div class="nav-left">
                <i class="fa-solid fa-brain logo-icon"></i>
                <span class="logo-text">GeniusGuide</span>
                <span class="page-title">Quiz Results</span>
            </div>
            
            <div class="nav-right">
                <div class="user-menu">
                    <img src="<?php echo htmlspecialchars($user['avatar_url']); ?>" 
                         alt="Avatar" 
                         class="user-avatar-small">
                    <span><?php echo htmlspecialchars($user['full_name']); ?></span>
                </div>
                <a href="quiz.php" class="btn-outline">
                    <i class="fas fa-home"></i>
                    Dashboard
                </a>
            </div>
        </div>
    </header>

    <main class="results-container">
        <div class="result-header">
            <h1><?php echo htmlspecialchars($attempt['title']); ?></h1>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                <?php echo date('F j, Y \a\t g:i A', strtotime($attempt['completed_at'])); ?>
            </p>
            
            <div class="result-grade"><?php echo $grade; ?></div>
            <div class="result-percentage"><?php echo $percentage; ?>%</div>
            
            <div style="margin-top: 1.5rem;">
                <span class="quiz-difficulty-badge <?php echo strtolower($attempt['difficulty']); ?>">
                    <?php echo $attempt['difficulty']; ?>
                </span>
                <span class="quiz-category-badge" style="margin-left: 0.5rem;">
                    <?php echo $attempt['category']; ?>
                </span>
            </div>
        </div>

        <div class="result-stats-grid">
            <div class="stat-box">
                <div class="stat-value"><?php echo $attempt['score']; ?>/<?php echo $attempt['total_points']; ?></div>
                <div class="stat-label">Score</div>
            </div>
            <div class="stat-box">
                <div class="stat-value"><?php echo $attempt['correct_answers']; ?>/<?php echo $attempt['total_questions']; ?></div>
                <div class="stat-label">Correct Answers</div>
            </div>
            <div class="stat-box">
                <div class="stat-value"><?php echo floor($attempt['time_taken_seconds'] / 60); ?>:<?php echo sprintf('%02d', $attempt['time_taken_seconds'] % 60); ?></div>
                <div class="stat-label">Time Taken</div>
            </div>
            <div class="stat-box">
                <div class="stat-value"><?php echo $percentage; ?>%</div>
                <div class="stat-label">Percentage</div>
            </div>
        </div>

        <div class="answers-review">
            <h2 style="margin-bottom: 1.5rem;">Review Answers</h2>
            
            <?php foreach ($answers as $index => $answer): ?>
                <div class="answer-item <?php echo $answer['is_correct'] ? 'correct' : 'incorrect'; ?>">
                    <div class="question-text">
                        <strong>Q<?php echo $index + 1; ?>:</strong> <?php echo htmlspecialchars($answer['question_text']); ?>
                        <span style="float: right; color: var(--water-blue);"><?php echo $answer['points']; ?> points</span>
                    </div>
                    
                    <div class="answer-status <?php echo $answer['is_correct'] ? 'correct-badge' : 'incorrect-badge'; ?>">
                        <?php echo $answer['is_correct'] ? '✓ Correct' : '✗ Incorrect'; ?>
                    </div>
                    
                    <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                        <strong>Your Answer:</strong> 
                        <?php 
                        if ($answer['selected_option_index'] === null) {
                            echo 'Not answered';
                        } else {
                            echo 'Option ' . chr(65 + $answer['selected_option_index']);
                        }
                        ?>
                    </div>
                    
                    <?php if (!$answer['is_correct'] && $answer['correct_option']): ?>
                        <div style="color: var(--success); margin-top: 0.5rem;">
                            <strong>Correct Answer:</strong> <?php echo htmlspecialchars($answer['correct_option']); ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="action-buttons">
            <button class="btn-primary" onclick="window.location.href='take-quiz.php?id=<?php echo $attempt['quiz_id']; ?>'">
                <i class="fas fa-redo"></i>
                Retake Quiz
            </button>
            <button class="btn-outline" onclick="window.location.href='quiz.php'">
                <i class="fas fa-list"></i>
                Back to Quizzes
            </button>
            <button class="btn-outline" onclick="window.print()">
                <i class="fas fa-print"></i>
                Print Results
            </button>
            <button class="btn-outline" onclick="shareResults()">
                <i class="fas fa-share-alt"></i>
                Share Results
            </button>
        </div>
    </main>

    <script>
        function shareResults() {
            const text = `I scored <?php echo $percentage; ?>% on "<?php echo $attempt['title']; ?>" quiz on GeniusGuide!`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'My Quiz Results',
                    text: text,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Results copied to clipboard!');
                });
            }
        }
    </script>
</body>
</html>