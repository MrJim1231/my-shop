import React from 'react'
import styles from '../styles/SizeChart.module.css'

const SizeChart = () => {
  return (
    <div className={styles.sizeChart}>
      <h2>Таблица размеров комплекта постельного белья</h2>

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
            <td>1,5 спальний комплект</td>
            <td>160x220 см - 1 шт</td>
            <td>150x220 см - 1 шт</td>
            <td>70x70 см или 50x70 см - 2 шт</td>
            <td>Пошиття на резинці +150 грн (повна передоплата)</td>
          </tr>
          <tr>
            <td>2 спальний комплект</td>
            <td>200x220 см - 1 шт</td>
            <td>180x220 см - 1 шт</td>
            <td>70x70 см или 50x70 см - 2 шт</td>
            <td>Пошиття на резинці +150 грн (повна передоплата)</td>
          </tr>
          <tr>
            <td>Євро</td>
            <td>220x220 см - 1 шт</td>
            <td>200x220 см - 1 шт</td>
            <td>70x70 см или 50x70 см - 2 шт</td>
            <td>Пошиття на резинці +150 грн (повна передоплата)</td>
          </tr>
          <tr>
            <td>Сімейний</td>
            <td>220x220 см - 1 шт</td>
            <td>150x220 см - 2 шт</td>
            <td>70x70 см или 50x70 см - 2 шт</td>
            <td>Пошиття на резинці +150 грн (повна передоплата)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SizeChart
