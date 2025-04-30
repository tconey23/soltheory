import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import { supabase } from './supabaseClient';
import { decryptWithKey, importKeyFromBase64 } from '../business/cryptoUtils';

const GlobalContext = createContext(); 
 
export const GlobalProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState()


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
  const [allUsers, setAllUsers] = useState()
  const justLoggedIn = useRef(false);
  const [messages, setMessages] = useState({ inbound: [], outbound: [] });
  const [messageKey, setMessageKey] = useState(0)
  const [deleteKey, setDeleteKey] = useState(0)




  const degrees = (degrees) => degrees * (Math.PI / 180);

  useEffect(() => {
    if(user && user?.['is_admin']){
      setIsAdmin(user?.['is_admin'])
    }
  }, [user])

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



  const getUserData = async (to, from) => {

    const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

    let { data: toUser, error: toErr } = await supabase
      .from('users')
      .select("*")
      .eq('primary_id', to)

    let { data: fromUser, error: fromErr } = await supabase
      .from('users')
      .select("*")
      .eq('primary_id', from)

    if(toUser && fromUser){
      return {
        to: `${capitalizeFirst(toUser?.[0].user_name)} (${toUser[0]?.email})`,
        from: `${capitalizeFirst(fromUser?.[0].user_name)} (${fromUser[0]?.email})`
      }
    }

    if(toUser){
      return {
        to: `${capitalizeFirst(toUser?.[0].user_name)} (${toUser[0]?.email})`
      }
    }

  }

  useEffect(() => {

    if(sessionData || userData || user){
      // console.log({
      //   session: sessionData,
      //   user: userData, 
      //   meta: user
      // })
    }

  }, [sessionData, userData, user]) 

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

