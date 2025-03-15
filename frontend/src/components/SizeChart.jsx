import React, { useState, useEffect } from 'react'
import styles from '../styles/SizeChart.module.css'

const SizeChart = ({ selectedSetSize }) => {
  const [isOpen, setIsOpen] = useState(false) // Стан для відкриття/закриття таблиці на мобільних

  const [sizeData] = useState({
    '1,5сп': {
      sheet: '160x220 см - 1 шт',
      duvetCover: '150x220 см - 1 шт',
      pillowcases: '70x70 см або 50x70 см - 2 шт',
    },
    '2сп': {
      sheet: '200x220 см - 1 шт',
      duvetCover: '180x220 см - 1 шт',
      pillowcases: '70x70 см або 50x70 см - 2 шт',
    },
    Євро: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '200x220 см - 1 шт',
      pillowcases: '70x70 см або 50x70 см - 2 шт',
    },
    Сімейний: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '150x220 см - 2 шт',
      pillowcases: '70x70 см або 50x70 см - 2 шт',
    },
  })

  const [currentSizeData, setCurrentSizeData] = useState(sizeData[selectedSetSize])

  useEffect(() => {
    if (selectedSetSize && sizeData[selectedSetSize]) {
      setCurrentSizeData(sizeData[selectedSetSize])
    }
  }, [selectedSetSize, sizeData])

  return (
    <div className={styles.sizeChart}>
      {/* Горизонтальна таблиця для десктопу */}
      <div className={styles.desktopTable}>
        <div className={styles.title}>
          <h3>Таблиця розміру:</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Розмір</th>
              <th>Простирадло</th>
              <th>Пододіяльник</th>
              <th>Наволочки</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedSetSize}</td>
              <td>{currentSizeData.sheet}</td>
              <td>{currentSizeData.duvetCover}</td>
              <td>{currentSizeData.pillowcases}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Кнопка + вертикальний список для мобільних */}
      <div className={styles.mobileView}>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Сховати розміри' : 'Показати розміри'}
        </button>
        {isOpen && (
          <div className={styles.sizeContainer}>
            <div className={styles.sizeBlock}>
              <strong>Розмір:</strong> {selectedSetSize}
            </div>
            <div className={styles.sizeBlock}>
              <strong>Простирадло:</strong> {currentSizeData.sheet}
            </div>
            <div className={styles.sizeBlock}>
              <strong>Пододіяльник:</strong> {currentSizeData.duvetCover}
            </div>
            <div className={styles.sizeBlock}>
              <strong>Наволочки:</strong> {currentSizeData.pillowcases}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SizeChart
