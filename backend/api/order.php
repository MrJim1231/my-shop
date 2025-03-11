<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Если это предварительный запрос OPTIONS, сразу завершаем обработку
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php'; // Подключение к базе данных

// Получаем данные из запроса
$data = json_decode(file_get_contents("php://input"), true);

// Проверяем, что данные получены корректно
if (!isset($data['name'], $data['phone'], $data['address'], $data['items'])) {
    echo json_encode(["status" => "error", "message" => "Отсутствуют обязательные данные"]);
    exit();
}

$name = $data['name'];
$phone = $data['phone'];
$address = $data['address'];
$comment = isset($data['comment']) ? $data['comment'] : '';
$items = $data['items'];
$totalPrice = $data['totalPrice'];
$userId = $data['userId'];

// Вставляем заказ в таблицу orders (user_id может быть NULL)
$sql = "INSERT INTO orders (name, phone, address, comment, total_price, user_id) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssdi", $name, $phone, $address, $comment, $totalPrice, $userId);

// Если заказ успешно вставлен
if ($stmt->execute()) {
    // Получаем ID последнего вставленного заказа
    $orderId = $stmt->insert_id;

    // Вставляем товары в таблицу order_items
    $sql_item = "INSERT INTO order_items (order_id, product_id, quantity, price, image, size) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt_item = $conn->prepare($sql_item);

    foreach ($items as $item) {
        $stmt_item->bind_param("iiisss", $orderId, $item['product_id'], $item['quantity'], $item['price'], $item['image'], $item['size']);
        $stmt_item->execute();
    }

    echo json_encode(["status" => "success", "message" => "Заказ успешно добавлен"]);
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка при добавлении заказа"]);
}

$conn->close();
?>
