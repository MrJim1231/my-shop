<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';  // Путь к autoload файлу Composer

use \Firebase\JWT\JWT;

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Email и пароль обязательны"]);
    exit();
}

$email = trim($data['email']);
$password = trim($data['password']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Некорректный email"]);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(["status" => "error", "message" => "Пароль должен быть не менее 6 символов"]);
    exit();
}

// Проверка на существующий email
$sql_check = "SELECT id FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email уже зарегистрирован"]);
    exit();
}

// Хеширование пароля
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Вставка нового пользователя в базу данных
$sql = "INSERT INTO users (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashed_password);

try {
    if ($stmt->execute()) {
        // Генерация JWT после успешной регистрации
        $user_id = $stmt->insert_id;
        $secret_key = "your_secret_key";  // Жестко заданный секретный ключ
        $issued_at = time();
        $expiration_time = $issued_at + 3600;  // Время истечения (1 час)

        // Плейлоуд для JWT
        $payload = array(
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "user_id" => $user_id
        );

        // Генерация токена с алгоритмом 'HS256'
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        // Отправка токена пользователю
        echo json_encode(["status" => "success", "message" => "Регистрация прошла успешно", "token" => $jwt]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка при регистрации"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Ошибка при генерации токена: " . $e->getMessage()]);
}

$stmt->close();
$conn->close();
