import React, { useState } from 'react'
import { Link } from 'react-router-dom' // Для посилань в хлібних крихтах
import { useCart } from '../context/CartContext'
import cartStyles from '../styles/Cart.module.css'
import OrderForm from '../components/OrderForm'

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart()
  const [isOrdering, setIsOrdering] = useState(false)

  return (
    <div className={cartStyles.container}>
      {/* Хлібні крихти */}
      <nav className={cartStyles.breadcrumb}>
        <Link to="/" className={cartStyles.breadcrumbLink}>
          Головна
        </Link>
        <span className={cartStyles.separator}>/</span>

        {/* Посилання на категорію товарів */}
        <Link to="/categories" className={cartStyles.breadcrumbLink}>
          Категорії
        </Link>
        <span className={cartStyles.separator}>/</span>

        <span className={cartStyles.breadcrumbText}>Кошик</span>
      </nav>

      <h1>Кошик</h1>
      {cart.length === 0 ? (
        <p>Кошик порожній</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className={cartStyles.cartItem}>
              <img src={item.image} alt={item.name} className={cartStyles.cartItemImage} />
              <div className={cartStyles.cartDetails}>
                <h2>{item.name}</h2>
                <p>Ціна: {item.price} грн</p>
                <p>Розмір: {item.size}</p>

                {/* Кнопки збільшення та зменшення кількості */}
                <div className={cartStyles.quantityControl}>
                  <button onClick={() => decreaseQuantity(item.id, item.size)} className={cartStyles.decreaseButton}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id, item.size)} className={cartStyles.increaseButton}>
                    +
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id, item.size)} className={cartStyles.removeButton}>
                  Видалити
                </button>
              </div>
            </div>
          ))}
          <div className={cartStyles.cartSummary}>
            <p>Загальна вартість: {getTotalPrice()} грн</p>
            <button onClick={() => setIsOrdering(true)} className={cartStyles.checkoutButton}>
              Оформити замовлення
            </button>
          </div>
        </div>
      )}
      {isOrdering && <OrderForm onClose={() => setIsOrdering(false)} />}
    </div>
  )
}

export default Cart
