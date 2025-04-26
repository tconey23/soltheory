import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { getUser } from './apiCalls';
import { supabase } from './supabaseClient';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alertProps, setAlertProps] = useState({
    text: 'this is an alert',
    severity: 'success',
    display: false,
  });
  const [returnUrl, setReturnUrl] = useState();
  const [font] = useState("/fonts/Fredoka_Regular.json");
  const [fontTTF] = useState("/fonts/Fredoka/static/Fredoka-Bold.ttf");
  const [speed, setSpeed] = useState(4);
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [cipherKey, setCipherKey] = useState();
  const [mySolMates, setMySolMates] = useState([]);
  const [showJoystick, setShowJoystick] = useState(true);
  const isMobile = useMediaQuery("(max-width:430px)");

  const degrees = (degrees) => degrees * (Math.PI / 180);

  // Fetch full metadata if needed
  const checkAdminAccess = async (email) => {
    const res = await getUser(email);

    setUser(prev => ({
      ...prev,
      metadata: res
    }));
  };

  // Load session on app start
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        setUser({ user: data.session.user });
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await supabase
          .from('users')
          .upsert([{ primary_id: session.user.id, email: session.user.email, currently_online: true }], {
            onConflict: 'primary_id',
          });
        setUser({ user: session.user });
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    importKeyFromStorage();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // When we have a user, fetch their metadata if missing
  useEffect(() => {
    if (user?.user?.email && !user?.metadata) {
      checkAdminAccess(user.user.email);
    }
  }, [user?.user?.email]);

  // When metadata arrives, update avatar, display name, admin flag
  useEffect(() => {
    if (user?.metadata) {
      setAvatar(user.metadata.avatar);
      setDisplayName(user.metadata.user_name);
      setIsAdmin(user.metadata.is_admin);
    } else {
      setAvatar(null);
      setDisplayName(null);
      setIsAdmin(false);
    }
  }, [user?.metadata]);

  // Cipher Key Storage & Import
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
    importKeyFromStorage();
  };

  // Live update listener for user's own metadata changes
  useEffect(() => {
    if (!user?.metadata?.primary_id) return;

    const channel = supabase
      .channel('users')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
      }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new.primary_id === user.metadata.primary_id) {
          setUser(prev => ({
            ...prev,
            metadata: payload.new,
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.metadata?.primary_id]);

  return (
    <GlobalContext.Provider
      value={{
        user, setUser,
        alertProps, setAlertProps,
        returnUrl, setReturnUrl,
        font, fontTTF,
        speed, setSpeed,
        avatar, setAvatar,
        displayName, setDisplayName,
        isAdmin, setIsAdmin,
        cipherKey, setCipherKey,
        mySolMates, setMySolMates,
        showJoystick, setShowJoystick,
        degrees,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
