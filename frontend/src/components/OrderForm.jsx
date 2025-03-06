import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import styles from '../styles/OrderForm.module.css'
import { API_URL } from '../api/config'

function OrderForm({ onClose }) {
  const { cart, getTotalPrice, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const orderData = {
      ...formData,
      items: cart,
      totalPrice: getTotalPrice(),
    }

    try {
      const response = await fetch(`${API_URL}order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        alert('Заказ успешно оформлен!')
        clearCart()
        onClose()
      } else {
        alert('Ошибка при оформлении заказа')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка соединения с сервером')
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
          <button type="submit">Отправить заказ</button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderForm
