import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import styles from '../styles/Auth.module.css'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className={styles.authContainer}>
      {/* Заголовок "Вход" или "Регистрация" */}
      <h2 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>

      {/* Условный рендеринг форм входа и регистрации */}
      {isLogin ? <Login /> : <Register />}

      {/* Кнопка для переключения между формами */}
      <div className={styles.toggleContainer}>
        <button className={styles.toggleButton} onClick={toggleForm}>
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </button>
      </div>
    </div>
  )
}

export default Auth
