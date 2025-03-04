import React, { useState, useEffect } from 'react'
import cartStyles from '../styles/Cart.module.css'

function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCart(storedCart)
  }, [])

  const handleRemoveFromCart = (productId, size) => {
    const updatedCart = cart.filter((item) => !(item.id === productId && item.size === size))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  return (
    <div className={cartStyles.cart}>
      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className={cartStyles.cartItem}>
              <img src={item.image} alt={item.name} className={cartStyles.cartItemImage} />
              <div>
                <h2>{item.name}</h2>
                <p>Цена: ${item.price}</p>
                <p>Размер: {item.size}</p>
                <p>Количество: {item.quantity}</p>
                <button onClick={() => handleRemoveFromCart(item.id, item.size)} className={cartStyles.removeButton}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <div className={cartStyles.cartSummary}>
            <p>Общая стоимость: ${getTotalPrice().toFixed(2)}</p>
            <button className={cartStyles.checkoutButton}>Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
