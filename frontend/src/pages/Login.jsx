import React, { useState, useEffect } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import styles from '../styles/Login.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (userId) {
      setUser(userId)
    }
  }, [])

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}login.php`, { email, password })
      setMessage(res.data.message)

      if (res.data.status === 'success') {
        localStorage.setItem('user_id', res.data.user_id)
        setUser(res.data.user_id)
      }
    } catch (err) {
      setMessage('Ошибка при входе')
    }
  }

  const logoutUser = () => {
    localStorage.removeItem('user_id')
    setUser(null)
  }

  return (
    <div className={styles.loginContainer}>
      {user ? (
        <>
          <h2 className={styles.title}>Вы вошли в систему</h2>
          <button onClick={logoutUser} className={styles.button}>
            Выйти
          </button>
        </>
      ) : (
        <>
          <h2 className={styles.title}>Вход</h2>
          <form onSubmit={loginUser} className={styles.form}>
            <input type="email" placeholder="Email" className={styles.input} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Пароль" className={styles.input} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className={styles.button}>
              Войти
            </button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </>
      )}
    </div>
  )
}

export default Login
