<?php
// Разрешаем доступ с любого источника
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Проверяем preflight-запрос (OPTIONS) и завершаем выполнение, если он есть
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключаем файл с подключением к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем category_id из GET-запроса
$category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;

// Если category_id указан, выбираем товары для этой категории
if ($category_id > 0) {
    // Запрос для получения товаров, которые принадлежат выбранной категории по category_id
    $sql = "SELECT * FROM products WHERE category_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $category_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Получаем все товары
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    // Выводим товары в формате JSON
    echo json_encode($products);
} else {
    // Если category_id не был передан, выводим ошибку
    echo json_encode(["error" => "Invalid category ID"]);
}
?>
