import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building,
  CheckCircle2,
  X,
  Info,
  User,
  MapPin,
  Activity,
  Megaphone,
  Scale,
  Stethoscope,
  Building2,
  Users,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const navigate = useNavigate();
  const { success, error } = useToast();

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your official email.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.login(email.trim(), password, rememberMe);
      success('Signed In Successfully', `Welcome, ${email.trim()}`);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setErrorMessage(msg);
      error('Access Denied', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGovernmentSSO = async () => {
    setLoading(true);
    try {
      const ssoEmail = 'officer.admin@health.gov.in';
      await authService.login(ssoEmail, 'GovernmentSSO#2026', true);
      success('Government SSO Verified', 'Signed in via National Single Sign-On');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'SSO sign-in failed.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = () => {
    setForgotEmail(email.trim());
    setForgotError('');
    setForgotSubmitted(false);
    setShowForgotModal(true);
  };

  const handleCloseForgot = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSubmitted(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#071329',
        backgroundImage:
          'linear-gradient(180deg, rgba(7, 19, 41, 0.72) 0%, rgba(7, 19, 41, 0.55) 45%, rgba(7, 19, 41, 0.88) 100%), url(/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          padding: '18px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(13, 148, 136, 0.45)',
            }}
          >
            <ShieldCheck style={{ width: 26, height: 26 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Care<span style={{ color: '#2dd4bf' }}>Sync</span>
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
              Government Admin Portal
            </p>
          </div>
        </div>

        {/* Top Right Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, fontWeight: 500 }}>
            <a
              href="#home"
              onClick={(e) => e.preventDefault()}
              style={{ color: '#e2e8f0', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => e.preventDefault()}
              style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => e.preventDefault()}
              style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              Contact
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('login-card-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(20, 184, 166, 0.4)',
              borderRadius: 9999,
              padding: '7px 16px',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 12px rgba(13, 148, 136, 0.2)',
              cursor: 'pointer',
            }}
          >
            <User style={{ width: 14, height: 14, color: '#2dd4bf' }} />
            <span>Admin Access</span>
          </button>
        </div>
      </header>

      {/* Main Container: Hero on Left, Login Card on Right */}
      <main
        style={{
          flex: 1,
          maxWidth: 1240,
          width: '100%',
          margin: '0 auto',
          padding: '24px 32px 48px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 48,
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Left Column: Command Center Presentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Badge */}
          <div>
            <div
              style={{
                width: 32,
                height: 3,
                background: '#2dd4bf',
                borderRadius: 2,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 9999,
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                color: '#2dd4bf',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
              }}
            >
              <ShieldCheck style={{ width: 14, height: 14 }} />
              National Healthcare Command Center
            </div>
          </div>

          {/* Big Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 4.4vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.12,
              margin: 0,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Stronger <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Healthcare
            </span>{' '}
            <br />
            for a Healthier India
          </h1>

          {/* Tagline / Subtitle */}
          <div style={{ maxWidth: 480 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#e2e8f0',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Monitor. Approve. Support. Progress.
            </p>
            <p
              style={{
                fontSize: 13,
                color: '#94a3b8',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              A unified platform to manage hospital approvals, monitor healthcare services, and oversee public health operations.
            </p>
          </div>

          {/* Left Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              maxWidth: 440,
              marginTop: 8,
            }}
          >
            {/* Stat 1 */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(10, 25, 47, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#ffffff' }}>500+</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Registered Hospitals</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(10, 25, 47, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#ffffff' }}>28+</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Districts Monitored</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(10, 25, 47, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#ffffff' }}>24/7</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Healthcare Oversight</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(10, 25, 47, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#ffffff' }}>100+</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Public Initiatives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Login Card */}
        <div id="login-card-section" style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: 'rgba(10, 25, 47, 0.88)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              border: '1px solid rgba(20, 184, 166, 0.35)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(13, 148, 136, 0.25)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Subtle top-right ambient aura */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 180,
                height: 180,
                background: 'radial-gradient(circle at top right, rgba(20, 184, 166, 0.22), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Card Header */}
            <div style={{ padding: '32px 28px 20px 28px', textAlign: 'center' }}>
              {/* Emblem */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.25), rgba(6, 182, 212, 0.15))',
                  border: '1px solid rgba(20, 184, 166, 0.45)',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  boxShadow: '0 0 16px rgba(13, 148, 136, 0.3)',
                }}
              >
                <ShieldCheck style={{ width: 26, height: 26 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
                  Care<span style={{ color: '#2dd4bf' }}>Sync</span>
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0 0' }}>
                Government Admin Portal
              </p>

              {/* Welcome Back */}
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '18px 0 4px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome Back
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Sign in to access the Government Admin Portal
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              noValidate
              style={{
                padding: '0 28px 28px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Error Message */}
              {errorMessage && (
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    color: '#fda4af',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  role="alert"
                >
                  <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <div style={{ position: 'relative' }}>
                  <Mail
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 16,
                      height: 16,
                      color: emailError ? '#f43f5e' : '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your official email"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: emailError ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 12,
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2dd4bf';
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = emailError ? '#f43f5e' : 'rgba(255, 255, 255, 0.12)';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <span style={{ color: '#fda4af', fontSize: 11, display: 'block', marginTop: 4 }}>
                    {emailError}
                  </span>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 16,
                      height: 16,
                      color: passwordError ? '#f43f5e' : '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 42px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: passwordError ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 12,
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2dd4bf';
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = passwordError ? '#f43f5e' : 'rgba(255, 255, 255, 0.12)';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                {passwordError && (
                  <span style={{ color: '#fda4af', fontSize: 11, display: 'block', marginTop: 4 }}>
                    {passwordError}
                  </span>
                )}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      accentColor: '#0d9488',
                      width: 15,
                      height: 15,
                      cursor: 'pointer',
                    }}
                  />
                  <span>Remember me on this device</span>
                </label>

                <button
                  type="button"
                  onClick={handleOpenForgot}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2dd4bf',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Primary Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(13, 148, 136, 0.45)',
                  transition: 'opacity 0.15s, transform 0.1s',
                }}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign in to Government Admin</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>

              {/* OR Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '4px 0',
                }}
              >
                <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.12)' }} />
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.12)' }} />
              </div>

              {/* Government SSO Button */}
              <button
                type="button"
                onClick={handleGovernmentSSO}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <Building style={{ width: 16, height: 16, color: '#2dd4bf' }} />
                <span>Continue with Government SSO</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Bottom Floating Feature Dock */}
      <footer
        style={{
          padding: '0 32px 32px 32px',
          maxWidth: 1240,
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'rgba(10, 25, 47, 0.72)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(20, 184, 166, 0.25)',
            borderRadius: 20,
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Module 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(20, 184, 166, 0.15)',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Building2 style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#ffffff' }}>Hospital Approvals</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Licensing and verifications</p>
            </div>
          </div>

          {/* Module 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(20, 184, 166, 0.15)',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Activity style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#ffffff' }}>Healthcare Monitoring</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Bed and ICU capacity</p>
            </div>
          </div>

          {/* Module 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(20, 184, 166, 0.15)',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Scale style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#ffffff' }}>Complaints Management</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Grievance redressal</p>
            </div>
          </div>

          {/* Module 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(20, 184, 166, 0.15)',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Megaphone style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#ffffff' }}>Public Health Announcements</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Alerts and directives</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Forgot Password Dialog */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={handleCloseForgot} role="dialog" aria-modal="true">
          <div
            className="modal-card"
            style={{
              maxWidth: 460,
              background: '#0d1d36',
              border: '1px solid rgba(20, 184, 166, 0.35)',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                background: 'linear-gradient(135deg, #071329, #0a192f)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <h2 className="modal-title" style={{ fontSize: 17, color: '#ffffff' }}>
                  Reset Your Password
                </h2>
                <p className="modal-subtitle" style={{ color: '#94a3b8' }}>
                  We will help you sign back into your account
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseForgot}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit}>
                <div className="modal-body" style={{ gap: 14 }}>
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'rgba(20, 184, 166, 0.12)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      color: '#2dd4bf',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    <Info style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: '#2dd4bf' }} />
                    <span>
                      Demo Mode: In this preview version, no actual emails are sent. You can log in right away using your email and any password.
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="forgot-email" className="form-label" style={{ color: '#cbd5e1' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 16,
                          height: 16,
                          color: forgotError ? '#f43f5e' : '#94a3b8',
                          pointerEvents: 'none',
                        }}
                      />
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (forgotError) setForgotError('');
                        }}
                        placeholder="Enter your email address"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          border: forgotError ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 12,
                          color: '#ffffff',
                          fontSize: 13,
                          outline: 'none',
                        }}
                        autoFocus
                      />
                    </div>
                    {forgotError && (
                      <span style={{ color: '#fda4af', fontSize: 11, display: 'block', marginTop: 4 }}>
                        {forgotError}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="modal-footer"
                  style={{
                    background: 'rgba(7, 19, 41, 0.8)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseForgot}
                    className="btn btn-outline"
                    style={{ background: 'transparent', color: '#cbd5e1', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #06b6d4)' }}
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px', gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'rgba(20, 184, 166, 0.15)',
                      color: '#2dd4bf',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    <CheckCircle2 style={{ width: 28, height: 28 }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px 0', color: '#ffffff' }}>
                      Reset Link Sent
                    </h3>
                    <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      We sent password reset instructions to{' '}
                      <strong style={{ color: '#2dd4bf' }}>{forgotEmail}</strong>.
                    </p>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, margin: '10px 0 0 0', lineHeight: 1.5 }}>
                      Note: Since this is a demo, no real email was sent. You can return to the login screen and sign in with any password.
                    </p>
                  </div>
                </div>

                <div
                  className="modal-footer"
                  style={{
                    background: 'rgba(7, 19, 41, 0.8)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseForgot}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px 16px', fontSize: 13, background: 'linear-gradient(135deg, #0d9488, #06b6d4)' }}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
