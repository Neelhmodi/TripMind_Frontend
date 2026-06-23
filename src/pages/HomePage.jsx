import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SearchForm from '../components/SearchForm.jsx';
import HotelSearchForm from '../components/HotelSearchForm.jsx';
import NLPSearch from '../components/NLPSearch.jsx';
import { addDays, todayISO } from '../utils/format.js';
import { encryptParams } from '../utils/urlHelper.js';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import Footer from '../components/Footer.jsx';









const DESTINATIONS = [
  { city: 'Goa',       iata: 'GOI', img: 'goa.jpg',       desc: 'Beach paradise', from: '₹3.5K' },
  { city: 'Dubai',     iata: 'DXB', img: 'dubai.jpg',     desc: 'City of gold',   from: '₹15K'  },
  { city: 'Singapore', iata: 'SIN', img: 'singapore.jpg', desc: 'Garden city',    from: '₹18K'  },
  { city: 'Delhi',     iata: 'DEL', img: 'delhi.jpg',     desc: 'Capital city',   from: '₹2.5K' },
  { city: 'Bangkok',   iata: 'BKK', img: 'bangkok.jpg',   desc: 'Temple city',    from: '₹12K'  },
  { city: 'Jaipur',    iata: 'JAI', img: 'jaipur.jpg',    desc: 'Pink city',      from: '₹2K'   },
];

const POPULAR_HOTELS = [
  { name: 'The Taj Mahal Palace', city: 'Mumbai', img: 'hotel_taj.png',       desc: 'Iconic heritage luxury overlooking the Gateway of India', from: '₹22K' },
  { name: 'Marina Bay Sands',     city: 'Singapore', img: 'hotel_mbs.png',    desc: 'World-famous infinity pool and skyline views', from: '₹45K' },
  { name: 'Burj Al Arab',         city: 'Dubai', img: 'hotel_burj.png',       desc: 'Ultra-luxury sail-shaped suite-only hotel', from: '₹95K' },
  { name: 'Rambagh Palace',       city: 'Jaipur', img: 'hotel_rambagh.png',   desc: 'Live like royalty in a historic heritage palace', from: '₹28K' },
  { name: 'Atlantis The Palm',    city: 'Dubai', img: 'hotel_atlantis.png',   desc: 'Ocean-themed luxury resort on Palm Jumeirah', from: '₹35K' },
  { name: 'The Oberoi Amarvilas', city: 'Agra', img: 'hotel_oberoi.png',     desc: 'Exquisite luxury rooms with views of the Taj Mahal', from: '₹25K' },
];

const AIRLINES = [
  { name: 'IndiGo',            logo: 'logo_indigo.svg' },
  { name: 'Air India',          logo: 'logo_airindia.svg' },
  { name: 'SpiceJet',           logo: 'logo_spicejet.svg' },
  { name: 'Emirates',           logo: 'logo_emirates.svg' },
  { name: 'Qatar Airways',      logo: 'logo_qatar.svg' },
  { name: 'Singapore Airlines', logo: 'logo_singapore.svg' },
  { name: 'Lufthansa',          logo: 'logo_lufthansa.svg' },
  { name: 'British Airways',    logo: 'logo_britishairways.svg' },
];

const HOTEL_BRANDS = [
  { name: 'Taj Hotels',     logo: 'logo_taj.svg' },
  { name: 'Marriott',       logo: 'logo_marriott.svg' },
  { name: 'Hilton',         logo: 'logo_hilton.svg' },
  { name: 'Hyatt',          logo: 'logo_hyatt.svg' },
  { name: 'Radisson',       logo: 'logo_radisson.svg' },
  { name: 'Oberoi Hotels',  logo: 'logo_oberoi.svg' },
  { name: 'Novotel',        logo: 'logo_novotel.svg' },
  { name: 'Sheraton',       logo: 'logo_sheraton.svg' },
];


