import React, { useState } from 'react'
import { useCart } from '../context/CartContext' // Подключаем контекст корзины
import { useNavigate } from 'react-router-dom' // Подключаем useNavigate
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config' // URL для API

function OrderForm({ onClose, rubberOption }) {
  const { cart, getTotalPrice, clearCart } = useCart() // Получаем данные из контекста корзины
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '', // Добавляем email в состояние
    comment: '', // Убираем comment2
  })
  const [loading, setLoading] = useState(false) // Для состояния загрузки
  const [error, setError] = useState(null) // Для отображения ошибки
  const navigate = useNavigate() // Хук для навигации

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      setError('Все поля, кроме комментария, обязательны для заполнения.')
      return
    }

    const userId = localStorage.getItem('userId') || null

    // Вычисляем общую сумму
    const totalPrice = getTotalPrice(rubberOption) // Используем getTotalPrice с rubberOption

    const orderData = {
      ...formData,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price) + (rubberOption[item.id] ? 100 : 0),
        image: item.image,
        size: item.size,
        rubber: rubberOption[item.id] || false,
      })),
      totalPrice, // Используем переданный totalPrice
      userId: userId,
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        onClose()

        if (userId) {
          navigate('/orders')
        } else {
          navigate('/')
        }
      } else {
        throw new Error('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.orderFormContainer}>
      <div className={styles.orderForm}>
        <h2>Оформление заказа</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Ваше имя" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Адрес доставки" value={formData.address} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Электронная почта" value={formData.email} onChange={handleChange} required />
          <textarea name="comment" placeholder="Комментарий к заказу" value={formData.comment} onChange={handleChange} />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Отправка заказа...' : 'Отправить заказ'}
          </button>
          <button type="button" onClick={onClose}>
            Отменить
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderForm
