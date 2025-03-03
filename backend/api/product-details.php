<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Подключаем файл с подключением к базе данных
require_once __DIR__ . '/../includes/db.php';

// Стартуем сессию для работы с корзиной
session_start();

// Проверяем, был ли передан параметр id в URL
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $productId = $_GET['id'];  // Получаем id, теперь это строка

    // Подготавливаем запрос, чтобы избежать SQL-инъекций
    $sql = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $productId);  // 's' означает строковый параметр
    
    // Выполняем запрос
    $stmt->execute();
    
    // Получаем результат
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        // Если товар найден, возвращаем его данные
        $product = $result->fetch_assoc();
        
        // Если запрос метода POST для добавления в корзину
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Добавляем товар в корзину
            $cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
            $productExists = false;
            
            // Проверяем, существует ли уже этот товар в корзине
            foreach ($cart as &$item) {
                if ($item['id'] == $product['id']) {
                    $item['quantity'] += 1; // Увеличиваем количество товара
                    $productExists = true;
                    break;
                }
            }
            
            // Если товара нет в корзине, добавляем его
            if (!$productExists) {
                $product['quantity'] = 1; // Если товар новый, ставим количество 1
                $cart[] = $product;
            }
            
            // Сохраняем корзину в сессию
            $_SESSION['cart'] = $cart;

            echo json_encode(["message" => "Product added to cart"]);
        } else {
            // Если товар просто запрашивается, возвращаем его
            echo json_encode($product, JSON_UNESCAPED_UNICODE);
        }
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
