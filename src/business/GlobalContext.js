import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
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
  const [avatar, setAvatar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mySolMates, setMySolMates] = useState([]);
  const [showJoystick, setShowJoystick] = useState(true);
  const isMobile = useMediaQuery("(max-width:430px)");
  const [sessionState, setSessionState] = useState()
  const [sessionData, setSessionData] = useState()
  const [userData, setUserData] = useState()
  const [userMetaData, setUserMetaData] = useState()
  const justLoggedIn = useRef(false);


  const degrees = (degrees) => degrees * (Math.PI / 180);


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
  }, [user]);

  useEffect(() => {
    if(userData?.user_metadata){
      setUserMetaData(userData.user_metadata)
    }
  }, [userData])

  useEffect(() =>{
    console.log(sessionData)
    if(sessionData?.user){
      setUserData(sessionData.user)
    }
  }, [sessionData])

  useEffect(() => {
    if(user?.data?.session){
      setSessionData(user.data.session)
    }
  }, [user])

  useEffect(() => {

    if(sessionData || userData || userMetaData){
      console.log({
        session: sessionData,
        user: userData, 
        meta: userMetaData
      })
    }

  }, [sessionData, userData, userMetaData])

  const updateAdmin = async (admin) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        is_admin: admin
      }
    })
    
    if(data){
      setUserData(data.user)
      return data
    }

    if(error){
      return error
    }
}

  const updateUser = async (name) => {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          display_name: name,
          is_admin: false,
          friends: []
        }
      })
      
      if(data){
        setUserData(data.user)
        return data
      }

      if(error){
        return error
      }
  }


  const login = async (email, password) => {  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);  // STOP EXECUTION here
      }
  
      if (!data?.session?.access_token) {
        throw new Error('Login succeeded but no session token found.');
      }
  
      console.log('Login successful:', data);
  
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) {
        console.error('Session fetch error after login:', sessionError);
        throw new Error('Failed to refresh session after login');
      }
  
      if (sessionData?.session) {
        justLoggedIn.current = true;
        setUser({ data: sessionData });
      } else {
        throw new Error('No valid session data after login.');
      }
  
    } catch (err) {
      console.error('Unexpected login failure:', err.message || err);
      throw err;  // rethrow so caller can handle it too
    }
  };

  const signUp = async (email, password, name) => {  
    try {
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if(data){
        if(data.user){setUserData(data.user)}
        if(data.session){setSessionData(data.session)}
        updateUser(name)
        return data
      }

      if (error) {
        console.error('Sign up error:', error);
        throw new Error(error.message);  // STOP EXECUTION here
      }

  
    } catch (err) {
      console.error('Unexpected signup failure:', err.message || err);
      throw err;  // rethrow so caller can handle it too
    }
  };
  

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
    indexedDB.deleteDatabase('supabase-auth-token')
    window.location.href = '/login'
  }

  const getLoggedInUser = async () => {

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if(user){
        console.log(user)
      } else {
        throw new Error(error)
      }
    } catch (err) {
      console.log(err)
    }

  }
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSessionState(event)
      if(event === 'SIGNED_IN'){
        getLoggedInUser()
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  return (
    <GlobalContext.Provider
      value={{
        user, setUser,
        alertProps, setAlertProps,
        returnUrl, setReturnUrl,
        avatar, setAvatar,
        isAdmin, setIsAdmin,
        mySolMates, setMySolMates,
        showJoystick, setShowJoystick,
        isMobile, degrees,
        sessionState,
        justLoggedIn,
        login,
        logout,
        signUp,
        userData,
        sessionData,
        updateUser,
        sessionState,
        updateAdmin
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
