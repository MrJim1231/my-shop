<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Подключаем файл с подключением к базе данных
require_once __DIR__ . '/../includes/db.php';

// Проверяем, был ли передан параметр id в URL
if (isset($_GET['id'])) {
    $productId = $_GET['id'];

    // Подготавливаем запрос, чтобы избежать SQL-инъекций
    $sql = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $productId); // 'i' означает, что параметр это integer (целое число)
    
    // Выполняем запрос
    $stmt->execute();
    
    // Получаем результат
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        // Если товар найден, возвращаем его данные
        $product = $result->fetch_assoc();
        echo json_encode($product, JSON_UNESCAPED_UNICODE);
    } else {
        // Если товар с таким id не найден, возвращаем ошибку 404
        http_response_code(404);
        echo json_encode(["message" => "Product not found"]);
    }
} else {
    // Если параметр id не был передан, возвращаем ошибку
    http_response_code(400);
    echo json_encode(["message" => "Product ID is required"]);
}
?>
