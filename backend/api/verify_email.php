<?php
require_once __DIR__ . '/../includes/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['code'])) {
    echo json_encode(["status" => "error", "message" => "Email и код подтверждения обязательны"]);
    exit();
}

$email = trim($data['email']);
$code = intval($data['code']);

$sql = "SELECT verification_code FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($stored_code);
$stmt->fetch();

if ($stmt->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Email не найден"]);
    exit();
}

if ($stored_code == $code) {
    $sql_update = "UPDATE users SET is_verified = 1 WHERE email = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("s", $email);
    $stmt_update->execute();

    echo json_encode(["status" => "success", "message" => "Email успешно подтвержден"]);
} else {
    echo json_encode(["status" => "error", "message" => "Неверный код"]);
}

$stmt->close();
$conn->close();
?>
