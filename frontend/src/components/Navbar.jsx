import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Импортируем хук useAuth
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth() // Получаем доступ к состоянию аутентификации
  const navigate = useNavigate() // Хук для навигации

  const handleLogout = () => {
    logout() // Вызов logout, который сбрасывает состояние аутентификации
    navigate('/login') // Перенаправление на страницу входа после выхода
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
        {isAuthenticated ? (
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
            <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : '')}>
              Войти
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
