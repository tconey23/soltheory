import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Avatar, TextField } from '@mui/material';
import { auth } from '../business/firebaseAuth';
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { Box } from '@mui/system';
import AccountPage from './AccountPage';

const FirebaseLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // New state for the user's display name
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    
          try {
            setUser(currentUser);
          } catch (error) {
              console.error(error);
              
          }
        });
    
        return () => unsubscribe(); // Cleanup listener on unmount
      }, []);
    
      // Sign up with email and password
      const handleSignUp = async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = userCredential.user;
    
          // Set display name for the new user
          await updateProfile(newUser, {
            displayName: name,
          });
    
          console.log("User signed up:", newUser);
          setUser({ ...newUser, displayName: name });
        } catch (error) {
          console.error("Sign-up failed:", error.message);
          alert(error.message);
        }
      };
    
      // Sign in with email and password
      const handleLogin = async () => {
    
        if(!isSignUp){
    
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user);
          } catch (error) {
            console.error("Login failed:", error.message);
            alert(error.message);
          }
        } else {
          handleSignUp()
        }
      };
    
    
      // Logout function
      const handleLogout = async () => {
        try {
          await signOut(auth);
          console.log("User signed out");
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      };

  return (
<Stack
      sx={{height: '100vh', width: '100vw'}}
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        backgroundColor={'white'}
        direction={'column'}
        alignItems="center"
        justifyContent="center"
        sx={{ height: '50%', width: '50%' }}
      >
      <Stack width={'80%'} height={'1%'} padding={3} alignItems={'flex-end'}>
        <Stack width={'5%'} height={'10%'} >
          <Button variant='contained' onClick={() => setSelectedOption('Play')}>X</Button>
        </Stack>
      </Stack>
      {user ? (
        <>
            <AccountPage user={user} handleLogout={handleLogout}/>
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
    </Stack>
  );
};

export default FirebaseLogin;