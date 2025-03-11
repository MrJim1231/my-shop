import React, { createContext, useState, useContext, useEffect } from 'react'

// Создаем контекст
const AuthContext = createContext()

// Провайдер аутентификации
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Здесь можно проверить localStorage или сделать запрос для получения данных о текущем пользователе
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData)) // Сохраняем пользователя в localStorage
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

// Хук для использования контекста
export const useAuth = () => {
  return useContext(AuthContext)
}
