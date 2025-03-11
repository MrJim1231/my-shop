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
      <h2 className={styles.title}>Регистрация</h2>
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
