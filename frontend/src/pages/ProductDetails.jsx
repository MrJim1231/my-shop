import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams() // Извлекаем id из URL
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true) // Стейт для отслеживания загрузки
  const [error, setError] = useState(null) // Стейт для ошибок

  useEffect(() => {
    if (id) {
      // Делаем запрос к API для получения информации о продукте по id
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`) // Убедитесь, что URL правильный
        .then((response) => {
          setProduct(response.data) // Сохраняем данные о продукте в состоянии
          setLoading(false) // Загрузка завершена
        })
        .catch((error) => {
          setError('Error loading product details') // Обработка ошибки
          setLoading(false) // Загрузка завершена
        })
    } else {
      setError('Product id is missing!') // Если id нет в URL
      setLoading(false) // Загрузка завершена
    }
  }, [id]) // Перезапускать эффект при изменении id в URL

  if (loading) {
    return <div>Loading...</div> // Пока данные загружаются, показываем загрузку
  }

  if (error) {
    return <div>{error}</div> // Если ошибка, показываем ее
  }

  return (
    <div className={styles.productDetails}>
      <img src={product.image} alt={product.name} className={styles.productImage} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Цена: ${product.price}</p>
      <p>Размер: {product.size}</p>
      <p>Доступность: {product.availability ? 'В наличии' : 'Нет в наличии'}</p>
      <p>Количество на складе: {product.quantity_in_stock}</p>
      <p>Вес: {product.weight} кг</p>
    </div>
  )
}

export default ProductDetails
