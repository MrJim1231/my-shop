import React, { useState, useEffect } from 'react'
import styles from '../styles/SizeChart.module.css'

const SizeChart = ({ selectedSetSize }) => {
  const [sizeData, setSizeData] = useState({
    '1,5сп': {
      sheet: '160x220 см - 1 шт',
      duvetCover: '150x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
      additional: 'Пошиття на резинці +150 грн (повна передоплата)',
    },
    '2сп': {
      sheet: '200x220 см - 1 шт',
      duvetCover: '180x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
      additional: 'Пошиття на резинці +150 грн (повна передоплата)',
    },
    Євро: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '200x220 см - 1 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
      additional: 'Пошиття на резинці +150 грн (повна передоплата)',
    },
    Сімейний: {
      sheet: '220x220 см - 1 шт',
      duvetCover: '150x220 см - 2 шт',
      pillowcases: '70x70 см или 50x70 см - 2 шт',
      additional: 'Пошиття на резинці +150 грн (повна передоплата)',
    },
  })

  // Для обновления данных при смене размера комплекта
  const [currentSizeData, setCurrentSizeData] = useState(sizeData[selectedSetSize])

  useEffect(() => {
    // Обновляем текущие данные, если изменился выбранный размер
    if (selectedSetSize && sizeData[selectedSetSize]) {
      setCurrentSizeData(sizeData[selectedSetSize])
    }
  }, [selectedSetSize, sizeData])

  return (
    <div className={styles.sizeChart}>
      {/* <h2>Таблица размеров комплекта постельного белья</h2> */}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Размер</th>
            <th>Простирадло</th>
            <th>Подковдра</th>
            <th>Наволочки</th>
            <th>Дополнительно</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedSetSize}</td>
            <td>{currentSizeData.sheet}</td>
            <td>{currentSizeData.duvetCover}</td>
            <td>{currentSizeData.pillowcases}</td>
            <td>{currentSizeData.additional}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SizeChart
