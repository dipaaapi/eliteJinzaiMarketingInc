import { useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { config } from '../config';
import * as authService from './authService';
import { AuthContext, useAuth } from './context';

function readSession() {
  try {
    return sessionStorage.getItem(config.sessionKey);
  } catch {
    return null;
  }
}

function writeSession(username) {
  try {
    if (username) sessionStorage.setItem(config.sessionKey, username);
    else sessionStorage.removeItem(config.sessionKey);
  } catch { /* storage unavailable */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(readSession()));

  // Restore the signed-in user after a page refresh.
  useEffect(() => {
    const username = readSession();
    if (!username) return;
    authService.getUser(username).then((found) => {
      if (!found) writeSession(null);
      setUser(found);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (username, password) => {
    const found = await authService.login(username, password);
    writeSession(found.username);
    setUser(found);
    return found;
  }, []);

  const signUp = useCallback(async (details) => {
    const created = await authService.register(details);
    writeSession(created.username);
    setUser(created);
    return created;
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (changes) => {
    const updated = await authService.updateProfile(user.username, changes);
    setUser(updated);
    return updated;
  }, [user]);

  const changePassword = useCallback(
    (current, next, confirm) => authService.changePassword(user.username, current, next, confirm),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// Sends signed-out visitors to the login page, then back to where they were going.
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/account" replace state={{ from: location.pathname }} />;
  return children;
}
