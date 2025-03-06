import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Загружаем корзину из localStorage при монтировании компонента
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCart(storedCart)
  }, [])

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    const productIndex = cart.findIndex((item) => item.id === product.id && item.size === product.size)

    if (productIndex !== -1) {
      // Если товар уже в корзине, увеличиваем его количество
      const updatedCart = [...cart]
      updatedCart[productIndex].quantity += 1
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    } else {
      // Если товара нет в корзине, добавляем его с количеством 1
      const updatedCart = [...cart, { ...product, quantity: 1 }]
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }

  // Функция для удаления товара из корзины
  const removeFromCart = (productId, size) => {
    const updatedCart = cart.filter((item) => !(item.id === productId && item.size === size))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart)) // Сохраняем обновленную корзину в localStorage
  }

  // Функция для увеличения количества товара
  const increaseQuantity = (productId, size) => {
    const updatedCart = cart.map((item) => (item.id === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // Функция для уменьшения количества товара
  const decreaseQuantity = (productId, size) => {
    const updatedCart = cart.map((item) => (item.id === productId && item.size === size && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // Функция для расчета общей стоимости
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  // Функция для очистки корзины
  const clearCart = () => {
    setCart([]) // Очищаем корзину в состоянии
    localStorage.removeItem('cart') // Удаляем корзину из localStorage
  }

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, clearCart }}>{children}</CartContext.Provider>
}
