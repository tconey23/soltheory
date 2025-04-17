import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Avatar, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { signIn, signUpUser } from '../business/apiCalls';
import "react-resizable/css/styles.css";
import { useGlobalContext } from '../business/GlobalContext';
import { checkAndAddUsers } from '../business/apiCalls';
import { useNavigate } from 'react-router-dom';


const Login = ({ setSelectedOption }) => {
  const {alertProps, setAlertProps, user, setUser, isMobile} = useGlobalContext()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [isSignUp, setIsSignUp] = useState(false); 
  const [size, setSize] = useState({ width: 400, height: 800 })

  const nav = useNavigate()

  useEffect(() =>{
    if(user?.session){
      checkAndAddUsers(user.session)
    }
    if(user?.disposition === 'success'){
      nav('/account')
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

  return (
    <Stack
      alignItems="center"
      justifyContent="flex-start"
      userData="login_wrapper"
      sx={styles.wrapper}
    >
        <Stack
          userData="inputs_wrapper"
          backgroundColor={'white'}
          direction={'column'}
          alignItems="center"
          justifyContent="center"
          sx={isMobile ? styles.mobileInputWrapper : styles.inputWrapper}
        >
          <Stack userData="login_styling" padding={'30px'} width={'100%'}>
            <Stack userData="input_fields" width={'100%'} alignItems={'center'}>
              <Box>
                <Typography>Email:</Typography>
                <TextField sx={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              </Box>

              <Box>
                <Typography>Password:</Typography>
                <TextField sx={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
              </Box>

              <Stack direction={'column'} margin={2} width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Button variant='contained' onClick={handleLogin}>{isSignUp ? 'Create' : 'Login'}</Button>
                <Button variant='contained' onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 2 }}>
                  {isSignUp ? "Back To Login" : "Sign Up"}
                </Button>
              </Stack>

            </Stack>
          </Stack>

        </Stack>
      </Stack>
  );
};

export default Login;

const styles = {
  input: {
    borderRadius: 20,
  },
  wrapper: { 
    height: '100%', 
    width: '100%' 
  },
  inputWrapper: { 
    height: '100%', 
    width: '50%' 
  },
  mobileInputWrapper: {
    width: '50%'
  }
}