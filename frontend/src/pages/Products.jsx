import React, { useEffect, useState } from 'react'
import styles from '../styles/Products.module.css'
import axios from 'axios'

function Products() {
  const [products, setProducts] = useState([]) // Список товаров
  const [currentPage, setCurrentPage] = useState(1) // Текущая страница
  const [totalPages, setTotalPages] = useState(1) // Общее количество страниц
  const [loading, setLoading] = useState(false) // Состояние загрузки

  const limit = 20 // Количество товаров на странице

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost/my-shop/backend/api/products.php?page=${currentPage}`)
      .then((response) => {
        setProducts(response.data.products) // Сохраняем товары
        setTotalPages(response.data.total_pages) // Устанавливаем количество страниц
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
        setLoading(false)
      })
  }, [currentPage]) // Перезапускаем эффект при изменении текущей страницы

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page) // Переключаем страницу
    }
  }

  if (loading) {
    return <div>Loading...</div> // Пока идет загрузка
  }

  return (
    <div className={styles.products}>
      <h1>Продукты</h1>
      <div className={styles.productList}>
        {products.map((product) => (
          <div className={styles.productItem} key={product.id}>
            <a href={`/product/${product.id}`}>
              {/* Отображаем картинку продукта */}
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Цена: ${product.price}</p>
            </a>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Products
