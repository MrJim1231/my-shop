import React, { useState, useEffect } from 'react'

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
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>Ошибка: {error}</div>
  }

  return (
    <div>
      <h2>Заказы</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h3>Заказ №{order.id}</h3>
            <p>Имя: {order.name}</p>
            <p>Телефон: {order.phone}</p>
            <p>Адрес: {order.address}</p>
            <p>Комментарий: {order.comment}</p>
            <p>Общая сумма: {order.total_price} руб.</p>
            <pre>{JSON.stringify(order.items, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Orders
