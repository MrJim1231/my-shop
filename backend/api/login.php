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

// Проверка на существующий email
$sql_check = "SELECT id, password FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Неверный email или пароль"]);
    exit();
}

$stmt_check->bind_result($user_id, $hashed_password);
$stmt_check->fetch();

// Проверка пароля
if (!password_verify($password, $hashed_password)) {
    echo json_encode(["status" => "error", "message" => "Неверный email или пароль"]);
    exit();
}

// Генерация JWT
$secret_key = "your_secret_key";  // Жестко заданный секретный ключ
$issued_at = time();
$expiration_time = $issued_at + 3600;  // Время истечения (1 час)

$payload = array(
    "iat" => $issued_at,
    "exp" => $expiration_time,
    "user_id" => $user_id
);

$jwt = JWT::encode($payload, $secret_key, 'HS256');

// Отправка токена пользователю
echo json_encode(["status" => "success", "message" => "Авторизация прошла успешно", "token" => $jwt]);

$stmt_check->close();
$conn->close();
?>
