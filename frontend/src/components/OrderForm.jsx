import React, { useState } from 'react'
import { useCart } from '../context/CartContext' // Подключаем контекст корзины
import { useNavigate } from 'react-router-dom' // Подключаем useNavigate
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config' // URL для API

function OrderForm({ onClose }) {
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

  // Обработчик изменения значений в форме
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Проверяем валидность данных
    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      setError('Все поля, кроме комментария, обязательны для заполнения.')
      return
    }

    // Получаем userId из localStorage или ставим null
    const userId = localStorage.getItem('userId') || null

    // Формируем данные для заказа с картинками и размерами
    const orderData = {
      ...formData,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        size: item.size,
      })),
      totalPrice: getTotalPrice(),
      userId: userId,
    }

    setLoading(true) // Включаем индикатор загрузки
    setError(null) // Очищаем возможные ошибки

    try {
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData), // Отправляем данные
      })

      if (response.ok) {
        clearCart() // Очищаем корзину
        onClose() // Закрываем форму

        // После успешного оформления заказа проверяем, зарегистрирован ли пользователь
        if (userId) {
          navigate('/orders') // Перенаправляем на страницу заказов, если пользователь зарегистрирован
        } else {
          navigate('/') // Перенаправляем на главную, если пользователь не зарегистрирован
        }
      } else {
        throw new Error('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false) // Выключаем индикатор загрузки
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
          {error && <p className={styles.error}>{error}</p>} {/* Отображаем ошибку, если она есть */}
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
