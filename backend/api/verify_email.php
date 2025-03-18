<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;

// Загружаем переменные окружения из .env файла
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api'); // Указываем путь к папке, где находится .env
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['code'])) {
    echo json_encode(["status" => "error", "message" => "Email и код подтверждения обязательны"]);
    exit();
}

$email = trim($data['email']);
$code = intval($data['code']);

$sql = "SELECT id, verification_code FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($user_id, $stored_code);
$stmt->fetch();

if ($stmt->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Email не найден"]);
    exit();
}

if ($stored_code == $code) {
    // Обновляем статус пользователя на подтвержден
    $sql_update = "UPDATE users SET is_verified = 1 WHERE email = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("s", $email);
    $stmt_update->execute();

    // Генерация JWT токена
    $secret_key = $_ENV['JWT_SECRET_KEY']; // Ключ для подписи токена (должен быть в .env файле)

    if (!$secret_key) {
        echo json_encode(["status" => "error", "message" => "JWT_SECRET_KEY не задан в .env файле"]);
        exit();
    }

    $issued_at = time();
    $expiration_time = $issued_at + 3600;  // Токен будет действителен 1 час
    $payload = [
        'iat' => $issued_at,  // Время создания
        'exp' => $expiration_time,  // Время истечения
        'sub' => $user_id  // Идентификатор пользователя
    ];

    try {
        $jwt = JWT::encode($payload, $secret_key, 'HS256'); // Добавляем алгоритм подписи 'HS256'
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Ошибка при генерации токена: " . $e->getMessage()]);
        exit();
    }

    // Отправляем успешный ответ с токеном
    echo json_encode([
        "status" => "success",
        "message" => "Email успешно подтвержден",
        "token" => $jwt,
        "userId" => $user_id  // Возвращаем userId
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Неверный код"]);
}

$stmt->close();
$conn->close();
?>
