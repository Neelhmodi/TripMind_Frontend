import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import FlightCard from '../components/FlightCard.jsx';
import HotelCard from '../components/HotelCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import SearchForm from '../components/SearchForm.jsx';
import HotelSearchForm from '../components/HotelSearchForm.jsx';
import { searchFlightsForm, searchFlightsNLP, searchHotelsForm, searchHotelsNLP } from '../utils/api.js';
import { formatDate, addDays, todayISO } from '../utils/format.js';
import Footer from '../components/Footer.jsx';
import { decryptParams } from '../utils/urlHelper.js';
import ReactDOM from 'react-dom';


export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  const [results, setResults]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [sortBy, setSortBy]         = useState('price');
  const [priceRange, setPriceRange] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  // Mobile filters states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [tempSortBy, setTempSortBy] = useState('price');
  const [tempPriceRange, setTempPriceRange] = useState(0);
  const [tempSelectedAirlines, setTempSelectedAirlines] = useState([]);

  // Decrypt parameters if available
  const q = searchParams.get('q');
  const decrypted = q ? decryptParams(q) : {};
  const isDecryptedEmpty = Object.keys(decrypted).length === 0;

  // Extract service type
  const pathService = window.location.pathname.includes('hotels') ? 'hotels' : 'flights';
  const serviceType = decrypted.serviceType || searchParams.get('serviceType') || pathService;
  const isHotels    = serviceType === 'hotels';

  // Flight/Hotel NLP search params fallback: if decryption failed but q is present, treat q as plain text NLP query
  const fallbackNlp = (q && isDecryptedEmpty) ? q : '';
  const nlp        = decrypted.nlp || searchParams.get('nlp') || fallbackNlp;
  const searchMode  = nlp ? 'nlp' : 'form';
  const originCity = decrypted.originCity || searchParams.get('originCity') || '';
  const originIata = decrypted.originIata || searchParams.get('originIata') || '';
  const destCity   = decrypted.destCity || searchParams.get('destCity')   || '';
  const destIata   = decrypted.destIata || searchParams.get('destIata')   || '';
  const departDate = decrypted.departDate || searchParams.get('departDate') || addDays(todayISO(), 14);
  const returnDate = decrypted.returnDate || searchParams.get('returnDate') || '';
  const adults     = parseInt(decrypted.adults || searchParams.get('adults')   || '1');
  const children   = parseInt(decrypted.children || searchParams.get('children') || '0');
  const airline    = decrypted.airline || searchParams.get('airline')    || '';
  const tripType   = decrypted.tripType || searchParams.get('tripType')   || 'one-way';

  // Hotel search params
  const city        = decrypted.city || searchParams.get('city') || '';
  const cityIata    = decrypted.cityIata || searchParams.get('cityIata') || '';
  const checkInDate = decrypted.checkInDate || searchParams.get('checkInDate') || '';
  const checkOutDate = decrypted.checkOutDate || searchParams.get('checkOutDate') || '';
  const rooms       = parseInt(decrypted.rooms || searchParams.get('rooms') || '1');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isHotels) {
      if (!nlp && !city) {
        setError('Destination city is required. Please go back and fill in the city.');
        setLoading(false);
        return;
      }
      try {
        let data;
        if (nlp) {
          data = await searchHotelsNLP(nlp);
        } else {
          data = await searchHotelsForm({
            city: city,
            city_iata: cityIata || null,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            num_adults: adults,
            num_children: children,
            num_rooms: rooms,
          });
        }
        setResults(data);
        if (data.hotels?.length) {
          const prices = data.hotels.map(h => h.price_per_night_inr).filter(Boolean);
          if (prices.length) setPriceRange(Math.max(...prices));
        }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Flights flow
      if (!nlp && (!originIata || !destIata)) {
        setError('Origin and destination are required. Please go back and fill in both cities.');
        setLoading(false);
        return;
      }

      try {
        let data;
        if (nlp) {
          data = await searchFlightsNLP(nlp);
        } else {
          data = await searchFlightsForm({
            origin_city:      originCity,
            origin_iata:      originIata,
            destination_city: destCity,
            destination_iata: destIata,
            depart_date:      departDate,
            return_date:      returnDate || null,
            num_adults:       adults,
            num_children:     children,
            preferred_airline: airline || null,
            trip_type:        tripType,
          });
        }
        setResults(data);
        if (data.outbound_flights?.length) {
          const prices = data.outbound_flights.map(f => f.price_inr).filter(Boolean);
          if (prices.length) setPriceRange(Math.max(...prices));
        }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }, [
    isHotels, nlp, city, cityIata, checkInDate, checkOutDate, rooms,
    originCity, originIata, destCity, destIata, departDate, returnDate, adults, children, airline, tripType
  ]);

  useEffect(() => {
    setSelectedAirlines([]);
    setShowSearch(false);
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  const getSortedFiltered = () => {
    if (isHotels) {
      if (!results?.hotels) return [];
      let list = [...results.hotels];
      if (priceRange) list = list.filter(h => !h.price_per_night_inr || h.price_per_night_inr <= priceRange);
      list.sort((a, b) => {
        if (sortBy === 'price')    return (a.price_per_night_inr || 9999999) - (b.price_per_night_inr || 9999999);
        if (sortBy === 'duration') return (b.rating || 0) - (a.rating || 0); // Sort hotels by rating when duration selected
        if (sortBy === 'depart')   return (b.reviews_count || 0) - (a.reviews_count || 0); // Sort by reviews
        return 0;
      });
      return list;
    } else {
      if (!results?.outbound_flights) return [];
      let flights = [...results.outbound_flights];
      if (priceRange) flights = flights.filter(f => !f.price_inr || f.price_inr <= priceRange);
      if (selectedAirlines.length > 0) {
        flights = flights.filter(f => {
          if (!f.airline) return false;
          const flightAirlines = f.airline.split(',').map(a => a.trim());
          return flightAirlines.some(a => selectedAirlines.includes(a));
        });
      }
      flights.sort((a, b) => {
        if (sortBy === 'price')    return (a.price_inr || 9999999) - (b.price_inr || 9999999);
        if (sortBy === 'duration') return (a.duration_minutes || 9999) - (b.duration_minutes || 9999);
        if (sortBy === 'depart')   return (a.departure_time || '').localeCompare(b.departure_time || '');
        return 0;
      });
      return flights;
    }
  };

  const flights = getSortedFiltered();
 
  const uniqueAirlines = React.useMemo(() => {
    if (isHotels || !results?.outbound_flights) return [];
    const set = new Set();
    results.outbound_flights.forEach(f => {
      if (f.airline) {
        f.airline.split(',').forEach(a => set.add(a.trim()));
      }
    });
    return Array.from(set).sort();
  }, [results, isHotels]);
 
  const meta    = results?.metadata;
  const allPrices = isHotels
    ? results?.hotels?.map(h => h.price_per_night_inr).filter(Boolean) || []
    : results?.outbound_flights?.map(f => f.price_inr).filter(Boolean) || [];
  const minP = allPrices.length ? Math.min(...allPrices) : null;
  const maxP = allPrices.length ? Math.max(...allPrices) : null;

  const openMobileFilters = () => {
    setTempSortBy(sortBy);
    setTempPriceRange(priceRange || maxP || 0);
    setTempSelectedAirlines(selectedAirlines);
    setShowMobileFilters(true);
  };

  const applyMobileFilters = () => {
    setSortBy(tempSortBy);
    setPriceRange(tempPriceRange);
    setSelectedAirlines(tempSelectedAirlines);
    setShowMobileFilters(false);
  };

  const clearMobileFilters = () => {
    setTempSortBy('price');
    setTempPriceRange(maxP || 0);
    setTempSelectedAirlines([]);
  };

  const routeLabel = nlp
    ? nlp
    : isHotels
      ? `Hotels in ${meta?.city || city}`
      : `${meta?.origin_city || originCity} (${meta?.origin_iata || originIata}) → ${meta?.destination_city || destCity} (${meta?.destination_iata || destIata})`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar serviceType={serviceType} />

      {/* Results header */}
      <div style={{ background: 'var(--night)', paddingTop: 64, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/', { state: { serviceType, searchMode } })} style={{
              background: 'rgba(255,255,255,0.1)', color: 'white',
              borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.15)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >← Back</button>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'white' }}>
                {routeLabel}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
                {isHotels ? (
                  <>
                    {meta?.check_in_date ? formatDate(meta.check_in_date) : formatDate(checkInDate)}
                    {` → `}
                    {meta?.check_out_date ? formatDate(meta.check_out_date) : formatDate(checkOutDate)}
                    {` · ${meta?.num_adults || adults} adult${(meta?.num_adults || adults) > 1 ? 's' : ''}`}
                    {(meta?.num_children || children) > 0 && `, ${meta?.num_children || children} child${(meta?.num_children || children) > 1 ? 'ren' : ''}`}
                    {` · ${meta?.num_rooms || rooms} room${(meta?.num_rooms || rooms) > 1 ? 's' : ''}`}
                  </>
                ) : (
                  <>
                    {meta?.depart_date ? formatDate(meta.depart_date) : formatDate(departDate)}
                    {meta?.return_date && ` → ${formatDate(meta.return_date)}`}
                    {` · ${meta?.num_adults || adults} adult${(meta?.num_adults || adults) > 1 ? 's' : ''}`}
                    {(meta?.num_children || children) > 0 && `, ${meta?.num_children || children} child${(meta?.num_children || children) > 1 ? 'ren' : ''}`}
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSearch(true)}
              style={{
                background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'var(--transition)',
                display: 'flex', alignItems: 'center', gap: 6
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span>🔍</span> Modify Search
            </button>


          </div>

          {showSearch && ReactDOM.createPortal(
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowSearch(false);
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
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box',
                animation: 'fadeIn 0.25s ease-out'
              }}
            >
              <div style={{
                background: 'white',
                borderRadius: 24,
                width: '100%',
                maxWidth: 1000,
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '36px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                boxSizing: 'border-box',
                animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <button
                  onClick={() => setShowSearch(false)}
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--cloud)',
                    color: 'var(--slate)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    transition: 'var(--transition)',
                    zIndex: 10
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--cloud)'}
                >
                  ✕
                </button>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--midnight)',
                  margin: '0 0 24px 0',
                  textAlign: 'left'
                }}>
                  Modify your search
                </h2>

                <div style={{ overflow: 'visible' }}>
                  {isHotels ? (
                    <HotelSearchForm isSidebar={false} initialData={{
                      city: meta?.city || city,
                      cityIata: meta?.city_iata || cityIata,
                      checkInDate: meta?.check_in_date || checkInDate,
                      checkOutDate: meta?.check_out_date || checkOutDate,
                      adults: meta?.num_adults || adults,
                      children: meta?.num_children || children,
                      rooms: meta?.num_rooms || rooms,
                    }} />
                  ) : (
                    <SearchForm isSidebar={false} initialData={{
                      originCity: meta?.origin_city || originCity,
                      originIata: meta?.origin_iata || originIata,
                      destCity:   meta?.destination_city || destCity,
                      destIata:   meta?.destination_iata || destIata,
                      departDate: meta?.depart_date || departDate,
                      returnDate: meta?.return_date || returnDate,
                      adults:     meta?.num_adults  || adults,
                      children:   meta?.num_children || children,
                      airline:    meta?.preferred_airline || airline,
                      tripType:   meta?.trip_type || tripType,
                    }} />
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {loading && <LoadingState count={5} isHotels={isHotels} />}

        {!loading && error && (
          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)',
            padding: '40px', textAlign: 'center',
            border: '1px solid #fecaca', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>
              Search Failed
            </h3>
            <p style={{ color: 'var(--slate)', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={fetchData} style={{
                padding: '12px 28px', borderRadius: 10,
                background: 'var(--sky)', color: 'white', fontWeight: 700, fontSize: 14,
                boxShadow: 'var(--shadow-sky)',
              }}>Try Again</button>
              <button onClick={() => navigate('/', { state: { serviceType, searchMode } })} style={{
                padding: '12px 28px', borderRadius: 10,
                background: 'var(--cloud)', color: 'var(--ink)', fontWeight: 700, fontSize: 14,
                border: '1px solid var(--mist)',
              }}>← New Search</button>
            </div>
          </div>
        )}

        {!loading && results?.status === 'missing_fields' && (
          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)',
            padding: '40px', textAlign: 'center',
            border: '1px solid #fef3c7', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--warning)', marginBottom: 12 }}>
              Missing Information
            </h3>
            <div style={{ marginBottom: 20 }}>
              {results.missing_fields.map((f, i) => (
                <div key={i} style={{
                  background: '#fef3c7', color: '#92400e',
                  borderRadius: 8, padding: '8px 16px',
                  display: 'inline-block', margin: '4px', fontSize: 13, fontWeight: 600,
                }}>⚠ {f}</div>
              ))}
            </div>
            <button onClick={() => navigate('/')} style={{
              padding: '12px 28px', borderRadius: 10,
              background: 'var(--sky)', color: 'white', fontWeight: 700, fontSize: 14,
            }}>Search Again</button>
          </div>
        )}

        {!loading && !error && results?.status !== 'missing_fields' && (
          <div className="results-layout">
            {/* Left Sidebar (Filters + Modify Search) */}
            <div className="results-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Filters Card */}
              <div className="results-filter-card" style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--mist)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  background: 'var(--night)',
                  color: 'white',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>⚡</span> Sort & Filter Results
                </div>

                {/* Body */}
                <div style={{ padding: '16px' }}>
                  {/* Results Count Info */}
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--slate)',
                    background: 'var(--cloud)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {flights.length} {isHotels ? 'hotel' : 'flight'}{flights.length !== 1 ? 's' : ''} found
                  </div>

                  {/* Sort By Section */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--slate)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      margin: '0 0 8px 0',
                    }}>
                      Sort By
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                      {[
                        { value: 'price',    label: 'Price'   },
                        { value: 'duration', label: isHotels ? 'Rating' : 'Duration' },
                        { value: 'depart',   label: isHotels ? 'Reviews' : 'Depart'  },
                      ].map(s => (
                        <button
                          key={s.value}
                          onClick={() => setSortBy(s.value)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: 6,
                            background: sortBy === s.value ? 'var(--sky)' : 'var(--cloud)',
                            color: sortBy === s.value ? 'white' : 'var(--slate)',
                            fontSize: 11,
                            fontWeight: 700,
                            transition: 'var(--transition)',
                            border: '1px solid',
                            borderColor: sortBy === s.value ? 'var(--sky)' : 'var(--mist)',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price Slider Section */}
                  {minP && maxP && (
                    <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 16 }}>
                      <h4 style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--slate)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        margin: '0 0 8px 0',
                      }}>
                        Max Price
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 6 }}>
                        <span>₹{Math.round(minP / 1000)}K</span>
                        <span style={{ color: 'var(--sky)', fontWeight: 700 }}>₹{Math.round((priceRange || maxP) / 1000)}K</span>
                      </div>
                      <input
                        type="range"
                        min={minP}
                        max={maxP}
                        value={priceRange || maxP}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--sky)', cursor: 'pointer' }}
                      />
                    </div>
                  )}
 
                  {/* Airlines Filter Section */}
                  {!isHotels && uniqueAirlines.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 16, marginTop: 16 }}>
                      <h4 style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--slate)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        margin: '0 0 10px 0',
                      }}>
                        Airlines
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 150, overflowY: 'auto', paddingRight: 4 }}>
                        {uniqueAirlines.map(airline => {
                          const isChecked = selectedAirlines.includes(airline);
                          return (
                            <label
                              key={airline}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--ink)',
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                                  } else {
                                    setSelectedAirlines([...selectedAirlines, airline]);
                                  }
                                }}
                                style={{
                                  width: 16,
                                  height: 16,
                                  accentColor: 'var(--sky)',
                                  cursor: 'pointer',
                                }}
                              />
                              <span>{airline}</span>
                            </label>
                          );
                        })}
                      </div>
                      {selectedAirlines.length > 0 && (
                        <button
                          onClick={() => setSelectedAirlines([])}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--sky)',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: 0,
                            marginTop: 8,
                            cursor: 'pointer',
                          }}
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Results List Container */}
            <div className="results-list-container">
              {flights.length === 0 ? (
                <div style={{
                  background: 'white', borderRadius: 'var(--radius-lg)',
                  padding: '60px 40px', textAlign: 'center',
                  border: '1px solid var(--mist)', boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>{isHotels ? '🏨' : '✈️'}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                    No {isHotels ? 'hotels' : 'flights'} found
                  </h3>
                  <p style={{ color: 'var(--slate)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.7 }}>
                    {isHotels
                      ? 'No hotels found for this city and dates. Try different dates or query keywords.'
                      : 'No flights found for this route and date. Try different dates or nearby airports.'
                    }
                  </p>
                  <button onClick={() => navigate('/', { state: { serviceType, searchMode } })} style={{
                    padding: '14px 32px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #0770e3, #0547b8)',
                    color: 'white', fontWeight: 700, fontSize: 15,
                    boxShadow: 'var(--shadow-sky)',
                  }}>← New Search</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {isHotels ? (
                    flights.map((hotel, i) => (
                      <HotelCard key={`${hotel.hotel_name}-${i}`} hotel={hotel} index={i} />
                    ))
                  ) : (
                    flights.map((flight, i) => (
                      <FlightCard key={`${flight.flight_number}-${i}`} flight={flight} index={i} />
                    ))
                  )}
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--slate)', fontSize: 13 }}>
                    ✓ Showing all {flights.length} results · Prices from {isHotels ? 'Google Hotels' : 'Google Flights'} via SerpApi
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer serviceType={serviceType} />

      {/* Mobile Floating Filters Button */}
      {!loading && !error && results?.status !== 'missing_fields' && flights.length > 0 && (
        <div className="mobile-filter-trigger-wrapper">
          <button className="mobile-filter-trigger-btn" onClick={openMobileFilters}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0770e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="8" x2="20" y2="8"></line>
              <line x1="4" y1="16" x2="20" y2="16"></line>
              <circle cx="16" cy="8" r="2.5" fill="white" stroke="#0770e3" strokeWidth="2.5"></circle>
              <circle cx="8" cy="16" r="2.5" fill="white" stroke="#0770e3" strokeWidth="2.5"></circle>
            </svg>
            <span>Filters</span>
          </button>
        </div>
      )}

      {/* Mobile Filters Portal */}
      {showMobileFilters && ReactDOM.createPortal(
        <div 
          className="mobile-filters-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileFilters(false);
            }
          }}
        >
          <div className="mobile-filters-sheet">
            {/* Header */}
            <div className="mobile-filters-header">
              <h3>
                Filters
                <span className="count-badge">
                  {flights.length} {isHotels ? 'hotel' : 'flight'}{flights.length !== 1 ? 's' : ''}
                </span>
              </h3>
              <button 
                className="mobile-filters-close-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="mobile-filters-body">
              
              {/* Sort By Segment */}
              <div>
                <h4 style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--slate)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 10px 0',
                }}>
                  Sort By
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { value: 'price',    label: 'Price'   },
                    { value: 'duration', label: isHotels ? 'Rating' : 'Duration' },
                    { value: 'depart',   label: isHotels ? 'Reviews' : 'Depart'  },
                  ].map(s => (
                    <button
                      key={s.value}
                      onClick={() => setTempSortBy(s.value)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: 8,
                        background: tempSortBy === s.value ? 'var(--sky)' : 'var(--cloud)',
                        color: tempSortBy === s.value ? 'white' : 'var(--slate)',
                        fontSize: 12,
                        fontWeight: 700,
                        transition: 'var(--transition)',
                        border: '1.5px solid',
                        borderColor: tempSortBy === s.value ? 'var(--sky)' : 'var(--mist)',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              {minP && maxP && (
                <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 20 }}>
                  <h4 style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--slate)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 10px 0',
                  }}>
                    Max Price
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>
                    <span>₹{Math.round(minP / 1000)}K</span>
                    <span style={{ color: 'var(--sky)', fontWeight: 800 }}>₹{Math.round(tempPriceRange / 1000)}K</span>
                  </div>
                  <input
                    type="range"
                    min={minP}
                    max={maxP}
                    value={tempPriceRange}
                    onChange={e => setTempPriceRange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--sky)', cursor: 'pointer' }}
                  />
                </div>
              )}

              {/* Airlines Checkboxes */}
              {!isHotels && uniqueAirlines.length > 0 && (
                <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 20 }}>
                  <h4 style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--slate)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 12px 0',
                  }}>
                    Airlines
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
                    {uniqueAirlines.map(airline => {
                      const isChecked = tempSelectedAirlines.includes(airline);
                      return (
                        <label
                          key={airline}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--ink)',
                            cursor: 'pointer',
                            padding: '4px 0',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setTempSelectedAirlines(tempSelectedAirlines.filter(a => a !== airline));
                              } else {
                                setTempSelectedAirlines([...tempSelectedAirlines, airline]);
                              }
                            }}
                            style={{
                              width: 18,
                              height: 18,
                              accentColor: 'var(--sky)',
                              cursor: 'pointer',
                            }}
                          />
                          <span>{airline}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="mobile-filters-footer">
              <button 
                className="mobile-filters-clear-btn"
                onClick={clearMobileFilters}
              >
                Clear All
              </button>
              <button 
                className="mobile-filters-apply-btn"
                onClick={applyMobileFilters}
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}