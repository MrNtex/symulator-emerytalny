'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './RentModal.css'
import PensionDistributionChart from '@/components/RentDistributionChart'

const RentModal = () => {
  const [retirementAmount, setRetirementAmount] = useState('')
  const [funFact, setFunFact] = useState('')
  const router = useRouter()

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

  const handleSimulationClick = () => {
    router.push('/dane')
  }

  return (
    <div className='rent-modal-container'>
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
            <span className="currency-label">zł/mies.</span>
          </div>

          <button className="simulation-button" onClick={handleSimulationClick}>
            Przejdź do symulacji
          </button>
        </div>

        <div className="fun-fact-section">
          <h3 className="fun-fact-title">Czy wiesz, że...</h3>
          <p className="fun-fact-content">{funFact}</p>
        </div>

        <div className="charts-section">
          <h3 className="charts-title">Twoje prognozy emerytalne (rozkład emerytur)</h3>

          {retirementAmount ? (
            <PensionDistributionChart userRent={parseFloat(retirementAmount)} />
          ) : (
            <div className="charts-placeholder">
              Wpisz kwotę emerytury, aby zobaczyć, jak wypadasz na tle społeczeństwa.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RentModal