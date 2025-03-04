import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import styles from '../styles/CategoryPage.module.css'

function CategoryPage() {
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost/my-shop/backend/api/get_products_by_category.php?category_id=${categoryId}`)
      .then((response) => {
        const uniqueProducts = response.data.filter((product, index, self) => index === self.findIndex((p) => p.name === product.name))
        setProducts(uniqueProducts)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка при получении товаров:', error)
        setLoading(false)
      })
  }, [categoryId])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Товары в категории</h1>
      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((product) => (
              <div className={styles.productItem} key={product.id}>
                <Link to={`/product/${product.id}`} className={styles.productLink}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <h3>{product.name}</h3>
                  <p className={styles.productPrice}>Цена: {product.price} грн</p>
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>Нет товаров в этой категории.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
