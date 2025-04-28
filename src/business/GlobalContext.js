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
    if(userMetaData && userMetaData?.['is_admin']){
      setIsAdmin(userMetaData?.['is_admin'])
    }
  }, [userMetaData])

  useEffect(() => {
    if(userData?.user_metadata){
      setUserMetaData(userData.user_metadata)
    }

  }, [userData])

  useEffect(() =>{
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
      // console.log({
      //   session: sessionData,
      //   user: userData, 
      //   meta: userMetaData
      // })
    }

  }, [sessionData, userData, userMetaData])

  const pullUserListRecord = async (user) => {
    
    let { data: userRec, error } = await supabase
    .from('users')
    .select("*")
    .eq('primary_id', user?.id)

   if(userRec?.[0]){
    console.log(userRec[0])
   }

  }

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

const updateUserField = async (field) => {
  console.log(field)
  const { data, error } = await supabase.auth.updateUser({
    data: field
  })
  
  if(data){
    setUserData(data.user)
    await getLoggedInUser()
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
  
      // console.log('Login successful:', data);
  
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
        return user
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
      
      if(event === 'USER_UPDATED'){
        setUserData(session.user)
      }

      // console.log(event, !!userData, session)
      if(event === 'SIGNED_IN' && !userData){
        setSessionData(session)
        setUserData(session.user)
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('user-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `primary_id=eq.${userData?.id}`
      }, (payload) => {
  
        if (payload.eventType === 'UPDATE') {
          const { avatar, friends, game_data, is_admin } = payload.new;
  
          const fields = {
            avatar: avatar,
            friends: friends,
            game_data: game_data,
            is_admin: is_admin
          };
  
          console.log(fields);
  
          updateUserField(fields); // ✅ updates metadata
          
          // ⬇️ ⬇️ ⬇️ ADD THIS
          setIsAdmin(is_admin);    // ✅ updates the top-level isAdmin state immediately
        }
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData?.id]);

  const windowGetLoggedInUser = async () => {
    const res = await getLoggedInUser()
    console.log(res)
    return res
  }

  const fetchAuthUsers = async () => {

    try {

      const res = await fetch('https://bueukhsebcjxwebldmmi.supabase.co/auth/v1/admin/users', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZXVraHNlYmNqeHdlYmxkbW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTA0MDE0MiwiZXhwIjoyMDYwNjE2MTQyfQ.yAJ60YtfNhVHoAtLurxk-nbJViUcyGP57_K2nfqnJuA',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZXVraHNlYmNqeHdlYmxkbW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTA0MDE0MiwiZXhwIjoyMDYwNjE2MTQyfQ.yAJ60YtfNhVHoAtLurxk-nbJViUcyGP57_K2nfqnJuA`,
        }
      });
      
      const allUsers = await res.json();
      if(allUsers){
        return allUsers
      } else {throw new Error(allUsers)}

    } catch (err){
      console.log(err)
    }
  }

  // fetchAuthUsers()



  window.updateAdmin = updateAdmin
  window.getLoggedInUser = windowGetLoggedInUser
  
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
        updateAdmin,
        updateUserField,
        userMetaData,
        fetchAuthUsers
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
