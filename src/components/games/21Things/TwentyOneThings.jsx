import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Box} from '@mui/material';
import Hexagon from '../Hexagon';
import { addGameToUser, get21Things } from '../../../business/games_calls';
import Stage from './Stage';
import FinalStage from './FinalStage';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import useGlobalStore from '../../../business/useGlobalStore';

const purple = '#dd95ff'
const yellow = '#fff200'
const green = '#45d500'

  const TwentyOneThings = ({ user, currStage, redirect=false }) => {
    const userMeta = useGlobalStore((state) => state.userMeta)
    const currentStage = useGlobalStore((state) => state.currentStage)
    const setCurrentStage = useGlobalStore((state) => state.setCurrentStage)
    const setGameIndex = useGlobalStore((state) => state.setGameIndex)
    const gameIndex = useGlobalStore((state) => state.gameIndex)
    const inGame = useGlobalStore((state) => state.inGame)
    const setInGame = useGlobalStore((state) => state.setInGame)

    const [selections, setSelections] = useState({ 1: [], 2: [], 3: [], note: '' })
    const navTo = useNavigate()
    const loc = useLocation()
    const {userId, gameId} = useParams()
    const [viewOnly, setViewOnly] = useState(false)
    
    const [prompts, setPrompts] = useState([])
    const [payload, setPayload] = useState(null)
    const [savegameNote, setSavegameNote] = useState('')
    const [newGame, setNewGame] = useState(false)
    // console.log('userId', userId, 'redirect', redirect, 'newgame', newGame)

    

      const getGuestGame = async () => {
        let { data: guest_games, error } = await supabase
          .from('guest_games')
          .select("*")
          .eq('id', gameId)   

          if(guest_games?.[0]){
            setPrompts(guest_games?.[0]?.game_content?.stages)  
            setSavegameNote(guest_games?.[0]?.game_content?.note)
            setCurrentStage(4)
          }
      }

    const getSavedGame = async () => {
      let { data: data, error } = await supabase
        .from('users')
        .select("*")
        .eq('primary_id', userId)
        console.log(data)

        if(data){
          data.forEach((d) => {
            const foundGame = d?.game_data?.find((g) => g.id === gameId)
            console.log(foundGame)
            if(foundGame){
                setPrompts(foundGame?.stages)
                setSavegameNote(foundGame?.note)
                setCurrentStage(4)
                setViewOnly(true)
              return
            } else {
              setNewGame(true) 
            }
          })
        }
    }
    
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
        setCurrentStage(0)
      }
    }

useEffect(() => {
  // const loadGame = async () => {
  //   if (redirect) {
  //     await getGuestGame();
  //   } else if (gameId && userId) {
  //     await getSavedGame(); // will set newGame = true if nothing found
  //   } else {
  //     setNewGame(true);
  //   }
  // };

  // loadGame();
}, [redirect, gameId, userId]);

useEffect(() => {
  fetchPrompts();
  if (newGame) {
  }
}, [newGame, gameIndex]);

    useEffect(() => {
        if(currentStage > 0){
            navTo(loc.pathname)
        }
    }, [currentStage])

    useEffect(() => {
      setInGame(false)
    }, [])
  
  
    const renderStage = () => {
      console.log(currentStage)
      switch (currentStage) {
        case 1:
          return <Stage height={'100%'} stageNum={1} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={2} maxSelect={6} currentColor="#dd95ff" prevColor="white" />
        case 2:
          return <Stage height={'100%'} stageNum={2} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={3} maxSelect={3} currentColor="#fff200" prevColor="#dd95ff" />
        case 3:
          return <Stage height={'100%'} stageNum={3} prompts={prompts} setPrompts={setPrompts} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} nextStage={4} maxSelect={1} currentColor="#45d500" prevColor="#fff200" />
        case 4:
          return <FinalStage viewOnly={viewOnly} savegameNote={savegameNote} redirect={redirect} height={'100%'} user={user} date={payload?.date} selections={selections} setSelections={setSelections} setCurrentStage={setCurrentStage} prompts={prompts}/>
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
            setInGame(true)
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
        {prompts?.length > 0 && renderStage()}
      </Stack>
    )
  }
  

export default TwentyOneThings;