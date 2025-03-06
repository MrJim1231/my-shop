<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Если это предварительный запрос OPTIONS, сразу завершаем обработку
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php'; // Подключение к базе данных

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["name"], $data["phone"], $data["address"], $data["items"], $data["totalPrice"])) {
    echo json_encode(["status" => "error", "message" => "Некорректные данные"]);
    exit();
}

$name = trim($data["name"]);
$phone = trim($data["phone"]);
$address = trim($data["address"]);
$comment = isset($data["comment"]) ? trim($data["comment"]) : "";
$items = json_encode($data["items"], JSON_UNESCAPED_UNICODE);
$totalPrice = (float) $data["totalPrice"];

// Подготовка SQL запроса для вставки заказа
$sql = "INSERT INTO orders (name, phone, address, comment, items, total_price) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssd", $name, $phone, $address, $comment, $items, $totalPrice);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Заказ успешно оформлен"]);
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка при оформлении заказа"]);
}

$stmt->close();
$conn->close();
?>
