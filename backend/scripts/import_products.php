<?php
// Указываем URL с YML данными
$url = "https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=7cbe3718003f120a0fa58cc327e6bdd508667edf&price_field=price&param_name=%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80&stock_sync=true&category_id=17670&platform=prom&file_format=yml&use_import_ids=false&with_hidden=false";

// Загружаем YML-файл
$xml = simplexml_load_file($url);

if (!$xml) {
    die("Ошибка загрузки YML");
}

// Подключаем базу данных
include('../config.php');
$mysqli = new mysqli(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if ($mysqli->connect_error) {
    die("Ошибка подключения: " . $mysqli->connect_error);
}

// Функция для скачивания изображения по URL и конвертирования его в формат WEBP
function downloadAndConvertImage($imageUrl, $savePath) {
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
        // Сохраняем временное изображение
        $tempPath = 'temp_image';
        file_put_contents($tempPath, $imageData);

        // Проверка типа изображения
        $imageType = exif_imagetype($tempPath);

        if ($imageType == IMAGETYPE_JPEG) {
            // Если изображение в формате JPEG
            $img = imagecreatefromjpeg($tempPath);
        } elseif ($imageType == IMAGETYPE_PNG) {
            // Если изображение в формате PNG
            $img = imagecreatefrompng($tempPath);
        } else {
            echo "Ошибка: неподдерживаемый формат изображения: $imageUrl<br>";
            unlink($tempPath);
            return false;
        }

        // Если изображение успешно загружено
        if ($img) {
            // Преобразуем палитровое изображение в формат с полным цветом (TrueColor)
            if (imageistruecolor($img) === false) {
                $trueColorImage = imagecreatetruecolor(imagesx($img), imagesy($img));
                imagecopy($trueColorImage, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
                imagedestroy($img);
                $img = $trueColorImage;
            }

            // Конвертируем и сохраняем как WEBP
            imagewebp($img, $savePath, 80); // Качество 80 (можно настроить)

            // Освобождаем память
            imagedestroy($img);

            // Удаляем временное изображение
            unlink($tempPath);

            return true;
        } else {
            echo "Ошибка при конвертации изображения: $imageUrl<br>";
            unlink($tempPath);
            return false;
        }
    } else {
        return false;
    }
}

// Папка, куда будем сохранять изображения
$imagesDir = "../images/products/";

// Проверяем, существует ли папка для изображений, если нет — создаём её
if (!is_dir($imagesDir)) {
    mkdir($imagesDir, 0777, true);
}

// === ДОБАВЛЕНИЕ КАТЕГОРИЙ И ТОВАРОВ ===
$totalProducts = 0;

foreach ($xml->shop->offers->offer as $offer) {
    $product_id = (string)$offer['id'];
    $group_id = isset($offer['group_id']) ? (string)$offer['group_id'] : NULL;
    $category_id = (string)$offer->categoryId;
    $name = $mysqli->real_escape_string($offer->name);
    $description = $mysqli->real_escape_string($offer->description);
    $price = (float)$offer->price;
    $imageUrl = (string)$offer->picture;
    $availability = ($offer['available'] == 'true') ? 1 : 0;
    $quantity_in_stock = isset($offer->quantity_in_stock) ? (int)$offer->quantity_in_stock : 0;
    $weight = isset($offer->weight) ? (float)$offer->weight : 0.0;

    // Ищем параметр "Размер"
    $size = '';
    foreach ($offer->param as $param) {
        if ((string)$param['name'] == 'Размер') {
            $size = $mysqli->real_escape_string((string)$param);
            break;
        }
    }

    // Скачиваем и конвертируем изображение
    $imageName = basename($imageUrl, ".jpg") . ".webp";  // Получаем имя изображения и меняем расширение на .webp
    $savePath = $imagesDir . $imageName;  // Путь для сохранения изображения

    if (downloadAndConvertImage($imageUrl, $savePath)) {
        echo "Картинка сохранена и конвертирована в WEBP: $imageName<br>";
    } else {
        echo "Ошибка при скачивании или конвертации картинки: $imageName<br>";
        $savePath = ''; // Если картинка не была успешно конвертирована, оставляем путь пустым
    }

    // Проверяем, есть ли товар в базе
    $checkQuery = "SELECT id FROM products WHERE id = '$product_id'";
    $result = $mysqli->query($checkQuery);

    if ($result->num_rows == 0) {
        // Вставляем товар в базу с картинкой
        $mysqli->query("INSERT INTO products (id, group_id, category_id, name, description, price, image, size, availability, quantity_in_stock, weight) 
                        VALUES ('$product_id', " . ($group_id ? "'$group_id'" : "NULL") . ", '$category_id', '$name', '$description', $price, '$savePath', '$size', $availability, $quantity_in_stock, $weight)");
        $totalProducts++;
    }
}

$mysqli->close();

echo "Общее количество товаров: " . count($xml->shop->offers->offer) . "<br>";
echo "Добавлено в базу: " . $totalProducts . "<br>";
echo "Категории и товары обновлены!";
?>
