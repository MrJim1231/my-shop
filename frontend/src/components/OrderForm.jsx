import React, { useState } from 'react'
import { useCart } from '../context/CartContext' // Підключаємо контекст кошика
import { useNavigate } from 'react-router-dom' // Підключаємо useNavigate
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config' // URL для API

function OrderForm({ onClose }) {
  const { cart, getTotalPrice, clearCart } = useCart() // Витягуємо дані з контексту кошика
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  })
  const [loading, setLoading] = useState(false) // Для стану завантаження
  const [error, setError] = useState(null) // Для відображення помилки
  const navigate = useNavigate() // Хук для навігації

  // Обробник зміни значень у формі
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Перевіряємо валідність даних
    if (!formData.name || !formData.phone || !formData.address) {
      setError("Усі поля, окрім коментаря, обов'язкові для заповнення.")
      return
    }

    // Отримуємо userId з localStorage або ставимо null
    const userId = localStorage.getItem('userId') || null

    // Формуємо дані замовлення з картинками та розмірами
    const orderData = {
      ...formData,
      items: cart.map((item) => ({
        product_id: item.id, // ID товару
        quantity: item.quantity, // Кількість товару
        price: item.price, // Ціна товару
        image: item.image, // Картинка товару
        size: item.size, // Розмір товару
      })),
      totalPrice: getTotalPrice(), // Загальна ціна
      userId: userId, // Додаємо userId з localStorage або null
    }

    console.log('Дані замовлення:', orderData) // Логуємо дані перед відправкою

    setLoading(true) // Вмикаємо індикатор завантаження
    setError(null) // Очищаємо можливі попередні помилки

    try {
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData), // Відправляємо дані
      })

      if (response.ok) {
        // alert('Замовлення успішно оформлене!')
        clearCart()
        onClose()

        // Після успішного оформлення замовлення перевіряємо, чи зареєстрований користувач
        if (userId) {
          navigate('/orders') // Перенаправляємо на сторінку замовлень, якщо користувач зареєстрований
        } else {
          navigate('/') // Перенаправляємо на головну, якщо користувач не зареєстрований
        }
      } else {
        throw new Error('Помилка при оформленні замовлення')
      }
    } catch (error) {
      console.error('Помилка:', error)
      setError("Помилка з'єднання з сервером")
    } finally {
      setLoading(false) // Вимикаємо індикатор завантаження
    }
  }

  return (
    <div className={styles.orderFormContainer}>
      <div className={styles.orderForm}>
        <h2>Оформлення замовлення</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Ваше ім'я" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Адреса доставки" value={formData.address} onChange={handleChange} required />
          <textarea name="comment" placeholder="Коментар до замовлення" value={formData.comment} onChange={handleChange} />
          {error && <p className={styles.error}>{error}</p>} {/* Відображаємо помилку, якщо є */}
          <button type="submit" disabled={loading}>
            {loading ? 'Відправка замовлення...' : 'Відправити замовлення'}
          </button>
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderForm
