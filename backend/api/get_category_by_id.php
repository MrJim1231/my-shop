<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';

$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;

if (!$category_id) {
    echo json_encode(["error" => "Не указан ID категории"], JSON_UNESCAPED_UNICODE);
    exit();
}

// Запрос к базе данных для получения имени категории
$stmt = $conn->prepare("SELECT id, name FROM categories WHERE id = ?");
$stmt->bind_param('i', $category_id);
$stmt->execute();
$result = $stmt->get_result();
$category = $result->fetch_assoc();

if ($category) {
    echo json_encode($category, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Категория не найдена"], JSON_UNESCAPED_UNICODE);
}
?>
