import React from 'react'
import styles from '../styles/ImageGallery.module.css' // Импортируем новый файл стилей

const ImageGallery = ({ images, setPreviousImage, previousImage }) => {
  return (
    <div className={styles.productInfo}>
      {images && images.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {images.map((image, index) => (
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
