import React from 'react'
import styles from '../styles/Discount.module.css'

export const applyDiscount = (price, parentCategoryName, categoryName) => {
  if (parentCategoryName === 'Бязь' || categoryName === 'Бязь') {
    return price - 500 // Скидка 500 грн на категорию "Бязь"
  }
  return price
}

const DiscountPrice = ({ price, parentCategoryName, categoryName }) => {
  const discountedPrice = applyDiscount(price, parentCategoryName, categoryName) // Используем applyDiscount

  return (
    <p>
      Цена:{' '}
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
