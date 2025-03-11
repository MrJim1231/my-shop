import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext' // Импортируем хук useAuth
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router-dom' // Используем useNavigate
import styles from '../styles/Auth.module.css' // Используем тот же файл стилей

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { login } = useAuth() // Получаем функцию login из AuthContext
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
        // Проверяем, что токен и userId присутствуют в ответе
        if (res.data.token && res.data.userId) {
          // Сохраняем токен и userId в localStorage
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.userId) // Добавляем сохранение userId

          // Обновляем контекст аутентификации с помощью хука useAuth
          login({ email, token: res.data.token, userId: res.data.userId })

          setIsLoggedIn(true)
          console.log('Token and UserId saved:', res.data.token, res.data.userId)

          // Перенаправляем на страницу заказов после успешного логина
          navigate('/orders')
        } else {
          setMessage({ text: 'Токен или userId не был получен от сервера', type: 'error' })
        }
      }
    } catch (err) {
      setMessage({ text: 'Ошибка при авторизации', type: 'error' })
      console.error('Error:', err)
    }
  }

  return (
    <div className={styles.loginContainer}>
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

      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Login
