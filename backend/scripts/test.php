<?php

// Указываем URL с YML данными
$url = "https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=7cbe3718003f120a0fa58cc327e6bdd508667edf&price_field=price&param_name=%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80&stock_sync=true&category_id=17670&platform=prom&file_format=yml&use_import_ids=false&with_hidden=false";

// Загружаем YML-файл
$xml = simplexml_load_file($url);

if (!$xml) {
    die("Ошибка загрузки YML");
}

// Функция для скачивания изображения по URL и сохранения в папку
function downloadImage($imageUrl, $savePath) {
    // Инициализация cURL
    $ch = curl_init($imageUrl);
    
    // Устанавливаем дополнительные параметры cURL
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Возвращать результат как строку
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Следовать за редиректами
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'); // Устанавливаем User-Agent
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Тайм-аут для cURL
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Отключаем проверку SSL-сертификата

    // Получаем данные изображения
    $imageData = curl_exec($ch);

    // Проверка на ошибку cURL
    if(curl_errno($ch)) {
        echo 'Ошибка cURL: ' . curl_error($ch) . "<br>";
        curl_close($ch);
        return false;
    }

    curl_close($ch);

    // Если картинка была успешно загружена
    if ($imageData !== false) {
        // Сохраняем картинку в папку
        file_put_contents($savePath, $imageData);
        return true;
    } else {
        // Ошибка при скачивании
        return false;
    }
}

// Папка, куда будем сохранять изображения
$imagesDir = "../images/products/";

// Проверяем, существует ли папка для изображений, если нет — создаём её
if (!is_dir($imagesDir)) {
    mkdir($imagesDir, 0777, true);
}

// Скачиваем все изображения
foreach ($xml->shop->offers->offer as $offer) {
    $image = (string)$offer->picture;  // Получаем ссылку на изображение
    $imageName = basename($image);  // Получаем имя изображения (например, "4182040-86eb6a6b96e2e9596fbe.jpg")
    $savePath = $imagesDir . $imageName;  // Путь для сохранения изображения

    // Скачиваем и сохраняем изображение
    if (downloadImage($image, $savePath)) {
        echo "Картинка сохранена: $imageName<br>";
    } else {
        echo "Ошибка при скачивании картинки: $imageName<br>";
    }
}

echo "Загрузка изображений завершена!";

?>
