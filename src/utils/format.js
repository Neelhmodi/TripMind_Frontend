// Fix: Show full integer price like ₹5,700 instead of ₹5.7K
export function formatPrice(priceInr) {
  if (!priceInr) return '—';
  return `₹${priceInr.toLocaleString('en-IN')}`;
}

export function formatDuration(minutes) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const parts = timeStr.split(' ');
  const timePart = parts.length === 2 ? parts[1] : timeStr;
  const timeParts = timePart.split(':');
  if (timeParts.length >= 2) {
    const h = parseInt(timeParts[0]);
    const m = timeParts[1];
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
  }
  return timePart.substring(0, 5);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getAirlineColor(airline) {
  const colors = {
    'IndiGo': '#1b3a8f', 'Air India': '#d72b3f', 'SpiceJet': '#ff5722',
    'Vistara': '#6b1a7e', 'Akasa Air': '#ff6b35', 'Air India Express': '#ff4444',
    'Emirates': '#c8102e', 'Qatar Airways': '#5c1f3f', 'Singapore Airlines': '#003b6f',
    'Lufthansa': '#05164d', 'British Airways': '#075aaa',
  };
  const key = Object.keys(colors).find(k => airline?.includes(k));
  return colors[key] || '#0770e3';
}

// Real airline logo URLs from Wikipedia/official sources or dynamic Duffel flight assets CDN
export function getAirlineLogo(airline, flightNumber) {
  let iata = '';
  
  // 1. Attempt to extract IATA from flight number (e.g. "6E 322" or "6E322" -> "6E")
  if (flightNumber) {
    const firstSegment = flightNumber.split(',')[0].trim();
    const parts = firstSegment.split(' ');
    if (parts.length > 0 && parts[0].length >= 2 && parts[0].length <= 3) {
      iata = parts[0].toUpperCase();
    } else {
      // Fallback regex to grab first 2-3 alphanumeric chars if no space (e.g. "6E322" or "QP101")
      const match = firstSegment.match(/^([A-Z0-9]{2,3})/i);
      if (match) {
        let matched = match[1].toUpperCase();
        // If matched 3 chars and ends with digit, prune to 2 (e.g. "6E3" -> "6E")
        if (matched.length === 3 && /[0-9]/.test(matched.charAt(2))) {
          matched = matched.substring(0, 2);
        }
        iata = matched;
      }
    }
  }

  // 2. Fallback to name-based lookup if IATA not resolved from flight number
  if (!iata && airline) {
    const name = airline.toLowerCase();
    if (name.includes('indigo')) iata = '6E';
    else if (name.includes('air india express')) iata = 'IX';
    else if (name.includes('air india')) iata = 'AI';
    else if (name.includes('spicejet')) iata = 'SG';
    else if (name.includes('vistara')) iata = 'UK';
    else if (name.includes('akasa')) iata = 'QP';
    else if (name.includes('emirates')) iata = 'EK';
    else if (name.includes('qatar')) iata = 'QR';
    else if (name.includes('singapore')) iata = 'SQ';
    else if (name.includes('lufthansa')) iata = 'LH';
    else if (name.includes('british')) iata = 'BA';
  }

  if (iata) {
    // Check if we have a local logo available for this carrier
    const localLogos = {
      '6E': '/logo_indigo.svg',
      'AI': '/logo_airindia.svg',
      'SG': '/logo_spicejet.svg',
      'EK': '/logo_emirates.svg',
      'QR': '/logo_qatar.svg',
      'SQ': '/logo_singapore.svg',
      'LH': '/logo_lufthansa.svg',
      'BA': '/logo_britishairways.svg',
      'QP': '/logo_akasa.png'
    };
    
    if (localLogos[iata]) {
      return localLogos[iata];
    }
    
    // Otherwise, fetch dynamically from Duffel's high-quality SVG airline logos CDN
    return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${iata}.svg`;
  }

  return null;
}

export function getAirlineInitials(airline) {
  if (!airline) return '?';
  const parts = airline.split(' ');
  if (parts.length === 1) return airline.substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}