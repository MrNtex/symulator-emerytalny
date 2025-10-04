'use client'

import React, { useState } from 'react'
import './RentModal.css'

const Home = () => {
  const [retirementAmount, setRetirementAmount] = useState('')

  return (
    <div className="home-container">
      <div className="retirement-question">
        <h2>Jaka emerytura Cię satysfakcjonuje?</h2>
        <div className="input-group">
          <input 
            type="number" 
            className="retirement-input"
            placeholder="0"
            min="0"
            value={retirementAmount}
            onChange={(e) => setRetirementAmount(e.target.value)}
          />
          <span className="currency-label">PLN/mies.</span>
        </div>
        <button className="simulation-button">
          Przejdź do symulacji
        </button>
      </div>

      <div className="fun-fact-section">
        <h3 className="fun-fact-title">Czy wiesz, że...</h3>
        <p className="fun-fact-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>

      <div className="charts-section">
        <h3 className="charts-title">Twoje prognozy emerytalne (rozkład emerytur)</h3>
        <div className="charts-placeholder">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </div>
      </div>
    </div>
  )
}

export default Home