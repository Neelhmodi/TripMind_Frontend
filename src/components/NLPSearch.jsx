import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptParams } from '../utils/urlHelper.js';

const FLIGHT_EXAMPLES = [
  "Delhi to Mumbai on July 20 with 2 adults",
  "Ahmedabad to Goa on 15 August, returning 22 August",
  "Mumbai to Dubai next Friday, budget 30000",
  "Bengaluru to Delhi on 10 July only IndiGo",
];

const HOTEL_EXAMPLES = [
  "Hotels in Goa for 3 nights next Friday",
  "5 star hotel in Dubai with swimming pool",
  "Cheap hotels in Mumbai under 4000 INR",
  "Hotels in Singapore near Marina Bay Sands",
];

export default function NLPSearch({ serviceType = 'flights' }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const isHotels = serviceType === 'hotels';
  const examples = isHotels ? HOTEL_EXAMPLES : FLIGHT_EXAMPLES;

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);

    // Auto-detect serviceType based on query keywords to route correctly
    let resolvedServiceType = serviceType;
    const lowerQuery = query.toLowerCase();
    const hotelKeywords = ['hotel', 'hotels', 'stay', 'stays', 'resort', 'resorts', 'accommodation', 'accommodations', 'room', 'rooms', 'hostel', 'hostels', 'motel', 'motels', 'lodging'];
    const flightKeywords = ['flight', 'flights', 'fly', 'flying', 'plane', 'planes', 'airline', 'airlines', 'ticket', 'tickets', 'fare', 'fares', 'nonstop', 'layover', 'airport', 'airports'];

    const hasHotelKey = hotelKeywords.some(kw => lowerQuery.includes(kw));
    const hasFlightKey = flightKeywords.some(kw => lowerQuery.includes(kw));

    if (hasHotelKey && !hasFlightKey) {
      resolvedServiceType = 'hotels';
    } else if (hasFlightKey && !hasHotelKey) {
      resolvedServiceType = 'flights';
    }

    const searchData = { 
      nlp: query.trim(),
      serviceType: resolvedServiceType
    };
    const token = encryptParams(searchData);
    navigate(`/${resolvedServiceType}?q=${token}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'visible' }}>
      {/* Title Bar - Matches height and spacing of SearchForm tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--mist)', padding: '0 18px', height: 40 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          color: '#6366f1', display: 'flex', alignItems: 'center', gap: 6,
          textTransform: 'uppercase', letterSpacing: '0.04em'
        }}>
          🤖 AI {isHotels ? 'Hotel' : 'Travel'} Assistant
        </span>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', borderRadius: 20, padding: '3px 10px',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
        }}>✨ AI POWERED</div>
      </div>

      <div style={{ padding: '22px' }}>
        <label style={{
          display: 'block', fontFamily: 'var(--font-display)',
          fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 6,
        }}>
          Describe your {isHotels ? 'hotel requirements' : 'trip'} in plain English:
        </label>

        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--cloud)', borderRadius: 'var(--radius-md)',
          padding: '6px 12px', border: '2px solid',
          borderColor: isFocused ? '#6366f1' : 'var(--mist)',
          transition: 'var(--transition)', marginBottom: 10,
        }}>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isHotels 
              ? 'e.g. "hotels in Goa for 3 nights next Friday with 2 adults and a swimming pool"'
              : 'e.g. "Ahmedabad to Goa on 15 August, returning 22 August with 2 adults"'
            }
            rows={2}
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontSize: 14, color: 'var(--ink)', padding: '4px 0',
              fontFamily: 'var(--font-body)', resize: 'none', outline: 'none',
              height: 60,
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              style={{
                alignSelf: 'flex-end', background: 'none', color: 'var(--slate)',
                fontSize: 18, border: 'none', padding: 0, marginTop: -4, cursor: 'pointer'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Example chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--slate)', alignSelf: 'center', marginRight: 4 }}>Try:</span>
          {examples.map((ex, i) => (
            <button key={i} onClick={() => setQuery(ex)} style={{
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1',
              fontSize: 11, fontWeight: 500, border: '1px solid rgba(99, 102, 241, 0.15)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; e.currentTarget.style.color = '#6366f1'; }}
            >
              {ex.length > 30 ? ex.slice(0, 30) + '…' : ex}
            </button>
          ))}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          style={{
            width: '100%', padding: '14px',
            background: query.trim()
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'var(--mist)',
            color: query.trim() ? 'white' : 'var(--slate)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
            boxShadow: query.trim() ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
            transition: 'var(--transition)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            border: 'none', cursor: query.trim() ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (query.trim() && !loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = query.trim() ? '0 4px 20px rgba(99,102,241,0.4)' : 'none'; }}
        >
          {loading
            ? <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            : '🤖'}
          {loading ? 'Processing...' : `Search ${isHotels ? 'Hotels' : 'Flights'}`}
        </button>
      </div>
    </div>
  );
}
