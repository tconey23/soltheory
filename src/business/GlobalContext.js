import React, { createContext, useContext, useState } from 'react';

// Create Context
const GlobalContext = createContext();

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'John Doe', age: 30 });
  const [alertProps, setAlertProps] = useState({
    text: 'this is an alert',
    severity: 'success',
    display: false
  })

  return (
    <GlobalContext.Provider value={{ user, setUser, alertProps, setAlertProps }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Use Context
export const useGlobalContext = () => useContext(GlobalContext);
