import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiMenu, FiX } from 'react-icons/fi'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isMenuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <NavLink to="/" className={styles.logoLink}>
            Sleep & Dream
          </NavLink>
        </div>

        {/* Десктоп-меню (скрывается на мобильных) */}
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
                <NavLink to="/" onClick={logout} className={styles.navLink}>
                  Выйти
                </NavLink>
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

        {/* Бургер-меню (показывается только на мобильных) */}
        <div className={styles.burgerIcon} onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </nav>

      {/* Мобильное меню (изначально скрыто) */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" onClick={toggleMenu}>
              Категории
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" onClick={toggleMenu}>
              Корзина ({getTotalItems()})
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/orders" onClick={toggleMenu}>
                  Заказы
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className={styles.navLink}
                >
                  Выйти
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" onClick={toggleMenu}>
                Личный кабинет
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