export default function HomePage() {
  const location = useLocation();
  const [searchMode, setSearchMode] = useState(location.state?.searchMode || 'form');
  const [serviceType, setServiceType] = useState(location.state?.serviceType || 'flights');

  const navigate = useNavigate();
  const conveyorRef = useRef(null);

  const scrollConveyor = (offset) => {
    if (conveyorRef.current) {
      conveyorRef.current.scrollLeft += offset;
    }
  };

  const handleDestinationClick = (d) => {
    const defaultDepart = addDays(todayISO(), 14); // 2 weeks out
    const searchData = {
      serviceType: 'flights',
      originCity:  'Ahmedabad',
      originIata:  'AMD',
      destCity:    d.city,
      destIata:    d.iata,
      departDate:  defaultDepart,
      returnDate:  '',
      adults:      '1',
      children:    '0',
      airline:     '',
      tripType:    'one-way',
    };
    const token = encryptParams(searchData);
    navigate(`/${searchData.serviceType}?q=${token}`);
  };

  const handleHotelClick = (h) => {
    const checkIn = addDays(todayISO(), 7); // 7 days from today
    const checkOut = addDays(checkIn, 3);   // 3 nights
    const searchData = {
      serviceType: 'hotels',
      city: h.city,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      rooms: '1',
      adults: '1',
      children: '0'
    };
    const token = encryptParams(searchData);
    navigate(`/${searchData.serviceType}?q=${token}`);
  };



  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar serviceType={serviceType} onServiceTypeChange={setServiceType} />

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-container animate-fade">
          {/* Left Column */}
          <div className="hero-left">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(7, 112, 227, 0.06)',
              border: '1px solid rgba(7, 112, 227, 0.15)',
              borderRadius: '100px',
              padding: '5px 14px',
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 12, color: 'var(--sky)' }}>✨</span>
              <span style={{ color: 'var(--sky)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {serviceType === 'flights' ? 'AI-POWERED FLIGHT SEARCH' : 'AI-POWERED HOTEL SEARCH'}
              </span>
            </div>
            
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 800,
              color: 'var(--midnight)',
              lineHeight: 1.1,
              marginBottom: 10,
              letterSpacing: '-1.2px',
            }}>
              Find Your Perfect<br />
              <span style={{ color: 'var(--sky)' }}>{serviceType === 'flights' ? 'Flight' : 'Hotel'}</span> in Seconds
            </h1>
            
            <p style={{
              color: 'var(--slate)',
              fontSize: '15px',
              fontWeight: 400,
              maxWidth: 520,
              lineHeight: 1.5,
              marginBottom: 12,
            }}>
              {serviceType === 'flights' 
                ? 'Search smarter with AI. Type naturally, search instantly, fly confidently.'
                : 'Search smarter with AI. Type naturally, search instantly, stay comfortably.'
              }
            </p>



            {/* Mode Switcher (Search Form vs AI Search) */}
            <div className="hero-switcher" style={{ marginBottom: 14 }}>
              {[
                { id: 'form', label: '🔍 Search Form' },
                { id: 'nlp',  label: '🤖 AI Search'   },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSearchMode(mode.id)}
                  style={{
                    padding: '8px 18px',
                    background: searchMode === mode.id ? 'var(--sky)' : 'white',
                    color: searchMode === mode.id ? 'white' : 'var(--slate)',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 13,
                    border: '1px solid',
                    borderColor: searchMode === mode.id ? 'var(--sky)' : 'var(--mist)',
                    transition: 'var(--transition)',
                    boxShadow: searchMode === mode.id ? '0 4px 14px rgba(7, 112, 227, 0.2)' : 'none',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div key={`${serviceType}-${searchMode}`} className="animate-fade">
              {serviceType === 'flights' ? (
                searchMode === 'form' ? <SearchForm /> : <NLPSearch serviceType="flights" />
              ) : (
                searchMode === 'form' ? <HotelSearchForm /> : <NLPSearch serviceType="hotels" />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div key={`hero-images-${serviceType}`} className="hero-right animate-fade">
            <img
              src={serviceType === 'flights' ? "/masthead_10_1.png" : "/masthead_hotels_1.png"}
              alt="Travel Destination 1"
              className="hero-img-1"
            />
            <img
              src={serviceType === 'flights' ? "/masthead_10_2.png" : "/masthead_hotels_2.png"}
              alt="Travel Destination 2"
              className="hero-img-2"
            />
          </div>
        </div>
      </div>

      {/* Popular destinations / hotels */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            {serviceType === 'flights' ? 'Popular Destinations' : 'Popular Hotels'}
          </h2>
          <span style={{ color: 'var(--slate)', fontSize: 14 }}>
            {serviceType === 'flights' 
              ? 'From Ahmedabad' 
              : 'Top-rated accommodations worldwide'}
          </span>
        </div>

        <div className="conveyor-container">
          <div className="conveyor-track">
            {(serviceType === 'flights' ? [...DESTINATIONS, ...DESTINATIONS] : [...POPULAR_HOTELS, ...POPULAR_HOTELS]).map((item, i) => {
              const isFlight = serviceType === 'flights';
              return (
                <button
                  key={`${isFlight ? item.city : item.name}-${i}`}
                  className="dest-card animate-fade"
                  style={{ animationDelay: `${(i % 6) * 0.08}s`, background: 'none', border: 'none', padding: 0 }}
                  onClick={() => isFlight ? handleDestinationClick(item) : handleHotelClick(item)}
                >
                  {/* Image header */}
                  <div style={{ position: 'relative', height: 140, width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={`/${item.img}`} 
                      alt={isFlight ? item.city : item.name} 
                      className="dest-card-image"
                    />
                  </div>
                  
                  {/* Details */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontWeight: 700, 
                        fontSize: isFlight ? 16 : 14, 
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: isFlight ? '70%' : '75%',
                        textAlign: 'left'
                      }}>
                        {isFlight ? item.city : item.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 600 }}>
                        {isFlight ? item.iata : item.city}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                      {item.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f5f8ff', paddingTop: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--slate)' }}>
                        {isFlight ? 'Fares from' : 'Rates from'}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--sky)' }}>
                        {item.from}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <WhyChooseUs serviceType={serviceType} />

      {/* Popular Airlines/Hotels Conveyor Belt */}
      <div style={{ padding: '24px 0 40px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto 16px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
              {serviceType === 'flights' ? 'Popular Airlines' : 'Popular Hotels'}
            </h2>
          </div>
        </div>

        <div className="airline-conveyor-section">
          <div className="airline-conveyor-track">
            {(serviceType === 'flights' ? [...AIRLINES, ...AIRLINES] : [...HOTEL_BRANDS, ...HOTEL_BRANDS]).map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="airline-logo-card"
              >
                <div className="airline-logo-circle">
                  <img 
                    src={`/${item.logo}`} 
                    alt={item.name} 
                    className="airline-logo-icon"
                  />
                </div>
                <span className="airline-logo-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer serviceType={serviceType} />
    </div>
  );
}