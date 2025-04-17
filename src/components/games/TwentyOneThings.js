import { useEffect, useState } from 'react';
import { Button, Stack, Typography, Box} from '@mui/material';
import { get21Things } from '../../business/apiCalls';
import Hexagon from './Hexagon';
import { addGameToUser } from '../../business/apiCalls';
import { useGlobalContext } from '../../business/GlobalContext';
import Stage from './Stage';
import FinalStage from './FinalStage';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const Home = ({handleDateChange, date, author, setCurrentStage, setResetRef}) => {
    const {alertProps, setAlertProps, isMobile} = useGlobalContext()

    const handlePlayGame = () => {
        setCurrentStage(prev => prev + 1)
        setResetRef(prev => prev +1)
    }


    return (
        <Stack userData='21things home wrapper' alignItems={'center'} height={'100%'} width={'100%'} sx={{scale: isMobile ? 1 : 1}}>
            <Stack userData='21things hex wrapper' >
                <Hexagon />
            </Stack>

            <Stack userData='21things info wrapper'>
                <Box sx={{marginBottom: 2}}>
                    <Typography fontSize={40}>21 Things</Typography>
                </Box>

                <Stack width={'100%'}>
                    <Typography fontSize={20}>Date: </Typography>
                    <Stack direction={'row'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Button onClick={() => handleDateChange('back')}>
                            <i style={{marginRight: 10, fontSize: 20}} className="fi fi-sr-angle-circle-left"></i>
                        </Button>
                        <Typography>{date}</Typography>
                        <Button onClick={() => handleDateChange('forward')}>
                            <i style={{marginLeft: 10, fontSize: 20}} className="fi fi-sr-angle-circle-right"></i>
                        </Button>
                    </Stack>
                </Stack>

                <Stack sx={{marginBottom: 2, marginTop: 2}} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Typography fontSize={20}>Author: </Typography>
                    <Typography>{author}</Typography>
                </Stack>
                <Stack sx={{marginBottom: 2}}>
                    <Button variant='contained' onClick={() => handlePlayGame()}>PLAY!</Button>
                </Stack>
            </Stack>

        </Stack>
    )
}

const TwentyOneThings = ({user}) => {

    const {alertProps, setAlertProps, isMobile} = useGlobalContext()

    const [prompts, setPrompts] = useState()
    const [date, setDate] = useState(null)
    const [author, setAuthor] = useState(null)
    const [today, setToday] = useState('01/24/2025')
    const [currentStage, setCurrentStage] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [selections, setSelections] = useState({
        1: [],
        2: [],
        3: [],
        note: ''
    })
    const [allData, setAllData] = useState()

    const [resetRef, setResetRef] = useState(0)

    const fetchPrompts = async (date) => {
        const res = await get21Things(date)

        const sorted = [...res].sort((a, b) => new Date(a.date) - new Date(b.date));
        setAllData(sorted)

        let latest = sorted[sorted.length-1]

        let array = []
        if(res) {
            setDate(latest.date)
            setAuthor(latest.author)

            latest.prompts.forEach((p) => {
                array.push({
                    prompt: p.prompt,
                    color: 'white'
                })
            })

            setPrompts(array)
        }
    }

    useEffect(() => {
        console.log(today)
    }, [today])

    useEffect(() => {   
        setIsReady(false)
    }, [])
    
    useEffect(() => {
        setPrompts([])
        fetchPrompts(today)
    }, [resetRef])

    const handleDateChange = (dir) => {
        console.log(dir)
        if (!allData || !date) return;
    
        const currentIndex = allData.findIndex(d => d.date === date);
        if (currentIndex === -1) return;
    
        const newIndex = dir === 'back' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= allData.length) return;
    
        const newDate = allData[newIndex].date;
        console.log(newDate)
        setToday(newDate);
    };

  return (
    <Stack userData='21things main wrapper' direction={'column'} sx={{ height: '100%', width: '100%'}} alignItems={'center'} >
        
        {prompts && currentStage === 0 && allData && 
            <Home handleDateChange={handleDateChange} date={date} author={author} prompts={prompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections}/>
        }

        {prompts && currentStage === 1 && (
        <Stage
            stageNum={1}
            prompts={prompts}
            setPrompts={setPrompts}
            selections={selections}
            setSelections={setSelections}
            setCurrentStage={setCurrentStage}
            nextStage={2}
            maxSelect={6}
            currentColor="#c956ff"
            prevColor="white"
        />
        )}

        {prompts && currentStage === 2 && (
        <Stage
            stageNum={2}
            prompts={prompts}
            setPrompts={setPrompts}
            selections={selections}
            setSelections={setSelections}
            setCurrentStage={setCurrentStage}
            nextStage={3}
            maxSelect={3}
            currentColor="#fff200"
            prevColor="#c956ff"
        />
        )}

        {prompts && currentStage === 3 && ( 
        <Stage
            stageNum={3}
            prompts={prompts}
            setPrompts={setPrompts}
            selections={selections}
            setSelections={setSelections}
            setCurrentStage={setCurrentStage}
            nextStage={4}
            maxSelect={1}
            currentColor="#45d500"
            prevColor="#fff200"
        />
        )}

        {prompts && currentStage === 4 && (
        <FinalStage
            user={user}
            date={date}
            selections={selections}
            setSelections={setSelections}
            setCurrentStage={setCurrentStage}
        />
        )}


    </Stack>
  );
};

export default TwentyOneThings;