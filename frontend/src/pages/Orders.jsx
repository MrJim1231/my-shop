import React, { useState, useEffect } from 'react'
import styles from '../styles/Orders.module.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId')

      if (!userId) {
        setError('Будь ласка, увійдіть в систему, щоб побачити ваші замовлення.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost/my-shop/backend/api/get_orders.php?userId=${userId}`)

        if (!response.ok) {
          throw new Error('Помилка при завантаженні замовлень')
        }

        const data = await response.json()

        if (Array.isArray(data)) {
          setOrders(data)
        } else {
          setOrders([])
          setError('Немає замовлень')
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
    return <div className={styles.loading}>Завантаження...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Замовлення</h2>
      <ul className={styles.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <h3 className={styles.orderTitle}>Замовлення №{order.order_number}</h3>
              <p className={styles.orderDetail}>Ім'я: {order.name}</p>
              <p className={styles.orderDetail}>Телефон: {order.phone}</p>
              <p className={styles.orderDetail}>Адреса: {order.address}</p>
              <p className={styles.orderDetail}>Email: {order.email}</p>
              <p className={styles.orderDetail}>Коментар: {order.comment}</p>
              <p className={styles.orderTotal}>Загальна сума: {parseFloat(order.total_price).toFixed(2)} грн.</p>
              <h4 className={styles.itemHeader}>Товари:</h4>
              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <p className={styles.itemDetail}>
                      <strong>Назва товару:</strong> {item.name}
                    </p>{' '}
                    {/* Добавляем название товара */}
                    <p className={styles.itemDetail}>
                      <strong>Кількість:</strong> {parseInt(item.quantity, 10)}
                    </p>
                    <p className={styles.itemDetail}>
                      <strong>Ціна:</strong> {parseFloat(item.price).toFixed(2)} грн.
                    </p>
                    <p className={styles.itemDetail}>
                      <strong>Розмір:</strong> {item.size}
                    </p>
                    <p className={styles.itemDetail}>
                      <strong>На резинці:</strong> {Number(item.rubber) ? 'Так' : 'Ні'}
                    </p>
                    <img src={item.image} alt="Product" className={styles.itemImage} />
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p className={styles.noOrders}>Немає замовлень</p>
        )}
      </ul>
    </div>
  )
}

export default Orders
