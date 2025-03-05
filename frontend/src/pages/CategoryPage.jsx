import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import styles from '../styles/CategoryPage.module.css'

function CategoryPage() {
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем данные о товарах для конкретной категории
    axios
      .get(`http://localhost/my-shop/backend/api/get_products_by_category.php?category_id=${categoryId}`)
      .then((response) => {
        // Убираем дублирующиеся товары
        const uniqueProducts = response.data.filter((product, index, self) => index === self.findIndex((p) => p.name === product.name))
        setProducts(uniqueProducts)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка при получении товаров:', error)
        setLoading(false)
      })
  }, [categoryId])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Товары в категории</h1>

      {loading ? (
        // Скелетоны загрузки вместо резких сдвигов контента
        <div className={styles.productGrid}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className={styles.productItem} key={product.id}>
                <Link to={`/product/${product.id}`} className={styles.productLink}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                    width="250"
                    height="250"
                    decoding="async"
                    fetchpriority={index === 0 ? 'high' : 'auto'} // Приоритет загрузки первого изображения
                    loading={index === 0 ? 'eager' : 'lazy'} // Первое изображение загружается сразу, другие — лениво
                    // style={{ minHeight: '250px', backgroundColor: '#f0f0f0' }}
                  />
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productPrice}>Цена: {product.price} грн</p>
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>Нет товаров в этой категории.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
