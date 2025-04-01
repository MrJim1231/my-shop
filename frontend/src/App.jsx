import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import CategoryPage from './pages/CategoryPage'
import Orders from './pages/Orders'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import ScrollToTopButton from './components/ScrollToTopButton'
import Auth from './pages/Auth' // Импортируем страницу авторизации
import ResetPassword from './pages/ResetPassword' // Импортируем страницу сброса пароля
import { ToastContainer } from 'react-toastify' // Импортируем ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Подключаем стили для уведомлений
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <header className="header-container">
            <Navbar />
            <Banner />
          </header>
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              {/* Новый маршрут для страницы авторизации */}
              <Route path="/auth" element={<Auth />} />
              {/* Новый маршрут для сброса пароля */}
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/orders" element={<PrivateRoute element={Orders} />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
        <ToastContainer position="top-right" autoClose={3000} /> {/* Добавлен ToastContainer */}
      </Router>
    </AuthProvider>
  )
}

export default App
