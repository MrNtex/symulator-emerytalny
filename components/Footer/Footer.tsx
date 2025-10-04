'use client';
import React from 'react';
import './Footer.css';
import { Linkedin, Rss, Youtube, ArrowUp, X } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="zus-footer">
            <div className="footer-content">

                <div className="footer-links">
                    <a href="#">› Zamówienia publiczne</a>
                    <a href="#">› Praca w ZUS</a>
                    <a href="#">› Praca dla lekarzy</a>
                    <a href="#">› Konkursy ofert</a>
                    <a href="#">› Mienie zbędne</a>
                    <a href="#">› Mapa serwisu</a>
                </div>


                <div className="footer-center">
                    <div className="footer-declarations">
                        <a href="#">Deklaracja dostępności</a>
                        <a href="#">Ustawienia plików cookies</a>
                    </div>

                    <div className="footer-socials">
                        <a href="#" className="social-icon">
                            <Youtube size={18} />
                            <span>Elektroniczny ZUS</span>
                        </a>
                        <span className="footer-divider"></span>

                        <a href="#" className="social-icon">
                            <Linkedin size={18} />
                            <span>Linkedin</span>
                        </a>
                        <span className="footer-divider"></span>

                        <a href="#" className="social-icon">
                            <X size={18} />
                            <span>X</span>
                        </a>
                        <span className="footer-divider"></span>

                        <a href="#" className="social-icon">
                            <Rss size={18} />
                            <span>Kanał RSS</span>
                        </a>
                    </div>
                </div>

                <div className="footer-right">
                    <button className="scroll-top" onClick={scrollToTop}>
                        Do góry <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
