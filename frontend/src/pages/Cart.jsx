import React, { useState } from 'react'
import styles from '../styles/Cart.module.css'

function Cart() {
  // Пример данных о товарах в корзине (можно заменить на реальный стейт или данные из backend)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Кошелек', price: 25, quantity: 1 },
    { id: 2, name: 'Ремень', price: 30, quantity: 2 },
    { id: 3, name: 'Сумка', price: 50, quantity: 1 },
  ])

  // Функция для удаления товара из корзины
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Рассчитываем общую сумму корзины
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className={styles.cart}>
      <h1>Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div className={styles.cartItem} key={item.id}>
              <img
                src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" // Используйте реальное изображение товара
                alt={item.name}
                className={styles.cartItemImage}
              />
              <div className={styles.cartItemInfo}>
                <h2>{item.name}</h2>
                <p>Цена: ${item.price}</p>
                <p>Количество: {item.quantity}</p>
                <button onClick={() => removeItem(item.id)} className={styles.removeItem}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.cartTotal}>
        <h3>Итоговая сумма: ${getTotal()}</h3>
      </div>
      <button className={styles.checkoutButton}>Оформить заказ</button>
    </div>
  )
}

export default Cart
