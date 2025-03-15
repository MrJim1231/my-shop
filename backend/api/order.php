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
require_once __DIR__ . '/../vendor/autoload.php'; // Подключаем autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Загружаем переменные из .env файла
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Получаем данные из запроса
$data = json_decode(file_get_contents("php://input"), true);

// Проверяем, что данные получены корректно
if (!isset($data['name'], $data['phone'], $data['address'], $data['email'], $data['items'])) {
    echo json_encode(["status" => "error", "message" => "Відсутні обов'язкові дані"]);
    exit();
}

$name = $data['name'];
$phone = $data['phone'];
$address = $data['address'];
$email = $data['email']; // Получаем email из запроса
$comment = isset($data['comment']) ? $data['comment'] : '';
$items = $data['items'];
$totalPrice = $data['totalPrice'];
$userId = $data['userId'];

// Вставляем заказ в таблицу orders (без comment2)
$sql = "INSERT INTO orders (name, phone, address, email, comment, total_price, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $name, $phone, $address, $email, $comment, $totalPrice, $userId);

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

    // Отправка письма
    $mail = new PHPMailer(true);
    try {
        // Настройки SMTP
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST']; // SMTP-сервер из .env
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USERNAME']; // Логин из .env
        $mail->Password = $_ENV['MAIL_PASSWORD']; // Пароль из .env
        $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION']; // Шифрование из .env
        $mail->Port = $_ENV['MAIL_PORT']; // Порт из .env

        $mail->setFrom($_ENV['MAIL_USERNAME'], 'Ваш магазин'); // От кого
        $mail->addAddress($email, $name); // Кому (email из формы)

        // Устанавливаем кодировку
        $mail->CharSet = 'UTF-8';

        // Тема и тело письма
        $mail->isHTML(true);
        $mail->Subject = "Ваше замовлення №$orderId";
        $mail->Body = "
            <h2>Дякуємо за ваше замовлення!</h2>
            <p><strong>Номер замовлення:</strong> $orderId</p>
            <p><strong>Ім'я:</strong> $name</p>
            <p><strong>Телефон:</strong> $phone</p>
            <p><strong>Адреса:</strong> $address</p>
            <p><strong>Коментар:</strong> $comment</p>
            <p><strong>Ітогова сума:</strong> $totalPrice грн</p>
            <h3>Товари у замовленні:</h3>
            <ul>
        ";

        foreach ($items as $item) {
            $mail->Body .= "
                <li>
                    <strong>Назва:</strong> {$item['name']}<br>
                    <strong>Кількість:</strong> {$item['quantity']}<br>
                    <strong>Ціна:</strong> {$item['price']} грн<br>
                    <strong>Розмір:</strong> {$item['size']}
                </li>
            ";
        }

        $mail->Body .= "</ul>";

        // Отправка письма
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
