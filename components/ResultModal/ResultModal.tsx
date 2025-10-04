'use client'

import React from 'react'
import './ResultModal.css'

const ResultModal = () => {
  return (
    <div className="result-container">
      <div className="forecast-header">
        <h1>Twoja prognozowana emerytura</h1>
        <p className="forecast-year">Wyliczenie dla roku 2055</p>
        
        <div className="amounts-grid">
          <div className="amount-card">
            <h3>KWOTA NOMINALNA</h3>
            <p className="amount">2858 zł</p>
            <span className="amount-desc">rzeczywista kwota w 2055</span>
          </div>
          <div className="amount-card">
            <h3>KWOTA UREALNIONA</h3>
            <p className="amount">0 zł</p>
            <span className="amount-desc">w dzisiejszej sile nabywczej</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Stopa zastąpienia</h4>
          <p className="stat-value">0.0%</p>
        </div>
        <div className="stat-card">
          <h4>vs Średnia w grupie</h4>
          <p className="stat-value negative">-65.3%</p>
        </div>
      </div>

      <div className="info-section">
        <h3>Wpływ zwolnień lekarskich</h3>
        <div className="info-content">
          <p>Zwolnienia lekarskie obniżają Twoją przyszłą emeryturę o około 70 zł miesięcznie. Bez L4 otrzymałbyś 2928 zł.</p>
        </div>
      </div>

      <div className="postpone-section">
        <h3>Odłóż przejście na emeryturę</h3>
        <p className="postpone-desc">Zobacz, jak wzrośnie Twoja emerytura, jeśli będziesz pracować dłużej:</p>
        
        <div className="postpone-grid">
          <div className="postpone-card">
            <p className="postpone-period">+1 rok</p>
            <p className="postpone-amount">+64 zł</p>
          </div>
          <div className="postpone-card">
            <p className="postpone-period">+2 lata</p>
            <p className="postpone-amount">+127 zł</p>
          </div>
          <div className="postpone-card">
            <p className="postpone-period">+5 lata</p>
            <p className="postpone-amount">+318 zł</p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary">Zmień parametry</button>
        <button className="btn-primary">Zaawansowana symulacja</button>
        <button className="btn-success">Pobierz raport</button>
      </div>
    </div>
  )
}

export default ResultModal

