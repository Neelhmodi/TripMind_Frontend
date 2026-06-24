import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { lookupIATA } from '../utils/api.js';
import { todayISO, addDays } from '../utils/format.js';
import { encryptParams } from '../utils/urlHelper.js';

const ALL_CITIES = [
  { city: 'Delhi',              iata: 'DEL', country: 'India' },
  { city: 'New Delhi',          iata: 'DEL', country: 'India' },
  { city: 'Mumbai',             iata: 'BOM', country: 'India' },
  { city: 'Bengaluru',          iata: 'BLR', country: 'India' },
  { city: 'Ahmedabad',          iata: 'AMD', country: 'India' },
  { city: 'Goa',                iata: 'GOI', country: 'India' },
  { city: 'Kolkata',            iata: 'CCU', country: 'India' },
  { city: 'Chennai',            iata: 'MAA', country: 'India' },
  { city: 'Hyderabad',          iata: 'HYD', country: 'India' },
  { city: 'Pune',               iata: 'PNQ', country: 'India' },
  { city: 'Jaipur',             iata: 'JAI', country: 'India' },
  { city: 'Kochi',              iata: 'COK', country: 'India' },
  { city: 'Lucknow',            iata: 'LKO', country: 'India' },
  { city: 'Vadodara',           iata: 'BDQ', country: 'India' },
  { city: 'Surat',              iata: 'STV', country: 'India' },
  { city: 'Indore',             iata: 'IDR', country: 'India' },
  { city: 'Bhopal',             iata: 'BHO', country: 'India' },
  { city: 'Nagpur',             iata: 'NAG', country: 'India' },
  { city: 'Patna',              iata: 'PAT', country: 'India' },
  { city: 'Ranchi',             iata: 'IXR', country: 'India' },
  { city: 'Bhubaneswar',        iata: 'BBI', country: 'India' },
  { city: 'Guwahati',           iata: 'GAU', country: 'India' },
  { city: 'Amritsar',           iata: 'ATQ', country: 'India' },
  { city: 'Chandigarh',         iata: 'IXC', country: 'India' },
  { city: 'Coimbatore',         iata: 'CJB', country: 'India' },
  { city: 'Mangalore',          iata: 'IXE', country: 'India' },
  { city: 'Trichy',             iata: 'TRZ', country: 'India' },
  { city: 'Varanasi',           iata: 'VNS', country: 'India' },
  { city: 'Leh',                iata: 'IXL', country: 'India' },
  { city: 'Srinagar',           iata: 'SXR', country: 'India' },
  { city: 'Jammu',              iata: 'IXJ', country: 'India' },
  { city: 'Jodhpur',            iata: 'JDH', country: 'India' },
  { city: 'Udaipur',            iata: 'UDR', country: 'India' },
  { city: 'Raipur',             iata: 'RPR', country: 'India' },
  { city: 'Visakhapatnam',      iata: 'VTZ', country: 'India' },
  { city: 'Vijayawada',          iata: 'VGA', country: 'India' },
  { city: 'Thiruvananthapuram', iata: 'TRV', country: 'India' },
  { city: 'Kozhikode',          iata: 'CCJ', country: 'India' },
  { city: 'Dibrugarh',          iata: 'DIB', country: 'India' },
  { city: 'Imphal',             iata: 'IMF', country: 'India' },
  { city: 'Bagdogra',           iata: 'IXB', country: 'India' },
  { city: 'Port Blair',         iata: 'IXZ', country: 'India' },
  { city: 'Hubli',              iata: 'HBX', country: 'India' },
  { city: 'Tirupati',           iata: 'TIR', country: 'India' },
  { city: 'Dehradun',           iata: 'DED', country: 'India' },
  { city: 'Gwalior',            iata: 'GWL', country: 'India' },
  { city: 'Dubai',              iata: 'DXB', country: 'UAE' },
  { city: 'Abu Dhabi',          iata: 'AUH', country: 'UAE' },
  { city: 'Sharjah',            iata: 'SHJ', country: 'UAE' },
  { city: 'Singapore',          iata: 'SIN', country: 'Singapore' },
  { city: 'Bangkok',            iata: 'BKK', country: 'Thailand' },
  { city: 'London',             iata: 'LHR', country: 'UK' },
  { city: 'New York',           iata: 'JFK', country: 'USA' },
  { city: 'Paris',              iata: 'CDG', country: 'France' },
  { city: 'Bali',               iata: 'DPS', country: 'Indonesia' },
  { city: 'Kuala Lumpur',       iata: 'KUL', country: 'Malaysia' },
  { city: 'Colombo',            iata: 'CMB', country: 'Sri Lanka' },
  { city: 'Kathmandu',          iata: 'KTM', country: 'Nepal' },
  { city: 'Doha',               iata: 'DOH', country: 'Qatar' },
  { city: 'Muscat',             iata: 'MCT', country: 'Oman' },
  { city: 'Toronto',            iata: 'YYZ', country: 'Canada' },
  { city: 'Sydney',             iata: 'SYD', country: 'Australia' },
  { city: 'Melbourne',          iata: 'MEL', country: 'Australia' },
  { city: 'Tokyo',              iata: 'NRT', country: 'Japan' },
  { city: 'Hong Kong',          iata: 'HKG', country: 'Hong Kong' },
];

