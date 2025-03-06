import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import styles from '../styles/Register.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  const registerUser = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}register.php`, { email, password })
      setMessage({ text: res.data.message, type: 'success' })
    } catch (err) {
      setMessage({ text: 'Ошибка при регистрации', type: 'error' })
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Регистрация</h2>
      <form className={styles.form} onSubmit={registerUser}>
        <input className={styles.input} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.input} type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button className={styles.button} type="submit">
          Зарегистрироваться
        </button>
      </form>
      {message.text && <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>{message.text}</p>}
    </div>
  )
}

export default Register
