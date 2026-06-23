import React from 'react';

function SkeletonCard() {
  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--mist)', padding: '20px 24px',
      display: 'grid', gridTemplateColumns: '1fr auto 1fr auto auto',
      alignItems: 'center', gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, marginBottom: 6, width: '70%' }} />
          <div className="skeleton" style={{ height: 11, width: '50%' }} />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ height: 22, width: 80, marginBottom: 6, marginLeft: 'auto', marginRight: 'auto' }} />
        <div className="skeleton" style={{ height: 12, width: 40, marginLeft: 'auto', marginRight: 'auto' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="skeleton" style={{ height: 12, width: 60 }} />
        <div className="skeleton" style={{ height: 2, width: '100%' }} />
        <div className="skeleton" style={{ height: 18, width: 70 }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ height: 22, width: 80, marginBottom: 6, marginLeft: 'auto', marginRight: 'auto' }} />
        <div className="skeleton" style={{ height: 12, width: 40, marginLeft: 'auto', marginRight: 'auto' }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="skeleton" style={{ height: 28, width: 90, marginBottom: 8, marginLeft: 'auto' }} />
        <div className="skeleton" style={{ height: 36, width: 90, marginLeft: 'auto', borderRadius: 8 }} />
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
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
