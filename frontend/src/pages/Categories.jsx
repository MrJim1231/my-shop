import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Categories.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts' // Импортируем компонент просмотренных товаров

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewedProducts, setViewedProducts] = useState([])

  // Загружаем категории
  useEffect(() => {
    axios
      .get(`${API_URL}categories.php`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data)
        } else {
          console.error('Получены неправильные данные:', response.data)
          setCategories([])
        }
      })
      .catch((error) => {
        console.error('Ошибка при получении категорий:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Загружаем просмотренные товары из localStorage
  useEffect(() => {
    const viewedItems = JSON.parse(localStorage.getItem('viewedProducts')) || []
    setViewedProducts(viewedItems)
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Категории товаров</h1>

      {loading ? (
        <div className={styles.categoryGrid}>
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
        <div className={styles.categoryGrid}>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link to={`/category/${category.id}`} key={category.id} className={styles.categoryItem}>
                <img
                  src={category.image}
                  alt={`Изображение категории ${category.name}`}
                  className={styles.categoryImage}
                  width="250"
                  height="250"
                  decoding="async"
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <h2 className={styles.categoryName}>{category.name}</h2>
              </Link>
            ))
          ) : (
            <p>Категории не найдены</p>
          )}
        </div>
      )}

      {/* Добавляем компонент для отображения товаров, которые были просмотрены */}
      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default Categories
