import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Импортируем хук useAuth
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { isAuthenticated, logout } = useAuth() // Получаем доступ к состоянию аутентификации

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
              <button onClick={logout}>Выйти</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : '')}>
                Регистрация
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : '')}>
                Войти
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
