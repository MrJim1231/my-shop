import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Categories.module.css'
import { API_URL } from '../api/config'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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
                  src={`http://localhost/my-shop/backend/${category.image.replace(/^(\.\.\/)+/, '')}`} // Формируем правильный путь
                  alt={`Изображение категории ${category.name}`} // Описательное alt-описание
                  className={styles.categoryImage}
                  width="250"
                  height="250"
                  decoding="async"
                  fetchpriority={index === 0 ? 'high' : 'auto'} // Оптимизация LCP
                  loading={index === 0 ? 'eager' : 'lazy'} // Первое изображение загружается сразу
                />
                <h2 className={styles.categoryName}>{category.name}</h2>
              </Link>
            ))
          ) : (
            <p>Категории не найдены</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Categories
