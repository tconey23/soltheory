import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material'
import { getUser } from './apiCalls';

// Create Context
const GlobalContext = createContext();

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alertProps, setAlertProps] = useState({
    text: 'this is an alert',
    severity: 'success',
    display: false
  })
  const [returnUrl, setReturnUrl] = useState()
  const [font] = useState("/fonts/Fredoka_Regular.json")
  const [fontTTF] = useState("/fonts/Fredoka/static/Fredoka-Bold.ttf")
  const [speed, setSpeed] = useState(4)
  const isMobile = useMediaQuery("(max-width:430px)")
  const [showJoystick, setShowJoystick] = useState(true)
  const [displayName, setDisplayName] = useState()
  const [isAdmin, setisAdmin] = useState(false)
  const [avatar, setAvatar] = useState(null)

  const degrees = (degrees) => degrees * (Math.PI / 180)

  const checkAdminAccess = async (email) => {
    const res = await getUser(email)
    console.log(res.avatar)
    if(res.avatar) {
      setAvatar(res.avatar)
    }
    
    if(res.user_name){
        setDisplayName(res.user_name)
    } else {
      setDisplayName(email)
    }
    if(res.is_admin){
        setisAdmin(true)
    }
}

useEffect(() =>{

  if(user && user.email){
    checkAdminAccess(user.email)
  }

}, [user])

  useEffect(() => {
    if(!user){
      const storedUser = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      if (isAuth && storedUser) {
        console.log(JSON.parse(storedUser))
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  return (
    <GlobalContext.Provider value={{ avatar, setAvatar, isAdmin, setisAdmin, user, setUser, alertProps, setAlertProps, returnUrl, setReturnUrl, font, speed, setSpeed, isMobile, showJoystick, setShowJoystick, degrees, fontTTF, displayName, setDisplayName}}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Use Context
export const useGlobalContext = () => useContext(GlobalContext);
