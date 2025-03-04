import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Categories.module.css'

function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost/my-shop/backend/api/categories.php')
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
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Категории товаров</h1>
      <div className={styles.categoryGrid}>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <Link to={`/category/${category.id}`} key={category.id} className={styles.categoryItem}>
              <img src={category.image} alt={category.name} className={styles.categoryImage} />
              <h3>{category.name}</h3>
            </Link>
          ))
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </div>
  )
}

export default Categories
