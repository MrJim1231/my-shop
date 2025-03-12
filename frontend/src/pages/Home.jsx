import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'
import { API_URL } from '../api/config'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Получаем категории
        const categoryResponse = await axios.get(`${API_URL}categories.php`)
        const categories = Array.isArray(categoryResponse.data) ? categoryResponse.data : []

        let allProducts = []
        let productNames = new Set()

        // Проходим по категориям и берем по 2 товара
        for (const category of categories) {
          const productResponse = await axios.get(`${API_URL}get_products_by_category.php?category_id=${category.id}`)
          const categoryProducts = Array.isArray(productResponse.data) ? productResponse.data : []

          for (const product of categoryProducts) {
            if (!productNames.has(product.name)) {
              productNames.add(product.name)
              allProducts.push(product)
            }
            if (allProducts.length >= 10) break
          }
          if (allProducts.length >= 10) break
        }

        setProducts(allProducts)
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Популярные товары</h1>

      {loading ? (
        <div className={styles.productGrid}>
          {Array(10)
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
                    fetchpriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productPrice}>Цена: {product.price} грн</p>
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>Нет товаров.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
