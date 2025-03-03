import React, { useEffect, useState } from 'react'
import styles from '../styles/Products.module.css'
import axios from 'axios' // Теперь axios должен быть доступен

function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost/my-shop/backend/api/products.php')
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
      })
  }, [])

  return (
    <div className={styles.products}>
      <h1>Продукты</h1>
      <div className={styles.productList}>
        {products.map((product) => (
          <div className={styles.productItem} key={product.id}>
            <a href={`/product/${product.id}`}>
              <img src={product.image_url} alt={product.name} className={styles.productImage} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Цена: ${product.price}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
