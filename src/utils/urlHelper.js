// urlHelper.js
// ─────────────────────────────────────────────────────────────────────────────
// Utility to encrypt (obfuscate) and decrypt search query parameters 
// to keep the website URL clean and prevent plain-text parameter leakage.
// ─────────────────────────────────────────────────────────────────────────────

const CIPHER_KEY = 42; // XOR key for simple character encryption

/**
 * Encrypts an object of parameters into a URL-safe obfuscated token.
 * @param {Object} paramsObj 
 * @returns {string} 
 */
export function encryptParams(paramsObj) {
  try {
    const jsonStr = JSON.stringify(paramsObj);
    // 1. Convert unicode string to Latin1 byte string (0-255 characters only)
    const latin1Str = unescape(encodeURIComponent(jsonStr));
    
    // 2. Apply XOR cipher on the Latin1 byte string
    let xorStr = '';
    for (let i = 0; i < latin1Str.length; i++) {
      xorStr += String.fromCharCode(latin1Str.charCodeAt(i) ^ CIPHER_KEY);
    }
    
    // 3. Encode to Base64
    const base64 = btoa(xorStr);
    
    // 4. Make Base64 URL-safe (replace + with -, / with _, and strip padding =)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Encryption failed:", e);
    return '';
  }
}

/**
 * Decrypts a URL-safe obfuscated token back into the original parameter object.
 * @param {string} token 
 * @returns {Object} 
 */
export function decryptParams(token) {
  if (!token) return {};
  
  const trimmed = token.trim();
  
  // Case 1: Plain JSON string
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      // Ignore and proceed
    }
  }
  
  // Restore URL-safe Base64 characters and padding
  let base64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Try decoding Base64
  let decodedStr;
  try {
    decodedStr = atob(base64);
  } catch (e) {
    // Not valid base64 (e.g. plain text query like "Goa")
    return {};
  }
  
  // Case 2: Plain Base64 encoded JSON (no XOR)
  try {
    const parsed = JSON.parse(decodedStr);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (e) {
    // Not plain Base64 JSON, proceed to XOR decryption
  }
  
  // Case 3: XOR encrypted token
  try {
    let latin1Str = '';
    for (let i = 0; i < decodedStr.length; i++) {
      latin1Str += String.fromCharCode(decodedStr.charCodeAt(i) ^ CIPHER_KEY);
    }
    
    const jsonStr = decodeURIComponent(escape(latin1Str));
    return JSON.parse(jsonStr);
  } catch (e) {
    // Decryption failed (e.g. plain text query that happened to be valid base64)
    return {};
  }
}
