import React, { useState, useEffect } from 'react'
import styles from '../styles/SizeChart.module.css'

const SizeChart = ({ selectedSetSize }) => {
  const [sizeData] = useState({
    '1,5сп': {
      sheet: '160x220 см - 1 шт',
      duvetCover: '150x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
    },
    '2сп': {
      sheet: '200x220 см - 1 шт',
      duvetCover: '180x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
    },
    Євро: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '200x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
    },
    Сімейний: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '150x220 см - 2 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
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
      {/* Обычная таблица для десктопов */}
      <div className={styles.desktopTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Размер</th>
              <th>Простыня</th>
              <th>Пододеяльник</th>
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

      {/* Вертикальный вид для мобильных */}
      <div className={styles.mobileView}>
        <div className={styles.sizeBlock}>
          <strong>Размер:</strong> {selectedSetSize}
        </div>
        <div className={styles.sizeBlock}>
          <strong>Простыня:</strong> {currentSizeData.sheet}
        </div>
        <div className={styles.sizeBlock}>
          <strong>Пододеяльник:</strong> {currentSizeData.duvetCover}
        </div>
        <div className={styles.sizeBlock}>
          <strong>Наволочки:</strong> {currentSizeData.pillowcases}
        </div>
      </div>
    </div>
  )
}

export default SizeChart
