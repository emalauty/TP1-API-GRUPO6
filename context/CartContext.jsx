import React, { createContext, useContext, useReducer } from 'react';

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// Estado inicial del carrito
const initialCartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar la cantidad
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo al carrito
        updatedItems = [...state.items, { ...product, quantity }];
      }
      
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const productId = action.payload;
      const updatedItems = state.items.filter(item => item.id !== productId);
      
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      }
      
      const updatedItems = state.items.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      );
      
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return initialCartState;
    }

    default:
      return state;
  }
};

// Contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

// Provider del carrito
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Función para agregar un producto al carrito
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  // Función para remover un producto del carrito
  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: productId
    });
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART
    });
  };

  // Función para verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartState.items.some(item => item.id === productId);
  };

  // Función para obtener la cantidad de un producto específico
  const getItemQuantity = (productId) => {
    const item = cartState.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};