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
      {/* Заголовок "Вхід" або "Реєстрація" */}
      <h2 className={styles.title}>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>

      {/* Умовне відображення форм входу та реєстрації */}
      {isLogin ? <Login /> : <Register />}

      {/* Кнопка для перемикання між формами */}
      <div className={styles.toggleContainer}>
        <button className={styles.toggleButton} onClick={toggleForm}>
          {isLogin ? 'Немає акаунта? Зареєструйтесь' : 'Вже є акаунт? Увійдіть'}
        </button>
      </div>
    </div>
  )
}

export default Auth
