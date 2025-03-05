import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext' // Импортируем useCart
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart() // Получаем функцию addToCart из контекста
  const [product, setProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSizeType, setSelectedSizeType] = useState(null) // Размер наволочки
  const [selectedSetSize, setSelectedSetSize] = useState(null) // Размер комплекта
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previousImage, setPreviousImage] = useState(null) // Состояние для хранения изображения

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          initializeSelection(response.data) // Устанавливаем доступные значения
          setLoading(false)
        })
        .catch(() => {
          setError('Ошибка при загрузке товара')
          setLoading(false)
        })
    }
  }, [id])

  // Функция для установки первого доступного комплекта и наволочки
  const initializeSelection = (productData) => {
    if (!productData.sizes) return

    const availableSetSize = ['1,5сп', '2сп', 'Євро', 'Сімейний'].find((size) =>
      Object.values(productData.sizes)
        .flat()
        .some((item) => item.size.includes(size) && item.availability && item.quantity_in_stock > 0)
    )

    const availableSizeType = ['50*70', '70*70'].find((size) =>
      Object.values(productData.sizes)
        .flat()
        .some((item) => item.size.includes(size) && item.availability && item.quantity_in_stock > 0)
    )

    setSelectedSetSize(availableSetSize || null)
    setSelectedSizeType(availableSizeType || null)

    // Устанавливаем первый доступный товар в качестве выбранного
    const firstAvailableProduct = Object.values(productData.sizes)
      .flat()
      .find((item) => item.size.includes(availableSetSize) && item.size.includes(availableSizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(firstAvailableProduct || null)
    setPreviousImage(firstAvailableProduct?.image || null) // Сохраняем изображение первого доступного товара
  }

  const handleSetSizeChange = (setSize) => {
    setSelectedSetSize(setSize)

    const availableProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(setSize) && item.size.includes(selectedSizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(availableProduct || null)
    setPreviousImage(availableProduct?.image || previousImage) // Обновляем изображение или сохраняем прежнее
  }

  const handleSizeTypeChange = (sizeType) => {
    setSelectedSizeType(sizeType)

    const availableProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(selectedSetSize) && item.size.includes(sizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(availableProduct || null)
    setPreviousImage(availableProduct?.image || previousImage) // Обновляем изображение или сохраняем прежнее
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    // Используем функцию addToCart из контекста для добавления товара в корзину
    addToCart(selectedProduct)
    alert('Товар добавлен в корзину')
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>{error}</div>

  return (
    <div className={styles.productDetails}>
      {/* Отображаем изображение, если оно есть, или используем сохраненное */}
      {selectedProduct?.image || previousImage ? (
        <img src={selectedProduct?.image || previousImage} alt={selectedProduct?.name} className={styles.productImage} />
      ) : (
        <div className={styles.noImage}>Изображение отсутствует</div>
      )}
      <h1>{selectedProduct?.name}</h1>
      <p>Цена: {selectedProduct?.price} грн</p>
      <p>Наличие: {selectedProduct?.availability ? 'В наличии' : 'Нет в наличии'}</p>
      <p>Количество на складе: {selectedProduct?.quantity_in_stock}</p>

      {/* Выбор размера комплекта */}
      <div className={styles.sizeTypeSection}>
        <h3>Выбор размера комплекта:</h3>
        <div className={styles.sizeTypeButtons}>
          {['1,5сп', '2сп', 'Євро', 'Сімейний'].map((size) => {
            const isAvailable = Object.values(product.sizes)
              .flat()
              .some((item) => item.size.includes(size) && item.availability && item.quantity_in_stock > 0)

            return (
              <button key={size} className={selectedSetSize === size ? styles.active : ''} onClick={() => handleSetSizeChange(size)} disabled={!isAvailable}>
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Выбор размера наволочки */}
      <div className={styles.sizeTypeSection}>
        <h3>Выбор размера наволочки подушки:</h3>
        <div className={styles.sizeTypeButtons}>
          {['50*70', '70*70'].map((size) => {
            const isAvailable = Object.values(product.sizes)
              .flat()
              .some((item) => item.size.includes(size) && item.availability && item.quantity_in_stock > 0)

            return (
              <button key={size} className={selectedSizeType === size ? styles.active : ''} onClick={() => handleSizeTypeChange(size)} disabled={!isAvailable}>
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Кнопка "Добавить в корзину" */}
      <button onClick={handleAddToCart} className={styles.addToCartButton} disabled={!selectedProduct || !selectedProduct.availability || selectedProduct.quantity_in_stock <= 0}>
        Добавить в корзину
      </button>
    </div>
  )
}

export default ProductDetails
