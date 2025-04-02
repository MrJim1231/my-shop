import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Auth.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const registerUser = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ text: 'Паролі не співпадають', type: 'error' })
      return
    }
    const userId = localStorage.getItem('userId') || null

    try {
      const res = await axios.post(`${API_URL}register.php`, { email, password, userId }, { headers: { 'Content-Type': 'application/json' } })

      setMessage({
        text: res.data.message,
        type: res.data.status === 'success' ? 'success' : 'error',
      })

      if (res.data.status === 'success') {
        localStorage.setItem('userId', res.data.userId)
        setIsCodeSent(true)
      }
    } catch (err) {
      console.error('Помилка запиту на реєстрацію:', err)
      setMessage({ text: 'Помилка при реєстрації', type: 'error' })
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')

    try {
      const res = await axios.post(`${API_URL}verify_email.php`, { email, code: verificationCode }, { headers: { 'Content-Type': 'application/json' } })

      setMessage({
        text: res.data.message,
        type: res.data.status === 'success' ? 'success' : 'error',
      })

      if (res.data.status === 'success') {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.userId)
          login(res.data)
          navigate('/orders')
        } else {
          console.error('Токен відсутній у відповіді сервера')
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
          <input className={styles.input} type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Підтвердіть пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <label>
            <input type="checkbox" id="showPassword" name="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
            Показати пароль
          </label>

          <button className={styles.button} type="submit">
            Зареєструватися
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={verifyCode}>
          <input
            className={styles.input}
            type="text"
            id="verification_code"
            name="verification_code"
            placeholder="Код підтвердження"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            autoComplete="one-time-code"
            required
          />
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
