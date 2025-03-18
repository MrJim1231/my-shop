import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Auth.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const { login } = useAuth() // Контекст аутентификации
  const navigate = useNavigate()

  // Функция для отправки данных на сервер для регистрации
  const registerUser = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId') || null

    console.log('Відправка даних на сервер:', { email, password, userId })

    try {
      const res = await axios.post(`${API_URL}register.php`, { email, password, userId }, { headers: { 'Content-Type': 'application/json' } })
      console.log('Відповідь сервера:', res.data)

      setMessage({
        text: res.data.message,
        type: res.data.status === 'success' ? 'success' : 'error',
      })

      if (res.data.status === 'success') {
        localStorage.setItem('userId', res.data.userId)
        setIsCodeSent(true) // Переключаем на форму ввода кода подтверждения
      }
    } catch (err) {
      console.error('Помилка запиту на реєстрацію:', err)
      setMessage({ text: 'Помилка при реєстрації', type: 'error' })
    }
  }

  // Функция для проверки кода подтверждения
  const verifyCode = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')

    console.log('Перевірка коду для email:', email, 'Код:', verificationCode)

    try {
      const res = await axios.post(`${API_URL}verify_email.php`, { email, code: verificationCode }, { headers: { 'Content-Type': 'application/json' } })

      console.log('Відповідь сервера на перевірку коду:', res.data)

      setMessage({
        text: res.data.message,
        type: res.data.status === 'success' ? 'success' : 'error',
      })

      if (res.data.status === 'success') {
        console.log('Токен:', res.data.token) // Выводим токен в консоль

        // Проверяем наличие токена
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
          login({ token: res.data.token }) // Передаем объект с токеном
          navigate('/') // Перенаправление на домашнюю страницу или другую страницу
        } else {
          console.error('Токен отсутствует в ответе сервера')
          setMessage({ text: 'Не вдалося отримати токен', type: 'error' })
        }
      }
    } catch (err) {
      console.error('Помилка запиту на перевірку коду:', err)
      setMessage({ text: 'Помилка перевірки коду', type: 'error' })
    }
  }

  return (
    <div className={styles.loginContainer}>
      {!isCodeSent ? (
        <form className={styles.form} onSubmit={registerUser}>
          <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className={styles.button} type="submit">
            Зареєструватися
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={verifyCode}>
          <input className={styles.input} type="text" placeholder="Код підтвердження" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
          <button className={styles.button} type="submit">
            Підтвердити Email
          </button>
        </form>
      )}
      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Register
