import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// The built-in demo admin shows its role name in the current language instead of a stored name.
export function displayName(user, t) {
  return user.demo && user.fullName === 'Administrator' ? t('role.admin') : user.fullName;
}
