<?php

// Указываем URL с YML данными
$url = "https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=7cbe3718003f120a0fa58cc327e6bdd508667edf&price_field=price&param_name=%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80&stock_sync=true&category_id=17670&platform=prom&file_format=yml&use_import_ids=false&with_hidden=false";

// Загружаем YML-файл
$xml = simplexml_load_file($url);

if (!$xml) {
    die("Ошибка загрузки YML");
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

// Скачиваем и конвертируем все изображения
foreach ($xml->shop->offers->offer as $offer) {
    // Если у товара несколько картинок
    $images = $offer->picture;
    if (!is_array($images)) {
        $images = [$images]; // Если только одно изображение, преобразуем в массив
    }

    // Обрабатываем каждое изображение
    foreach ($images as $image) {
        $image = (string)$image;  // Получаем ссылку на изображение
        $imageName = basename($image, ".jpg") . ".webp";  // Получаем имя изображения и меняем расширение на .webp
        $savePath = $imagesDir . $imageName;  // Путь для сохранения изображения

        // Скачиваем и конвертируем изображение
        if (downloadAndConvertImage($image, $savePath)) {
            echo "Картинка сохранена и конвертирована в WEBP: $imageName<br>";
        } else {
            echo "Ошибка при скачивании или конвертации картинки: $imageName<br>";
        }
    }
}

echo "Загрузка и конвертация изображений завершена!";

?>
