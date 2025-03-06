import React, { useState, useEffect } from 'react'
import styles from '../styles/Orders.module.css' // Подключение стилей

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost/my-shop/backend/api/get_orders.php')

        if (!response.ok) {
          throw new Error('Ошибка при загрузке заказов')
        }

        const data = await response.json()

        // Если нет заказов, возвращаем пустой массив
        if (Array.isArray(data)) {
          setOrders(data)
        } else {
          setOrders([]) // Если нет заказов, устанавливаем пустой массив
          setError('Нет заказов')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Заказы</h2>
      <ul className={styles.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <h3 className={styles.orderTitle}>Заказ №{order.id}</h3>
              <p className={styles.orderDetail}>Имя: {order.name}</p>
              <p className={styles.orderDetail}>Телефон: {order.phone}</p>
              <p className={styles.orderDetail}>Адрес: {order.address}</p>
              <p className={styles.orderDetail}>Комментарий: {order.comment}</p>
              <p className={styles.orderTotal}>Общая сумма: {parseFloat(order.total_price).toFixed(2)} грн.</p>

              <h4 className={styles.itemHeader}>Товары:</h4>
              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <p className={styles.itemDetail}>Количество: {parseInt(item.quantity, 10)}</p>
                    <p className={styles.itemDetail}>Цена: {parseFloat(item.price).toFixed(2)} грн.</p>
                    <p className={styles.itemDetail}>Размер: {item.size}</p>
                    <img src={item.image} alt="Product" className={styles.itemImage} />
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p className={styles.noOrders}>Нет заказов</p>
        )}
      </ul>
    </div>
  )
}

export default Orders
