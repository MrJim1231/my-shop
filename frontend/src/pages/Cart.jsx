import React from 'react'
import { useCart } from '../context/CartContext' // Импортируем useCart
import cartStyles from '../styles/Cart.module.css'

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart() // Извлекаем нужные данные и функции из контекста

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
                <p>
                  Количество:
                  <button onClick={() => decreaseQuantity(item.id, item.size)} className={cartStyles.quantityButton}>
                    -
                  </button>
                  {item.quantity}
                  <button onClick={() => increaseQuantity(item.id, item.size)} className={cartStyles.quantityButton}>
                    +
                  </button>
                </p>
                <button onClick={() => removeFromCart(item.id, item.size)} className={cartStyles.removeButton}>
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
