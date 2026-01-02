<?php
// api/get_quiz_details.php
require_once '../config/session.php';
require_once '../config/database.php';

Auth::requireLogin();

$quizId = $_GET['id'] ?? 0;

$database = new Database();
$db = $database->getConnection();

// Get quiz details
$query = "SELECT q.*, 
                 (SELECT COUNT(*) FROM quiz_attempts 
                  WHERE quiz_id = q.id AND user_id = :user_id) as has_attempt
          FROM quizzes q
          WHERE q.id = :quiz_id";
          
$stmt = $db->prepare($query);
$stmt->bindParam(':quiz_id', $quizId);
$stmt->bindParam(':user_id', $_SESSION['user_id']);
$stmt->execute();
$quiz = $stmt->fetch(PDO::FETCH_ASSOC);

if ($quiz) {
    // Get user attempts for this quiz
    $query = "SELECT * FROM quiz_attempts 
              WHERE quiz_id = :quiz_id AND user_id = :user_id
              ORDER BY completed_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':quiz_id', $quizId);
$stmt->bindParam(':user_id', $_SESSION['user_id']);
$stmt->execute();
$attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'quiz' => $quiz,
    'attempts' => $attempts
]);
} else {
echo json_encode([
    'success' => false,
    'message' => 'Quiz not found'
]);
}
?>