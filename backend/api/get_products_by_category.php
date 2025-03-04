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

if ($category_id > 0) {
    // Получаем все подкатегории для выбранной категории
    $subcategories_query = "SELECT id FROM categories WHERE parent_id = ?";
    $stmt = $conn->prepare($subcategories_query);
    $stmt->bind_param('i', $category_id);
    $stmt->execute();
    $subcategories_result = $stmt->get_result();

    // Формируем список всех категорий, включая подкатегории
    $all_categories = [$category_id];
    while ($subcategory = $subcategories_result->fetch_assoc()) {
        $all_categories[] = $subcategory['id'];
    }

    // Преобразуем массив в строку для SQL-запроса
    $categories_list = implode(',', $all_categories);

    // Запрос на получение товаров для всех выбранных категорий
    $query = "SELECT * FROM products WHERE category_id IN ($categories_list)";
    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
} else {
    echo json_encode(["error" => "Invalid category ID"]);
}
?>
