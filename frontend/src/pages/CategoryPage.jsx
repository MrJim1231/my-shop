import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import styles from '../styles/CategoryPage.module.css'

function CategoryPage() {
  const { categoryId } = useParams() // Получаем categoryId из URL
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Отправляем запрос на сервер для получения товаров, которые принадлежат выбранной категории по categoryId
    axios
      .get(`http://localhost/my-shop/backend/api/get_products_by_category.php?category_id=${categoryId}`)
      .then((response) => {
        // Фильтруем товары, оставляя только уникальные по имени
        const uniqueProducts = response.data.filter((product, index, self) => index === self.findIndex((p) => p.name === product.name))
        setProducts(uniqueProducts) // Записываем уникальные товары в state
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка при получении товаров:', error)
        setLoading(false)
      })
  }, [categoryId]) // Эффект сработает при изменении categoryId

  return (
    <div className={styles.categoryPage}>
      <h1>Товары в категории: {categoryId}</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className={styles['product-list']}>
          {products.length > 0 ? (
            products.map((product) => (
              <div className={styles['product-item']} key={product.id}>
                <a href={`/product/${product.id}`}>
                  <img
                    src={product.image} // Изображение товара из базы данных
                    alt={product.name}
                    className={styles['product-image']}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.price} грн</p>
                  <p className={styles['product-size']}>Размер: {product.size}</p>
                </a>
              </div>
            ))
          ) : (
            <p>Нет товаров в этой категории.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
