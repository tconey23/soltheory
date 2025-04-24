import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material'
import { getUser } from './apiCalls';
import { supabase } from './supabaseClient';

const GlobalContext = createContext();

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
  const [cipherKey, setCipherKey] = useState()
  const [mySolMates, setMySolMates] = useState([])

  const degrees = (degrees) => degrees * (Math.PI / 180)

  const checkAdminAccess = async (email) => {
    const res = await getUser(email);
  
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
  }, [user]);

  const generateAndStoreKey = async () => {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  
    const raw = await crypto.subtle.exportKey("raw", key);
    const base64Key = btoa(String.fromCharCode(...new Uint8Array(raw)));
  
    localStorage.setItem("cipherKey", base64Key);
    setCipherKey(key);
  };
  
  const importKeyFromStorage = async () => {
    const base64Key = localStorage.getItem("cipherKey");
  
    if (!base64Key) {
      await generateAndStoreKey();
      return;
    }
  
    const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
      "raw",
      raw,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
  
    setCipherKey(key);
  };

  const resetCipherKey = () => {
    localStorage.removeItem("cipherKey");
    setCipherKey(null);
    importKeyFromStorage(); // Regenerate
  };
  
  

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  
      if (event === 'SIGNED_IN' && session?.user) {
        await supabase
          .from('users')
          .upsert([{ primary_id: session.user.id, email: session.user.email, currently_online: true }], {
            onConflict: 'primary_id',
          });
      }
  
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });


    importKeyFromStorage()

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(user)
      
    const channel = supabase
      .channel('users')
      .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users',
        }, async (payload) => {

          console.log(payload.new.primary_id, user.metadata.primary_id)
          
          if(payload.eventType === 'UPDATE' && payload.new.primary_id === user.metadata.primary_id){

            // console.log(payload.new)
            
            setUser(prev => 
              ({
              ...prev,
              metadata: payload.new
            }))            

          }

        })
      .subscribe();
  
    return () => supabase.removeChannel(channel);
  }, [user]);
  
  return (
    <GlobalContext.Provider value={{ avatar, setAvatar, isAdmin, setisAdmin, user, setUser, alertProps, setAlertProps, returnUrl, setReturnUrl, font, speed, setSpeed, isMobile, showJoystick, setShowJoystick, degrees, fontTTF, displayName, setDisplayName, cipherKey, setCipherKey}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
