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
  const {alertProps, setAlertProps, user, setUser, isMobile} = useGlobalContext()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [isSignUp, setIsSignUp] = useState(false); 
  const [size, setSize] = useState({ width: 400, height: 800 })
  const [resConf, setResConf] = useState(false)

  const nav = useNavigate()

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
if (session) {
  setUser({ user: session });
  nav('/account');
} else {
  
}

  }
  useEffect(() =>{
    console.log(user)
    checkSession()
  }, [user])

  useEffect(() => {
    console.log(email)
  }, [email])


  const resendConfEmail = async () => {
    console.log(email)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'https://soltheory.com/login'
      }
    });
    if(!error){
      setAlertProps({
        text: `Confirmation email resent`,
        severity: 'success',
        display: true
      })
    } else {
      setAlertProps({
        text: error,
        severity: 'error',
        display: true
      })
    }
  }

  const handleLogin = async () => {
    
      try {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if(result?.data?.session?.access_token){
          setUser(result)
          setAlertProps({
            text: `Login successful`,
            severity: 'success',
            display: true
          })
        } else {
          if(result.error.message === "Email not confirmed"){
            setResConf(true)
            setAlertProps({
              text: `Status: ${result?.error?.status} - ${result?.error?.message}`,
              severity: 'error',
              display: true
            })
          } else {

            setAlertProps({
              text: `Status: ${result?.error?.status} - ${result?.error?.message} \n\n Verify your account exists, try again or sign up`,
              severity: 'error',
              display: true
            })
          }
        }

        return result;
      } catch (err) {
        console.log(err)
        setAlertProps({
          text: 'error',
          severity: 'error',
          display: true
        })
        return null;
      }
    
  };

  const handleSignUp = async () => {

    if(!name || !email || !password){

      let missingReq = ''

      const reqData = {
        name: name,
        email: email, 
        password: password
      }

      const missingData = Object.entries(reqData).filter((d) => !d[1]).map((m) => m[0])

      if(missingData.length > 0){
        missingData.forEach((d, i) => {
          i > 0 ? missingReq += `, ${d} ` : missingReq += ` ${d} `
          
        })
      }
      setAlertProps({
        text: `Missing required data (${missingReq})`,
        severity: 'error',
        display: true
      })
      return 
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://soltheory.com/login', // Where they land after confirming email
          data: { name } // Optional: you can save extra signup metadata here
        }
      });
  
      console.log(data);
      if (error?.message !== 'Email not confirmed') {
        setAlertProps({
          text: `Status: ${error.status} - ${error.message}, \n\nPlease verify your email is valid and try again.`,
          severity: 'error',
          display: true
        });
        return;
      }
  
      if (data?.user && !data.session) {
        // Signup success, but user must confirm email
        setAlertProps({
          text: `Signup successful! Please check your email to confirm your account.`,
          severity: 'success',
          display: true
        });
        setIsSignUp(false)
      } else if (data?.session) {
        // Somehow user is already confirmed
        setUser({ user: data.session });
        nav('/account');
      }
  
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setAlertProps({
        text: `Unexpected error during sign up.`,
        severity: 'error',
        display: true
      });
    }
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