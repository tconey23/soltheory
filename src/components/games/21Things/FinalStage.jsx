// FinalStage.js
import { Stack, Button, Typography, ImageList, TextField } from '@mui/material' 
import { useEffect, useState } from 'react'
import Prompt from './Prompt'
import useGlobalStore from '../../../business/useGlobalStore'
import { useGlobalContext } from '../../../business/GlobalContext'
import { supabase } from '../../../business/supabaseClient'
import { useNavigate } from 'react-router-dom'

const FinalStage = ({ selections, setSelections, setCurrentStage, date }) => {
  const navTo = useNavigate()
  const userMeta = useGlobalStore((state) => state.userMeta)
  const { screen, setAlertProps, user} = useGlobalContext()
  const [note, setNote] = useState('')
  const [warning, setWarning] = useState(null)
  const greenPrompt = selections[3]?.[0] || null

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
      stages: [selections[1], selections[2], selections[3]],
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
      setAlertProps({
        text: 'Successfully saved game data!',
        severity: 'success',
        display: true,
      })
      setCurrentStage(0)
      setNote('')
      setSelections({ 1: [], 2: [], 3: [], note: '' })
    }
  }

  const renderStageList = (stageKey, color) => (
    <ImageList
      sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingX: 2}}
      gap={'0px'}
      cols={stageKey === '3' ? 1 : 3}
    >
      {selections[stageKey]?.map((p, i) => (
        <Stack marginX={'0.5px'} key={i} padding={screen ? 0 : 0.3} justifyContent="center" alignItems="center">
          <Prompt prompt={p.prompt} color={color} />
        </Stack>
      ))}
    </ImageList>
  )

  return (
    <Stack
      userdata="21things final stage"
      sx={{ scale: screen ? 0.89 : 1 }}
      height="100%"
      width="100%"
      alignItems="center"
    >
      {renderStageList('1', '#c956ff')}
      {renderStageList('2', '#fff200')}
      {renderStageList('3', '#45d500')}

      <Stack width="100%" mt={4}>
        <Typography fontFamily={'Fredoka Regular'}>
          Why does{' '}
          <Typography
            fontFamily={'Fredoka Regular'}
            display="inline"
            paddingX={1}
            borderRadius={20}
            boxShadow="2px 3px 7px 1px #00000070"
            backgroundColor="#45d500"
          >
            {greenPrompt?.prompt}
          </Typography>{' '}
          boost your mood the most?
        </Typography>

        {warning && <Typography color="red">{warning}</Typography>}
        <TextField
          onChange={(e) => handleNoteChange(e.target.value)}
          value={note}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
      </Stack>

      <Stack direction="row" spacing={2} mt={2}>
        <Button onClick={() => setCurrentStage(3)}>Back</Button>
        {note.length > 10 && <Button onClick={handleSubmit}>Submit</Button>}
      </Stack>
    </Stack>
  )
}

export default FinalStage
