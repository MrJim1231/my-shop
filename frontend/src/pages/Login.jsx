import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import styles from '../styles/Login.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}login.php`, { email, password })
      setMessage(res.data.message)

      if (res.data.status === 'success') {
        localStorage.setItem('user_id', res.data.user_id)
      }
    } catch (err) {
      setMessage('Ошибка при входе')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Вход</h2>
      <form onSubmit={loginUser} className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" className={styles.input} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Login
