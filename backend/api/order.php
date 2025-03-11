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

$data = json_decode(file_get_contents("php://input"), true); // Чтение данных, отправленных в формате JSON

// Проверка на наличие необходимых данных
if (!isset($data["name"], $data["phone"], $data["address"], $data["items"], $data["totalPrice"], $data["userId"])) {
    echo json_encode(["status" => "error", "message" => "Некорректные данные"]);
    exit();
}

$name = trim($data["name"]);
$phone = trim($data["phone"]);
$address = trim($data["address"]);
$comment = isset($data["comment"]) ? trim($data["comment"]) : "";
$items = $data["items"]; // Массив товаров
$totalPrice = (float) $data["totalPrice"];
$userId = (int) $data["userId"]; // Получаем userId

// Вставка заказа в таблицу orders
$sql = "INSERT INTO orders (name, phone, address, comment, total_price, user_id) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssdi", $name, $phone, $address, $comment, $totalPrice, $userId); // Добавляем userId в запрос

if ($stmt->execute()) {
    // Получаем ID только что вставленного заказа
    $orderId = $stmt->insert_id;

    // Теперь вставляем товары в таблицу order_items
    foreach ($items as $item) {
        $productId = $item["product_id"];
        $quantity = $item["quantity"];
        $price = $item["price"];
        $image = $item["image"];
        $size = $item["size"];

        $sql_item = "INSERT INTO order_items (order_id, product_id, quantity, price, image, size) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt_item = $conn->prepare($sql_item);
        $stmt_item->bind_param("iiiiss", $orderId, $productId, $quantity, $price, $image, $size);
        $stmt_item->execute();
    }

    echo json_encode(["status" => "success", "message" => "Заказ успешно оформлен"]);
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка при оформлении заказа"]);
}

$stmt->close();
$conn->close();
?>
