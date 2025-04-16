import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material'

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
  const [returnUrl, setReturnUrl] = useState()
  const [font, setFont] = useState("/fonts/Fredoka_Regular.json")
  const [speed, setSpeed] = useState(4)
  const isMobile = useMediaQuery("(max-width:430px)")
  const [showJoystick, setShowJoystick] = useState(true)

  const degrees = (degrees) => degrees * (Math.PI / 180)

  useEffect(() => {
    // console.log(isMobile)
  }, [isMobile])

  return (
    <GlobalContext.Provider value={{ user, setUser, alertProps, setAlertProps, returnUrl, setReturnUrl, font, speed, setSpeed, isMobile, showJoystick, setShowJoystick, degrees}}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Use Context
export const useGlobalContext = () => useContext(GlobalContext);
