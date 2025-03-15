import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Categories.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts' // Імпортуємо компонент переглянутих товарів

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewedProducts, setViewedProducts] = useState([])

  // Завантажуємо категорії
  useEffect(() => {
    axios
      .get(`${API_URL}categories.php`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data)
        } else {
          console.error('Отримані неправильні дані:', response.data)
          setCategories([])
        }
      })
      .catch((error) => {
        console.error('Помилка при отриманні категорій:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Завантажуємо переглянуті товари з localStorage
  useEffect(() => {
    const viewedItems = JSON.parse(localStorage.getItem('viewedProducts')) || []
    setViewedProducts(viewedItems)
  }, [])

  return (
    <div className={styles.container}>
      {/* Хлібні крихти */}
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Головна
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbText}>Категорії товарів</span>
      </nav>

      <h1 className={styles.title}>Категорії товарів</h1>

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
                  alt={`Зображення категорії ${category.name}`}
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
            <p>Категорії не знайдено</p>
          )}
        </div>
      )}

      {/* Додаємо компонент для відображення товарів, які були переглянуті */}
      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default Categories
