import React, { useState } from 'react'
import { useCart } from '../context/CartContext' // Подключаем контекст корзины
import { useNavigate } from 'react-router-dom' // Подключаем useNavigate
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config' // URL для API
import { toast } from 'react-toastify' // Импортируем toast
import 'react-toastify/dist/ReactToastify.css' // Подключаем стили для уведомлений

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

  // Функция для получения или создания userId для незарегистрированного пользователя
  const getUserId = () => {
    let userId = localStorage.getItem('userId')

    if (!userId) {
      userId = `guest-${Date.now()}` // Генерируем уникальный идентификатор
      localStorage.setItem('userId', userId)
    }

    return userId
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Проверка на обязательные поля
    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      setError('Все поля, кроме комментария, обязательны для заполнения.')
      return
    }

    // Получаем userId из localStorage (если он есть, иначе генерируем новый)
    const userId = getUserId()

    // Вычисляем общую сумму
    const totalPrice = getTotalPrice(rubberOption) // Используем getTotalPrice с rubberOption

    // Собираем данные для отправки на сервер, исключая userId, если его нет
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
      userId, // Передаем userId
    }

    setLoading(true)
    setError(null)

    try {
      // Отправляем запрос на сервер
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        toast.success("Дякуємо за замовлення! Деталі замовлення були відправлені вам на пошту, очікуйте. Менеджер з вами зв'яжеться.", {
          autoClose: false, // Убираем автоматическое закрытие
          closeButton: true, // Показываем кнопку для закрытия уведомления
        })
        onClose()

        // Если пользователь зарегистрирован, перенаправляем на страницу заказов
        navigate(userId ? '/orders' : '/')
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
