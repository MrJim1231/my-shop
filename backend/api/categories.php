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

// Запрос к базе данных для получения всех категорий (без исключений)
$sql = "SELECT * FROM categories";  // Убираем исключения
$result = $conn->query($sql);

// Если запрос успешен, получаем все категории
$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

// Выводим категории в формате JSON
echo json_encode($categories);
?>
