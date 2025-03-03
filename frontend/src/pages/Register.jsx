import React, { useState } from 'react'
import '../styles/Register.module.css'

function Register() {
  // Состояния для каждого поля формы
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  // Функция для обработки отправки формы
  const handleSubmit = (e) => {
    e.preventDefault()

    // Простая валидация
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (!name || !email || !password) {
      setError('Все поля обязательны для заполнения')
      return
    }

    setError('')
    alert('Регистрация прошла успешно!')
    // Здесь можно добавить логику для отправки данных на сервер
  }

  return (
    <div className="register">
      <h1>Регистрация</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Имя:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите ваше имя" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Электронная почта:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Введите ваш email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Подтвердите пароль" />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  )
}

export default Register
