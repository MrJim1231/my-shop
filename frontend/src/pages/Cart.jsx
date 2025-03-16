import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import cartStyles from '../styles/Cart.module.css'
import OrderForm from '../components/OrderForm'

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart()
  const [isOrdering, setIsOrdering] = useState(false)
  const [rubberOption, setRubberOption] = useState({})

  const handleRubberChange = (itemId, isChecked) => {
    setRubberOption((prev) => ({
      ...prev,
      [itemId]: isChecked,
    }))
  }

  return (
    <div className={cartStyles.container}>
      <nav className={cartStyles.breadcrumb}>
        <Link to="/" className={cartStyles.breadcrumbLink}>
          Главная
        </Link>
        <span className={cartStyles.separator}>/</span>
        <Link to="/categories" className={cartStyles.breadcrumbLink}>
          Категории
        </Link>
        <span className={cartStyles.separator}>/</span>
        <span className={cartStyles.breadcrumbText}>Корзина</span>
      </nav>

      <h1>Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className={cartStyles.cartItem}>
              <img src={item.image} alt={item.name} className={cartStyles.cartItemImage} />
              <div className={cartStyles.cartDetails}>
                <h2>{item.name}</h2>
                <p>Цена: {(Number(item.price) + (rubberOption[item.id] ? 100 : 0)).toFixed(2)} грн</p>
                <p>Размер: {item.size}</p>
                <p>На складе: {item.quantity_in_stock}</p>
                <div className={cartStyles.quantityControl}>
                  <button onClick={() => decreaseQuantity(item.id, item.size)} className={cartStyles.decreaseButton}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id, item.size)} className={cartStyles.increaseButton}>
                    +
                  </button>
                </div>
                <label>
                  <input type="checkbox" checked={rubberOption[item.id] || false} onChange={(e) => handleRubberChange(item.id, e.target.checked)} />
                  На резинке (+100 грн)
                </label>
                <button onClick={() => removeFromCart(item.id, item.size)} className={cartStyles.removeButton}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <div className={cartStyles.cartSummary}>
            <p>Общая стоимость: {getTotalPrice(rubberOption)} грн</p> {/* Используем getTotalPrice */}
            <button onClick={() => setIsOrdering(true)} className={cartStyles.checkoutButton}>
              Оформить заказ
            </button>
          </div>
        </div>
      )}
      {isOrdering && <OrderForm onClose={() => setIsOrdering(false)} rubberOption={rubberOption} totalPrice={getTotalPrice(rubberOption)} />}
    </div>
  )
}

export default Cart
