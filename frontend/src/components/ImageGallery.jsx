import React from 'react'
import styles from '../styles/ImageGallery.module.css' // Импортируем новый файл стилей

const ImageGallery = ({ images, setPreviousImage, previousImage }) => {
  // Обрезаем массив изображений, если их больше 5
  const displayedImages = images.length > 5 ? images.slice(0, 5) : images

  return (
    <div className={styles.productInfo}>
      {displayedImages && displayedImages.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {displayedImages.map((image, index) => (
            <img key={index} src={image} alt={`Product Image ${index + 1}`} className={styles.thumbnailImage} onClick={() => setPreviousImage(image)} />
          ))}
        </div>
      )}

      <div className={styles.mainImage}>
        {previousImage ? <img src={previousImage} alt="Main Product Image" className={styles.mainImageDisplay} /> : <div className={styles.noImage}>Изображения отсутствуют</div>}
      </div>
    </div>
  )
}

export default ImageGallery
