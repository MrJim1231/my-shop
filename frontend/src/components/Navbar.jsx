import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <nav className={styles.navbar}>
      <ul>
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
        <li>
          <NavLink to="/products" className={({ isActive }) => (isActive ? styles.active : '')}>
            Продукты
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? styles.active : '')}>
            Корзина
          </NavLink>
        </li>
        {isAuthenticated ? ( // Проверяем, если пользователь авторизован
          <>
            <li>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? styles.active : '')}>
                Заказы
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.button}>
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
  )
}

export default Navbar
