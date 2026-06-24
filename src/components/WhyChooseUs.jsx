import React from 'react';

// Custom SVG Icons with modern gradient designs
const AIIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#ai-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="url(#ai-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="url(#ai-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="ai-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10M12 20V4M6 20V14" stroke="url(#chart-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 20H21" stroke="url(#chart-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="4" r="2" fill="#00a896" />
    <defs>
      <linearGradient id="chart-grad" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00a896" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
  </svg>
);

const BoltIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#bolt-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="url(#users-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="url(#users-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.6944 17.2541 22.1338 16.5675C21.5732 15.8809 20.7906 15.4084 19.91 15.22" stroke="url(#users-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8837 3.31033 17.671 3.78287 18.2324 4.471C18.7937 5.15913 19.0984 6.02108 19.0984 6.91C19.0984 7.79892 18.7937 8.66087 18.2324 9.349C17.671 10.0371 16.8837 10.5097 16 10.69" stroke="url(#users-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="users-grad" x1="1" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
  </svg>
);

const FLIGHT_CARDS = [
  {
    icon: <AIIcon />,
    title: "AI-Powered Smart Routing",
    subtitle: "LangGraph-Driven Extraction",
    desc: "Specify your travel plan in conversational Hinglish or English. Our LLM agent extracts cities, dates, and preferences in milliseconds.",
    badge: "Llama 3.3 AI",
    badgeBg: "rgba(99, 102, 241, 0.08)",
    badgeColor: "#6366f1",
  },
  {
    icon: <ChartIcon />,
    title: "Real-time Flight Airfares",
    subtitle: "Direct SerpApi Live Feed",
    desc: "Access instant pricing and seat availability fetched directly from Google Flights. No stale caching, no middleman markups.",
    badge: "100% Live",
    badgeBg: "rgba(0, 168, 150, 0.08)",
    badgeColor: "#00a896",
  },
  {
    icon: <BoltIcon />,
    title: "Lightning-Fast Redirects",
    subtitle: "Zero-Commission Booking",
    desc: "Click 'Book Now' to jump instantly to the carrier's official ticket counter site. Save extra fees by bypassing traditional agency cutouts.",
    badge: "Direct Book",
    badgeBg: "rgba(245, 158, 11, 0.08)",
    badgeColor: "#f59e0b",
  },
  {
    icon: <UsersIcon />,
    title: "Secure Cloud Profiles",
    subtitle: "MongoDB Atlas Integration",
    desc: "Create a secure account to persist your flight search history, customize travel settings, and retrieve your profile preferences instantly from any device.",
    badge: "MongoDB Cloud",
    badgeBg: "rgba(14, 165, 233, 0.08)",
    badgeColor: "#0ea5e9",
  }
];

const HOTEL_CARDS = [
  {
    icon: <AIIcon />,
    title: "AI-Powered Smart Matching",
    subtitle: "LangGraph-Driven Extraction",
    desc: "Specify your lodging plan in conversational Hinglish or English. Our LLM agent extracts amenities, cities, dates, and preferences in milliseconds.",
    badge: "Llama 3.3 AI",
    badgeBg: "rgba(99, 102, 241, 0.08)",
    badgeColor: "#6366f1",
  },
  {
    icon: <ChartIcon />,
    title: "Real-time Hotel Rates",
    subtitle: "Direct SerpApi Live Feed",
    desc: "Access instant room pricing and availability details fetched directly from Google Hotels. No stale caching, no middleman markups.",
    badge: "100% Live",
    badgeBg: "rgba(0, 168, 150, 0.08)",
    badgeColor: "#00a896",
  },
  {
    icon: <BoltIcon />,
    title: "Multi-Option Comparisons",
    subtitle: "Zero-Commission Booking",
    desc: "Click 'Book Hotel' to compare Booking.com, MakeMyTrip, and Expedia. Secure the best rate without extra booking agency markup fees.",
    badge: "Compare Deals",
    badgeBg: "rgba(245, 158, 11, 0.08)",
    badgeColor: "#f59e0b",
  },
  {
    icon: <UsersIcon />,
    title: "Secure Cloud Profiles",
    subtitle: "MongoDB Atlas Integration",
    desc: "Create a secure account to persist your hotel search history, customize lodging preferences, and retrieve your profile preferences instantly from any device.",
    badge: "MongoDB Cloud",
    badgeBg: "rgba(14, 165, 233, 0.08)",
    badgeColor: "#0ea5e9",
  }
];

export default function WhyChooseUs({ serviceType = 'flights' }) {
  const isHotels = serviceType === 'hotels';
  const cards = isHotels ? HOTEL_CARDS : FLIGHT_CARDS;

  return (
    <div className="benefits-container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(7, 112, 227, 0.06)',
          borderRadius: '100px',
          padding: '5px 14px',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--sky)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>BENEFITS</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 3.2vw, 34px)',
          fontWeight: 800,
          color: 'var(--midnight)',
          letterSpacing: '-1px',
          marginBottom: 12,
        }}>
          {isHotels ? 'Why Smart Guests Choose TripMind' : 'Why Smart Travelers Choose TripMind'}
        </h2>
        <p style={{
          color: 'var(--slate)',
          fontSize: 15,
          maxWidth: 580,
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          {isHotels 
            ? 'Ditch legacy hotel booking platforms. Experience a next-generation AI assistant that works around the clock to find the perfect accommodations for you.'
            : 'Ditch legacy travel booking agencies. Experience a next-generation AI assistant that works around the clock to find the perfect flights for you.'
          }
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24,
      }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
              border: '1px solid #eef2f6',
              boxShadow: '0 4px 20px rgba(5, 32, 60, 0.02)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(5, 32, 60, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(7, 112, 227, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(5, 32, 60, 0.02)';
              e.currentTarget.style.borderColor = '#eef2f6';
            }}
          >
            {/* Top Accent line */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${card.badgeColor}, rgba(255,255,255,0))`
            }} />

            {/* Icon circle */}
            <div style={{
              width: 56, height: 56,
              borderRadius: 'var(--radius-md)',
              background: card.badgeBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: `0 4px 12px ${card.badgeBg}`,
            }}>
              {card.icon}
            </div>

            {/* Badge */}
            <div style={{
              background: card.badgeBg,
              color: card.badgeColor,
              fontSize: 10,
              fontWeight: 700,
              padding: '4px 9px',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 12,
            }}>
              {card.badge}
            </div>

            {/* Titles */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: 4,
            }}>
              {card.title}
            </h3>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--slate)',
              marginBottom: 12,
            }}>
              {card.subtitle}
            </span>

            {/* Description */}
            <p style={{
              fontSize: 13,
              color: 'var(--slate)',
              lineHeight: 1.6,
            }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
