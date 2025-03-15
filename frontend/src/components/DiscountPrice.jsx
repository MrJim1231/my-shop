import React from 'react'
import styles from '../styles/Discount.module.css'

const DiscountPrice = ({ price, parentCategoryName, categoryName }) => {
  const applyDiscount = (price) => {
    if (parentCategoryName === 'Бязь' || categoryName === 'Бязь') {
      return price - 500
    }
    return price
  }

  const discountedPrice = applyDiscount(price)

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
