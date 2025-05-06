import { useEffect, useState } from 'react';
import { Button, FormControl, Input, InputLabel, Stack, Typography } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';
import { supabase } from '../business/supabaseClient';

const LoginForm = () => {

  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const screen = useGlobalStore((state) => state.screen)
  const setSession = useGlobalStore((state) => state.setSession)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState()
  const [newUser, setNewUser] = useState(false)
  const [userName, setUserName] = useState()
  const [toggleShowPassword, setToggleShowPassword] = useState(false)


  const handleLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if(data){
      console.log(data)
      setUser(data?.user)
      setSession(data?.session)
    }
  }

  const handleSignUp = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })
  }


  return (
    <>
    <Stack paddingY={5} height={'75%'}>
    <Stack paddingBottom={'1px'} direction={'column'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
      <FormControl>
        <InputLabel>Email Address</InputLabel>
        <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
      </FormControl>
    </Stack>

    <Stack direction={'column'} width={'100%'} justifyContent={'center'} alignItems={'center'} >
        <Stack paddingY={1} direction={'row'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input type={toggleShowPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
          {
            toggleShowPassword ? 
            <i style={{cursor: 'pointer'}} className="fi fi-rr-eye-crossed" onClick={() => setToggleShowPassword(false)}></i>
            :
            <i style={{cursor: 'pointer'}} className="fi fi-rr-eye" onClick={() => setToggleShowPassword(true)}></i>
          }
        </Stack>

        {newUser && 
        <Stack paddingY={1} direction={'column'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
          <FormControl>
            <InputLabel>Confirm Password</InputLabel>
            <Input value={confPassword} onChange={(e) => setConfPassword(e.target.value)}/>
          </FormControl>
        </Stack>}

    </Stack>

    {newUser && 
    <Stack paddingY={1} direction={'column'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
      <FormControl>
        <InputLabel>User name</InputLabel>
        <Input value={userName} onChange={(e) => setUserName(e.target.value)}/>
      </FormControl>
    </Stack>}

    <Stack paddingY={1} direction={'row'} justifyContent={'center'} alignItems={'center'}>
      <Stack>
        <Button color='primary' onClick={() => {
          if(newUser){
            handleSignUp()
          } else {
            handleLogin()
          }
        }} variant='contained' style={{bgcolor:'#372248'}}>{newUser ? 'Sign Up' : 'Login'}</Button>
      </Stack>
    </Stack>

    <Stack paddingY={1} direction={'row'} justifyContent={'center'} alignItems={'center'}>
      <Stack>
        <Button onClick={() => setNewUser(prev => !prev)} style={{bgcolor:'#372248'}}>{newUser ? 'Back to login' : 'New user'}</Button>
      </Stack>
    </Stack>

    </Stack>
    </>
  )
}


const Login = () => {
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const screen = useGlobalStore((state) => state.screen)
  return (
    <Stack direction={'column'} width={'98%'} height={'95%'} justifyContent={'flex-start'} alignItems={'center'} bgcolor={'#474973'} borderRadius={1} overflow={'auto'}>
      <Stack paddingY={1} direction={'column'} width={'98%'} height={'fit-content'} justifyContent={'flex-start'} alignItems={'center'}>
        <Typography textAlign={'center'} fontFamily={'Fredoka Regular'} fontSize={20}>Welcome to SOLTheory</Typography>
        <Typography textAlign={'center'} fontFamily={'Fredoka Regular'} fontSize={15}>Please log in to proceed</Typography>
      </Stack>
      <Stack width={'90%'}>
        <LoginForm />
      </Stack>
    </Stack>
  );
};

export default Login;