// FinalStage.js
import { Stack, Button, Typography, ImageList, TextField, Box, Modal } from '@mui/material' 
import { useEffect, useState } from 'react'
import Prompt from './Prompt'
import useGlobalStore from '../../../business/useGlobalStore'
import { supabase } from '../../../business/supabaseClient'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

const FinalStage = ({ prompts, setCurrentStage, date, setSelections, redirect, savegameNote, viewOnly  }) => {
  const toggleShareGame = useGlobalStore((state => state.toggleShareGame))
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
  const setToggleLogin = useGlobalStore((state) => state.setToggleLogin)
  if (!Array.isArray(prompts)) return null;

  const navTo = useNavigate()
  const loc = useLocation()
  const { gameId } = useParams()
  const userMeta = useGlobalStore((state) => state.userMeta)
  const [note, setNote] = useState('')
  const [warning, setWarning] = useState(null)

const [stage1, setStage1] = useState([])
const [stage2, setStage2] = useState([])
const [stage3, setStage3] = useState([])
const [askToShare, setAskToShare] = useState(false)

  useEffect(() => {
    console.log(prompts)
    if(!redirect && !savegameNote){
      setStage1(prompts.filter(p => p.stages.includes(1)))
      setStage2(prompts.filter(p => p.stages.includes(2)))
      setStage3(prompts.filter(p => p.stages.includes(3)))
    } else {
      setStage1(prompts?.[0])
      setStage2(prompts?.[1])
      setStage3(prompts?.[2])
      setNote(savegameNote)
    }
  }, [prompts, redirect])

  
  useEffect(() => {

    console.log(stage1, stage2, stage3)

  }, [stage1, stage2, stage3])


  const handleNoteChange = (val) => {
    if (val.length <= 180) {
      setNote(val) 
      setWarning(null)
    } else {
      setWarning('You have reached the 180 character limit.')
    }
  }

  const handleShare = async (share) => {

    if(share){
       navigator.share({
        title: 'Check out my 21 Things for today',
        text: 'Come play with me at https://soltheory.com/games',
        url: `https://soltheory.com/games/21things/${userMeta?.primary_id}/${gameId}`
      })
    } else {
      setCurrentStage(0)
      setNote('')
      setSelections({ 1: [], 2: [], 3: [], note: '' })
      sessionStorage.removeItem('redirectAfterLogin')
      setAskToShare(false)
    }
  }

  const handleSubmit = async () => {
    let currentGameData = userMeta?.game_data
    const gameData = {
      id: gameId || Date.now(),
      game: 'TwentyOneThings',
      stages: [stage1, stage2, stage3],
      game_date: date || Date.now(),
      note,
    }

    currentGameData.push(gameData)    
    const { data, error } = await supabase
    .from('users')
    .update({ game_data: currentGameData })
    .eq('primary_id', userMeta.primary_id)
    .select()
        
    if (data[0].primary_id) {
      // navTo('/games')
      setAlertContent({
        text: 'Successfully saved game data!',
        type: 'success',
      })
      setAskToShare(true)
      
      const { error } = await supabase
        .from('guest_games')
        .delete()
        .eq('id', gameId)
    }
  }

  const renderStageList = (list, color) => (
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
      {list?.map((p, i) => (
        <Box
          key={i}
          sx={{
            backgroundColor: color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            padding: 1,
            cursor: 'default',
            minHeight: '80px', // make rows even
            fontSize: '1rem',
            lineHeight: 1.2,
          }}
        >
          {p.prompt}
        </Box>
      ))}
    </Box>
  );

  const saveGuestGame = async () => {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)

    const gameData = {
      id: Date.now(),
      game: 'TwentyOneThings',
      stages: [stage1, stage2, stage3],
      game_date: date,
      note,
    }

    console.log(gameData)

      const { data, error } = await supabase
      .from('guest_games')
      .update({ game_content: gameData })
      .eq('id', gameId)
      .select()

      if(data){
        setToggleLogin(true)
      }

  }
  

  return (
    <Stack
      userdata="21things final stage"
      height="90%"
      width="100%"
      alignItems="center"
    >

{prompts && <>
      {renderStageList(stage1, '#c956ff')}
      {renderStageList(stage2, '#fff200')}
      {renderStageList(stage3, '#45d500')}

      <Stack width="100%" mt={4}>
        <Typography fontSize={'0.9rem'} fontFamily={'Fredoka Regular'}>
          {`Why does "${stage3?.[0]?.prompt}" boost your mood the most?`}
        </Typography>

        {warning && <Typography color="red">{warning}</Typography>}
        <TextField
          onChange={(e) => handleNoteChange(e.target.value)}
          value={note}
          disabled={viewOnly}
          multiline
          rows={3}
          fullWidth
          margin="normal"
          />
      </Stack>

    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
      {/* {!userMeta &&
      <>
      <Typography color='red'>**You must be logged in to save game data**</Typography>
      <Button onClick={() => setToggleLogin(true)} >Login</Button>
      </>
      } */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button onClick={() =>{
          if(viewOnly) {
            navTo('/games')
          } else {
            setCurrentStage(3)
          }
          
          }}>Back</Button>
        <Box onClick={() => {
          if(!userMeta){
            setAlertContent({
              text: 'You must be logged in to save game data',
              type: 'warning', 
            })
            saveGuestGame()
          }
        }}>
          {note.length > 0 && !viewOnly && <Button sx={{bgcolor: !userMeta && 'grey'}} disabled={!userMeta} onClick={handleSubmit}>Submit</Button>}
        </Box>
      </Stack>
    </Stack>
          </>}
          <Modal open={askToShare}>
            <Stack justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'}>
              <Stack justifyContent={'center'} alignItems={'center'} bgcolor={'white'} height={'10%'} width={'75%'}>
              <Typography>Would you like to share this game?</Typography>
              <Stack direction={'row'}>
                <Button onClick={() => handleShare(true)}>YES</Button>
                <Button onClick={() => handleShare(false)}>NO</Button>
              </Stack>
              </Stack>
            </Stack>
          </Modal>
    </Stack>
  )
}

export default FinalStage
