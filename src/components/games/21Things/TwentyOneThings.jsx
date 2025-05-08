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


    
    const fetchPrompts = async (id) => {
      const res = await get21Things(id || gameIndex)
      if (res && res.date && res.prompts) {
        const parsedPrompts = res.prompts

        const initialized = parsedPrompts.map(p => ({
          prompt: typeof p === 'string' ? p : p.prompt,
          stages: [0]
        }));

        setPayload(res)
        setPrompts(initialized)
      }
    }
    useEffect(() => {
    
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
          return <Stage height={'100%'} stageNum={1} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={2} maxSelect={6} currentColor="#c956ff" prevColor="white" />
        case 2:
          return <Stage height={'100%'} stageNum={2} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={3} maxSelect={3} currentColor="#fff200" prevColor="#c956ff" />
        case 3:
          return <Stage height={'100%'} stageNum={3} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={4} maxSelect={1} currentColor="#45d500" prevColor="#fff200" />
        case 4:
          return <FinalStage height={'100%'} user={user} date={payload?.date} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} prompts={prompts}/>
        default:
          return <Home
          onPlay={() => {
            // Clear all selections (reset stages to [0])
            setPrompts((prev) =>
              prev.map((p) => ({
                ...p,
                stages: [0], // or [] if you want to remove stage 0 as well
              }))
            );
        
            // Clear optional user selections/note (if still used)
            setSelections({ 1: [], 2: [], 3: [], note: '' });
        
            // Reset to stage 1
            setCurrentStage(1);
          }}
          payload={payload}
          setGameIndex={setGameIndex}
          gameIndex={gameIndex}
          setSelections={setSelections}
        />
      }
    }
  
    return (
      <Stack alignItems="center" height="100%" width="100%">
        {renderStage()}
      </Stack>
    )
  }
  

export default TwentyOneThings;