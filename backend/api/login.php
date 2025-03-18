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
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api'); 
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Email и пароль обязательны"]);
    exit();
}

$email = trim($data['email']);
$password = trim($data['password']);

$sql_check = "SELECT id, password, is_verified FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Неверный email или пароль"]);
    exit();
}

$stmt_check->bind_result($user_id, $hashed_password, $is_verified);
$stmt_check->fetch();

// Если пароль неверный
if (!password_verify($password, $hashed_password)) {
    echo json_encode(["status" => "error", "message" => "Неверный email или пароль"]);
    exit();
}

// Если email не подтвержден
if (!$is_verified) {
    // Генерируем новый код подтверждения
    $verification_code = (string) random_int(100000, 999999);


    // Обновляем код в базе
    $sql_update_code = "UPDATE users SET verification_code = ? WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update_code);
    $stmt_update->bind_param("ss", $verification_code, $user_id);
    $stmt_update->execute();
    $stmt_update->close();

    // Отправляем письмо с кодом
    if (sendVerificationEmail($email, $verification_code)) {
        echo json_encode([
            "status" => "verification_required",
            "message" => "Email не подтвержден. Код повторно отправлен на почту",
            "userId" => $user_id
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка при отправке письма с кодом"]);
    }
    exit();
}

// Генерация JWT
$secret_key = $_ENV['JWT_SECRET_KEY'];
if (!$secret_key) {
    echo json_encode(["status" => "error", "message" => "JWT_SECRET_KEY не задан"]);
    exit();
}

$issued_at = time();
$expiration_time = $issued_at + 3600;

$payload = [
    "iat" => $issued_at,
    "exp" => $expiration_time,
    "user_id" => $user_id
];

$jwt = JWT::encode($payload, $secret_key, 'HS256');

echo json_encode([
    "status" => "success",
    "message" => "Авторизация успешна",
    "token" => $jwt,
    "userId" => $user_id
]);

$stmt_check->close();
$conn->close();

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
        $mail->CharSet = 'UTF-8';
        $mail->Subject = "Повторный код подтверждения";
        $mail->Body = "Ваш новый код подтверждения: <b>$verification_code</b>";

        return $mail->send();
    } catch (Exception $e) {
        return false;
    }
}

?>
