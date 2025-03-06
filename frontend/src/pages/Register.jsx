import React, { useState } from 'react'
import { API_URL } from '../api/config'
import axios from 'axios'
import styles from '../styles/Register.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const registerUser = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}register.php`, { email, password })
      setMessage(res.data.message)
    } catch (err) {
      setMessage('Ошибка при регистрации')
    }
  }

  return (
    <div className={styles.container}>
      <h2>Регистрация</h2>
      <form onSubmit={registerUser}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Register
