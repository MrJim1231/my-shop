import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Используем контекст аутентификации

const PrivateRoute = ({ element: Element }) => {
  const { isAuthenticated } = useAuth() // Проверка аутентификации

  // Если токен в localStorage есть, не перенаправляем
  if (!isAuthenticated && !localStorage.getItem('token')) {
    return <Navigate to="/auth" />
  }

  return <Element />
}

export default PrivateRoute
