import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Prompt from './Prompt';
import Username from '../../Username';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const SharedGame = () => {

    const {userId, gameId} = useParams()
    const navto = useNavigate()

    const [userName, setUserName] = useState('')
    const [date, setDate] = useState()
    const [note, setNote] = useState()
    const [stage1, setStage1] = useState([])
    const [stage2, setStage2] = useState([])
    const [stage3, setStage3] = useState([])

    useEffect(() => {
        console.clear()
        setDate('')
        setNote('')
        setStage1([])
        setStage2([])
        setStage3([])

        const getUser = async (id) => {
            let { data: user, error } = await supabase
            .from('users')
            .select("user_name")
            .eq('primary_id', id)

            if(user?.[0]){
                setUserName(user?.[0]?.user_name)
            }
        }


        const getGame = async () => {
            let { data: game, error } = await supabase
                .from('twentyone_things_data')
                .select("*")
                .eq('user_id', userId)
                .eq('id', gameId)

                await getUser(userId)

                if(game){
                    let gameData = game?.[0]

                    console.log(gameData)

                    setDate(gameData?.game_date)
                    setNote(gameData?.note)
                    setStage1(gameData?.stage1)
                    setStage2(gameData?.stage2)
                    setStage3(gameData?.stage3)
                }
        }


       if(userId && gameId){
            getGame()
       }


    }, [userId, gameId])

  return (
    <Stack direction={'column'} width={'100%'} height={'80%'} justifyContent={'space-evenly'} alignItems={'center'}>

        <Stack width={'100%'} alignItems={'flex-start'} marginLeft={'30px'}>
            <Button onClick={() => navto('/games')} sx={{maxWidth: '10px'}}><i className="fi fi-rr-arrow-small-left"></i></Button>
        </Stack>

        <Stack direction={'row'}>
            <Typography fontFamily={'Fredoka Regular'} fontSize={20}>{`${userName.includes('guest') ? 'Guest' : userName}'s game on ${date}`}</Typography>
        </Stack>
      
      <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            width: '100%',
            maxHeight: '90%',
            padding: 1,
            margin: '0 auto',
            overflow: 'auto',
            alignContent: 'center'
        }}
      >
        {stage1.map((p) => (
            <Prompt prompt={p.prompt} color={purple}/>
        ))}
      </Box>

      <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90%',
            padding: 1,
            margin: '0 auto',
            overflow: 'auto',
        }}
      >
        {stage2.map((p) => (
            <Prompt prompt={p.prompt} color={yellow}/>
        ))}
      </Box>

      <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: 2,
            width: '33%',
            maxWidth: '600px',
            maxHeight: '90%',
            padding: 1,
            margin: '0 auto',
            overflow: 'auto',
        }}
      >
        {stage3.map((p) => (
            <Prompt prompt={p.prompt} color={green}/>
        ))}
      </Box>

        <Stack sx={{boxShadow: `0px 0px 11px 3px #c956ff85`, borderRadius: 3}} paddingY={10} width={'90%'} maxHeight={'100px'} justifyContent={'flex-start'}>
            <Typography height={'100%'} fontFamily={'Fredoka Regular'} fontSize={15}>{note}</Typography>
        </Stack>

    </Stack>
  );
};

export default SharedGame;