<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';

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

$sql = "INSERT INTO users (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Регистрация прошла успешно"]);
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка при регистрации"]);
}

$stmt->close();
$conn->close();
?>