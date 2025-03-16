<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['phone'], $data['address'], $data['email'], $data['items'])) {
    echo json_encode(["status" => "error", "message" => "Відсутні обов'язкові дані"]);
    exit();
}

$name = $data['name'];
$phone = $data['phone'];
$address = $data['address'];
$email = $data['email'];
$comment = isset($data['comment']) ? $data['comment'] : '';
$items = $data['items'];
$totalPrice = $data['totalPrice'];

// Если пользователь не зарегистрирован, устанавливаем user_id в NULL
$userId = isset($data['userId']) ? $data['userId'] : NULL;
$orderNumber = strtoupper(uniqid('ORD-', true));

$sql = "INSERT INTO orders (order_number, name, phone, address, email, comment, total_price, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssdi", $orderNumber, $name, $phone, $address, $email, $comment, $totalPrice, $userId);

if ($stmt->execute()) {
    $orderId = $stmt->insert_id;
    $sql_item = "INSERT INTO order_items (order_id, product_id, name, quantity, price, image, size, rubber) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_item = $conn->prepare($sql_item);
    
    foreach ($items as $item) {
        // Извлекаем название товара из таблицы products
        $sql_product_name = "SELECT name FROM products WHERE id = ?";
        $stmt_product = $conn->prepare($sql_product_name);
        $stmt_product->bind_param("i", $item['product_id']);
        $stmt_product->execute();
        $result = $stmt_product->get_result();
        $product_name = $result->fetch_assoc()['name'];

        // Вставляем данные в таблицу order_items, включая имя товара
        $rubber = isset($item['rubber']) && $item['rubber'] ? 1 : 0;
        $stmt_item->bind_param("iisisssi", $orderId, $item['product_id'], $product_name, $item['quantity'], $item['price'], $item['image'], $item['size'], $rubber);
        $stmt_item->execute();
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USERNAME'];
        $mail->Password = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
        $mail->Port = $_ENV['MAIL_PORT'];
        $mail->setFrom($_ENV['MAIL_USERNAME'], 'Ваш магазин');
        $mail->addAddress($email, $name);
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);
        $mail->Subject = "Ваше замовлення №$orderNumber";
        $mail->Body = "<h2>Дякуємо за ваше замовлення!</h2>
                       <p><strong>Номер замовлення:</strong> $orderNumber</p>
                       <p><strong>Ім'я:</strong> $name</p>
                       <p><strong>Телефон:</strong> $phone</p>
                       <p><strong>Адреса:</strong> $address</p>
                       <p><strong>Коментар:</strong> $comment</p>
                       <p><strong>Ітогова сума:</strong> $totalPrice грн</p>
                       <h3>Товари у замовленні:</h3>
                       <table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; width: 100%;'>
                           <thead>
                               <tr>
                                   <th style='text-align: center;'>Фото</th>
                                   <th style='text-align: center;'>Назва</th>
                                   <th style='text-align: center;'>Кількість</th>
                                   <th style='text-align: center;'>Ціна</th>
                                   <th style='text-align: center;'>Розмір</th>
                                   <th style='text-align: center;'>На резинці</th>
                               </tr>
                           </thead>
                           <tbody>";

        foreach ($items as $item) {
            $rubberText = isset($item['rubber']) && $item['rubber'] ? 'Так' : 'Ні';
            
            // Добавляем изображение товара
            $imageHtml = "";
            if (!empty($item['image'])) {
                $imageHtml = "<img src='" . $item['image'] . "' alt='" . $product_name . "' style='max-width: 100px; display: block; margin: 0 auto;'>";
            }

            $mail->Body .= "<tr>
                                <td style='text-align: center;'>$imageHtml</td>
                                <td style='text-align: center;'>{$product_name}</td>
                                <td style='text-align: center;'>{$item['quantity']}</td>
                                <td style='text-align: center;'>{$item['price']} грн</td>
                                <td style='text-align: center;'>{$item['size']}</td>
                                <td style='text-align: center;'>$rubberText</td>
                            </tr>";
        }

        $mail->Body .= "</tbody></table>";
        
        if ($mail->send()) {
            echo json_encode(["status" => "success", "message" => "Замовлення успішно додано і лист надіслано"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Не вдалося надіслати лист"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Помилка при надсиланні листа: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Помилка при додаванні замовлення"]);
}

$conn->close();
?>
