import React from 'react';

function SkeletonFlightCard() {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--mist)',
      overflow: 'hidden',
      padding: 0
    }}>
      <div className="flight-card-grid">
        {/* Airline Info */}
        <div className="flight-airline-info">
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 14, marginBottom: 6, width: '70%' }} />
            <div className="skeleton" style={{ height: 11, width: '40%' }} />
          </div>
        </div>

        {/* Times Container */}
        <div className="flight-times-container">
          <div className="flight-depart-time" style={{ minWidth: 60 }}>
            <div className="skeleton" style={{ height: 22, width: 60, marginBottom: 6, marginLeft: 'auto', marginRight: 'auto' }} />
            <div className="skeleton" style={{ height: 12, width: 30, marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
          <div className="flight-route-line">
            <div className="skeleton" style={{ height: 12, width: 50, marginBottom: 4 }} />
            <div className="skeleton" style={{ height: 2, width: '100%', marginBottom: 4 }} />
            <div className="skeleton" style={{ height: 16, width: 60, borderRadius: 8 }} />
          </div>
          <div className="flight-arrive-time" style={{ minWidth: 60 }}>
            <div className="skeleton" style={{ height: 22, width: 60, marginBottom: 6, marginLeft: 'auto', marginRight: 'auto' }} />
            <div className="skeleton" style={{ height: 12, width: 30, marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
        </div>

        {/* Price & Book */}
        <div className="flight-price-book">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div className="skeleton" style={{ height: 22, width: 80 }} />
            <div className="skeleton" style={{ height: 11, width: 50 }} />
          </div>
          <div className="skeleton" style={{ height: 38, width: 90, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonHotelCard() {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--mist)',
      overflow: 'hidden',
      padding: 0
    }}>
      <div className="hotel-card-grid">
        {/* Left: Hotel Image Skeleton */}
        <div className="hotel-image-wrapper">
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Middle: Details Skeleton */}
        <div className="hotel-details-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div className="skeleton" style={{ height: 20, width: '120px', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 14, width: 60, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="skeleton" style={{ height: 16, width: 80, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 12, width: 100, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 2 }}>
            <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <div className="skeleton" style={{ height: 18, width: 70, borderRadius: 12 }} />
            <div className="skeleton" style={{ height: 18, width: 60, borderRadius: 12 }} />
            <div className="skeleton" style={{ height: 18, width: 80, borderRadius: 12 }} />
          </div>
        </div>

        {/* Right: Price & Book Skeleton */}
        <div className="hotel-price-book">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div className="skeleton" style={{ height: 22, width: 80 }} />
            <div className="skeleton" style={{ height: 11, width: 50 }} />
          </div>
          <div className="skeleton" style={{ height: 38, width: 90, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}

export default function LoadingState({ count = 4, isHotels = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-md)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        border: '1px solid var(--mist)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-ring 1.5s infinite',
        }}>
          <span style={{ fontSize: 16, color: 'white' }}>{isHotels ? '🏨' : '✈'}</span>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
            {isHotels ? 'Searching for the best hotels…' : 'Searching for the best flights…'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--slate)' }}>
            {isHotels ? 'Comparing rates across premium platforms' : 'Checking all airlines and routes'}
          </div>
        </div>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        isHotels ? <SkeletonHotelCard key={i} /> : <SkeletonFlightCard key={i} />
      ))}
    </div>
  );
}
