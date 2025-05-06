import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import { supabase } from './supabaseClient';
import { checkSession, getMeta } from './supabase_calls';
import { metaObj, sessionObj, userObj } from './dev_defaults';

const GlobalContext = createContext(); 

export const GlobalProvider = ({ children }) => {

    const isMobile = useMediaQuery("(max-width:430px)");
    const degrees = (degrees) => degrees * (Math.PI / 180);
    const font = ('/fonts/Fredoka/Fredoka-VariableFont_wdth,wght.ttf')

    const [user, setUser] = useState(userObj)
    const [session, setSession] = useState(sessionObj)
    const [userMeta, setUserMeta] = useState(metaObj)
    const [toggleMenu, setToggleMenu] = useState(false)
    const [alertProps, setAlertProps] = useState({
      text: '',
      severity: '',
      display: false
    })

      const contextValue = useMemo(() => ({
        degrees,
        font,
        isMobile,
        user, 
        setUser,
        session,
        setSession,
        userMeta,
        toggleMenu,
        setToggleMenu,
        alertProps, 
        setAlertProps
      }), [
        degrees, font, isMobile,
        user, session, userMeta,
        toggleMenu
      ]);
  
    return (
        <GlobalContext.Provider value={contextValue}>
             {children}
        </GlobalContext.Provider>
    )

}

export const useGlobalContext = () => useContext(GlobalContext);