import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import { useAuth } from '../context/AuthContext' // Получаем хук для работы с контекстом
import { useNavigate } from 'react-router-dom' // Импортируем useNavigate для редиректа
import styles from '../styles/Auth.module.css' // Используем тот же файл стилей

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const { login } = useAuth() // Получаем функцию login из контекста
  const navigate = useNavigate() // Хук для навигации

  const registerUser = async (e) => {
    e.preventDefault()

    console.log('Отправка данных:', { email, password })

    try {
      const res = await axios.post(`${API_URL}register.php`, { email, password }, { headers: { 'Content-Type': 'application/json' } })

      console.log('Ответ сервера:', res.data)

      setMessage({ text: res.data.message, type: res.data.status === 'success' ? 'success' : 'error' })

      if (res.data.status === 'success') {
        const { token, userId } = res.data

        if (token && userId) {
          console.log('Полученные данные:', { token, userId })

          // Сохраняем токен и userId в localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('userId', userId)

          // Входим в систему с помощью контекста
          login({ token, userId })

          // Перенаправляем на главную страницу
          navigate('/') // Перенаправление на главную
        } else {
          setMessage({ text: 'Ошибка: данные от сервера неполные', type: 'error' })
          console.log('Ошибка: токен или userId отсутствует')
        }
      }
    } catch (err) {
      setMessage({ text: 'Ошибка при регистрации', type: 'error' })
      console.error('Ошибка запроса:', err)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.form} onSubmit={registerUser}>
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.button} type="submit">
          Зарегистрироваться
        </button>
      </form>
      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Register
