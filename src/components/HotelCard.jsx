import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { formatPrice, formatDate } from '../utils/format.js';

const STUNNING_HOTEL_FALLBACKS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80', // Elegant hotel facade
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80', // Luxury resort pool
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80', // Ocean view resort
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80', // Classic luxury lobby
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80', // Modern bedroom suite
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80', // Boutique resort bedroom
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=80', // Sunset resort layout
];

export default function HotelCard({ hotel, index }) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Parse rating stars
  const getStarRating = (hotelClass) => {
    if (!hotelClass) return '';
    const match = hotelClass.match(/\d/);
    const count = match ? parseInt(match[0]) : 3; // default to 3 stars if not parseable
    return '⭐'.repeat(Math.min(5, Math.max(1, count)));
  };

  const getDeterministicFallback = (hotelName, idxVal) => {
    const nameStr = hotelName || '';
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash + idxVal) % STUNNING_HOTEL_FALLBACKS.length;
    return STUNNING_HOTEL_FALLBACKS[idx];
  };

  const stars = getStarRating(hotel.hotel_class);
  const mainImage = hotel.images && hotel.images.length > 0 && !imageError 
    ? hotel.images[0] 
    : getDeterministicFallback(hotel.hotel_name, index);

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
      <div className="hotel-card-grid">
        {/* Left: Hotel Image */}
        <div className="hotel-image-wrapper">
          <img
            src={mainImage}
            alt={hotel.hotel_name}
            onError={() => setImageError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
          />
          {hotel.hotel_class && (
            <span style={{
              position: 'absolute', bottom: 8, left: 8,
              background: 'rgba(5, 32, 60, 0.8)', color: 'white',
              fontSize: 10, fontWeight: 700, padding: '3px 8px',
              borderRadius: 6, backdropFilter: 'blur(4px)'
            }}>
              {hotel.hotel_class}
            </span>
          )}
        </div>

        {/* Middle: Details */}
        <div className="hotel-details-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{
              fontWeight: 700, fontSize: 18, color: 'var(--ink)',
              margin: 0, fontFamily: 'var(--font-display)', lineHeight: 1.2
            }}>
              {hotel.hotel_name}
            </h3>
            <span style={{ fontSize: 13 }}>{stars}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {hotel.rating && (
              <div style={{
                background: 'rgba(7, 112, 227, 0.08)', color: 'var(--sky)',
                fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                display: 'inline-flex', alignItems: 'center', gap: 4
              }}>
                🏆 {hotel.rating} / 5.0
              </div>
            )}
            {hotel.reviews_count && (
              <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500 }}>
                ({hotel.reviews_count.toLocaleString()} reviews)
              </span>
            )}
          </div>

          <div style={{ fontSize: 13, color: 'var(--slate)', display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ lineHeight: 1.4 }}>{hotel.address || 'Address not available'}</span>
          </div>

          {/* Amenities Badges */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {hotel.amenities.slice(0, 4).map((am, i) => (
                <span key={i} style={{
                  background: 'var(--cloud)', color: 'var(--slate)',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 12, border: '1px solid var(--mist)'
                }}>
                  {am}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span style={{
                  background: 'transparent', color: 'var(--sky)',
                  fontSize: 11, fontWeight: 700, padding: '3px 6px',
                }}>
                  +{hotel.amenities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Price & Redirection */}
        <div className="hotel-price-book">
          <div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: 'var(--ink)',
              fontFamily: 'var(--font-display)', lineHeight: 1,
            }}>
              {hotel.price_per_night_inr ? formatPrice(hotel.price_per_night_inr) : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>per night</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '9px 22px', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0770e3, #0547b8)',
              color: 'white', fontWeight: 700, fontSize: 13,
              boxShadow: '0 4px 12px rgba(7,112,227,0.3)',
              transition: 'var(--transition)',
              border: 'none', cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            Book Hotel
          </button>
        </div>
      </div>

      {/* Expand/Collapse Trigger */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '8px',
          background: expanded ? 'var(--sky-light)' : 'var(--cloud)',
          color: 'var(--sky)', fontSize: 12, fontWeight: 600,
          border: 'none', borderTop: '1px solid var(--mist)', transition: 'var(--transition)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-light)'}
        onMouseLeave={e => e.currentTarget.style.background = expanded ? 'var(--sky-light)' : 'var(--cloud)'}
      >
        {expanded ? '▲ Hide details' : '▼ Hotel details'}
      </button>

      {expanded && (
        <div style={{
          padding: '16px 24px', background: 'var(--cloud)',
          borderTop: '1px solid var(--mist)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div className="hotel-card-details-grid">
            {/* Nearby Places */}
            {hotel.nearby_places && hotel.nearby_places.length > 0 && (
              <div style={{
                background: 'white', borderRadius: 'var(--radius-sm)',
                padding: '12px 16px', border: '1px solid var(--mist)'
              }}>
                <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  📍 Nearby Attractions
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {hotel.nearby_places.map((place, i) => (
                    <li key={i}>{place}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Website redirect or fallback */}
            <div style={{
              background: 'white', borderRadius: 'var(--radius-sm)',
              padding: '12px 16px', border: '1px solid var(--mist)'
            }}>
              <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                🌐 Official Website
              </div>
              {hotel.booking_link ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Official Hotel Site</span>
                  <button
                    onClick={() => window.open(hotel.booking_link, '_blank')}
                    style={{
                      background: 'var(--sky-light)', color: 'var(--sky)', border: 'none',
                      padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                      cursor: 'pointer', transition: 'var(--transition)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-glow)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--sky-light)'}
                  >
                    View Site ↗
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500, fontStyle: 'italic', padding: '4px 0' }}>
                  Hotel has no any official website
                </div>
              )}
            </div>
          </div>

          {/* Amenities list (if long) */}
          {hotel.amenities && hotel.amenities.length > 4 && (
            <div style={{
              background: 'white', borderRadius: 'var(--radius-sm)',
              padding: '12px 16px', border: '1px solid var(--mist)', marginTop: 12
            }}>
              <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                ✨ All Facilities
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {hotel.amenities.map((am, i) => (
                  <span key={i} style={{
                    background: 'var(--cloud)', color: 'var(--ink)',
                    fontSize: 11, padding: '2px 8px', borderRadius: 4
                  }}>
                    {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Redirection Disclaimer */}
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
              <strong>Redirection & Booking:</strong> Clicking booking deals redirects you directly to the official reservation website of the hotel or agent.
            </div>
          </div>
        </div>
      )}

      {showModal && ReactDOM.createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 32, 60, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999, // Render over everything
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Modal Container */}
          <div className="booking-modal-container">
            {/* Close Button */}
            <button 
              className="booking-modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="booking-modal-title">
              Book this hotel via
            </h2>

            {/* Subtitle / Details */}
            <div className="booking-modal-details">
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{hotel.hotel_name}</span>
              <span>·</span>
              <span>{hotel.check_in_date && hotel.check_out_date ? `${formatDate(hotel.check_in_date)} – ${formatDate(hotel.check_out_date)}` : 'Dates flexible'}</span>
              <span>·</span>
              <span>2 guests</span>
            </div>

            {/* Booking Platforms List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Option 1: Booking.com */}
              <div className="booking-option-card booking-com-card">
                <div className="booking-brand-badge" style={{ background: '#003580', color: 'white' }}>
                  Booking.com
                </div>
                <span className="booking-option-desc">
                  Most popular globally
                </span>
                <button
                  className="booking-action-btn"
                  onClick={() => {
                    const link = hotel.booking_links?.booking_com || 'https://www.booking.com';
                    window.open(link, '_blank');
                  }}
                  style={{ background: '#003580', color: 'white' }}
                >
                  Book ➔
                </button>
              </div>

              {/* Option 2: MakeMyTrip */}
              <div className="booking-option-card makemytrip-card">
                <div className="booking-brand-badge" style={{ background: '#d91e36', color: 'white' }}>
                  MakeMyTrip
                </div>
                <span className="booking-option-desc">
                  Best for India bookings
                </span>
                <button
                  className="booking-action-btn"
                  onClick={() => {
                    const link = hotel.booking_links?.makemytrip || 'https://www.makemytrip.com';
                    window.open(link, '_blank');
                  }}
                  style={{ background: '#d91e36', color: 'white' }}
                >
                  Book ➔
                </button>
              </div>

              {/* Option 3: Expedia */}
              <div className="booking-option-card expedia-card">
                <div className="booking-brand-badge" style={{ background: '#ffbf00', color: '#1e293b' }}>
                  Expedia
                </div>
                <span className="booking-option-desc">
                  Good for international stays
                </span>
                <button
                  className="booking-action-btn"
                  onClick={() => {
                    const link = hotel.booking_links?.expedia || 'https://www.expedia.co.in';
                    window.open(link, '_blank');
                  }}
                  style={{ background: '#ffbf00', color: '#1e293b' }}
                >
                  Book ➔
                </button>
              </div>

            </div>

            {/* Footer Text */}
            <p style={{
              color: 'var(--slate)',
              fontSize: 12,
              fontWeight: 500,
              marginTop: 24,
              marginBottom: 0,
              lineHeight: 1.5,
              textAlign: 'center'
            }}>
              Each platform opens with hotel name, dates and guests already filled in.
            </p>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

