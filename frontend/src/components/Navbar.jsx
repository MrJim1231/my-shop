import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const isCategoryActive = (path) => {
    return location.pathname.startsWith(`/${path}`)
  }

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <NavLink to="/" className={styles.logoLink}>
            Sleep & Dream
          </NavLink>
        </div>

        {getTotalItems() > 0 && (
          <div className={`${styles.cartIcon} ${isMenuOpen ? styles.hidden : ''}`}>
            <NavLink to="/cart">
              <FiShoppingCart />
              <span className={styles.badge}>{getTotalItems()}</span>
            </NavLink>
          </div>
        )}

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
              Головна
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => (isActive || isCategoryActive('category') ? styles.active : '')}>
              Категорії
            </NavLink>
          </li>
          <li className={styles.cartLink}>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? styles.active : '')}>
              Кошик
              {getTotalItems() > 0 && <span className={styles.badge}>{getTotalItems()}</span>}
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/orders" className={({ isActive }) => (isActive ? styles.active : '')}>
                  Замовлення
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={logout} className={styles.navLink}>
                  Вийти
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" className={({ isActive }) => (isActive ? styles.active : '')}>
                Особистий кабінет
              </NavLink>
            </li>
          )}
        </ul>

        <div className={styles.burgerIcon} onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              Головна
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/categories" onClick={toggleMenu}>
              Категорії
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/cart" onClick={toggleMenu}>
              Кошик
            </NavLink>
          </li>
          <hr />
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/orders" onClick={toggleMenu}>
                  Замовлення
                </NavLink>
              </li>
              <hr />
              <li>
                <NavLink
                  to="/"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className={styles.navLink}
                >
                  Вийти
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" onClick={toggleMenu}>
                Особистий кабінет
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
