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

const Login = ({ user, setUser, setSelectedOption }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for the user's display name
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Sign in with email and password
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(error.message);
    }
  };

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
      backgroundColor={'white'}
      direction={'column'}
      alignItems="center"
      justifyContent="center"
      sx={{ height: '75vh', width: '75vw' }}
    >
      {user ? (
        <>
          <Stack>
            <Button onClick={() => setSelectedOption('Play')}>X</Button>
          </Stack>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">Welcome, {user.displayName || "User"}!</Typography>
          <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Stack>
            <Button onClick={() => setSelectedOption('Play')}>X</Button>
          </Stack>

          {/* Toggle between Login and Sign-up */}
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

          {isSignUp ? (
            <Button onClick={handleSignUp}>Sign Up</Button>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}

          <Button onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 2 }}>
            {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default Login;