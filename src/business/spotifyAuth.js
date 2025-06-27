const loc = window.location.origin

export const getAccessToken = async (code) => {
  const verifier = localStorage.getItem('verifier');
  const clientId = 'c9e747591c344d3b9f47fae550e56531';
  const redirectUri = `${window.location.origin}/mythreesongs`;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    console.error('Token exchange error:', data);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('verifier');
    throw new Error(data.error_description || 'Failed to fetch token');
  }

  return data.access_token;
};


export function generateCodeVerifier(length = 128) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function redirectToSpotifyLogin() {
  const clientId = 'c9e747591c344d3b9f47fae550e56531';
  const redirectUri = `${loc}/mythreesongs`;
  console.log(redirectUri)
  const scopes = '';

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem('verifier', verifier); // Needed later to exchange code

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: scopes,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

