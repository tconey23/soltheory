// FinalStage.js
import { Stack, Button, Typography, ImageList, TextField, Box, Modal } from '@mui/material' 
import { useEffect, useState } from 'react'
import Prompt from './Prompt'
import useGlobalStore from '../../../business/useGlobalStore'
import { supabase } from '../../../business/supabaseClient'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import "@fontsource-variable/sofia-sans"

const FinalStage = ({ prompts, setCurrentStage, date, setSelections }) => {
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
  const guestUser = useGlobalStore((state) => state.guestUser)
  const setToggleLogin = useGlobalStore((state) => state.setToggleLogin)

  const inGame = useGlobalStore((state) => state.inGame)
  const setInGame = useGlobalStore((state) => state.setInGame)

  if (!Array.isArray(prompts)) return null;
  const {gameId} = useParams()

  const navTo = useNavigate()
  const userMeta = useGlobalStore((state) => state.userMeta)
  const [note, setNote] = useState('')
  const [warning, setWarning] = useState(null)
  const [askToShare, setAskToShare] = useState(false)
  const [showSubmit, setShowSubmit] = useState(true)


  const stage1 = prompts.filter(p => p.stages.includes(1));
  const stage2 = prompts.filter(p => p.stages.includes(2));
  const stage3 = prompts.filter(p => p.stages.includes(3));

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
       await navigator.share({
        text: 'Check out my 21 Things for today', 
        title: 'Check out my 21 Things for today', 
        url: `https://soltheory.com/games/21things/shared/${userMeta?.primary_id || guestUser?.id}/${gameId}`
      })
      setAskToShare(false)
      setAlertContent({
        text: 'Game saved/shared successfully',
        type: 'success', 
      })
      // navTo('/games')
      setShowSubmit(false)
    } else {
      setCurrentStage(0)
      setNote('')
      setSelections({ 1: [], 2: [], 3: [], note: '' })
      sessionStorage.removeItem('redirectAfterLogin')
      setAskToShare(false)
      setInGame(false)
    }
  }

  const handleSubmit = async () => {
    const gameData = {
      id: gameId || Date.now(),
      user_id: userMeta?.primary_id || guestUser?.id,
      game_name: 'TwentyOneThings',
      stage1: stage1,
      stage2: stage2,
      stage3: stage3,
      note:note,
      game_date: date || Date.now(),
    }
        
        const { data, error } = await supabase
      .from('twentyone_things_data')
      .upsert([gameData])  // replaces insert()
      .select();

        console.error(error)
        if(data){
          setAskToShare(true)
        }
          
  }

  const renderStageList = (list, color, listIndex) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: listIndex === 3 ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
        gap: 2,
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90%',
        padding: 1,
        margin: '0 auto',
        overflow: 'auto',
        minHeight: 'fit-content'
      }}
    >
      {list.map((p, i) => (
        <Typography
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
            minHeight: '80px',
            width: '100%',
            fontSize: {
              xs: '3.5vw',   // Mobile
              sm: '2vw',   // Tablet
              md: '1.5vw', // Desktop
            },
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            fontFamily: "Fredoka Regular",
            justifySelf: 'center'
          }}
        >
          {p.prompt}
        </Typography>
      ))}
    </Box>
  );
  

  return (
    <Stack
      userdata="21things final stage"
      height="89svh"
      width="100%"
      alignItems="center"
      overflow={'auto'}
    >
      {renderStageList(stage1, '#dd95ff', 1)}
      {renderStageList(stage2, '#fff200', 2)}
      {renderStageList(stage3, '#45d500', 3)}

      <Stack width="100%" mt={4}>
        <Typography fontSize={'0.9rem'} fontFamily={'Fredoka Regular'}>
          {`Why does "${stage3?.[0].prompt}" boost your mood the most?`}
        </Typography>

        {warning && <Typography color="red">{warning}</Typography>}
        <TextField
          onChange={(e) => handleNoteChange(e.target.value)}
          value={note}
          multiline
          rows={3}
          fullWidth
          margin="normal"
        />
      </Stack>

    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <Stack direction="row" spacing={2} mt={2}>
        <Button 
          onClick={() => {
            if(showSubmit){
              setCurrentStage(3)
            } else {
              setCurrentStage(0)
            }

          }}>
            {showSubmit ? 'Back' : 'Done'}
        </Button>
        <Box 
        >
          {note.length > 0 && showSubmit &&
          <Button 
            sx={{
              bgcolor: !userMeta 
              && 
              !guestUser?.id 
              && 'grey'
              }} 
            disabled={!userMeta && !guestUser?.id} onClick={handleSubmit}>Submit</Button>}
        </Box>
      </Stack>
    </Stack>
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
