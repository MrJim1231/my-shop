import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          setSelectedProduct(response.data) // Инициализируем выбранный товар
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

  const handleSizeChange = (size, groupId) => {
    // Ищем товар с выбранным размером в конкретной группе
    const newProduct = product.sizes[groupId]?.find((item) => item.size === size)
    if (newProduct) {
      console.log('Updated product:', newProduct) // Логируем для проверки
      setSelectedProduct({ ...newProduct }) // Обновляем выбранный товар
    }
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || []
      const existingProductIndex = currentCart.findIndex((item) => item.id === selectedProduct.id)

      if (existingProductIndex !== -1) {
        currentCart[existingProductIndex].quantity += 1
      } else {
        selectedProduct.quantity = 1
        currentCart.push(selectedProduct)
      }

      localStorage.setItem('cart', JSON.stringify(currentCart))
      alert('Продукт добавлен в корзину')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className={styles.productDetails}>
      {/* Обновляем картинку в зависимости от выбранного товара */}
      {selectedProduct && selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.productImage} />}

      <h1>{selectedProduct.name}</h1>
      <p>{selectedProduct.description}</p>
      <p>Цена: {selectedProduct.price} грн</p>
      <p>Доступность: {selectedProduct.availability ? 'В наличии' : 'Нет в наличии'}</p>
      <p>Количество на складе: {selectedProduct.quantity_in_stock}</p>

      {/* Выбор размера */}
      <div className={styles.sizeSelector}>
        <h3>Выберите размер:</h3>
        {Object.keys(product.sizes).map((groupId) => (
          <div key={groupId} className={styles.sizeGroup}>
            <h4>Группа товаров {groupId}</h4>
            {product.sizes[groupId].map((item) => (
              <button key={item.id} onClick={() => handleSizeChange(item.size, groupId)} className={selectedProduct.size === item.size ? styles.active : ''}>
                {item.size}
              </button>
            ))}
          </div>
        ))}
      </div>

      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  )
}

export default ProductDetails
