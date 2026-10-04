'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, setStoredUser } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter an email address.');
      return;
    }

    try {
      if (mode === 'register') {
        const response = await apiFetch('/register', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim(), email: trimmedEmail })
        });
        setMessage(response.message);
        setMode('login');
        return;
      }

      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail })
      });
      setStoredUser(response.user);
      router.push('/dashboard');
    } catch (requestError) {
      setError(requestError.message || (mode === 'register' ? 'Unable to register.' : 'User not found.'));
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-badge auth-brand-badge" aria-hidden="true">✓</div>
        <h1>{mode === 'register' ? 'Create an account' : 'Sign in to your account'}</h1>

        <form onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <>
              <label htmlFor="name" className="field-label">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </>
          ) : null}

          <label htmlFor="email" className="field-label">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          {error ? <div className="form-message error">{error}</div> : null}
          {message ? <div className="form-message success">{message}</div> : null}

          <button type="submit" className="primary-btn auth-btn">
            {mode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="switch-text">
          {mode === 'register' ? 'Already registered? ' : 'New user? '}
          <button
            type="button"
            className="inline-link"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'register' ? 'Sign in' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
