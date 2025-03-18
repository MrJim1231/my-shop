import React, { createContext, useContext, useState, useEffect } from 'react'

// Создание контекста
const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Проверка наличия токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true) // Если токен есть, значит пользователь авторизован
    }
  }, [])

  // Функция для входа в систему
  const login = (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token) // Сохраняем токен
      localStorage.setItem('userId', userData.userId) // Сохраняем userId, если есть
      setIsAuthenticated(true) // Обновляем состояние, что пользователь авторизован
    }
  }

  // Функция для выхода из системы
  const logout = () => {
    localStorage.removeItem('token') // Удаляем токен
    localStorage.removeItem('userId') // Удаляем userId
    setIsAuthenticated(false) // Обновляем состояние
  }

  // Возвращаем значение контекста
  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
