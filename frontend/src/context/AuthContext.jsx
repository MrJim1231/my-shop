import React, { createContext, useContext, useState, useEffect } from 'react'

// Создание контекста
const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true) // Если токен есть, значит пользователь авторизован
    }
  }, []) // Эффект запускается при монтировании компонента

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    setIsAuthenticated(true) // Обновляем состояние немедленно после входа
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false) // Обновляем состояние немедленно после выхода
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
