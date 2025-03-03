import React, { useState, useEffect } from 'react'
import styles from '../styles/Cart.module.css'

function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    // Загружаем корзину из localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCart(storedCart)
  }, [])

  // Функция для удаления товара из корзины
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Сохраняем обновленную корзину
  }

  // Функция для подсчета общей стоимости с учетом количества
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      // Учитываем количество товара при подсчете стоимости
      return total + (item.price || 0) * (item.quantity || 1)
    }, 0)
  }

  return (
    <div className={styles.cart}>
      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div className={styles.cartItem} key={item.id}>
                <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                <div className={styles.cartItemDetails}>
                  <h2>{item.name}</h2>
                  <p>Цена: ${item.price}</p>
                  <p>Количество: {item.quantity}</p>
                  <button onClick={() => handleRemoveFromCart(item.id)} className={styles.removeButton}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <p>Общая стоимость: ${getTotalPrice().toFixed(2)}</p>
            <button className={styles.checkoutButton}>Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
