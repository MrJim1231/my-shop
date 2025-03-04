import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSizeType, setSelectedSizeType] = useState('50*70') // Размер наволочки
  const [selectedSetSize, setSelectedSetSize] = useState('1,5сп') // Размер комплекта
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          const firstProduct = Object.values(response.data.sizes).flat()[0] // Выбираем первый товар из всех групп
          setSelectedProduct(firstProduct)
          setLoading(false)
        })
        .catch(() => {
          setError('Ошибка при загрузке товара')
          setLoading(false)
        })
    }
  }, [id])

  // Обработка изменения комплекта
  const handleSetSizeChange = (setSize) => {
    setSelectedSetSize(setSize)
    const firstProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(setSize) && item.size.includes(selectedSizeType))
    setSelectedProduct(firstProduct)
  }

  // Обработка изменения размера наволочки
  const handleSizeTypeChange = (sizeType) => {
    setSelectedSizeType(sizeType)
    const firstProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(selectedSetSize) && item.size.includes(sizeType))
    setSelectedProduct(firstProduct)
  }

  const handleSizeChange = (product) => {
    setSelectedProduct(product)
  }

  const handleAddToCart = () => {
    console.log('Добавляем в корзину товар:', selectedProduct)
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const index = cart.findIndex((item) => item.id === selectedProduct.id)

    if (index !== -1) {
      cart[index].quantity += 1
    } else {
      selectedProduct.quantity = 1
      cart.push(selectedProduct)
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Товар добавлен в корзину')
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>{error}</div>

  return (
    <div className={styles.productDetails}>
      {selectedProduct?.image && <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.productImage} />}
      <h1>{selectedProduct?.name}</h1>
      <p>Цена: {selectedProduct?.price} грн</p>
      <p>Наличие: {selectedProduct?.availability ? 'В наличии' : 'Нет в наличии'}</p>
      <p>Количество на складе: {selectedProduct?.quantity_in_stock}</p>

      {/* Выбор размера комплекта */}
      <div className={styles.sizeTypeSection}>
        <h3>Выбор размера комплекта:</h3>
        <div className={styles.sizeTypeButtons}>
          <button className={selectedSetSize === '1,5сп' ? styles.active : ''} onClick={() => handleSetSizeChange('1,5сп')}>
            1,5сп
          </button>
          <button className={selectedSetSize === '2сп' ? styles.active : ''} onClick={() => handleSetSizeChange('2сп')}>
            2сп
          </button>
          <button className={selectedSetSize === 'Євро' ? styles.active : ''} onClick={() => handleSetSizeChange('Євро')}>
            Євро
          </button>
          <button className={selectedSetSize === 'Сімейний' ? styles.active : ''} onClick={() => handleSetSizeChange('Сімейний')}>
            Сімейний
          </button>
        </div>
      </div>

      {/* Выбор размера наволочки подушки */}
      <div className={styles.sizeTypeSection}>
        <h3>Выбор размера наволочки подушки:</h3>
        <div className={styles.sizeTypeButtons}>
          <button className={selectedSizeType === '50*70' ? styles.active : ''} onClick={() => handleSizeTypeChange('50*70')}>
            50*70
          </button>
          <button className={selectedSizeType === '70*70' ? styles.active : ''} onClick={() => handleSizeTypeChange('70*70')}>
            70*70
          </button>
        </div>
      </div>

      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  )
}

export default ProductDetails
