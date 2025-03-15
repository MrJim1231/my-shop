import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import styles from '../styles/ProductDetails.module.css'
import { API_URL } from '../api/config'
import ViewedProducts from '../components/ViewedProducts'
import DiscountPrice, { applyDiscount } from '../components/DiscountPrice'
import SizeChart from '../components/SizeChart' // Імпортуємо компонент SizeChart
import ImageGallery from '../components/ImageGallery' // Імпортуємо компонент ImageGallery

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState(null)
  const [parentCategoryName, setParentCategoryName] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSizeType, setSelectedSizeType] = useState(null)
  const [selectedSetSize, setSelectedSetSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previousImage, setPreviousImage] = useState(null)
  const [viewedProducts, setViewedProducts] = useState([])

  // Завантажуємо переглянуті товари з localStorage
  useEffect(() => {
    const viewedItems = JSON.parse(localStorage.getItem('viewedProducts')) || []
    setViewedProducts(viewedItems)
  }, [])

  // Завантаження даних про товар
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}product-details.php?id=${id}`)
        .then((response) => {
          setProduct(response.data)
          initializeSelection(response.data)

          if (response.data.category_id) {
            fetchCategory(response.data.category_id)
          }

          setLoading(false)
        })
        .catch((error) => {
          console.error('Помилка при завантаженні товару:', error)
          setError('Помилка при завантаженні товару')
          setLoading(false)
        })
    }
  }, [id])

  const fetchCategory = (catId) => {
    axios
      .get(`${API_URL}get_category_by_id.php?category_id=${catId}`)
      .then((res) => {
        setCategoryName(res.data.name)
        setCategoryId(catId)

        if (res.data.parent_category && res.data.parent_category.id) {
          axios
            .get(`${API_URL}get_category_by_id.php?category_id=${res.data.parent_category.id}`)
            .then((parentRes) => {
              setParentCategoryName(parentRes.data.name)
            })
            .catch(() => {
              setParentCategoryName('Невідома батьківська категорія')
            })
        } else {
          setParentCategoryName('Немає батьківської категорії')
        }
      })
      .catch(() => {
        setCategoryName('Невідома категорія')
        setCategoryId(null)
      })
  }

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

    const firstAvailableProduct = Object.values(productData.sizes)
      .flat()
      .find((item) => item.size.includes(availableSetSize) && item.size.includes(availableSizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(firstAvailableProduct || null)
    setPreviousImage(productData?.images?.[0] || null)

    if (firstAvailableProduct?.category_id && firstAvailableProduct.category_id !== categoryId) {
      fetchCategory(firstAvailableProduct.category_id)
    }
  }

  const handleSetSizeChange = (setSize) => {
    setSelectedSetSize(setSize)

    const availableProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(setSize) && item.size.includes(selectedSizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(availableProduct || null)
    setPreviousImage(availableProduct?.image || previousImage)

    if (availableProduct?.category_id && availableProduct.category_id !== categoryId) {
      fetchCategory(availableProduct.category_id)
    }
  }

  const handleSizeTypeChange = (sizeType) => {
    setSelectedSizeType(sizeType)

    const availableProduct = Object.values(product.sizes)
      .flat()
      .find((item) => item.size.includes(selectedSetSize) && item.size.includes(sizeType) && item.availability && item.quantity_in_stock > 0)

    setSelectedProduct(availableProduct || null)
    setPreviousImage(availableProduct?.image || previousImage)

    if (availableProduct?.category_id && availableProduct.category_id !== categoryId) {
      fetchCategory(availableProduct.category_id)
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    const discountedPrice = applyDiscount(selectedProduct.price, parentCategoryName, categoryName) // Застосовуємо знижку

    const productToAdd = {
      ...selectedProduct,
      image: previousImage,
      price: discountedPrice, // Застосовуємо знижку при додаванні товару в кошик
    }

    addToCart(productToAdd)
  }

  if (loading) return <div>Завантаження...</div>
  if (error) return <div>{error}</div>

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Головна
        </Link>
        <span className={styles.separator}>/</span>
        <Link to="/categories" className={styles.breadcrumbLink}>
          Категорії
        </Link>
        <span className={styles.separator}>/</span>
        {parentCategoryName && (
          <Link to={`/category/${categoryId}`} className={styles.breadcrumbLink}>
            {parentCategoryName}
          </Link>
        )}
        <span className={styles.separator}>/</span>
        {categoryId && (
          <Link to={`/category/${categoryId}`} className={styles.breadcrumbLink}>
            {categoryName || 'Категорія'}
          </Link>
        )}
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbText}>{selectedProduct?.name || product?.name || 'Товар'}</span>
      </nav>
      <div className={styles.productDetails}>
        {/* Використовуємо компонент ImageGallery */}
        {product?.images && <ImageGallery images={product.images} setPreviousImage={setPreviousImage} previousImage={previousImage} />}

        <div className={styles.section}>
          <h2>{selectedProduct?.name}</h2>
          <DiscountPrice price={selectedProduct?.price} parentCategoryName={parentCategoryName} categoryName={categoryName} />
          <p>Наявність: {selectedProduct?.availability ? 'В наявності' : 'Немає в наявності'}</p>
          <p>Кількість на складі: {selectedProduct?.quantity_in_stock}</p>
          <div className={styles.sizeTypeSection}>
            <h3>Вибір розміру комплекту:</h3>
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

          <div className={styles.sizeTypeSection}>
            <h3>Вибір розміру наволочки подушки:</h3>
            <div className={styles.sizeTypeButtons}>
              {['50*70', '70*70'].map((size) => (
                <button key={size} className={selectedSizeType === size ? styles.active : ''} onClick={() => handleSizeTypeChange(size)}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Додаємо таблицю з розмірами */}
          {product?.sizes && <SizeChart selectedSetSize={selectedSetSize} />}

          <button onClick={handleAddToCart} className={styles.addToCartButton} disabled={!selectedProduct || !selectedProduct.availability || selectedProduct.quantity_in_stock <= 0}>
            Додати в кошик
          </button>
        </div>
      </div>
      <ViewedProducts viewedProducts={viewedProducts} />
    </div>
  )
}

export default ProductDetails
