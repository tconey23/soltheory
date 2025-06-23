import { useEffect, useState } from 'react';
import { Button, List, ListItem, MenuItem, Select, Stack, Typography } from '@mui/material';
import TwentOneThingsButton from '../games/TwentyOneThingsButton';
import SixPicsButton from '../games/SixPicsButton';
import useGlobalStore from '../../business/useGlobalStore';
import { Link } from 'react-router-dom';
import Prompt from '../games/21Things/Prompt';

const MyGames = ({displayGame}) => {

    const [selectedGame, setSelectedGame] = useState('')
    const [gameArray, setGameArray] = useState([])
    const userMeta = useGlobalStore((state) => state.userMeta);
    const green = '#45d500'

    // console.log(displayGame)

    const getGames = async (game) => {

        let { data: game_data, error } = await supabase
        .from('twentyone_things_data')
        .select('*')
        .eq('user_id', userMeta.primary_id)
        .order('game_date', { ascending: false });

        // console.log(game_data, error)
        if(game_data){
            setGameArray(game_data)
        }

    }

    const handleClick = (user_id, game_url) => {
        let fullPath = `/games/21things/shared/${user_id}/${game_url}`
        window.open(fullPath, '_blank');
    };


    useEffect(() => {
        if(!selectedGame) return
        getGames(selectedGame)
    }, [selectedGame])

    useEffect(() => {
        if(displayGame){
            setSelectedGame(displayGame)
        }
    }, [displayGame])


  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
        {!displayGame && 
        <Stack maxHeight={'50px'} sx={{marginX: 5}}>
            <Select sx={{maxHeight: '50px'}} value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                <MenuItem sx={{scale: 1}} value='twentyonethings'>      
                    <TwentOneThingsButton scl={0.45}/>
                </MenuItem>
                <MenuItem sx={{scale: 1}} value='sixpics'>      
                    <SixPicsButton scl={0.45}/>
                </MenuItem>
            </Select>
        </Stack>}
        <Stack direction={'column'} alignItems={'center'}>
            <List sx={{background: 'white', overflow: displayGame ? 'inherit' : 'auto', height: '50%'}}>
                {gameArray?.map((g) => {
                    // console.log(g)
                    return (
                        <ListItem onClick={() => handleClick(g?.user_id, g?.id)} sx={{border: '0px solid black', paddingY: 2, marginY: 0.25}}>
                            <Stack>
                                <Typography sx={{fontWeight: 'bold'}}>Played on: {g.game_date}</Typography>
                                <Prompt prompt={g?.stage3?.[0]?.prompt} color={green}/>
                            </Stack>
                        </ListItem>
                    )
                })

                }
            </List>
        </Stack>
    </Stack>
  );
};

export default MyGames;