import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import ProductDetails from './pages/ProductDetails'
import CategoryPage from './pages/CategoryPage'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header-container">
          <Navbar />
          <Banner /> {/* Баннер отображается только на главной странице */}
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
