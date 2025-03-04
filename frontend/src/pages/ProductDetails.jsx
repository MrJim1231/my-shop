import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/ProductDetails.module.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost/my-shop/backend/api/product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          setSimilarProducts(response.data.sizes || [])
          setSelectedProduct(response.data)
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

  const handleSizeChange = (event) => {
    const newSize = event.target.value
    const newProduct = similarProducts.find((item) => item.size === newSize)
    if (newProduct) {
      setSelectedProduct({ ...product, ...newProduct })
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
      <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.productImage} />
      <h1>{selectedProduct.name}</h1>
      <p>{selectedProduct.description}</p>
      <p>Цена: ${selectedProduct.price}</p>
      <p>
        Размер:
        <select onChange={handleSizeChange} value={selectedProduct.size}>
          {similarProducts.map((item) => (
            <option key={item.id} value={item.size}>
              {item.size}
            </option>
          ))}
        </select>
      </p>
      <p>Доступность: {selectedProduct.availability ? 'В наличии' : 'Нет в наличии'}</p>
      <p>Количество на складе: {selectedProduct.quantity_in_stock}</p>
      <p>Вес: {selectedProduct.weight} кг</p>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  )
}

export default ProductDetails
