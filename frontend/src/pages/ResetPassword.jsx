import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../api/config'
import styles from '../styles/ResetPassword.module.css'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const urlToken = searchParams.get('token')

    if (urlToken) {
      setToken(urlToken)
    }
  }, [searchParams])

  const handleRequestReset = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/reset_password_request.php`, { email })
      setMessage(response.data.message)
    } catch (error) {
      console.error('Помилка при відправці запиту на скидання пароля:', error)
      setMessage('Помилка при відправці запиту')
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/reset_password.php`, { token, new_password: newPassword })
      setMessage(response.data.message)
    } catch (error) {
      console.error('Помилка при скиданні пароля:', error)
      setMessage('Помилка при скиданні пароля')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Скидання пароля</h2>
      {message && <p className={styles.message}>{message}</p>}

      {token ? (
        <div>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            className={styles.input}
            placeholder="Введіть новий пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autocomplete="new-password"
          />
          <button className={`${styles.button} ${styles.buttonReset}`} onClick={handleResetPassword} disabled={loading}>
            {loading ? 'Скидаємо...' : 'Скинути пароль'}
          </button>
        </div>
      ) : (
        <div>
          <input type="email" id="email" name="email" className={styles.input} placeholder="Введіть email" value={email} onChange={(e) => setEmail(e.target.value)} autocomplete="email" />
          <button className={`${styles.button} ${styles.buttonRequest}`} onClick={handleRequestReset} disabled={loading}>
            {loading ? 'Відправка...' : 'Відправити запит'}
          </button>
        </div>
      )}
    </div>
  )
}
