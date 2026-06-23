import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ serviceType, onServiceTypeChange }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLightNavbar = isHomePage && !scrolled;

  const urlParams = new URLSearchParams(location.search);
  const activeService = serviceType || urlParams.get('serviceType') || 'flights';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(5, 32, 60, 0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : (isLightNavbar ? '1px solid rgba(22, 30, 45, 0.08)' : 'none'),
        transition: 'all 0.3s ease',
        padding: 0,
      }}>
        <div className="nav-container">
          {/* Column 1: Logo */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button onClick={() => navigate('/')} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', cursor: 'pointer', border: 'none', padding: 0,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-5deg)', flexShrink: 0 }}>
                <line x1="22" y1="2" x2="11" y2="13" stroke="url(#nav-plane-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="url(#nav-plane-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></polygon>
                <defs>
                  <linearGradient id="nav-plane-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor={isLightNavbar ? "#0770e3" : "#38bdf8"} />
                    <stop offset="1" stopColor={isLightNavbar ? "#6366f1" : "#818cf8"} />
                  </linearGradient>
                </defs>
              </svg>
              <span className="nav-logo-text" style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                letterSpacing: '-0.8px',
              }}>
                <span style={{ color: isLightNavbar ? '#05203c' : '#ffffff' }}>Trip</span>
                <span style={{ color: isLightNavbar ? '#0770e3' : '#38bdf8' }}>Mind</span>
              </span>
            </button>
          </div>

          {/* Column 2: Navigation Links (Flights/Hotels Switcher) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: isLightNavbar ? 'rgba(5, 32, 60, 0.04)' : 'rgba(255, 255, 255, 0.08)',
              border: isLightNavbar ? '1px solid rgba(5, 32, 60, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 30,
              padding: 3,
              height: 38,
            }}>
              {[
                { id: 'flights', label: 'Flights', icon: '✈️' },
                { id: 'hotels', label: 'Hotels', icon: '🏨' },
              ].map(tab => {
                const active = activeService === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (onServiceTypeChange) {
                        onServiceTypeChange(tab.id);
                      } else {
                        navigate('/', { state: { serviceType: tab.id } });
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 18px',
                      borderRadius: 25,
                      fontWeight: 700,
                      fontSize: 13,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: active 
                        ? 'linear-gradient(135deg, #0770e3, #0547b8)' 
                        : 'transparent',
                      color: active 
                        ? 'white' 
                        : (isLightNavbar ? 'var(--ink)' : 'rgba(255, 255, 255, 0.85)'),
                      boxShadow: active ? '0 2px 8px rgba(7, 112, 227, 0.25)' : 'none',
                      outline: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = isLightNavbar 
                          ? 'rgba(5, 32, 60, 0.05)' 
                          : 'rgba(255, 255, 255, 0.12)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                    <span className="nav-tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: Placeholder for layout consistency */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
            {/* Login / Register features have been removed */}
          </div>
        </div>
      </nav>
    </>
  );
}