import React, { useEffect, useState } from 'react';
import { redirectToSpotifyLogin } from '../../../business/spotifyAuth'; // adjust import
import SongSelector from './SongSelector';
import { Stack } from '@mui/material';

const MyThreeSongs = () => {

    const [token, setToken] = useState(null);

    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        const verifier = localStorage.getItem('verifier');
        const clientId = 'c9e747591c344d3b9f47fae550e56531';
        const redirectUri = 'http://127.0.0.1:3000/mythreesongs';

        fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('spotify_token', data.access_token);
                setToken(data.access_token); // 👈 THIS LINE IS MISSING
                window.history.replaceState({}, document.title, '/mythreesongs');
            }
        });
    }
    }, []);


  if (!token) {
    return (
        <div>
        <h1>Login with Spotify</h1>
        <button onClick={redirectToSpotifyLogin}>Connect to Spotify</button>
        </div>
    );
  }

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      <h1>Pick 3 Songs with Meaning</h1>
      <SongSelector token={token} />
    </Stack>
  );
};

export default MyThreeSongs;