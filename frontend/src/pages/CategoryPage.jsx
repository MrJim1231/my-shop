import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import styles from '../styles/CategoryPage.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts' // импорт компонента для отображения просмотренных товаров
import useViewedProducts from '../hooks/useViewedProducts' // импорт хука для работы с просмотренными товарами

function CategoryPage() {
  const { categoryId } = useParams()
  const [categoryName, setCategoryName] = useState('Загрузка...') // Имя категории
  const [products, setProducts] = useState([]) // Все товары для категории
  const [loading, setLoading] = useState(true)

  // Используем кастомный хук для работы с просмотренными товарами
  const { viewedProducts, addViewedProduct } = useViewedProducts()

  // Загружаем данные о категории
  useEffect(() => {
    axios
      .get(`${API_URL}get_category_by_id.php?category_id=${categoryId}`) // Исправленный запрос
      .then((response) => {
        if (response.data.name) {
          setCategoryName(response.data.name) // Сохраняем имя категории
        } else {
          console.warn('Категория не найдена, ID:', categoryId)
          setCategoryName('Категория не найдена')
        }
      })
      .catch((error) => {
        console.error('Ошибка при получении данных о категории:', error)
        setCategoryName('Ошибка загрузки категории')
      })
  }, [categoryId])

  useEffect(() => {
    // Загружаем данные о товарах для конкретной категории
    axios
      .get(`${API_URL}get_products_by_category.php?category_id=${categoryId}`)
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
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Главная
        </Link>
        <span className={styles.separator}>/</span>
        <Link to="/categories" className={styles.breadcrumbLink}>
          Категории товаров
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbText}>Товары в категории {categoryName}</span>
      </nav>

      <h1 className={styles.title}>Товары в категории</h1>

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
                  onClick={() => addViewedProduct(product)} // Добавляем товар в список просмотренных
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
                      <p>Изображение недоступно</p>
                    )}
                  </div>

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

      {/* Секция с просмотренными товарами */}
      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default CategoryPage
