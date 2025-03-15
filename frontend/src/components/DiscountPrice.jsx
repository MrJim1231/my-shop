import React from 'react'
import styles from '../styles/Discount.module.css'

// Функция для применения скидки
export const applyDiscount = (price, parentCategoryName, categoryName) => {
  if (parentCategoryName === 'Бязь' || categoryName === 'Бязь') {
    return price - 500 // Скидка 500 грн на категорию "Бязь"
  }
  if (parentCategoryName === 'Ранфорс' || categoryName === 'Ранфорс') {
    return price - 300 // Скидка 300 грн на категорию "Ранфорс"
  }
  return price // Без скидки
}

const DiscountPrice = ({ price, parentCategoryName, categoryName }) => {
  const discountedPrice = applyDiscount(price, parentCategoryName, categoryName) // Используем applyDiscount

  return (
    <p>
      Ціна:{' '}
      {discountedPrice !== price ? (
        <>
          <span className={styles.oldPrice}>{price} грн</span>
          <span className={styles.newPrice}>{discountedPrice} грн</span>
        </>
      ) : (
        <span className={styles.noDiscount}>{price} грн</span>
      )}
    </p>
  )
}

export default DiscountPrice
