<?php
// api/submit_quiz.php
require_once '../config/session.php';
require_once '../config/database.php';

Auth::requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$quizId = $_POST['quiz_id'] ?? 0;
$answers = json_decode($_POST['answers'] ?? '{}', true);
$timeTaken = $_POST['time_taken'] ?? 0;

$database = new Database();
$db = $database->getConnection();

// Get quiz details
$query = "SELECT * FROM quizzes WHERE id = :quiz_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':quiz_id', $quizId);
$stmt->execute();
$quiz = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$quiz) {
    echo json_encode(['success' => false, 'message' => 'Quiz not found']);
    exit;
}

// Get questions for this quiz
$query = "SELECT * FROM questions WHERE quiz_id = :quiz_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':quiz_id', $quizId);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate score
$correctAnswers = 0;
$totalScore = 0;
$userAnswers = [];

foreach ($questions as $index => $question) {
    $selectedOption = $answers[$index] ?? null;
    $isCorrect = ($selectedOption === $question['correct_option_index']);
    
    if ($isCorrect) {
        $correctAnswers++;
        $totalScore += $question['points'];
    }
    
    // Store user answer for later insertion
    $userAnswers[] = [
        'question_id' => $question['id'],
        'selected_option' => $selectedOption,
        'is_correct' => $isCorrect
    ];
}

// Start transaction
$db->beginTransaction();

try {
    // Create quiz attempt record
    $query = "INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, time_taken_seconds) 
              VALUES (:user_id, :quiz_id, :score, :total_questions, :correct_answers, :time_taken)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->bindParam(':quiz_id', $quizId);
    $stmt->bindParam(':score', $totalScore);
    $stmt->bindParam(':total_questions', $quiz['total_questions']);
    $stmt->bindParam(':correct_answers', $correctAnswers);
    $stmt->bindParam(':time_taken', $timeTaken);
    $stmt->execute();
    
    $attemptId = $db->lastInsertId();
    
    // Insert user answers
    foreach ($userAnswers as $answer) {
        $query = "INSERT INTO user_answers (attempt_id, question_id, selected_option_index, is_correct) 
                  VALUES (:attempt_id, :question_id, :selected_option, :is_correct)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':attempt_id', $attemptId);
        $stmt->bindParam(':question_id', $answer['question_id']);
        $stmt->bindParam(':selected_option', $answer['selected_option']);
        $stmt->bindParam(':is_correct', $answer['is_correct'], PDO::PARAM_BOOL);
        $stmt->execute();
    }
    
    $db->commit();
    
    echo json_encode([
        'success' => true,
        'attempt_id' => $attemptId,
        'score' => $totalScore,
        'correct_answers' => $correctAnswers,
        'total_questions' => $quiz['total_questions'],
        'percentage' => round(($correctAnswers / $quiz['total_questions']) * 100, 2)
    ]);
    
} catch (Exception $e) {
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => 'Failed to submit quiz: ' . $e->getMessage()]);
}
?>