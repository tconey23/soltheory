import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Box} from '@mui/material';
import { get21Things } from '../../business/apiCalls';
import Hexagon from './Hexagon';
import { addGameToUser } from '../../business/apiCalls';
import { useGlobalContext } from '../../business/GlobalContext';
import Stage from './Stage';
import FinalStage from './FinalStage';


const stage2 = [
    {
        "prompt": "Musicals",
        "color": "#c956ff"
    },
    {
        "prompt": "Licking the bottom of the bowl",
        "color": "#c956ff"
    },
    {
        "prompt": "Cruise control",
        "color": "#c956ff"
    },
    {
        "prompt": "Western movies",
        "color": "#c956ff"
    },
    {
        "prompt": "Making a vision board",
        "color": "#c956ff"
    },
    {
        "prompt": "Sharing a banana split ",
        "color": "#c956ff"
    }
]

const stage3 = [
    {
        "prompt": "Licking the bottom of the bowl",
        "color": "#fff200"
    },
    {
        "prompt": "Making a vision board",
        "color": "#fff200"
    },
    {
        "prompt": "Sharing a banana split ",
        "color": "#fff200"
    }
]

const fav = [{
    "prompt": "Licking the bottom of the bowl",
    "color": "#45d500"
},]

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const Home = ({ onPlay, setGameIndex, payload, gameIndex }) => {
    const { isMobile } = useGlobalContext()
  
    return (
      <Stack alignItems="center" height="100%" width="100%" sx={{ scale: isMobile ? 1 : 1 }}>
        <Stack>
          <Hexagon />
        </Stack>
  
        <Stack>
          <Box mb={2}>
            <Typography fontSize={40}>21 Things</Typography>
          </Box>
  
          <Stack width="100%">
            <Typography fontSize={20}>Date:</Typography>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Button onClick={() => setGameIndex(prev => prev +1)}>
                <i style={{ marginRight: 10, fontSize: 20 }} className="fi fi-sr-angle-circle-left"></i>
              </Button>
              <Typography>{payload?.date}</Typography>
              <Button disabled={gameIndex < 1}  onClick={() => setGameIndex(prev => prev -1)}>
                <i style={{ marginLeft: 10, fontSize: 20 }} className="fi fi-sr-angle-circle-right"></i>
              </Button>
            </Stack>
          </Stack>
  
          <Stack mb={2} mt={2} alignItems="center">
            <Typography fontSize={20}>Author:</Typography>
            <Typography>{payload?.author}</Typography>
          </Stack>
  
          <Stack mb={2}>
            <Button variant="contained" onClick={onPlay}>PLAY!</Button>
          </Stack>
        </Stack>
      </Stack>
    )
  }

  const TwentyOneThings = ({ user }) => {
    const [currentStage, setCurrentStage] = useState(0)
    const [selections, setSelections] = useState({ 1: [], 2: [], 3: [], note: '' })
    const [gameIndex, setGameIndex] = useState(0)
  
    const [prompts, setPrompts] = useState([])
    const [payload, setPayload] = useState(null)
    
    useEffect(() => {
      const fetchPrompts = async () => {
        const res = await get21Things(gameIndex)
        if (res && res.date && res.prompts) {
          const parsedPrompts = JSON.parse(res.prompts)
          const initialized = parsedPrompts.map(p => ({
            prompt: typeof p === 'string' ? p : p.prompt,
            color: 'white'
          }))
          setPayload(res)
          setPrompts(initialized)
        }
      }
    
      fetchPrompts()
    }, [gameIndex])

    useEffect(() =>{
        // if(payload?.date){
        //     setCurrentStage(4)
        // }
    }, [payload])
  
  
    const renderStage = () => {
      switch (currentStage) {
        case 1:
          return <Stage stageNum={1} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={2} maxSelect={6} currentColor="#c956ff" prevColor="white" />
        case 2:
          return <Stage stageNum={2} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={3} maxSelect={3} currentColor="#fff200" prevColor="#c956ff" />
        case 3:
          return <Stage stageNum={3} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={4} maxSelect={1} currentColor="#45d500" prevColor="#fff200" />
        case 4:
          return <FinalStage user={user} date={payload.date} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} />
        default:
          return <Home onPlay={() => setCurrentStage(1)} payload={payload} setGameIndex={setGameIndex} gameIndex={gameIndex} />
      }
    }
  
    return (
      <Stack alignItems="center" height="100%" width="100%">
        {renderStage()}
      </Stack>
    )
  }
  

export default TwentyOneThings;