import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import styles from '../styles/CategoryPage.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts' // імпортуємо компонент для відображення переглянутих товарів
import useViewedProducts from '../hooks/useViewedProducts' // імпортуємо хук для роботи з переглянутими товарами
import DiscountPrice from '../components/DiscountPrice'

function CategoryPage() {
  const { categoryId } = useParams()
  const [categoryName, setCategoryName] = useState('Завантаження...') // Назва категорії
  const [products, setProducts] = useState([]) // Усі товари для категорії
  const [loading, setLoading] = useState(true)

  // Використовуємо кастомний хук для роботи з переглянутими товарами
  const { viewedProducts, addViewedProduct } = useViewedProducts()

  // Завантажуємо дані про категорію
  useEffect(() => {
    axios
      .get(`${API_URL}get_category_by_id.php?category_id=${categoryId}`) // Виправлений запит
      .then((response) => {
        if (response.data.name) {
          setCategoryName(response.data.name) // Зберігаємо назву категорії
        } else {
          console.warn('Категорія не знайдена, ID:', categoryId)
          setCategoryName('Категорія не знайдена')
        }
      })
      .catch((error) => {
        console.error('Помилка при отриманні даних про категорію:', error)
        setCategoryName('Помилка завантаження категорії')
      })
  }, [categoryId])

  useEffect(() => {
    // Завантажуємо дані про товари для конкретної категорії
    axios
      .get(`${API_URL}get_products_by_category.php?category_id=${categoryId}`)
      .then((response) => {
        // Видаляємо дублікати товарів
        const uniqueProducts = response.data.filter((product, index, self) => index === self.findIndex((p) => p.name === product.name))
        setProducts(uniqueProducts)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Помилка при отриманні товарів:', error)
        setLoading(false)
      })
  }, [categoryId])

  return (
    <div className={styles.container}>
      {/* Хлібні крихти */}
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Головна
        </Link>
        <span className={styles.separator}>/</span>
        <Link to="/categories" className={styles.breadcrumbLink}>
          Категорії товарів
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbText}>Товари в категорії {categoryName}</span>
      </nav>

      <h1 className={styles.title}>Товари в категорії</h1>

      {loading ? (
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
                <Link
                  to={`/product/${product.id}`}
                  className={styles.productLink}
                  onClick={() => addViewedProduct({ ...product, categoryName })} // Додаємо товар до списку переглянутих
                >
                  <div className={styles.productImages}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={styles.productImage}
                        width="250"
                        height="250"
                        decoding="async"
                        fetchpriority={index === 0 ? 'high' : 'auto'}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <p>Зображення недоступне</p>
                    )}
                  </div>

                  <h2 className={styles.productName}>{product.name}</h2>
                  <DiscountPrice price={product.price} parentCategoryName={categoryName} categoryName={categoryName} />
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>Немає товарів у цій категорії.</p>
          )}
        </div>
      )}

      {/* Секція з переглянутими товарами */}
      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default CategoryPage
