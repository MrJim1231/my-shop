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

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price + (rubberOption[item.id] ? 100 : 0)
      return total + itemPrice * item.quantity
    }, 0)
  }

  return (
    <div className={cartStyles.container}>
      <nav className={cartStyles.breadcrumb}>
        <Link to="/" className={cartStyles.breadcrumbLink}>
          Головна
        </Link>
        <span className={cartStyles.separator}>/</span>
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
                <p>Ціна: {item.price + (rubberOption[item.id] ? 100 : 0)} грн</p>
                <p>Розмір: {item.size}</p>
                <p>На складі: {item.quantity_in_stock}</p>
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
                  Видалити
                </button>
              </div>
            </div>
          ))}
          <div className={cartStyles.cartSummary}>
            <p>Загальна вартість: {calculateTotalPrice()} грн</p>
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
