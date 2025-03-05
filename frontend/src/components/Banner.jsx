import React from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/Banner.css'

const Banner = () => {
  const location = useLocation()
  if (location.pathname !== '/') return null // Баннер только на главной

  return (
    <div className="banner">
      <img src="/images/banner.jpg" alt="Баннер магазина" className="banner-image" />
    </div>
  )
}

export default Banner
