import { useTheme } from 'next-themes'
import React, { useState, useEffect } from 'react'
import styles from './ThemeChanger.module.css'

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className={styles.themeChanger}>
      {theme === 'light' ? (
        <button onClick={() => setTheme('dark')}>
          <img src="https://res.cloudinary.com/nucat/image/upload/v1642325983/moon-half-visible-face-on-light-and-half-on-darkness_fv6ccm.png" />
          Change color theme
        </button>
      ) : (
        <button onClick={() => setTheme('light')}>
          <img className={styles.themeImg} src="https://res.cloudinary.com/nucat/image/upload/v1642325983/moon-half-visible-face-on-light-and-half-on-darkness_fv6ccm.png" />
          Change color theme
        </button>
      )}
    </div>
  )
}

export default ThemeChanger
