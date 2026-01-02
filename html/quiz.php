<?php
// quiz.php
require_once 'config/session.php';
require_once 'config/database.php';

Auth::requireLogin();
$user = Auth::getUser();

// Get user statistics
$database = new Database();
$db = $database->getConnection();

// Get total quizzes taken
$query = "SELECT COUNT(*) as total_quizzes FROM quiz_attempts WHERE user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
$stmt->execute();
$totalQuizzes = $stmt->fetch(PDO::FETCH_ASSOC)['total_quizzes'];

// Get average score
$query = "SELECT AVG(score) as avg_score, 
                 AVG((correct_answers/total_questions)*100) as avg_percentage 
          FROM quiz_attempts 
          WHERE user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
$stmt->execute();
$avgResult = $stmt->fetch(PDO::FETCH_ASSOC);
$avgScore = round($avgResult['avg_score'] ?? 0, 1);
$avgPercentage = round($avgResult['avg_percentage'] ?? 0, 1);

// Get best score
$query = "SELECT MAX((correct_answers/total_questions)*100) as best_percentage 
          FROM quiz_attempts 
          WHERE user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
$stmt->execute();
$bestPercentage = round($stmt->fetch(PDO::FETCH_ASSOC)['best_percentage'] ?? 0, 1);

// Get quizzes by department filter
$department = $_GET['department'] ?? $user['department'];
$departmentFilter = $department != 'all' ? " AND category = :department" : "";

$query = "SELECT q.*, 
                 COALESCE(ua.score, 0) as user_score,
                 COALESCE(ua.completed_at, NULL) as last_attempt
          FROM quizzes q
          LEFT JOIN (
              SELECT quiz_id, MAX(score) as score, MAX(completed_at) as completed_at
              FROM quiz_attempts 
              WHERE user_id = :user_id 
              GROUP BY quiz_id
          ) ua ON q.id = ua.quiz_id
          WHERE 1=1 $departmentFilter
          ORDER BY q.created_at DESC";
          
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
if ($department != 'all') {
    $stmt->bindParam(':department', $department);
}
$stmt->execute();
$quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get upcoming quizzes (quizzes not taken yet)
$query = "SELECT * FROM quizzes q
          WHERE q.id NOT IN (
              SELECT quiz_id FROM quiz_attempts WHERE user_id = :user_id
          )
          ORDER BY RAND() LIMIT 2";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user['id']);
