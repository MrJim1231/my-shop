import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext' // Імпортуємо хук useAuth
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router-dom' // Використовуємо useNavigate
import styles from '../styles/Auth.module.css' // Використовуємо той самий файл стилів

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { login, logout } = useAuth() // Отримуємо функцію login та logout з AuthContext
  const navigate = useNavigate() // Хук для навігації

  // Перевірка наявності токена при монтуванні компонента
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      setMessage({ text: 'Ви вже авторизовані', type: 'success' })
    }
  }, [])

  const loginUser = async (e) => {
    e.preventDefault()

    console.log('Відправка даних:', { email, password })

    try {
      const res = await axios.post(
        `${API_URL}login.php`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('Відповідь сервера:', res.data)

      setMessage({ text: res.data.message, type: 'success' })

      if (res.data.status === 'success') {
        // Перевіряємо, що токен і userId присутні в відповіді
        if (res.data.token && res.data.userId) {
          // Зберігаємо токен і userId в localStorage
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.userId) // Додаємо збереження userId

          // Оновлюємо контекст автентифікації за допомогою хука useAuth
          login({ email, token: res.data.token, userId: res.data.userId })

          setIsLoggedIn(true)
          console.log('Токен та UserId збережено:', res.data.token, res.data.userId)

          // Перенаправляємо на сторінку замовлень після успішного входу
          navigate('/orders')
        } else {
          setMessage({ text: 'Токен або userId не був отриманий від сервера', type: 'error' })
        }
      }
    } catch (err) {
      setMessage({ text: 'Помилка при авторизації', type: 'error' })
      console.error('Помилка:', err)
    }
  }

  const logoutUser = () => {
    // Викликаємо logout з контексту
    logout()

    // Перенаправляємо на сторінку входу
    navigate('/login')
  }

  return (
    <div className={styles.loginContainer}>
      {/* Якщо користувач не авторизований, показуємо форму входу */}
      {!isLoggedIn && (
        <form className={styles.form} onSubmit={loginUser}>
          <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className={styles.button} type="submit">
            Увійти
          </button>
        </form>
      )}

      {/* Якщо користувач авторизований, показуємо кнопку для виходу */}
      {isLoggedIn && (
        <div>
          <p>Ви авторизовані</p>
          <button className={styles.button} type="button" onClick={logoutUser}>
            Вийти
          </button>
        </div>
      )}

      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Login
