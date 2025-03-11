import React from 'react'
import { Navigate } from 'react-router-dom' // Используем Navigate для перенаправления
import { useAuth } from '../context/AuthContext' // Импортируем контекст аутентификации

const PrivateRoute = ({ element: Element }) => {
  const { isAuthenticated } = useAuth() // Проверяем, авторизован ли пользователь

  // Если пользователь не авторизован, перенаправляем на страницу входа
  return isAuthenticated ? <Element /> : <Navigate to="/login" />
}

export default PrivateRoute
