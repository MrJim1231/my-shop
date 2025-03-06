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
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h2>Заказы</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id}>
              <h3>Заказ №{order.id}</h3>
              <p>Имя: {order.name}</p>
              <p>Телефон: {order.phone}</p>
              <p>Адрес: {order.address}</p>
              <p>Комментарий: {order.comment}</p>
              <p>Общая сумма: {parseFloat(order.total_price).toFixed(2)} руб.</p>

              <h4>Товары:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    <p>Продукт ID: {item.product_id}</p>
                    <p>Количество: {parseInt(item.quantity, 10)}</p>
                    <p>Цена: {parseFloat(item.price).toFixed(2)} руб.</p>
                    <p>Размер: {item.size}</p>
                    <img src={item.image} alt="Product" style={{ width: '100px', height: 'auto' }} />
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>Нет заказов</p>
        )}
      </ul>
    </div>
  )
}

export default Orders