$stmt->execute();
$upcomingQuizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GeniusGuide - Quiz Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons --> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- Main CSS -->
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/quiz.css">
    <link rel="stylesheet" href="/css/quiz_taking.css">
    <link rel="stylesheet" href="/css/dashboard.css">
    <link rel="stylesheet" href="/css/modal.css">
    <link rel="stylesheet" href="/css/auth.css">
    
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: var(--dark-surface);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: var(--transition);
        }
        
        .stat-card:hover {
            border-color: var(--water-blue);
            transform: translateY(-2px);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--water-blue);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .quick-nav {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .nav-btn {
            padding: 0.75rem 1.5rem;
            background: var(--dark-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .nav-btn:hover {
            background: var(--water-blue);
            border-color: var(--water-blue);
        }
        
        .quiz-filter-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .filter-tab {
            padding: 0.5rem 1.5rem;
            background: var(--dark-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .filter-tab.active {
            background: var(--water-blue);
            border-color: var(--water-blue);
            color: white;
        }
        
        .filter-tab:hover:not(.active) {
            border-color: var(--text-secondary);
        }
        
        .user-menu {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 1rem;
            background: var(--dark-surface);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .user-menu:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 0.5rem;
            background: var(--dark-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            min-width: 200px;
            z-index: 1000;
            display: none;
        }
        
        .user-menu:hover .user-dropdown {
            display: block;
        }
        
        .dropdown-item {
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: var(--transition);
        }
        
        .dropdown-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .dropdown-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 0.25rem 0;
        }
    </style>
</head>
<body class="quiz-body">
    <!-- Simple Header -->
    <header class="quiz-header">
        <div class="quiz-nav">
            <div class="nav-left">
                <i class="fa-solid fa-brain logo-icon"></i>
                <span class="logo-text">GeniusGuide</span>
                <span class="page-title">Quizzes</span>
            </div>
            
            <div class="nav-right">
                <div class="user-menu">
                    <img src="<?php echo htmlspecialchars($user['avatar_url']); ?>" 
                         alt="Avatar" 
                         class="user-avatar-small">
                    <span><?php echo htmlspecialchars($user['full_name']); ?></span>
                    <i class="fas fa-chevron-down"></i>
                    
                    <div class="user-dropdown">
                        <div class="dropdown-item">
                            <i class="fas fa-user"></i>
                            <?php echo htmlspecialchars($user['full_name']); ?>
                        </div>
                        <div class="dropdown-item">
                            <i class="fas fa-graduation-cap"></i>
                            <?php echo htmlspecialchars($user['department']); ?>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="profile.php" class="dropdown-item">
                            <i class="fas fa-cog"></i>
                            Profile Settings
                        </a>
                        <a href="logout.php" class="dropdown-item">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="quiz-main">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <h1 class="greeting">Welcome back, <?php echo htmlspecialchars(explode(' ', $user['full_name'])[0]); ?>!</h1>
            <p class="date-display"><?php echo date('l, F j, Y'); ?></p>
        </div>

        <!-- Quiz Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value"><?php echo $totalQuizzes; ?></div>
                <div class="stat-label">Quizzes Taken</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $avgScore; ?></div>
                <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $avgPercentage; ?>%</div>
                <div class="stat-label">Average Percentage</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?php echo $bestPercentage; ?>%</div>
                <div class="stat-label">Best Performance</div>
            </div>
        </div>

        <!-- Quick Navigation -->
        <div class="quick-nav">
            <button class="nav-btn" onclick="window.location.href='take-quiz.php?id=random'">
                <i class="fas fa-random"></i>
                Random Quiz
            </button>
            <button class="nav-btn" onclick="window.location.href='history.php'">
                <i class="fas fa-history"></i>
                Review History
            </button>
            <button class="nav-btn" onclick="window.location.href='leaderboard.php'">
                <i class="fas fa-trophy"></i>
                Leaderboard
            </button>
            <button class="nav-btn" onclick="startNewQuiz()">
                <i class="fas fa-plus"></i>
                Create Quiz
            </button>
        </div>

        <!-- Quiz Filter Tabs -->
        <div class="quiz-filter-tabs">
            <button class="filter-tab <?php echo ($department == 'all') ? 'active' : ''; ?>" 
                    onclick="filterQuizzes('all')">
                All Quizzes
            </button>
            <button class="filter-tab <?php echo ($department == 'Software Engineering') ? 'active' : ''; ?>" 
                    onclick="filterQuizzes('Software Engineering')">
                Software Engineering
            </button>
            <button class="filter-tab <?php echo ($department == 'Computer Science') ? 'active' : ''; ?>" 
                    onclick="filterQuizzes('Computer Science')">
                Computer Science
            </button>
            <button class="filter-tab <?php echo ($department == 'Information Systems') ? 'active' : ''; ?>" 
                    onclick="filterQuizzes('Information Systems')">
                Information Systems
            </button>
            <button class="filter-tab <?php echo ($department == 'Information Technology') ? 'active' : ''; ?>" 
                    onclick="filterQuizzes('Information Technology')">
                Information Technology
            </button>
        </div>

        <!-- Quiz Grid Header -->
        <div class="section-header">
            <h2>Available Quizzes</h2>
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search quizzes..." id="quizSearch" onkeyup="searchQuizzes()">
            </div>
        </div>

        <!-- Quiz Grid - 3 CARDS PER ROW -->
        <div class="quizzes-grid" id="quizzesGrid">
            <?php foreach ($quizzes as $quiz): ?>
                <div class="quiz-card" data-department="<?php echo htmlspecialchars($quiz['category']); ?>">
                    <div class="quiz-card-header">
                        <div class="quiz-category-badge <?php echo strtolower(str_replace(' ', '-', $quiz['category'])); ?>">
                            <?php echo htmlspecialchars($quiz['category']); ?>
                        </div>
                        <span class="quiz-difficulty-badge <?php echo strtolower($quiz['difficulty']); ?>">
                            <?php echo htmlspecialchars($quiz['difficulty']); ?>
                        </span>
                    </div>
                    
                    <div class="quiz-card-body">
                        <h3 class="quiz-title"><?php echo htmlspecialchars($quiz['title']); ?></h3>
                        <p class="quiz-subtitle"><?php echo htmlspecialchars($quiz['description']); ?></p>
                        
                        <div class="quiz-meta">
                            <span class="meta-item">
                                <i class="fas fa-question-circle"></i>
                                <?php echo $quiz['total_questions']; ?> Questions
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-clock"></i>
                                <?php echo $quiz['time_limit_minutes']; ?> Min
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-star"></i>
                                <?php echo $quiz['total_points']; ?> Points
                            </span>
                        </div>
                        
                        <?php if ($quiz['user_score'] > 0): ?>
                            <div class="quiz-progress">
                                <div class="progress-label">Your Score</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" 
                                         style="width: <?php echo ($quiz['user_score'] / $quiz['total_points']) * 100; ?>%">
                                    </div>
                                </div>
                                <div class="progress-value"><?php echo $quiz['user_score']; ?>/<?php echo $quiz['total_points']; ?></div>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <div class="quiz-card-footer">
                        <?php if ($quiz['last_attempt']): ?>
                            <button class="btn-outline details-btn" 
                                    onclick="showQuizDetails(<?php echo $quiz['id']; ?>)">
                                <i class="fas fa-chart-bar"></i>
                                View Details
                            </button>
                            <button class="btn-primary retake-btn" 
                                    onclick="startQuiz(<?php echo $quiz['id']; ?>)">
                                <i class="fas fa-redo"></i>
                                Retake Quiz
                            </button>
                        <?php else: ?>
                            <button class="btn-outline details-btn" 
                                    onclick="showQuizDetails(<?php echo $quiz['id']; ?>)">
                                <i class="fas fa-info-circle"></i>
                                Details
                            </button>
                            <button class="btn-primary start-btn" 
                                    onclick="startQuiz(<?php echo $quiz['id']; ?>)">
                                <i class="fas fa-play"></i>
                                Start Quiz
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Sidebar Content BELOW the cards -->
        <div class="sidebar-content">
            <!-- Upcoming Quizzes Widget -->
            <div class="sidebar-widget">
                <h3><i class="fas fa-calendar-alt"></i> Upcoming Quizzes</h3>
                <div class="upcoming-list">
                    <?php foreach ($upcomingQuizzes as $upcoming): ?>
                        <div class="upcoming-item">
                            <div class="upcoming-date">
                                <?php
                                $date = date('d', strtotime('+'.rand(1,7).' days'));
                                $month = date('M', strtotime('+'.rand(1,7).' days'));
                                ?>
                                <span class="date-day"><?php echo $date; ?></span>
                                <span class="date-month"><?php echo $month; ?></span>
                            </div>
                            <div class="upcoming-info">
                                <h4><?php echo htmlspecialchars($upcoming['title']); ?></h4>
                                <p><?php echo htmlspecialchars($upcoming['description']); ?></p>
                                <span class="upcoming-difficulty <?php echo strtolower($upcoming['difficulty']); ?>">
                                    <?php echo htmlspecialchars($upcoming['difficulty']); ?>
                                </span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Quick Actions Widget -->
            <div class="sidebar-widget">
                <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                <div class="quick-actions-grid">
                    <button class="action-btn" onclick="window.location.href='take-quiz.php?id=random'">
                        <i class="fas fa-random"></i>
                        Random Quiz
                    </button>
                    <button class="action-btn" onclick="window.location.href='history.php'">
                        <i class="fas fa-history"></i>
                        Review History
                    </button>
                    <button class="action-btn" onclick="downloadResults()">
                        <i class="fas fa-download"></i>
                        Download Results
                    </button>
                    <button class="action-btn" onclick="shareProgress()">
                        <i class="fas fa-share-alt"></i>
                        Share Progress
                    </button>
                </div>
            </div>
        </div>
    </main>

    <!-- Quiz Details Modal -->
    <div id="quizDetailsModal" class="modal-overlay" style="display: none;">
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title" id="modalQuizTitle"></h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body" id="modalQuizBody"></div>
            <div class="modal-footer">
                <button class="btn-outline" onclick="closeModal()">Close</button>
                <button class="btn-primary" id="modalStartBtn">Start Quiz</button>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        function filterQuizzes(department) {
            window.location.href = `quiz.php?department=${department}`;
        }
        
        function searchQuizzes() {
            const searchTerm = document.getElementById('quizSearch').value.toLowerCase();
            const quizzes = document.querySelectorAll('.quiz-card');
            
            quizzes.forEach(quiz => {
                const title = quiz.querySelector('.quiz-title').textContent.toLowerCase();
                const subtitle = quiz.querySelector('.quiz-subtitle').textContent.toLowerCase();
                const category = quiz.dataset.department.toLowerCase();
                
                if (title.includes(searchTerm) || subtitle.includes(searchTerm) || category.includes(searchTerm)) {
                    quiz.style.display = 'block';
                } else {
                    quiz.style.display = 'none';
                }
            });
        }
        
        function showQuizDetails(quizId) {
            fetch(`api/get_quiz_details.php?id=${quizId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const quiz = data.quiz;
                        document.getElementById('modalQuizTitle').textContent = quiz.title;
                        
                        let html = `
                            <div style="margin-bottom: 1.5rem;">
                                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${quiz.description}</p>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Questions</div>
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">${quiz.total_questions}</div>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Time</div>
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">${quiz.time_limit_minutes} min</div>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Difficulty</div>
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">${quiz.difficulty}</div>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Points</div>
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--water-blue);">${quiz.total_points}</div>
                                    </div>
                                </div>
                                <div style="background: var(--dark-bg); padding: 1rem; border-radius: var(--radius-md);">
                                    <h4 style="margin-bottom: 0.5rem;">Your Attempts</h4>
                                    <div id="attemptsList"></div>
                                </div>
                            </div>
                        `;
                        
                        document.getElementById('modalQuizBody').innerHTML = html;
                        document.getElementById('modalStartBtn').onclick = () => startQuiz(quizId);
                        document.getElementById('modalStartBtn').textContent = quiz.has_attempt ? 'Retake Quiz' : 'Start Quiz';
                        
                        // Load attempts
                        if (data.attempts && data.attempts.length > 0) {
                            let attemptsHtml = '';
                            data.attempts.forEach(attempt => {
                                const percentage = Math.round((attempt.correct_answers / attempt.total_questions) * 100);
                                const date = new Date(attempt.completed_at).toLocaleDateString();
                                attemptsHtml += `
                                    <div style="padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                        <div style="display: flex; justify-content: space-between;">
                                            <span>Score: ${attempt.score}/${attempt.total_questions * 10}</span>
                                            <span>${percentage}%</span>
                                        </div>
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                            ${date} • ${Math.floor(attempt.time_taken_seconds / 60)}m ${attempt.time_taken_seconds % 60}s
                                        </div>
                                    </div>
                                `;
                            });
                            document.getElementById('attemptsList').innerHTML = attemptsHtml;
                        } else {
                            document.getElementById('attemptsList').innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No attempts yet</p>';
                        }
                        
                        document.getElementById('quizDetailsModal').style.display = 'flex';
                    }
                });
        }
        
        function closeModal() {
            document.getElementById('quizDetailsModal').style.display = 'none';
        }
        
        function startQuiz(quizId) {
            window.location.href = `take-quiz.php?id=${quizId}`;
        }
        
        function startNewQuiz() {
            // Show modal for creating new quiz
            alert('Quiz creation feature coming soon!');
        }
        
        function downloadResults() {
            // Generate and download results PDF/CSV
            alert('Downloading your quiz results...');
        }
        
        function shareProgress() {
            // Share progress on social media
            const text = `Check out my quiz progress on GeniusGuide! I have taken ${<?php echo $totalQuizzes; ?>} quizzes with an average score of ${<?php echo $avgPercentage; ?>}%.`;
            if (navigator.share) {
                navigator.share({
                    title: 'My Quiz Progress',
                    text: text,
                    url: window.location.href
                });
            } else {
                prompt('Copy this link to share:', text);
            }
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('quizDetailsModal');
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>
</body>
</html>