import { useEffect, useState, useRef } from 'react';
import { MenuItem, Select, Stack, Typography } from '@mui/material';
import TwentyOneCalendar from './TwentyOneCalendar';
import TwentyOneThingsDisp from './TwentyOneThingsDisp'; 
import { fetchPacks } from '../games/6pics/helpers/functions';
import SixPicsDisp from './SixPicsDisp';

const SixPicsData = () => {
      const [packs, setPacks] = useState([])
      const [selectedGame, setSelectedGame] = useState()
    
      const hasFetched = useRef(false);
    
      useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
      
        const getPacks = async () => {
          try {
            const res = await fetchPacks();
            if (res) {
                setPacks(res)
            } else {
                setPacks([])
            }
          } catch (err) {
            console.error(err);
          }
        };
      
        getPacks();
      }, []);

      useEffect(() => {
        if (!selectedGame && packs.length) {
          const firstPack = packs.find((p) => !p.marked_for_delete);
          if (firstPack) setSelectedGame(firstPack.pack_name);
        }
      }, [packs, selectedGame]);


      const selectGame = (pack) => {
        setSelectedGame(pack)
      }

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} bgcolor={''}>
        <Stack>
            <Select value={selectedGame || ''} onChange={(e) => selectGame(e.target.value)}>
                {
                    packs?.map((p) => {
                        if(!p.marked_for_delete){
                            return <MenuItem value={p.pack_name} >{p.pack_name}</MenuItem>
                        }
                    })
                }
            </Select>
        </Stack>
        <Stack>
            <SixPicsDisp gameData={selectedGame}/>
        </Stack>
    </Stack>
  );

};

export default SixPicsData;