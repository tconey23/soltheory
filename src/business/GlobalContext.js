import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material'
import { getUser } from './apiCalls';
import { supabase } from './supabaseClient';

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
  const [recheckUser, setRecheckUser] = useState(0)

  const degrees = (degrees) => degrees * (Math.PI / 180)

  useEffect(() => {
    // console.log(recheckUser)
  }, [recheckUser])

  const checkAdminAccess = async (email) => {
    const res = await getUser(email);
  
    // Only update if metadata is different
    setUser(prev => {
      if (!prev.metadata) {
        return {
          ...prev,
          metadata: res
        };
      }
      return prev;
    });
  };

useEffect(() => {
  if (user?.user?.email && !user?.metadata) {
    checkAdminAccess(user.user.email)
  }
}, [user?.user?.email])

useEffect(() =>{

  console.log(user)

  if(user?.metadata){
    setAvatar(user.metadata.avatar)
    setDisplayName(user.metadata.user_name)
    setisAdmin(user.metadata.is_admin)
  } else {
    setAvatar(null)
    setDisplayName(null)
    setisAdmin(null)
  }
}, [user])

  useEffect(() => {
    if(!user){
      const storedUser = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuth && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, recheckUser]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth Event]:', event);
  
      if (event === 'SIGNED_IN' && session?.user) {
        await supabase
          .from('users')
          .upsert([{ primary_id: session.user.id, email: session.user.email }], {
            onConflict: 'primary_id',
          });
      }
  
      if (event === 'SIGNED_OUT') {
        setUser(null); // Optional cleanup
      }
    });
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  

  
  return (
    <GlobalContext.Provider value={{ setRecheckUser, avatar, setAvatar, isAdmin, setisAdmin, user, setUser, alertProps, setAlertProps, returnUrl, setReturnUrl, font, speed, setSpeed, isMobile, showJoystick, setShowJoystick, degrees, fontTTF, displayName, setDisplayName}}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Use Context
export const useGlobalContext = () => useContext(GlobalContext);
