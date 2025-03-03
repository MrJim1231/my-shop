import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home' // Импорт компонента Home
import Navbar from './pages/Navbar' // Импортируем Navbar
import Categories from './pages/Categories' // Импорт компонента Categories
import Products from './pages/Products' // Импорт компонента Products
import Cart from './pages/Cart' // Импорт компонента Cart
import Register from './pages/Register' // Импорт компонента Register

function App() {
  return (
    <Router>
      {/* Навигационная панель, которая будет отображаться на всех страницах */}
      <Navbar />
      {/* Основной контейнер для всего контента */}
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Home />} />

        {/* Страница категорий */}
        <Route path="/categories" element={<Categories />} />

        {/* Страница продуктов */}
        <Route path="/products" element={<Products />} />

        {/* Страница корзины */}
        <Route path="/cart" element={<Cart />} />

        {/* Страница регистрации */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
