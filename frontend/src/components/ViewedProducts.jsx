import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/ViewedProducts.module.css'
import DiscountPrice from '../components/DiscountPrice'

function ViewedProducts({ viewedProducts }) {
  // Ограничиваем отображение до последних 4 товаров
  const recentViewedProducts = viewedProducts.slice(0, 4)

  return (
    <div className={styles.viewedProductsSection}>
      <h2 className={styles.title}>Товары, которые вы просматривали</h2>
      <div className={styles.productGrid}>
        {recentViewedProducts.length > 0 ? (
          recentViewedProducts.map((product, index) => {
            const imageUrl = product.image || (product.images && product.images[0])

            return (
              <div key={product.id} className={styles.productItem}>
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
                  <DiscountPrice price={product.price} categoryName={product.categoryName} />
                </Link>
              </div>
            )
          })
        ) : (
          <p>Вы еще не просматривали товары.</p>
        )}
      </div>
    </div>
  )
}

export default ViewedProducts
