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

    // Логирование отправленных данных
    console.log('Sending data:', { email, password })

    try {
      const res = await axios.post(
        `${API_URL}register.php`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      // Логируем ответ сервера для проверки данных
      console.log('Server Response:', res.data)

      setMessage({ text: res.data.message, type: 'success' })

      if (res.data.status === 'success') {
        // Логируем наличие токена в ответе
        if (res.data.token) {
          console.log('Token received:', res.data.token) // Логируем токен из ответа

          // Сохраняем токен в localStorage
          localStorage.setItem('token', res.data.token)
          console.log('Token saved to localStorage:', res.data.token) // Логируем сохранённый токен
        } else {
          setMessage({ text: 'Токен не был получен от сервера', type: 'error' })
          console.log('Token not received') // Логируем, если токен не пришел
        }
      }
    } catch (err) {
      setMessage({ text: 'Ошибка при регистрации', type: 'error' })
      console.error('Error:', err) // Логирование ошибки
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
