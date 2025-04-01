import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts'
import useViewedProducts from '../hooks/useViewedProducts'
import DiscountPrice from '../components/DiscountPrice'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { viewedProducts, addViewedProduct } = useViewedProducts()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const categoryResponse = await axios.get(`${API_URL}categories.php`)
        const categories = Array.isArray(categoryResponse.data) ? categoryResponse.data : []

        let allProducts = []
        let productNames = new Set()

        for (const category of categories) {
          const productResponse = await axios.get(`${API_URL}get_products_by_category.php?category_id=${category.id}`)
          const categoryProducts = Array.isArray(productResponse.data) ? productResponse.data : []

          for (const product of categoryProducts) {
            if (!productNames.has(product.name)) {
              productNames.add(product.name)
              product.categoryName = category.name
              allProducts.push(product)
            }
            if (allProducts.length >= 10) break
          }
          if (allProducts.length >= 10) break
        }

        setProducts(allProducts)
      } catch (error) {
        console.error('Помилка під час завантаження товарів:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Популярні товари</h1>

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
            products.map((product, index) => {
              const imageUrl = product.image || (product.images && product.images[0])

              return (
                <div className={styles.productItem} key={product.id}>
                  <Link to={`/product/${product.id}`} className={styles.productLink} onClick={() => addViewedProduct(product)}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`Комплект постільної білизни ${product.name}`}
                        className={styles.productImage}
                        width="250"
                        height="250"
                        decoding="async"
                        fetchpriority={index === 0 ? 'high' : 'auto'}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className={styles.noImage}>Зображення відсутнє</div>
                    )}
                    <h2 className={styles.productName}>Комплект постільної білизни {product.name}</h2>
                    <DiscountPrice price={product.price} categoryName={product.categoryName} />
                  </Link>
                </div>
              )
            })
          ) : (
            <p className={styles.noProducts}>Немає товарів.</p>
          )}
        </div>
      )}

      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default Home
