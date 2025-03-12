import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || []
    setCart(storedCart)
  }, [])

  const addToCart = (product) => {
    const productIndex = cart.findIndex((item) => item.id === product.id && item.size === product.size)

    if (productIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[productIndex].quantity += 1
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }]
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  }

  const removeFromCart = (productId, size) => {
    const updatedCart = cart.filter((item) => !(item.id === productId && item.size === size))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const increaseQuantity = (productId, size) => {
    const updatedCart = cart.map((item) => (item.id === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const decreaseQuantity = (productId, size) => {
    const updatedCart = cart.map((item) => (item.id === productId && item.size === size && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, getTotalItems, clearCart }}>{children}</CartContext.Provider>
}
