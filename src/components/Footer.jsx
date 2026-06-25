import React, { useState } from 'react';
import { encryptParams } from '../utils/urlHelper.js';
import { subscribeNewsletter } from '../utils/api.js';

const TechBadge = ({ label }) => (
  <span style={{
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 4,
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  }}>{label}</span>
);

export default function Footer({ serviceType }) {
  const currentYear = new Date().getFullYear();
  const urlParams = new URLSearchParams(window.location.search);
  const resolvedServiceType = serviceType || urlParams.get('serviceType') || 'flights';
  const isHotels = resolvedServiceType === 'hotels';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHotLink = (city, iata) => {
    if (isHotels) {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 7); // 7 days from now
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3); // 3 nights

      const searchData = {
        serviceType: 'hotels',
        city: city,
        cityIata: iata || '',
        checkInDate: checkIn.toISOString().split('T')[0],
        checkOutDate: checkOut.toISOString().split('T')[0],
        rooms: '1',
        adults: '2',
        children: '0'
      };
      const token = encryptParams(searchData);
      window.location.href = `/${searchData.serviceType}?q=${token}`;
    } else {
      const defaultDepart = new Date();
      defaultDepart.setDate(defaultDepart.getDate() + 14); // 2 weeks from now
      const formattedDate = defaultDepart.toISOString().split('T')[0];

      const searchData = {
        serviceType: 'flights',
        originCity:  'Ahmedabad',
        originIata:  'AMD',
        destCity:    city,
        destIata:    iata,
        departDate:  formattedDate,
        returnDate:  '',
        adults:      '1',
        children:    '0',
        airline:     '',
        tripType:    'one-way',
      };
      const token = encryptParams(searchData);
      window.location.href = `/${searchData.serviceType}?q=${token}`;
    }
  };

  return (
    <footer style={{
      background: 'var(--midnight)',
      color: '#ffffff',
      fontFamily: 'var(--font-body)',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      paddingTop: '64px',
      paddingBottom: '32px',
      overflow: 'hidden'
    }}>
      {/* Upper Footer: 3-Column Layout */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 40,
        marginBottom: 48
      }}>
        {/* Column 1: Brand & About */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-5deg)', flexShrink: 0 }}>
              <line x1="22" y1="2" x2="11" y2="13" stroke="url(#footer-plane-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="url(#footer-plane-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></polygon>
              <defs>
                <linearGradient id="footer-plane-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 22, letterSpacing: '-0.8px',
            }}>
              <span style={{ color: '#ffffff' }}>Trip</span>
              <span style={{ color: '#38bdf8' }}>Mind</span>
            </span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#ffffff' }}>
            {isHotels 
              ? 'Next-generation hotel booking assistant. Specify your lodging preferences in natural Hinglish or English and let our LangGraph agent find the best accommodations.'
              : 'Next-generation travel planning assistant. Specify your flight preferences in natural Hinglish or English and let our LangGraph agent find the best itineraries.'
            }
          </p>
        </div>

        {/* Column 2: Hot Routes */}
        <div style={{ justifySelf: 'center', minWidth: 160 }}>
          <h4 style={{
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 20
          }}>{isHotels ? 'Hot Stays' : 'Hot Routes'}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            {[
              { label: isHotels ? 'Goa stays' : 'Goa (GOI)', city: 'Goa', iata: 'GOI' },
              { label: isHotels ? 'Dubai stays' : 'Dubai (DXB)', city: 'Dubai', iata: 'DXB' },
              { label: isHotels ? 'Singapore stays' : 'Singapore (SIN)', city: 'Singapore', iata: 'SIN' },
              { label: isHotels ? 'Bangkok stays' : 'Bangkok (BKK)', city: 'Bangkok', iata: 'BKK' }
            ].map((route, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleHotLink(route.city, route.iata)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#ffffff',
                    fontSize: 13,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--sky)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                >
                  {route.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 style={{
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 4
          }}>Join Newsletter</h4>
          <p style={{ fontSize: 13, color: '#ffffff', lineHeight: 1.5 }}>
            {isHotels
              ? 'Subscribe to get notifications on smart hotel deal analytics and pricing insights.'
              : 'Subscribe to get notifications on smart flight deal analytics and pricing insights.'
            }
          </p>
          {subscribed ? (
            <div className="animate-fade" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 168, 150, 0.1)',
              border: '1px solid rgba(0, 168, 150, 0.2)',
              color: 'var(--success)',
              fontSize: 13,
              fontWeight: 500,
              marginTop: 4
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  disabled={loading}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubscribe();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: error ? '1px solid var(--danger)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: loading ? '#64748b' : 'white',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'var(--transition)',
                    cursor: loading ? 'not-allowed' : 'text',
                  }}
                  onFocus={e => !loading && (e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--sky)')}
                  onBlur={e => !loading && (e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'rgba(255, 255, 255, 0.08)')}
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: loading ? '#475569' : 'var(--sky)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--sky-dark)')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--sky)')}
                >
                  {loading ? 'Joining...' : 'Join'}
                </button>
              </div>
              {error && (
                <div className="animate-fade" style={{
                  color: 'var(--danger)',
                  fontSize: 12,
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: '0 auto 24px', padding: '0 24px' }}>
        <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.06)' }} />
      </div>

      {/* Lower Footer: Copyright & Legal */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        fontSize: 12
      }}>
        <div style={{ color: '#ffffff' }}>
          &copy; {currentYear} TripMind AI · Powered by Neuronet Systems Pvt. Ltd.
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((policy, idx) => (
            <a
              key={idx}
              href="/"
              style={{ color: '#ffffff', textDecoration: 'none', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--sky)'}
              onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
            >
              {policy}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
