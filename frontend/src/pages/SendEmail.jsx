import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css' // стиль для страницы (опционально)

const SendEmail = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      name,
      email,
      message,
    }

    try {
      const response = await axios.post('/api/send-email', data)
      if (response.status === 200) {
        setStatus('Сообщение успешно отправлено!')
      }
    } catch (error) {
      setStatus('Не удалось отправить сообщение.')
    }
  }

  return (
    <div className={styles.container}>
      <h2>Отправка письма</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Ваше имя:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Ваш email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Сообщение:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button}>
          Отправить сообщение
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  )
}

export default SendEmail