function GuestCounter({ label, value, onDec, onInc, min = 0 }) {
  return (
    <div style={{
      flex: '1 1 110px', minWidth: 0, background: 'var(--cloud)',
      borderRadius: 'var(--radius-md)', padding: '6px 12px',
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onDec}
          type="button"
          style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: value <= min ? 'var(--mist)' : 'white',
            color: value <= min ? 'var(--steel)' : 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 400, lineHeight: 1,
            border: '1.5px solid var(--mist)',
            cursor: value <= min ? 'not-allowed' : 'pointer',
          }}
        >−</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', minWidth: 24, textAlign: 'center' }}>{value}</span>
        <button
          onClick={onInc}
          type="button"
          style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: 'var(--sky)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 400, lineHeight: 1,
            border: 'none', cursor: 'pointer',
          }}
        >+</button>
      </div>
    </div>
  );
}

function DestinationInput({ label, value, iata, onChange, placeholder }) {
  const [query, setQuery]           = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen]             = useState(false);
  const [resolvedIata, setResolvedIata] = useState(iata || '');
  const ref     = useRef(null);
  const debounce = useRef(null);

  useEffect(() => { setQuery(value || ''); setResolvedIata(iata || ''); }, [value, iata]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filter = (q) => ALL_CITIES.filter(c =>
    c.city.toLowerCase().includes(q.toLowerCase()) ||
    c.iata.toLowerCase().includes(q.toLowerCase())
  );

  const handleInput = (val) => {
    setQuery(val);
    onChange(val, ''); // Update parent state immediately so custom cities can be searched
    setResolvedIata(''); // Clear previous IATA code for new custom city

    clearTimeout(debounce.current);

    // Only filter and show matching suggestions when input has at least 2 characters
    if (val.length >= 2) {
      const filtered = filter(val);
      setSuggestions(filtered);
      setOpen(true);
    } else {
      // Show default top 8 cities when input is shorter
      setSuggestions(ALL_CITIES.slice(0, 8));
      setOpen(val.length > 0);
    }

    if (!val) return;
    debounce.current = setTimeout(async () => {
      const result = await lookupIATA(val);
      if (result?.found) { 
        onChange(val, result.iata); 
        setResolvedIata(result.iata); 
      }
    }, 600);
  };

  const selectCity = (c) => {
    setQuery(c.city); 
    setResolvedIata(c.iata);
    onChange(c.city, c.iata); 
    setOpen(false);
  };

  // Build suggestions list: prepend a dynamic "Search in ..." option if custom text is typed
  const displaySuggestions = [...suggestions];
  if (query && !filter(query).some(c => c.city.toLowerCase() === query.toLowerCase())) {
    displaySuggestions.unshift({ city: query, iata: '', country: 'Search Location' });
  }

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => { setSuggestions(query && query.length >= 2 ? filter(query) : ALL_CITIES.slice(0, 8)); setOpen(true); }}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 60px 10px 36px', border: '2px solid transparent', borderRadius: 'var(--radius-sm)', background: 'transparent', fontSize: 15, fontWeight: 600, color: 'var(--ink)', outline: 'none', transition: 'var(--transition)' }}
        />
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: resolvedIata ? 'var(--sky)' : 'var(--steel)' }}>🏨</span>
        {resolvedIata && (
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: 'var(--sky)', background: 'var(--sky-light)', padding: '2px 6px', borderRadius: 4 }}>{resolvedIata}</span>
        )}
      </div>
      {open && displaySuggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--mist)', overflow: 'hidden', marginTop: 2, animation: 'fadeIn 0.15s ease' }}>
          <div style={{ padding: '6px 12px 2px', fontSize: 10, color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Locations</div>
          {displaySuggestions.slice(0, 6).map(c => (
            <button key={`${c.city}-${c.iata}`} type="button" onMouseDown={() => selectCity(c)} style={{ width: '100%', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', color: 'var(--ink)', textAlign: 'left', border: 'none', borderBottom: '1px solid var(--mist)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--sky-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                {c.country === 'Search Location' ? '🔍' : '🏙️'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.city}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)' }}>{c.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const formatDateFriendly = (dateStr) => {
  if (!dateStr) return 'Select date';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

function DatePicker({ label, value, minDate, onChange, isSidebar = false }) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const ref = useRef(null);

  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    if (!isNaN(d.getTime())) {
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  }, [value, open]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handleDaySelect = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setOpen(false);
  };

  const isDayDisabled = (day) => {
    if (!day) return true;
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return minDate && dateStr < minDate;
  };

  const isDaySelected = (day) => {
    if (!day) return false;
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return dateStr === value;
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const displayValue = value ? formatDateFriendly(value) : 'Select date';

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        style={{
          width: '100%',
          padding: isSidebar ? '4px 12px 4px 30px' : '8px 12px 8px 30px',
          border: '2px solid transparent',
          borderRadius: 'var(--radius-sm)',
          background: 'transparent',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ink)',
          textAlign: 'left',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: isSidebar ? 30 : 38,
          cursor: 'pointer',
        }}
      >
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--sky)' }}>
          📅
        </span>
        {displayValue}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 300,
            background: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--mist)',
            padding: 16,
            marginTop: 4,
            width: 280,
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button
              onClick={handlePrevMonth}
              type="button"
              style={{
                background: 'var(--cloud)', border: '1px solid var(--mist)', borderRadius: 8,
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: 'var(--slate)', cursor: 'pointer',
              }}
            >
              ←
            </button>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{monthName}</span>
            <button
              onClick={handleNextMonth}
              type="button"
              style={{
                background: 'var(--cloud)', border: '1px solid var(--mist)', borderRadius: 8,
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: 'var(--slate)', cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 8 }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <span key={day} style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const disabled = isDayDisabled(day);
              const selected = isDaySelected(day);

              return (
                <button
                  key={day}
                  onClick={(e) => { e.stopPropagation(); if (!disabled) handleDaySelect(day); }}
                  disabled={disabled}
                  type="button"
                  style={{
                    padding: '6px 0',
                    borderRadius: 8,
                    background: selected ? 'var(--sky)' : 'transparent',
                    color: selected ? 'white' : disabled ? 'var(--steel)' : 'var(--ink)',
                    fontSize: 13,
                    fontWeight: selected ? 700 : 500,
                    border: 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled && !selected) e.currentTarget.style.background = 'var(--sky-light)';
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled && !selected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelSearchForm({ initialData, isSidebar = false }) {
  const navigate = useNavigate();
  const [dest, setDest]             = useState({ city: initialData?.city || '', iata: initialData?.cityIata || '' });
  const [checkIn, setCheckIn]       = useState(initialData?.checkInDate || addDays(todayISO(), 7));
  const [checkOut, setCheckOut]     = useState(initialData?.checkOutDate || addDays(todayISO(), 10));
  const [adults, setAdults]         = useState(initialData?.adults || 2);
  const [children, setChildren]     = useState(initialData?.children || 0);
  const [rooms, setRooms]           = useState(initialData?.rooms || 1);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  const handleDestChange = (city, iata) => {
    setDest({ city, iata });
    if (errors.dest) {
      setErrors(prev => { const next = { ...prev }; delete next.dest; return next; });
    }
  };

  const handleCheckInChange = (date) => {
    setCheckIn(date);
    if (errors.checkIn) {
      setErrors(prev => { const next = { ...prev }; delete next.checkIn; return next; });
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date);
    if (errors.checkOut) {
      setErrors(prev => { const next = { ...prev }; delete next.checkOut; return next; });
    }
  };

  const validate = () => {
    const errs = {};
    if (!dest.city) {
      errs.dest = 'Please select a destination city';
    }
    if (!checkIn) {
      errs.checkIn = 'Please select a check-in date';
    }
    if (!checkOut) {
      errs.checkOut = 'Please select a check-out date';
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      errs.checkOut = 'Check-out date must be after check-in date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = () => {
    if (!validate()) return;
    setLoading(true);
    const searchData = {
      serviceType: 'hotels',
      city: dest.city,
      cityIata: dest.iata || '',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString(),
    };
    const token = encryptParams(searchData);
    navigate(`/${searchData.serviceType}?q=${token}`);
  };

  return (
    <div style={isSidebar ? { overflow: 'visible' } : { background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'visible' }}>
      {/* Decorative Title Bar matching Flights form */}
      {!isSidebar && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--mist)', padding: '0 20px', height: 40, alignItems: 'center' }}>
          <span style={{
            padding: '10px 14px', fontWeight: 700, fontSize: 13,
            color: 'var(--sky)', transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: 6
          }}>
            🏨 Hotel Search
          </span>
        </div>
      )}

      <div style={{ padding: isSidebar ? '12px 0 0 0' : '22px' }}>
        {/* City row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ flex: 1, background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: isSidebar ? '5px 10px' : '8px 12px' }}>
            <DestinationInput label="Going To" value={dest.city} iata={dest.iata}
              onChange={handleDestChange} placeholder="Destination city" />
            {errors.dest && <p style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{errors.dest}</p>}
          </div>
        </div>

        {/* Dates + rooms + guests */}
        <div className="search-fields-grid-5">
          {/* Check-in */}
          <div style={{ flex: '1 1 130px', background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: isSidebar ? '4px 10px' : '8px 12px', display: 'flex', alignItems: 'center' }}>
            <DatePicker
              label="Check-in"
              value={checkIn}
              minDate={todayISO()}
              onChange={handleCheckInChange}
              isSidebar={isSidebar}
            />
            {errors.checkIn && <p style={{ color: 'var(--danger)', fontSize: 10, marginTop: 2 }}>{errors.checkIn}</p>}
          </div>

          {/* Check-out */}
          <div style={{ flex: '1 1 130px', background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: isSidebar ? '4px 10px' : '8px 12px', display: 'flex', alignItems: 'center' }}>
            <DatePicker
              label="Check-out"
              value={checkOut}
              minDate={checkIn || todayISO()}
              onChange={handleCheckOutChange}
              isSidebar={isSidebar}
            />
            {errors.checkOut && <p style={{ color: 'var(--danger)', fontSize: 10, marginTop: 2 }}>{errors.checkOut}</p>}
          </div>

          {/* Rooms */}
          <GuestCounter
            label="Rooms"
            value={rooms}
            min={1}
            onDec={() => setRooms(Math.max(1, rooms - 1))}
            onInc={() => setRooms(Math.min(9, rooms + 1))}
          />

          {/* Adults */}
          <GuestCounter
            label="Adults"
            value={adults}
            min={1}
            onDec={() => setAdults(Math.max(1, adults - 1))}
            onInc={() => setAdults(Math.min(9, adults + 1))}
          />

          {/* Children */}
          <GuestCounter
            label="Children"
            value={children}
            min={0}
            onDec={() => setChildren(Math.max(0, children - 1))}
            onInc={() => setChildren(Math.min(9, children + 1))}
          />
        </div>

        {/* Search button */}
        <button onClick={handleSearch} disabled={loading} style={{
          width: '100%', padding: isSidebar ? '11px' : '14px',
          background: 'linear-gradient(135deg, #0770e3, #0547b8)',
          color: 'white', borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
          boxShadow: 'var(--shadow-sky)', transition: 'var(--transition)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          border: 'none', cursor: 'pointer',
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(7,112,227,0.4)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sky)'; }}
        >
          {loading
            ? <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            : '🏨'}
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </div>
    </div>
  );
}
