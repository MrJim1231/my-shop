import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Auth.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      setMessage({ text: 'Ви вже авторизовані', type: 'success' })
    }
  }, [])

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}login.php`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
      setMessage({ text: res.data.message, type: 'success' })
      if (res.data.status === 'success') {
        if (res.data.token && res.data.userId) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.userId)
          login({ email, token: res.data.token, userId: res.data.userId })
          setIsLoggedIn(true)
          navigate('/orders')
        } else {
          console.log('Токен або userId відсутній у відповіді сервера')
        }
      } else if (res.data.status === 'verification_required') {
        setRequiresVerification(true)
      }
    } catch (err) {
      console.error('Помилка авторизації:', err)
      setMessage({ text: 'Помилка при авторизації', type: 'error' })
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}verify_email.php`, { email, code }, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.status === 'success') {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        login({ email, token: res.data.token, userId: res.data.userId })
        setIsLoggedIn(true)
        setRequiresVerification(false)
        navigate('/orders')
      } else {
        setMessage({ text: 'Невірний код підтвердження', type: 'error' })
      }
    } catch (err) {
      console.error('Помилка при підтвердженні коду:', err)
      setMessage({ text: 'Помилка при підтвердженні коду', type: 'error' })
    }
  }

  return (
    <div className={styles.loginContainer}>
      {!isLoggedIn && !requiresVerification && (
        <form className={styles.form} onSubmit={loginUser}>
          <input className={styles.input} type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button className={styles.button} type="submit">
            Увійти
          </button>
          <p className={styles.forgotPassword} onClick={() => navigate('/reset-password')}>
            Забули пароль?
          </p>
        </form>
      )}

      {requiresVerification && (
        <form className={styles.form} onSubmit={verifyCode}>
          <input
            className={styles.input}
            type="text"
            id="verification_code"
            name="verification_code"
            placeholder="Введіть код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="one-time-code"
            required
          />
          <button className={styles.button} type="submit">
            Підтвердити
          </button>
        </form>
      )}

      {isLoggedIn && (
        <div>
          <p>Ви авторизовані</p>
          <button className={styles.button} type="button" onClick={logout}>
            Вийти
          </button>
        </div>
      )}

      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Login
