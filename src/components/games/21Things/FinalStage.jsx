// FinalStage.js
import { Stack, Button, Typography, ImageList, TextField, Box } from '@mui/material' 
import { useEffect, useState } from 'react'
import Prompt from './Prompt'
import useGlobalStore from '../../../business/useGlobalStore'
import { supabase } from '../../../business/supabaseClient'
import { useNavigate } from 'react-router-dom'

const FinalStage = ({ prompts, setCurrentStage, date, setSelections }) => {
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
  const setToggleLogin = useGlobalStore((state) => state.setToggleLogin)
  if (!Array.isArray(prompts)) return null;

  const navTo = useNavigate()
  const userMeta = useGlobalStore((state) => state.userMeta)
  const [note, setNote] = useState('')
  const [warning, setWarning] = useState(null)


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

  const handleSubmit = async () => {
    let currentGameData = userMeta?.game_data
    const gameData = {
      id: Date.now(),
      game: 'TwentyOneThings',
      stages: [stage1, stage2, stage3],
      game_date: date,
      note,
    }

    currentGameData.push(gameData)
    console.log(currentGameData)

    
    const { data, error } = await supabase
    .from('users')
    .update({ game_data: currentGameData })
    .eq('primary_id', userMeta.primary_id)
    .select()

    console.log(data)
        
    if (data[0].primary_id) {
      navTo('/games')
      setAlertContent({
        text: 'Successfully saved game data!',
        type: 'success',
      })
      setCurrentStage(0)
      setNote('')
      setSelections({ 1: [], 2: [], 3: [], note: '' })
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
      {list.map((p, i) => (
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
  

  return (
    <Stack
      userdata="21things final stage"
      height="90%"
      width="100%"
      alignItems="center"
    >
      {renderStageList(stage1, '#c956ff')}
      {renderStageList(stage2, '#fff200')}
      {renderStageList(stage3, '#45d500')}

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
      {/* {!userMeta &&
      <>
       <Typography color='red'>**You must be logged in to save game data**</Typography>
       <Button onClick={() => setToggleLogin(true)} >Login</Button>
      </>
      } */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button onClick={() => setCurrentStage(3)}>Back</Button>
        <Box onClick={() => {
          if(!userMeta){
            setAlertContent({
              text: 'You must be logged in to save game data',
              type: 'error',
            })
          }
        }}>
          {note.length > 0 && <Button sx={{bgcolor: !userMeta && 'grey'}} disabled={!userMeta} onClick={handleSubmit}>Submit</Button>}
        </Box>
      </Stack>
    </Stack>
    </Stack>
  )
}

export default FinalStage
