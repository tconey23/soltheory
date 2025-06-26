import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';

const SongSelector = ({ token }) => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const searchSongs = async () => {
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
    <Stack direction={'column'} width={'100%'} height={'100%'}>
            <input
        type="text"
        value={query}
        placeholder="Search for a song..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
      />
      <button onClick={searchSongs}>Search</button>

      <ul>
        {results.map((track) => (
          <li key={track.id}>
            <img src={track.album.images[2]?.url} alt="cover" width={40} />
            {track.name} - {track.artists.map(a => a.name).join(', ')}
            <button onClick={() => selectSong(track)}>Select</button>
          </li>
        ))}
      </ul>

      <h3>Selected Songs:</h3>
      <ul>
        {selected.map((song) => (
          <li key={song.id}>
            <img src={song.album.images[2]?.url} alt="cover" width={40} />
            {song.name} - {song.artists.map(a => a.name).join(', ')}
            <button onClick={() => removeSong(song.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </Stack>
  );
};

export default SongSelector;