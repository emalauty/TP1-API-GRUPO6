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
      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user
        });
        
        return { success: true, user };
      } else {
        const error = 'Email o contraseña incorrectos';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: error
        });
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = 'No se pudo conectar al servidor';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Función para registrar usuario
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Verificar si el email ya existe
      const existingRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(userData.email)}`);
      const existingUsers = await existingRes.json();
      
      if (existingUsers.length > 0) {
        const error = 'El email ya está registrado';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: error
        });
        return { success: false, error };
      }

      // Crear nuevo usuario
      const newUser = {
        ...userData,
        id: Date.now(), // ID simple para el ejemplo
        createdAt: new Date().toISOString()
      };

      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const user = await res.json();
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user
        });
        
        return { success: true, user };
      } else {
        const error = 'Error al crear la cuenta';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: error
        });
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = 'No se pudo conectar al servidor';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
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
