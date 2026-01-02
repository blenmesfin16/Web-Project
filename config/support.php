<?php
// logout.php
require_once 'config/session.php';

Auth::logout();
header('Location: login.php');
exit;
?>

<?php
// login.php (basic example)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validate and authenticate user
    // Redirect to quiz.php on success
}
?>