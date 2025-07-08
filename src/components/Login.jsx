import { useEffect, useState } from 'react';
import { Box, Button, FormControl, Input, InputLabel, Stack, Typography } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';
import { supabase } from '../business/supabaseClient';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';

const LoginForm = () => {

  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const screen = useGlobalStore((state) => state.screen)
  const setSession = useGlobalStore((state) => state.setSession)
  const setToggleLogin = useGlobalStore((state) => state.setToggleLogin)
  const toggleLogin = useGlobalStore((state) => state.toggleLogin)
  const redirectUrl = useGlobalStore((state) => state.redirectUrl)
  const setRedirectUrl = useGlobalStore((state) => state.setRedirectUrl)
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [newUser, setNewUser] = useState(false)
  const [userName, setUserName] = useState('')
  const [toggleShowPassword, setToggleShowPassword] = useState(false)
  const [toggleShowPasswordConf, setToggleShowPasswordConf] = useState(false)
  const [passMatch, setPassMatch] = useState(false)

  const loc = useLocation()
  const navTo = useNavigate()

  useEffect(() => {

    if(password === confPassword){
      setPassMatch(true)
    } else {
      setPassMatch(false)
    }

  }, [password, confPassword, email, userName])

  useEffect(() => {
    if(loc?.pathname){
      setRedirectUrl(loc?.pathname)
    }
  }, [loc?.pathname])

const handleLogin = async () => {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  });

  if (error) {
    console.error('Supabase login error:', error.message);
  } else {
    sessionStorage.setItem('returnPath', redirectUrl)
  }

  if (data) {
    if(toggleLogin){
      setToggleLogin(false)
    }
    setUser(data?.user);
    setSession(data?.session);
  }
}

  const handleSignUp = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

      if (error) {
    if(error?.message === "User already registered"){
      setAlertContent({
        text: 'A user with this email address already exists',
        type: 'error'
      })
    } else {
            setAlertContent({
        text: `${error?.message}`,
        type: 'error'
      })
    }
  }

  if (data) {
    setUser(data?.user);
    setSession(data?.session);
  }

  }


  return (
    <Stack paddingY={0} height={'75%'} width={'100%'}>
    <Stack paddingBottom={'1px'} direction={'column'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
      <FormControl>
        {!email && <InputLabel sx={{textAlign: 'flex-start'}}>Email Address</InputLabel>}
        <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
      </FormControl>
    </Stack>

    <Stack direction={'column'} width={'100%'} justifyContent={'space-evenly'} alignItems={'center'} >
        <Stack direction={'row'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
          <FormControl>
            {!password && <InputLabel>Password</InputLabel>}
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
        <>
          <Stack direction={'row'} width={'98%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
            <FormControl>
              {!confPassword && <InputLabel>Confirm Password</InputLabel>}
              <Input type={toggleShowPasswordConf ? 'text' : 'password'} value={confPassword} onChange={(e) => setConfPassword(e.target.value)}/>
            </FormControl>
            {
              toggleShowPasswordConf ? 
              <i style={{cursor: 'pointer'}} className="fi fi-rr-eye-crossed" onClick={() => setToggleShowPasswordConf(false)}></i>
              :
              <i style={{cursor: 'pointer'}} className="fi fi-rr-eye" onClick={() => setToggleShowPasswordConf(true)}></i>
            }
          </Stack>
          <Stack direction={'column'} width={'100%'} height={'30%'} justifyContent={'center'} alignItems={'center'}>
            <FormControl>
              <InputLabel>User name</InputLabel>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </FormControl>
          </Stack>
        </>
        }

    </Stack>

    <Stack paddingY={1} direction={'row'} justifyContent={'center'} alignItems={'center'}>
      <Stack>
        {
          newUser && passMatch && email && userName &&
          <Button onClick={() => {
            if(newUser){
              handleSignUp()
            } else {
              handleLogin()
            }
          }}>Sign Up</Button>
        }
        {
          !newUser && 
          <Button onClick={() => {
            if(newUser){
              handleSignUp()
            } else {
              handleLogin()
            }
          }}>Login</Button>
        }

      </Stack>
    </Stack>

    <Stack paddingY={1} direction={'row'} justifyContent={'center'} alignItems={'center'}>
      <Stack>
        <Button onClick={() => setNewUser(prev => !prev)} style={{bgcolor:'#372248'}}>{newUser ? 'Back to login' : 'New user'}</Button>
      </Stack>
    </Stack>
    </Stack>
  )
}


const Login = () => {
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const screen = useGlobalStore((state) => state.screen)
  return (
    <Stack direction={'column'} width={'90%'} height={'95%'} justifyContent={'flex-start'} alignItems={'center'} bgcolor={'#474973'} borderRadius={5} overflow={'auto'}>
      <Stack paddingY={3} direction={'column'} width={'98%'} height={'fit-content'} justifyContent={'flex-start'} alignItems={'center'}>
        <Typography textAlign={'center'} fontFamily={'Fredoka Regular'} color='white' fontSize={20}>Welcome to SOLTheory</Typography>
        <Box sx={{width: '90%'}}>
          <Typography textAlign={'center'} fontFamily={'Fredoka Regular'} color='white' fontSize={13}>You can explore our site without creating an account, but signing up unlocks additional features such as saving your gameplay and following your bliss.</Typography>
        </Box>
      </Stack>
      <Stack width={'90%'}>
        <LoginForm />
      </Stack>
        <Box>
          <Typography textAlign={'center'} fontFamily={'Fredoka Regular'} color='white' fontSize={13}>For more information about SOL Theory, reach out to 

            <Typography sx={{fontSize: '21px'}}>
              <Link href="mailto:hello@soltheory.com?subject=Info%20Request" target="_blank" rel="noopener noreferrer">hello@soltheory.com</Link>
            </Typography>
          </Typography>
        </Box>
    </Stack>
  );
};

export default Login;