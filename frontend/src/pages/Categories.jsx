import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../styles/Categories.module.css'

function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Отправка запроса на сервер для получения категорий
    axios
      .get('http://localhost/my-shop/backend/api/categories.php')
      .then((response) => {
        // Проверяем, что данные действительно массив
        if (Array.isArray(response.data)) {
          setCategories(response.data) // Записываем данные о категориях в state
        } else {
          console.error('Получены неправильные данные:', response.data)
          setCategories([]) // Инициализируем пустым массивом, если данные не корректные
        }
      })
      .catch((error) => {
        console.error('Ошибка при получении категорий:', error)
      })
  }, [])

  return (
    <div className={styles.categories}>
      <h1>Категории товаров</h1>
      <div className={styles['category-list']}>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div className={styles['category-item']} key={category.id}>
              <img
                src={category.image} // Например, изображение категории из базы данных
                alt={category.name}
                className={styles['category-image']}
              />
              <h3>{category.name}</h3>
              <Link to={`/category/${category.id}`}>Перейти</Link> {/* Используем category.id */}
            </div>
          ))
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </div>
  )
}

export default Categories
