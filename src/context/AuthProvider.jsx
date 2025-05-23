import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('admin'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin', token);
    } else {
      localStorage.removeItem('admin');
    }
  }, [token]);

  const value = {
    token,
    setToken,
    isAuthenticated: Boolean(token),
    logout: () => setToken(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
