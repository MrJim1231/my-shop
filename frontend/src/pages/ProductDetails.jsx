import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          setLoading(false)
        })
        .catch((error) => {
          setError('Error loading product details')
          setLoading(false)
        })
    } else {
      setError('Product id is missing!')
      setLoading(false)
    }
  }, [id])

  // Функция для добавления товара в корзину
  const handleAddToCart = () => {
    if (product) {
      // Проверяем, есть ли уже корзина в localStorage
      const currentCart = JSON.parse(localStorage.getItem('cart')) || []

      // Проверяем, есть ли уже такой товар в корзине
      const existingProductIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingProductIndex !== -1) {
        // Если товар уже в корзине, увеличиваем его количество
        currentCart[existingProductIndex].quantity += 1
      } else {
        // Если товара нет в корзине, добавляем его с количеством 1
        product.quantity = 1
        currentCart.push(product)
      }

      // Сохраняем обновленную корзину в localStorage
      localStorage.setItem('cart', JSON.stringify(currentCart))

      alert('Продукт добавлен в корзину')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
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

      {/* Кнопка для добавления в корзину */}
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  )
}

export default ProductDetails
