import React, { useState, useEffect } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import styles from '../styles/Login.module.css'
import { useNavigate } from 'react-router-dom' // Используем useNavigate

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate() // Хук для навигации

  // Проверка наличия токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      setMessage({ text: 'Вы уже авторизованы', type: 'success' })
    }
  }, [])

  const loginUser = async (e) => {
    e.preventDefault()

    console.log('Sending data:', { email, password })

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

      console.log('Server Response:', res.data)

      setMessage({ text: res.data.message, type: 'success' })

      if (res.data.status === 'success') {
        // Проверяем, что токен присутствует в ответе
        if (res.data.token) {
          // Сохраняем токен в localStorage
          localStorage.setItem('token', res.data.token)
          setIsLoggedIn(true)
          console.log('Token saved:', res.data.token)
        } else {
          setMessage({ text: 'Токен не был получен от сервера', type: 'error' })
        }
      }
    } catch (err) {
      setMessage({ text: 'Ошибка при авторизации', type: 'error' })
      console.error('Error:', err)
    }
  }

  const logoutUser = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setMessage({ text: 'Вы вышли из системы', type: 'success' })

    // Перенаправление на страницу входа
    navigate('/login') // Используем navigate для перенаправления
  }

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>{isLoggedIn ? 'Вы в системе' : 'Вход'}</h2>

      {/* Если пользователь не авторизован, показываем форму входа */}
      {!isLoggedIn && (
        <form className={styles.form} onSubmit={loginUser}>
          <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className={styles.button} type="submit">
            Войти
          </button>
        </form>
      )}

      {/* Если пользователь авторизован, показываем кнопку выхода */}
      {isLoggedIn && (
        <button className={styles.button} onClick={logoutUser}>
          Выйти
        </button>
      )}

      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Login
