import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css' // Импортируем стили как объект

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Блок категорий */}
      <section className={styles.categories}>
        <h2>Популярные категории</h2>
        <div className={styles['category-list']}>
          <div className={styles['category-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Кошельки" />
            <h3>Кошельки</h3>
            <Link to="/category/wallets">Перейти в категорию</Link>
          </div>
          <div className={styles['category-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Ремни" />
            <h3>Ремни</h3>
            <Link to="/category/belts">Перейти в категорию</Link>
          </div>
          <div className={styles['category-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Сумки" />
            <h3>Сумки</h3>
            <Link to="/category/bags">Перейти в категорию</Link>
          </div>
        </div>
      </section>

      {/* Блок популярных товаров */}
      <section className={styles['popular-products']}>
        <h2>Популярные товары</h2>
        <div className={styles['product-list']}>
          <div className={styles['product-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Кошелек" />
            <h3>Кошелек</h3>
            <p>Цена: 1000 грн</p>
            <Link to="/product/1">Подробнее</Link>
          </div>
          <div className={styles['product-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Ремень" />
            <h3>Ремень</h3>
            <p>Цена: 500 грн</p>
            <Link to="/product/2">Подробнее</Link>
          </div>
          <div className={styles['product-item']}>
            <img src="https://pokryvalo.com.ua/wp-content/uploads/2021/11/S471.jpg" alt="Сумка" />
            <h3>Сумка</h3>
            <p>Цена: 1500 грн</p>
            <Link to="/product/3">Подробнее</Link>
          </div>
        </div>
      </section>

      {/* О нас */}
      <section className={styles.about}>
        <h2>О нас</h2>
        <p>Мы предлагаем эксклюзивные кожаные аксессуары премиум-класса. Наши изделия изготавливаются только из качественных материалов с учетом всех стандартов и традиций ремесленного мастерства.</p>
        <Link to="/about">Подробнее</Link>
      </section>
    </div>
  )
}

export default Home
