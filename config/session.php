<?php
// config/session.php
session_start();

class Auth {
    public static function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public static function getUser() {
        return $_SESSION['user'] ?? null;
    }

    public static function login($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user'] = $user;
    }

    public static function logout() {
        session_destroy();
        session_start();
    }

    public static function requireLogin() {
        if (!self::isLoggedIn()) {
            header("Location: login.php");
            exit();
        }
    }
}

// Auto-login for development (remove in production)
if (!Auth::isLoggedIn() && isset($_GET['auto_login'])) {
    $_SESSION['user_id'] = 1;
    $_SESSION['user'] = [
        'id' => 1,
        'username' => 'johndoe',
        'email' => 'john@example.com',
        'full_name' => 'John Doe',
        'avatar_url' => 'https://ui-avatars.com/api/?name=John+Doe&background=38bdf8&color=fff',
        'department' => 'Computer Science'
    ];
}
?>