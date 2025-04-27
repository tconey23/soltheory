import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Avatar, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { signIn, signUpUser } from '../business/apiCalls';
import "react-resizable/css/styles.css";
import { useGlobalContext } from '../business/GlobalContext';
import { checkAndAddUsers } from '../business/apiCalls';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../business/supabaseClient';


const Login = ({ setSelectedOption }) => {
  const {user, isMobile, sessionState, login, logout, setAlertProps} = useGlobalContext()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [isSignUp, setIsSignUp] = useState(false); 
  const [resConf, setResConf] = useState(false)

  const nav = useNavigate()

  useEffect(() =>{

  }, [user, sessionState])



  const resendConfEmail = async () => {
  }

  const handleLogin = async () => {
    try {
      await login(email, password)
      setAlertProps({ text: 'Login successful', severity: 'success', display: true })
      nav('/account')
    } catch (err) {
      setAlertProps({ text: err.message, severity: 'error', display: true })
    }
  };
  
  

  const handleSignUp = async () => {
    
  };
  
  
  

  return (
    <Stack
      alignItems="center"
      justifyContent="flex-start"
      userdata="login_wrapper"
      sx={styles.wrapper}
    >
        <Stack
          userdata="inputs_wrapper"
          backgroundColor={'white'}
          direction={'column'}
          alignItems="center"
          justifyContent="center"
          sx={isMobile ? styles.mobileInputWrapper : styles.inputWrapper}
        >
          <Stack userdata="login_styling" padding={'30px'} width={'100%'}>
            
            {resConf && <Button onClick={() => resendConfEmail()} >Resend Confirmation Email</Button>}
            
            <Stack userdata="input_fields" width={'100%'} alignItems={'center'}>
              <Box>
                <Typography>Email:</Typography>
                <TextField sx={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              </Box>

              {isSignUp &&
              <Box>
                <Typography>User Name:</Typography>
                <TextField sx={styles.input} value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              </Box>}

              <Box>
                <Typography>Password:</Typography>
                <TextField sx={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
              </Box>

              <Stack direction={'column'} margin={2} width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Stack direction={'row'}>
                  <Button 
                    variant="contained" 
                    onClick={isSignUp ? handleSignUp : handleLogin}
                    >
                    {isSignUp ? 'Create' : 'Login'}
                  </Button>
                </Stack>

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