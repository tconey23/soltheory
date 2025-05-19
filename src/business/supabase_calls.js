import { supabase } from "./supabaseClient";


export const updatePassword = async (email, newPassword) => {
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
    const { data, error } = await supabase.auth.updateUser({
        email: email,
        password: newPassword,
        data: { "password_set": true }
      })

      if(error){
        console.log(error)
        setAlertContent({text: 'An error has occured', type:'error'})
      }

      if(data?.user){
        setAlertContent({text: 'Password reset', type:'success'})
        return 'success'
      }
}

export const checkSession = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if(sessionData){
        return sessionData
    }
}

export const getMeta = async (id) => {
    let { data: meta, error } = await supabase
    .from('users')
    .select("*")
    .eq('primary_id', id)

    if(meta){
        return(meta[0])
    }
}

export const updateUserName = async (id, name) => {
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
    const { data, error } = await supabase
        .from('users')
        .update({ user_name: name })
        .eq('primary_id', id)
        .select()

        if(data?.[0]){
            setAlertContent({text: 'User name updated', type:'success'})
            return 'success'
        } else {
          setAlertContent({text: 'An error has occured', type:'error'})
        }
}

export const login = async (email, password) => {
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if(data){
    setAlertContent({text: 'Login successful', type:'success'})
    return data
  } else if(error){
    setAlertContent({text: 'An error has occured', type:'error'})
    console.log(error)
  }
}

export const logout = async () => {
    try {
      // Attempt Supabase logout but don't wait forever
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );
  
      await Promise.race([
        supabase.auth.signOut(),
        timeout
      ]);
    } catch (err) {
      setAlertContent({text: 'An error has occured', type:'error'})
      console.warn('SignOut failed or timed out:', err.message);
    }
  
    // Clear state and storage no matter what
    localStorage.removeItem('sb-bueukhsebcjxwebldmmi-auth-token');
    sessionStorage.clear();
    indexedDB.deleteDatabase('supabase-auth-token');
  
    setTimeout(() => {
      window.location.href = '/home';
    }, 100);
}

    export const getMessages = async (id) => {
      let { data: messaging, error } = await supabase
      .from('messaging')
      .select("*")
      .eq('to', id)

      if(messaging){
        return messaging
      } else {
        console.log(error)
      }
    }
    
    export const getAvatar = async (id) => {
      let { data: avatar, error } = await supabase
      .from('users')
      .select("avatar")
      .eq('primary_id', id)

      if(avatar){
        return avatar
      }
    }

    export const deviceData = async (win_data, nav_data, user) => {

      console.log(win_data, nav_data, user)

      const { data, error } = await supabase
      .from('device_details')
      .insert([
        { user: user, 
          win_data: JSON.stringify(win_data), 
          nav_data: JSON.stringify(nav_data)
        },
      ])
      .select() 

      console.log(data, error)
        
    }

