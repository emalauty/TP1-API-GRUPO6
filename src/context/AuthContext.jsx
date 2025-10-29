import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Acciones de autenticación
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER'
};

// Estado inicial de autenticación
const initialAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// URL base de la API del backend. Ajusta el puerto si tu backend corre en otro.
const API_BASE = 'http://localhost:8080/api';

// Reducer para manejar las acciones de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};

// Contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // Cargar usuario del localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER,
          payload: user
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const error = data.message || 'Email o contraseña incorrectos';
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error });
        return { success: false, error };
      }
      // Guardar user y token
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'No se pudo conectar al servidor';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Función para registrar usuario
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        const error = data.message || 'Error al crear la cuenta';
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error });
        return { success: false, error };
      }
      // Guardar user y token
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'No se pudo conectar al servidor';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
