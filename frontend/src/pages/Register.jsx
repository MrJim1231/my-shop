import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import { useAuth } from '../context/AuthContext' // Отримуємо хук для роботи з контекстом
import { useNavigate } from 'react-router-dom' // Імпортуємо useNavigate для редиректу
import styles from '../styles/Auth.module.css' // Використовуємо той самий файл стилів

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const { login } = useAuth() // Отримуємо функцію login з контексту
  const navigate = useNavigate() // Хук для навігації

  const registerUser = async (e) => {
    e.preventDefault()

    console.log('Відправка даних:', { email, password })

    // Получаем userId из localStorage, если он есть
    const userId = localStorage.getItem('userId') || null

    try {
      const res = await axios.post(
        `${API_URL}register.php`,
        { email, password, userId }, // Передаем userId, если он есть
        { headers: { 'Content-Type': 'application/json' } }
      )

      console.log('Відповідь сервера:', res.data)

      setMessage({
        text: res.data.message,
        type: res.data.status === 'success' ? 'success' : 'error',
      })

      if (res.data.status === 'success') {
        const { token, userId } = res.data

        if (token && userId) {
          console.log('Отримані дані:', { token, userId })

          // Зберігаємо токен і userId в localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('userId', userId)

          // Входимо в систему за допомогою контексту
          login({ token, userId })

          // Перенаправляємо на головну сторінку
          navigate('/') // Перенаправлення на головну
        } else {
          setMessage({ text: 'Помилка: дані від сервера неповні', type: 'error' })
          console.log('Помилка: токен або userId відсутній')
        }
      }
    } catch (err) {
      setMessage({ text: 'Помилка при реєстрації', type: 'error' })
      console.error('Помилка запиту:', err)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.form} onSubmit={registerUser}>
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.button} type="submit">
          Зареєструватися
        </button>
      </form>
      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Register
