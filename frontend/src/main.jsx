import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext' // Импортируем CartProvider
import './styles/reset.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      {' '}
      {/* Оборачиваем приложение в CartProvider */}
      <App />
    </CartProvider>
  </StrictMode>
)
