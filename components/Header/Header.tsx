'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import './Header.css';
import { Ear, Accessibility, Search } from 'lucide-react';

const Header = () => {
    const router = useRouter();

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <header className="zus-header">
            <div className="zus-topbar">
                <div className="zus-logo" onClick={handleLogoClick}>
                    <img
                        src="/images/zus-logo.png"
                        alt="ZUS Logo"
                        className="zus-logo-image"
                    />
                </div>

                <div className="zus-controls">
                    <button className="zus-kontakt">Kontakt</button>

                    <div className="zus-lang">
                        <span style={{ fontSize: '12px', color: '#00416E' }}>PL</span>
                        <svg color='#00416E' width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>

                    <div className="zus-access">
                        <button className="access-btn" title="Pomoc dla osób niesłyszących">
                            <Ear size={20} />
                        </button>
                        <button className="access-btn" title="Wersja dla niepełnosprawnych">
                            <Accessibility size={20} />
                        </button>
                    </div>

                    <button className="bip-logo">
                        <img src="/images/bip-logo.png" alt="BIP Logo" />
                    </button>

                    <a href="#" className="zus-register">Zarejestruj w PUE/eZUS</a>
                    <a href="#" className="zus-login">Zaloguj do PUE/eZUS</a>

                    <button className="zus-search" title="Szukaj">
                        <Search size={20} />
                    </button>

                    <div className="zus-eu">
                        <img
                            src="/images/eu-logo.png"
                            alt="Unia Europejska"
                            className="zus-eu-flag"
                        />
                        <div className="zus-eu-text">
                            <strong>Unia Europejska</strong>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="zus-navbar">
                <a href="#">Świadczenia</a>
                <a href="#">Firmy</a>
                <a href="#">Pracujący</a>
                <a href="#">Lekarze</a>
                <a href="#">Wzory formularzy</a>
                <a href="#">Baza wiedzy</a>
                <a href="#">O ZUS</a>
            </nav>
        </header>
    );
};

export default Header;
