import { useEffect, useState } from 'react';
import { Stack, Button, List, MenuItem, TextField, Tooltip, Typography, Modal } from '@mui/material';
import { useWindowHeight } from '../../../business/useWindowHeight';
import { saveThreeSongs } from '../../../business/games_calls';
import useGlobalStore from '../../../business/useGlobalStore';

const SongSelector = ({ token }) => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [trackToPlay, setTrackToPlay] = useState()
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)

  const height = useWindowHeight() 

  const handleSave = async (songs) => {
    console.log(selected)
    let saveSongs = await saveThreeSongs(selected, userMeta?.primary_id)

    if(saveSongs === 'success'){
      setAlertContent({
        text: 'Your songs have been saved successfully',
        type: 'success'
      })
      setSelected([])
      setQuery('')
      setResults([])
    } else {
      setAlertContent({
        text: 'An error has ocurred. Please try again later',
        type: 'error'
      })
    }

  }

  useEffect(() => {
    console.log(selected)
  }, [selected])

  const searchSongs = async () => {
    console.log("Spotify token:", token)
    if (!query || !token) return;
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setResults(data.tracks?.items || []);
  };

  const selectSong = (song) => {
    if (selected.length >= 3 || selected.some(s => s.id === song.id)) return;
    setSelected([...selected, song]);
  };

  const removeSong = (id) => {
    setSelected(selected.filter(s => s.id !== id));
  };

  return (
    <Stack direction="column" width="100%" height="100vh" maxHeight="100vh" overflow="hidden" alignItems={'center'}>

      <Stack width={'100%'} height={'45%'} alignItems={'center'}>

        <Stack direction={'row'} marginY={'20px'} height={'10%'} alignItems={'center'}>
          <TextField
            type="text"
            value={query}
            placeholder="Search for a song..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
            sx={{marginRight: '20px'}}
            />

          <Button onClick={searchSongs}>Search</Button>
        </Stack>

        <Stack flex={1} overflow="auto" width={'88%'}>

          <List sx={{height: '70%', width: '100%', overflow: 'auto', boxShadow: 'inset 0px 0px 8px 2px #00000036', borderRadius: 3}}>
            {results.map((track) => (
              <MenuItem key={track.id} >
                
                  <Button onClick={() => selectSong(track)} sx={{width: '100%'}}> 
                    <Stack direction={'column'} width={'100%'}>
                      <Stack direction={'row'} width={'100%'}>
                          <img src={track.album.images[2]?.url} alt="cover" width={40} style={{marginRight: '10px'}}/>
                        <Stack direction={'column'} width={'100%'} alignItems={'flex-start'}>
                          {track.name}
                          <Typography sx={{textOverflow: 'ellipsis', width: '90%', overflow: 'hidden', textAlign:'left'}} fontSize={10}>{track.artists.map(a => a.name).join(', ')}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Button>
                
              </MenuItem>
            ))}
          </List>
        </Stack>
        
      </Stack>
      
      {selected?.length > 0 && 
        <Stack flex={1} overflow="auto">
          <Typography>Selected Songs: {selected?.length}</Typography>
          <Stack height={'50%'} >
            <List sx={{height: '100%', overflow: 'auto', boxShadow: 'inset 0px 0px 8px 2px #00000036', borderRadius: 3}}>
              {selected.map((song) => (
                <MenuItem key={song.id}>
                  <Stack bgcolor={'#372248'} padding={1} borderRadius={2} width={'98%'}>
                    <Stack direction={'column'} width={'100%'}>
                      <Stack direction={'row'} width={'100%'} >
                          <Stack justifyContent={'center'}>
                              <img src={song.album.images[2]?.url} alt="cover" width={50} style={{marginRight: '10px'}}/>
                          </Stack>
                          <Stack justifyContent={'center'} direction={'column'} width={'63%'} alignItems={'flex-start'}>
                            <Typography sx={{textOverflow: 'ellipsis', width: '90%', overflow: 'hidden', textAlign:'left', color: 'white'}} fontSize={14}>{song.name}</Typography>
                            <Typography sx={{textOverflow: 'ellipsis', width: '90%', overflow: 'hidden', textAlign:'left', color: 'white'}} fontSize={10}>{song.artists.map(a => a.name).join(', ')}</Typography>
                          </Stack>

                        <Stack justifyContent={'center'}>
                          <Button sx={{fontSize: 18, border: '1px solid white', scale: 0.9}} onClick={() => setTrackToPlay(song.id)}><i className="fi fi-sr-play-circle"></i></Button>
                          <Button sx={{fontSize: 18, border: '1px solid white', scale: 0.9}} onClick={() => removeSong(song.id)}><i className="fi fi-rr-cross-circle"></i></Button>
                        </Stack>

                      </Stack>
                    </Stack>
                  </Stack>
                </MenuItem>
              ))}
            </List>
          <Stack width={'100%'} alignItems={'center'} marginTop={1}>
            <Button onClick={() => handleSave()}>Save!</Button>
          </Stack>
          </Stack>
        </Stack>
      }
      <Modal
        open={!!trackToPlay}
      >
        <Stack height={'100%'}>
          <Stack>
            <Button onClick={() => setTrackToPlay('')}>Close</Button>
          </Stack>
          <Stack height={'75%'} justifyContent={'center'} alignItems={'center'}>
            <iframe
              src={`https://open.spotify.com/embed/track/${trackToPlay}`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
            ></iframe>
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default SongSelector;