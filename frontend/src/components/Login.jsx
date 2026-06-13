import React, { useState } from 'react';
import { Lock, User, ShieldAlert, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess, onBackToPortfolio }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi đăng nhập.');
      }

      // Successful login
      onLoginSuccess(data.token, data.expiresAt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.1)'
      }}>
        {/* Spotlight Effect overlay */}
        <div className="spotlight" />

        {/* Back Button */}
        <button 
          onClick={onBackToPortfolio}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-sub)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            zIndex: 10
          }}
          className="nav-link"
        >
          <ArrowLeft size={16} /> Portfolio
        </button>

        {/* Header Icon */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.1)',
            color: 'var(--secondary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)'
          }}>
            <KeyRound size={28} />
          </div>
          <h2 className="glow-text-purple" style={{ fontSize: '1.8rem' }}>Admin Console</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Nhập thông tin quản trị viên để xác thực chữ ký số JWT.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.9rem'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            <label htmlFor="username" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Tài khoản
            </label>
            <input
              id="username"
              type="text"
              required
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu truy cập"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-neon"
            style={{ 
              background: 'var(--secondary-color)', 
              borderColor: 'var(--secondary-color)', 
              color: '#fff',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
              justifyContent: 'center',
              marginTop: '10px'
            }}
            disabled={loading}
          >
            {loading ? 'Đang xác thực JWT...' : 'Đăng nhập vào Hệ thống'}
          </button>
        </form>

        {/* Security note — no credentials are exposed here */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--primary-color)' }} />
          <span>Phiên đăng nhập được bảo vệ bằng chữ ký số JWT (HMAC SHA256).</span>
        </div>
      </div>
    </div>
  );
}
