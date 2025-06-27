import React, { useEffect, useState } from 'react';
import { redirectToSpotifyLogin, getAccessToken } from '../../../business/spotifyAuth';
import SongSelector from './SongSelector';
import { Stack, Button, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const MyThreeSongs = () => {
  const [token, setToken] = useState(null);
  const location = useLocation();

useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get('code');
  const stored = localStorage.getItem('spotify_token');

  if (code && !token) {
    console.log('Auth code found:', code);
    getAccessToken(code)
      .then((accessToken) => {
        console.log('Access Token Received:', accessToken);
        setToken(accessToken);
        localStorage.setItem('spotify_token', accessToken);
        window.history.replaceState({}, document.title, location.pathname);
      })
      .catch((err) => {
        console.error('Failed to get Spotify access token:', err);
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('verifier');
      });
  } else if (stored && !token) {
    console.log('Using token from localStorage');
    setToken(stored);
  } else if (!stored && !code && !token) {
    // FORCE login if no token or code — run redirectToSpotifyLogin
    // redirectToSpotifyLogin();
  }
}, []);


  if (!token) {
    return (
      <Stack>
        <Typography fontSize={10}>Login with Spotify</Typography>
        <Button onClick={redirectToSpotifyLogin}>Connect to Spotify</Button>
      </Stack>
    );
  }

  return (
    <Stack direction="column" width="100%" height="100%">
      <Box width="85%" textAlign="center">
        <Typography fontSize={22}>Pick the 3 Songs that mean the most to you</Typography>
      </Box>
      <SongSelector token={token} />
    </Stack>
  );
};

export default MyThreeSongs;
