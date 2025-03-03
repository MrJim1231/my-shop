import { NavLink } from 'react-router-dom'
import styles from '../styles/Navbar.module.css' // Импортируем стили как объект

function Navbar() {
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
        <li>
          <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : '')}>
            Личный кабинет
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
