import React, { useState } from 'react';
import { formatPrice, formatDuration, formatTime, getAirlineColor, getAirlineInitials, getAirlineLogo } from '../utils/format.js';

export default function FlightCard({ flight, index }) {
  const [expanded, setExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const color    = getAirlineColor(flight.airline);
  const initials = getAirlineInitials(flight.airline);
  const logoUrl  = getAirlineLogo(flight.airline, flight.flight_number);
  const stops    = flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;
  const stopColor = flight.stops === 0 ? 'var(--success)' : flight.stops === 1 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      className="animate-fade"
      style={{
        animationDelay: `${index * 0.06}s`,
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--mist)',
        overflow: 'hidden',
        transition: 'var(--transition)',
        boxShadow: 'var(--shadow-sm)',
        // Fix: equal margin on both sides
        marginLeft: 0,
        marginRight: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(7,112,227,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--mist)';
      }}
    >
      <div className="flight-card-grid">
        {/* Airline — Fix: real logo image */}
        <div className="flight-airline-info">
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: logoUrl && !logoError ? 'white' : `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            border: logoUrl && !logoError ? '1.5px solid var(--mist)' : 'none',
            overflow: 'hidden',
            boxShadow: logoUrl && !logoError ? 'var(--shadow-sm)' : `0 4px 12px ${color}33`,
          }}>
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={flight.airline}
                onError={() => setLogoError(true)}
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ color: 'white', fontWeight: 800, fontSize: 13 }}>{initials}</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.3 }}>
              {flight.airline?.split(', ')[0] || 'Unknown'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>
              {flight.flight_number || '—'}
            </div>
          </div>
        </div>

        {/* Times and Route (wrapped for mobile responsiveness) */}
        <div className="flight-times-container">
          {/* Depart time */}
          <div className="flight-depart-time">
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {formatTime(flight.departure_time)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sky)', marginTop: 4 }}>
              {flight.departure_iata || '—'}
            </div>
          </div>

          {/* Route line */}
          <div className="flight-route-line">
            <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500 }}>
              {formatDuration(flight.duration_minutes)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
              <div style={{ height: 1.5, flex: 1, background: 'var(--mist)', borderRadius: 1 }} />
              <span style={{ fontSize: 14, color: 'var(--slate)' }}>✈</span>
              <div style={{ height: 1.5, flex: 1, background: 'var(--mist)', borderRadius: 1 }} />
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: stopColor,
              background: `${stopColor}18`, padding: '2px 10px', borderRadius: 10,
            }}>
              {stops}
            </div>
            {flight.layovers && flight.layovers.length > 0 && (
              <div style={{
                fontSize: 10,
                color: 'var(--slate)',
                fontWeight: 700,
                marginTop: 4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 120,
              }} title={flight.layovers.map(l => `${l.name} (${l.id})`).join(', ')}>
                via {flight.layovers.map(l => l.id).join(', ')}
              </div>
            )}
          </div>

          {/* Arrive time */}
          <div className="flight-arrive-time">
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {formatTime(flight.arrival_time)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sky)', marginTop: 4 }}>
              {flight.arrival_iata || '—'}
            </div>
          </div>
        </div>

        {/* Price + book — Fix: full integer price */}
        <div className="flight-price-book">
          <div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: 'var(--ink)',
              fontFamily: 'var(--font-display)', lineHeight: 1,
            }}>
              {formatPrice(flight.price_inr)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>per person</div>
          </div>
          <button
            onClick={() => {
              const airlineUrls = {
                'IndiGo': 'https://www.goindigo.in',
                'Air India': 'https://www.airindia.com',
                'SpiceJet': 'https://www.spicejet.com',
                'Emirates': 'https://www.emirates.com',
                'Qatar Airways': 'https://www.qatarairways.com',
                'Singapore Airlines': 'https://www.singaporeair.com',
                'Lufthansa': 'https://www.lufthansa.com',
                'British Airways': 'https://www.britishairways.com',
                'Vistara': 'https://www.airindia.com',
                'Akasa Air': 'https://www.akasaair.com',
              };
              const name = flight.airline ? flight.airline.split(', ')[0] : '';
              const key = Object.keys(airlineUrls).find(k => name.includes(k));
              const targetUrl = key ? airlineUrls[key] : 'https://www.google.com/flights';
              window.open(targetUrl, '_blank');
            }}
            style={{
              padding: '9px 22px', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0770e3, #0547b8)',
              color: 'white', fontWeight: 700, fontSize: 13,
              boxShadow: '0 4px 12px rgba(7,112,227,0.3)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Toggle details */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '8px',
          background: expanded ? 'var(--sky-light)' : 'var(--cloud)',
          color: 'var(--sky)', fontSize: 12, fontWeight: 600,
          borderTop: '1px solid var(--mist)', transition: 'var(--transition)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-light)'}
        onMouseLeave={e => e.currentTarget.style.background = expanded ? 'var(--sky-light)' : 'var(--cloud)'}
      >
        {expanded ? '▲ Hide details' : '▼ Flight details'}
      </button>

      {expanded && (
        <div style={{
          padding: '16px 28px', background: 'var(--cloud)',  // Fix: same 28px padding
          borderTop: '1px solid var(--mist)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {[
              { label: 'Departure Airport', value: flight.departure_airport || '—' },
              { label: 'Arrival Airport',   value: flight.arrival_airport   || '—' },
              { label: 'Flight Date',       value: flight.flight_date?.slice(0, 10) || '—' },
              { label: 'Status',            value: flight.flight_status || 'Scheduled' },
              { label: 'Duration',          value: formatDuration(flight.duration_minutes) },
            ].map(item => (
              <div key={item.label} style={{
                background: 'white', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', border: '1px solid var(--mist)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {flight.layovers && flight.layovers.length > 0 && (
            <div style={{
              marginTop: 12,
              background: 'white',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              border: '1px solid var(--mist)',
            }}>
              <div style={{
                fontSize: 10,
                color: 'var(--slate)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>🕒</span> Layover Information
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {flight.layovers.map((layover, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <div style={{
                      background: 'rgba(7, 112, 227, 0.08)',
                      color: 'var(--sky)',
                      fontWeight: 800,
                      fontSize: 12,
                      padding: '3px 8px',
                      borderRadius: 6
                    }}>
                      {layover.id}
                    </div>
                    <div style={{ flex: 1, color: 'var(--ink)', fontWeight: 600, textAlign: 'left' }}>
                      {layover.name || 'Unknown Airport'}
                    </div>
                    {layover.duration && (
                      <div style={{ color: 'var(--slate)', fontSize: 12, fontWeight: 500 }}>
                        Layover duration: {formatDuration(layover.duration)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(7, 112, 227, 0.06)',
            border: '1px solid rgba(7, 112, 227, 0.15)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginTop: 12,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>ℹ️</span>
            <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.5 }}>
              <strong>Redirection & Booking:</strong> Clicking "Book Now" redirects you directly to the official booking homepage of {flight.airline?.split(', ')[0] || 'the selected airline'} in a new tab.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}