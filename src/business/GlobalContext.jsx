import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import { supabase } from './supabaseClient';
import { checkSession, getMeta } from './supabase_calls';
import { metaObj, sessionObj, userObj } from './dev_defaults';

const GlobalContext = createContext(); 

export const GlobalProvider = ({ children }) => {

 // Material UI breakpoints
 const isShort = useMediaQuery('(max-height: 667px)')
 const isXs = useMediaQuery('(max-width: 599px)');
 const isSm = useMediaQuery('(min-width: 600px) and (max-width: 959px)');
 const isMd = useMediaQuery('(min-width: 960px) and (max-width: 1279px)');
 const isLg = useMediaQuery('(min-width: 1280px) and (max-width: 1919px)');
 const isXl = useMediaQuery('(min-width: 1920px)');

 // Orientation
 const isPortrait = useMediaQuery('(orientation: portrait)');
 const isLandscape = useMediaQuery('(orientation: landscape)');

 // Foldables (experimental, Chromium-based foldables)
 const isFoldable = useMediaQuery('(screen-spanning: single-fold-vertical)');

 // Derived flags
 const isMobile = isXs || isSm;
 const isTablet = isMd;
 const isDesktop = isLg || isXl;

 const [screen, setScreen] = useState({});

 useEffect(() => {
   setScreen({
     isXs,
     isSm,
     isMd,
     isLg,
     isXl,
     isPortrait,
     isLandscape,
     isFoldable,
     isMobile,
     isTablet,
     isDesktop,
     isShort
   });
 }, [isXs, isSm, isMd, isLg, isXl, isPortrait, isLandscape, isFoldable, isShort]);

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
        screen,
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
        degrees, font, screen,
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