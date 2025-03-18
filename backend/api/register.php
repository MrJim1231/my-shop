<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Загружаем переменные окружения из .env файла
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api'); // Указываем путь к папке, где находится .env
$dotenv->load();


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Email и пароль обязательны"]);
    exit();
}

$email = trim($data['email']);
$password = trim($data['password']);

// Проверяем, передан ли userId, если нет - генерируем новый
$user_id = isset($data['userId']) ? $data['userId'] : uniqid();

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Некорректный email"]);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(["status" => "error", "message" => "Пароль должен быть не менее 6 символов"]);
    exit();
}

// Проверка на существующий email
$sql_check = "SELECT id, is_verified FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();
$stmt_check->bind_result($existing_id, $is_verified);
$stmt_check->fetch();

if ($stmt_check->num_rows > 0) {
    if ($is_verified) {
        echo json_encode(["status" => "error", "message" => "Email уже зарегистрирован и подтвержден"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email уже зарегистрирован, но не подтвержден. Проверьте почту"]);
    }
    exit();
}

// Хешируем пароль
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Генерируем код подтверждения (6 цифр)
$verification_code = (string) random_int(100000, 999999);

// Вставляем нового пользователя в базу
$sql = "INSERT INTO users (id, email, password, verification_code, is_verified) VALUES (?, ?, ?, ?, 0)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $user_id, $email, $hashed_password, $verification_code);

try {
    if ($stmt->execute()) {
        // Отправляем код на почту
        if (sendVerificationEmail($email, $verification_code)) {
            echo json_encode([
                "status" => "success",
                "message" => "Регистрация прошла успешно. Проверьте почту для подтверждения",
                "userId" => $user_id
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Ошибка при отправке письма с кодом подтверждения"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка при регистрации"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Ошибка при регистрации: " . $e->getMessage()]);
}

$stmt->close();
$conn->close();

// Функция отправки письма
function sendVerificationEmail($email, $verification_code)
{
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USERNAME'];
        $mail->Password = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
        $mail->Port = $_ENV['MAIL_PORT'];

        $mail->setFrom($_ENV['ADMIN_EMAIL'], 'Your Website');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';  // Устанавливаем правильную кодировку
        $mail->Subject = "Код подтверждения регистрации";
        $mail->Body = "Ваш код подтверждения: <b>$verification_code</b>";

        // Убедитесь, что тело письма в кодировке UTF-8
        $mail->Body = mb_convert_encoding($mail->Body, 'UTF-8', 'auto');

        return $mail->send();
    } catch (Exception $e) {
        return false;
    }
}

?>
