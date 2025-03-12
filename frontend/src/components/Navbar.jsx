import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext' // Подключаем контекст корзины
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { getTotalItems } = useCart() // Получаем общее количество товаров в корзине

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <NavLink to="/" className={styles.logoLink}>
            Sleep & Dream
          </NavLink>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => (isActive ? styles.active : '')}>
              Категории
            </NavLink>
          </li>
          <li className={styles.cartLink}>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? styles.active : '')}>
              Корзина
              {getTotalItems() > 0 && <span className={styles.badge}>{getTotalItems()}</span>}
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/orders" className={({ isActive }) => (isActive ? styles.active : '')}>
                  Заказы
                </NavLink>
              </li>
              <li>
                <button onClick={logout} className={styles.button}>
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" className={({ isActive }) => (isActive ? styles.active : '')}>
                Личный кабинет
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
