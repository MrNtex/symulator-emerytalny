import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Symulator Emerytalny ZUS</h1>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link">Strona główna</a>
          <a href="/symulacja" className="nav-link">Symulacja</a>
          <a href="/informacje" className="nav-link">Informacje</a>
        </nav>
      </div>
    </header>
  )
}

export default Header

