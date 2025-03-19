import React, { useState } from 'react'
import styles from '../styles/ImageGallery.module.css' // Импортируем новый файл стилей

const ImageGallery = ({ images }) => {
  const [previousImage, setPreviousImage] = useState(null)

  // Убираем повторяющиеся изображения
  const uniqueImages = [...new Set(images)]

  // Если картинок больше 5, обрезаем массив
  const displayedImages = uniqueImages.length > 5 ? uniqueImages.slice(0, 5) : uniqueImages

  // Если картинок больше одной, показываем миниатюры
  const showThumbnails = displayedImages.length > 1

  // Если картинок только одна, показываем только её
  const mainImage = previousImage || displayedImages[0]

  return (
    <div className={styles.productInfo}>
      {showThumbnails && (
        <div className={styles.thumbnailContainer}>
          {displayedImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              className={styles.thumbnailImage}
              onClick={() => setPreviousImage(image)} // Изменение основного изображения при клике
            />
          ))}
        </div>
      )}

      {/* Основное изображение */}
      <div className={styles.mainImage}>
        <img
          src={mainImage} // Показываем основное изображение
          alt="Main Product Image"
          className={styles.mainImageDisplay}
        />
      </div>
    </div>
  )
}

export default ImageGallery
