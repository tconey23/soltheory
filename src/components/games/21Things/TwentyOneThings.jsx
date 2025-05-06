import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Box} from '@mui/material';
import Hexagon from '../Hexagon';
import { addGameToUser, get21Things } from '../../../business/games_calls';
import Stage from './Stage';
import FinalStage from './FinalStage';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../business/useGlobalStore';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

  const TwentyOneThings = ({ user, currStage }) => {
    const currentStage = useGlobalStore((state) => state.currentStage)
    const setCurrentStage = useGlobalStore((state) => state.setCurrentStage)
    const setGameIndex = useGlobalStore((state) => state.setGameIndex)
    const gameIndex = useGlobalStore((state) => state.gameIndex)
    const [selections, setSelections] = useState({ 1: [], 2: [], 3: [], note: '' })
    const navTo = useNavigate()
  
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

    useEffect(() => {
        if(currentStage > 0){
            navTo('/games/21things')
        }
    }, [currentStage])
  
  
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