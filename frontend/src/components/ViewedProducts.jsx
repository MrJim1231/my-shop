import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'

function ViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState([])

  useEffect(() => {
    // Загружаем просмотренные товары при монтировании компонента
    const viewed = JSON.parse(localStorage.getItem('viewedProducts')) || []
    setViewedProducts(viewed)
  }, [])

  return (
    <>
      {viewedProducts.length > 0 && (
        <div>
          <h2 className={styles.viewedTitle}>Товары, которые вы просматривали</h2>
          <div className={styles.productGrid}>
            {viewedProducts.map((product, index) => {
              const imageUrl = product.image || (product.images && product.images[0])

              return (
                <div className={styles.productItem} key={product.id}>
                  <Link to={`/product/${product.id}`} className={styles.productLink}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className={styles.productImage}
                        width="250"
                        height="250"
                        decoding="async"
                        fetchpriority={index === 0 ? 'high' : 'auto'}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className={styles.noImage}>Изображение отсутствует</div>
                    )}
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productPrice}>Цена: {product.price} грн</p>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default ViewedProducts
