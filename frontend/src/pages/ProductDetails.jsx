import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          setSimilarProducts(response.data.sizes || []) // Сохраняем массив с похожими товарами
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

  const handleAddToCart = () => {
    if (product) {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || []
      const existingProductIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingProductIndex !== -1) {
        currentCart[existingProductIndex].quantity += 1
      } else {
        product.quantity = 1
        currentCart.push(product)
      }

      localStorage.setItem('cart', JSON.stringify(currentCart))
      alert('Продукт добавлен в корзину')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

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
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>

      {/* Блок с доступными размерами */}
      {similarProducts.length > 0 && (
        <div className={styles.similarProducts}>
          <h2>Другие размеры этого товара:</h2>
          <ul>
            {similarProducts.map((item) => (
              <li key={item.id}>
                Размер: {item.size} | Цена: ${item.price} | {item.availability ? 'В наличии' : 'Нет в наличии'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
