import React, { useState } from 'react';
import { login, register } from '../utils/api.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function AuthModal({ onClose }) {
  const { login: setUser } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !form.name) { setError('Name is required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await login(form.email, form.password);
      } else {
        data = await register(form.name, form.email, form.password);
      }
      setUser(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(5,32,60,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 24, width: '100%', maxWidth: 420,
        overflow: 'hidden', boxShadow: '0 24px 60px rgba(5,32,60,0.3)',
        animation: 'slideUp 0.25s ease',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #05203c, #0a2a4a)',
          padding: '32px 32px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #0770e3, #0547b8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>✈</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'white' }}>
              Trip<span style={{ color: '#4da6ff' }}>Mind</span>
            </span>
            <button onClick={onClose} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.1)',
              color: 'white', borderRadius: 8, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 4 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '9px', borderRadius: 8,
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? 'var(--sky)' : 'rgba(255,255,255,0.7)',
                fontWeight: 600, fontSize: 14, transition: 'all .2s',
              }}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 32px 32px' }}>
          {mode === 'register' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={handleKey}
                placeholder="Raj Patel"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid var(--mist)', borderRadius: 10,
                  fontSize: 14, color: 'var(--ink)', background: 'var(--cloud)',
                  transition: 'border .2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--sky)'}
                onBlur={e => e.target.style.borderColor = 'var(--mist)'}
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={handleKey}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid var(--mist)', borderRadius: 10,
                fontSize: 14, color: 'var(--ink)', background: 'var(--cloud)',
                transition: 'border .2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--sky)'}
              onBlur={e => e.target.style.borderColor = 'var(--mist)'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={handleKey}
              placeholder="Min. 6 characters"
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid var(--mist)', borderRadius: 10,
                fontSize: 14, color: 'var(--ink)', background: 'var(--cloud)',
                transition: 'border .2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--sky)'}
              onBlur={e => e.target.style.borderColor = 'var(--mist)'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px',
              color: '#dc2626', fontSize: 13, marginBottom: 16,
            }}>⚠ {error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #0770e3, #0547b8)',
              color: 'white', borderRadius: 12,
              fontWeight: 700, fontSize: 15,
              boxShadow: '0 6px 24px rgba(7,112,227,0.35)',
              transition: 'all .2s', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--slate)', marginTop: 16 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ color: 'var(--sky)', fontWeight: 600, background: 'none' }}>
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}