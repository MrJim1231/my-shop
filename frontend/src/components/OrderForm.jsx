import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config'

function OrderForm({ onClose }) {
  const { cart, getTotalPrice, clearCart } = useCart() // Извлекаем данные из контекста корзины
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  })
  const [loading, setLoading] = useState(false) // Для состояния загрузки
  const [error, setError] = useState(null) // Для отображения ошибки

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Проверяем валидность данных
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Все поля, кроме комментария, обязательны для заполнения.')
      return
    }

    // Формируем данные заказа
    const orderData = {
      ...formData,
      items: cart.map((item) => ({
        product_id: item.id, // ID товара
        quantity: item.quantity, // Количество товара
        price: item.price, // Цена товара
      })),
      totalPrice: getTotalPrice(), // Общая цена
    }

    setLoading(true) // Включаем индикатор загрузки
    setError(null) // Очищаем возможные предыдущие ошибки

    try {
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData), // Отправляем данные
      })

      if (response.ok) {
        alert('Заказ успешно оформлен!')
        clearCart()
        onClose()
      } else {
        throw new Error('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false) // Отключаем индикатор загрузки
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
          <textarea name="comment" placeholder="Комментарий к заказу" value={formData.comment} onChange={handleChange} />
          {error && <p className={styles.error}>{error}</p>} {/* Отображаем ошибку, если есть */}
          <button type="submit" disabled={loading}>
            {loading ? 'Отправка заказа...' : 'Отправить заказ'}
          </button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderForm
