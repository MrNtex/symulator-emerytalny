'use client'

import React, { useState, useEffect } from 'react'
import './RentModal.css'

const Home = () => {
  const [retirementAmount, setRetirementAmount] = useState('')
  const [funFact, setFunFact] = useState('')

  useEffect(() => {
    fetch('/data/funFacts.json')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setFunFact(data[randomIndex])
        } else {
          setFunFact("Brak dostępnych ciekawostek.")
        }
      })
      .catch(() => setFunFact("Nie udało się załadować ciekawostek."))
  }, [])

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
          {funFact}
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