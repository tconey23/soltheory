import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Avatar, TextField } from '@mui/material';
import { Box } from '@mui/system';
import AccountPage from './AccountPage';
import { signIn, signUpUser } from '../business/apiCalls';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useGlobalContext } from '../business/GlobalContext';
import { checkAndAddUsers } from '../business/apiCalls';


const Login = ({ setSelectedOption }) => {
  const {alertProps, setAlertProps} = useGlobalContext()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [isSignUp, setIsSignUp] = useState(false); 
  const [size, setSize] = useState({ width: 400, height: 800 })

  const {user, setUser} = useGlobalContext()

  useEffect(() =>{
    console.log(user) 
    if(user){
      checkAndAddUsers(user.session)
    }
  }, [user])

  const handleLogin = async () => {
    
    if(isSignUp){
      const res = await signUpUser(email, password, name)
      console.log(res)

      if(res && res.id){
        setUser(res)
      }
    } else {

      const res = await signIn(email, password)
      console.log(res)
      if(res && res.session?.access_token) {
        setUser(res)
      }

      if(res && res.disposition){
        setAlertProps({
          text: res.message,
          severity: res.disposition,
          display: true
        })
      }

      
    }

  }

  const handleLogout = async () => {
    setUser(null)
    setAlertProps({
      text: 'You have been logged out',
      severity: 'success',
      display: true
    })
  }
  

  return (
    <ResizableBox
        width={size.width}
        height={size.height}
        axis="both" // Resize in both directions
        minConstraints={[300, 600]} // Min width & height
        maxConstraints={[1200, 1200]} // Max width & height
        onResizeStop={(e, data) => setSize({ width: data.size.width, height: data.size.height })}
        style={{justifyContent: 'flex-start'}}
    >
      <Stack
        backgroundColor={'white'}
        direction={'column'}
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100%', width: '100%' }}
      >
      <Stack width={'80%'} height={'1%'} padding={3} alignItems={'flex-end'}>
        <Stack width={'5%'} height={'10%'} >
          <Button variant='contained' onClick={() => setSelectedOption('Play')}>X</Button>
        </Stack>
      </Stack>
      {user ? (
        <>
            <AccountPage user={user.user} handleLogout={handleLogout} size={size}/>
        </>
      ) : (
        <>
          <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>

            <Stack width={'25%'}>
              {isSignUp && (
                <Box>
                  <Typography>Display Name:</Typography>
                  <TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                </Box>
              )}

                <Box>
                  <Typography>Email:</Typography>
                  <TextField value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                </Box>

                <Box>
                  <Typography>Password:</Typography>
                  <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                </Box>

                <Stack direction={'column'} margin={2}>

                  <Button variant='contained' onClick={handleLogin}>{isSignUp ? 'Create' : 'Login'}</Button>
                  <Button variant='contained' onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 2 }}>
                    {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
                  </Button>

                </Stack>
            </Stack>
          </Stack>
        </>
      )}
      </Stack>
    </ResizableBox>
  );
};

export default Login;