const updateUserField = async (field, data) => {
  console.log('field', field)
  console.log('data', data)
  console.log('user id', user?.primary_id)

  const { data: response, error } = await supabase
  .from('users')
  .update({ [field]: data})
  .eq('primary_id', user?.primary_id)
  .select()

  console.log('response', response)
  console.log('error',error)
  return 'success'
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

      // console.log('login', data)
  
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
        // setUser({ data: sessionData });
      } else {
        throw new Error('No valid session data after login.');
      }
  
    } catch (err) {
      console.error('Unexpected login failure:', err.message || err);
      throw err;  // rethrow so caller can handle it too
    }
  };

  const addAuthRecord = async (email, password, name) => {
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
        throw new Error(error.message); 
      }

  
    } catch (err) {
      console.error('Unexpected signup failure:', err.message || err);
      throw err;  // rethrow so caller can handle it too
    }
  }

  const addUserRecord = async (email, name) => {

    const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email: email,
        user_name: name,
        friends: [],
        game_data: [],
        currently_online: false,
        is_admin: false,
        is_super: false,
        avatar: ''
      },
    ])
    .select()

    if(data){
      return data
    } else {
      console.log(error)
    }
        
  }


  const signUp = async (email, password, name) => {  

    const auth = await addAuthRecord(email, password, name)

    if(auth) {
      console.log(auth)
      setAuthUser(auth)
      const user = await addUserRecord(email, password, name)

      if(user){
        console.log(user)
        setUser(user)
      }

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

  const getUserTable = async (id) => {
    let { data: user, error } = await supabase
    .from('users')
    .select("*")
    .eq('primary_id', id)
    
    if(user) {
      setUser(user[0])
      console.log(user)
      return user
    }
    
    if(error) return error
  }

  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log(session)
      setSessionState(event)
      
      if(event === 'USER_UPDATED'){
        setUserData(session.user)
      }

      // console.log(event, !!userData, session)
      if(event === 'SIGNED_IN' && !userData){
        getUserTable(session.user.id)
        setSessionData(session)
        setUserData(session.user)
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

    const decryptRealtime = async (data) => {
      try {
        const base64Key = data.message_cipher_key;
        if (!base64Key) throw new Error("No message cipher key attached");
        const key = await importKeyFromBase64(base64Key);
        const decSub = await decryptWithKey(data.subject, data.subject_iv, key);
        const decMess = await decryptWithKey(data.message_content, data.message_iv, key);
  
        data.subject = decSub;
        data.message_content = decMess;
  
        return data;
      } catch (err) {
        console.error("Realtime decryption failed:", err);
        return data;
      }
    };

    const handleDecrypt = async (messData) => {
      setMessages({ inbound: [], outbound: [] }); // reset
    
      for (let message of messData) {
        try {
          const base64Key = message.message_cipher_key;
          if (!base64Key) continue;
          const key = await importKeyFromBase64(base64Key);
          const decSub = await decryptWithKey(message.subject, message.subject_iv, key);
          const decMess = await decryptWithKey(message.message_content, message.message_iv, key);
    
          message.subject = decSub;
          message.message_content = decMess;
    
          // Now determine if it's inbound or outbound
          const isInbound = message.to.primary_id === user.sub;
          const isOutbound = message.from.primary_id === user.sub
    
          setMessages(prev => ({
            inbound: isInbound ? [...prev.inbound, message] : prev.inbound,
            outbound: isOutbound ? [...prev.outbound, message] : prev.outbound
          }));
    
        } catch (error) {
          console.error("Failed decrypting message:", message, error);
        }
      }
    };
    

    const initialFetch = async () => {
      const userId = user?.primary_id;
      if (!userId || !messages.inbound || !messages.outbound) return;
      // console.log('userId', userId)
    
      try {
        const { data: messData, error } = await supabase
        .from('messaging')
        .select('*')
        .or(`to.eq.${userId},from.eq.${userId}`);

          // console.log(`to.eq.${userId},from.eq.${userId}`)
          // console.log('messData', messData)
          // console.log('error', error)
    
        if (messData) {
          // console.log('[Fetched messages]', messData);
          handleDecrypt(messData);
        } else if (error) {
          // console.error('[Supabase error]', error);
          throw new Error(error);
        }
      } catch (err) {
        console.error('[initialFetch error]', err);
      }
    };

    useEffect(() =>{
      if(user){
        initialFetch()
      }
    }, [user])
    

    useEffect(() => {
      const channel = supabase
        .channel('messaging')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messaging',
        }, async (payload) => {

          const message = payload.new || payload.old;
          if (!message) return;

          
          const isInbound = message?.to === user?.primary_id;
          const isOutbound = message?.from === user?.primary_id;

          const dataPackage = {
            payload: payload,
            message: message,
            isInbound: isInbound,
            isOutbound: isOutbound,
            toId: message?.to,
            fromId: message?.from,
            userId: user?.primary_id
          }

          if (payload.eventType === 'DELETE') {
            setMessages(prev => ({
                  inbound: prev.inbound.filter(m => m.message_id !== message.message_id),
                  outbound: prev.outbound.filter(m => m.message_id !== message.message_id)
              }))

              initialFetch()
          }

          
          if (!isInbound && !isOutbound){
            return 
          }
 
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const decryptedMessage = await decryptRealtime(message);
            
            setMessages(prev => {
              const newInbound = [...prev.inbound];
              const newOutbound = [...prev.outbound];
              if (isInbound) {
                // Remove old if exists
                const idx = newInbound.findIndex(m => m.id === decryptedMessage.id);
                if (idx >= 0) newInbound.splice(idx, 1);
                newInbound.push(decryptedMessage);
              }
    
              if (isOutbound) {
                const idx = newOutbound.findIndex(m => m.id === decryptedMessage.id);
                if (idx >= 0) newOutbound.splice(idx, 1);
                newOutbound.push(decryptedMessage);
              }
    
              // Optional: sort each array by newest first
              newInbound.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              newOutbound.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              
              return {
                inbound: newInbound,
                outbound: newOutbound
              };
            });
          }
          
        })
        .subscribe();
    
      return () => {
        supabase.removeChannel(channel);
      };
    }, [user]);
    
    
  useEffect(() => {
    const channel = supabase
      .channel('user-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `primary_id=eq.${user?.primary_id}`
      }, (payload) => {

        console.log(payload)
  
        if (payload.eventType === 'UPDATE') {
          const { avatar, friends, game_data, is_admin } = payload.new;
  
          const fields = {
            avatar: avatar,
            friends: friends,
            game_data: game_data,
            is_admin: is_admin
          };
  
          getUserTable(user?.primary_id)
          
          setIsAdmin(is_admin);  
        }
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.primary_id]);

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
      
      const authUsers = await res.json();
      if(authUsers){
        setAllUsers(authUsers)
        return authUsers
      } else {throw new Error(authUsers)}

    } catch (err){
      console.log(err)
    }
  }

  useEffect(() =>{
    if(!allUsers){
      fetchAuthUsers()
    }
  }, [])

  useEffect(() => {
      setMessageKey(prev => prev +1)
      // console.log(messages)
  }, [messages.inbound, messages.outbound])

  useEffect(() =>{
    initialFetch()
  }, [deleteKey])

  useEffect(() => {
    // console.log('user', user)
  }, [user])

  window.setMessageKey = setMessageKey
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
        user,
        fetchAuthUsers,
        allUsers,
        messages, 
        setMessages,
        initialFetch,
        messageKey,
        setMessageKey,
        getUserData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
