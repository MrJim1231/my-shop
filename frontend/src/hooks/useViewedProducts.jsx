import { useState, useEffect } from 'react'

function useViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState([])

  // Загружаем просмотренные товары из localStorage при монтировании компонента
  useEffect(() => {
    const storedViewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || []
    setViewedProducts(storedViewedProducts)
  }, [])

  // Функция для добавления товара в список просмотренных
  const addViewedProduct = (product) => {
    setViewedProducts((prevProducts) => {
      // Проверяем, если товар уже в списке, не добавляем его повторно
      const updatedProducts = prevProducts.filter((item) => item.id !== product.id)
      const newViewedProducts = [product, ...updatedProducts] // Добавляем в начало списка

      // Сохраняем обновленный список в localStorage
      localStorage.setItem('viewedProducts', JSON.stringify(newViewedProducts))

      return newViewedProducts
    })
  }

  return {
    viewedProducts,
    addViewedProduct,
  }
}

export default useViewedProducts
