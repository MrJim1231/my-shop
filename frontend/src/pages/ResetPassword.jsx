import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../api/config'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const urlToken = searchParams.get('token')
    console.log('URL параметр token:', urlToken) // ЛОГ: Проверяем, какой токен пришел в URL

    if (urlToken) {
      setToken(urlToken)
    }
  }, [searchParams])

  const handleRequestReset = async () => {
    console.log('Отправка запроса на сброс пароля для email:', email) // ЛОГ: Email перед отправкой
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/reset_password_request.php`, { email })
      console.log('Ответ сервера (reset_password_request):', response.data) // ЛОГ: Ответ от сервера
      setMessage(response.data.message)
    } catch (error) {
      console.error('Ошибка при отправке запроса на сброс пароля:', error) // ЛОГ: Ошибка запроса
      setMessage('Ошибка при отправке запроса')
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    console.log('Попытка сброса пароля с токеном:', token, 'и новым паролем:', newPassword) // ЛОГ: Перед отправкой запроса
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/reset_password.php`, { token, new_password: newPassword })
      console.log('Ответ сервера (reset_password):', response.data) // ЛОГ: Ответ от сервера
      setMessage(response.data.message)
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error) // ЛОГ: Ошибка запроса
      setMessage('Ошибка при сбросе пароля')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Сброс пароля</h2>
      {message && <p className="text-red-500 mb-2">{message}</p>}

      {token ? (
        <div>
          <input type="password" className="w-full p-2 border rounded mb-2" placeholder="Введите новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button className="w-full p-2 bg-green-500 text-white rounded" onClick={handleResetPassword} disabled={loading}>
            {loading ? 'Сбрасываем...' : 'Сбросить пароль'}
          </button>
        </div>
      ) : (
        <div>
          <input type="email" className="w-full p-2 border rounded mb-2" placeholder="Введите email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="w-full p-2 bg-blue-500 text-white rounded" onClick={handleRequestReset} disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить запрос'}
          </button>
        </div>
      )}
    </div>
  )
}
