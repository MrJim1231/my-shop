import React from 'react'
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2025 Магазин постельного белья. Все права защищены.</p>
        <p>Контакт: info@beddingstore.com | Телефон: +38 067 123 4567</p>
      </div>
    </footer>
  )
}

export default Footer
