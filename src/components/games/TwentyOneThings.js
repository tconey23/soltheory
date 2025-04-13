import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box, TextField } from '@mui/material';
import {ImageList} from '@mui/material';
import { get21Things } from '../../business/apiCalls';
import Hexagon from './Hexagon';
import { addGameToUser } from '../../business/apiCalls';
import { useGlobalContext } from '../../business/GlobalContext';
import { USDZExporter } from 'three/examples/jsm/Addons.js';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const Prompt = ({prompt, color}) => {
    const {alertProps, setAlertProps} = useGlobalContext()

    return (
        <Stack userData='21things prompt' sx={{transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}}} justifyContent={'center'} boxShadow={'1px 1px 7px 1px #0000007a'} borderRadius={10} width={'150px'} height={'85px'} backgroundColor={color}>
            <Typography padding={2} fontSize={13}>{prompt}</Typography>
        </Stack>
    )
}

const Home = ({handleDateChange, date, author, setCurrentStage, setResetRef, setToday, allData}) => {
    const {alertProps, setAlertProps} = useGlobalContext()

    const handlePlayGame = () => {
        setCurrentStage(prev => prev + 1)
        setResetRef(prev => prev +1)
    }


    return (
        <Stack userData='21things home wrapper' alignItems={'center'} height={'100%'} width={'100%'}>
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


const Stage1 = ({ prompts, setPrompts, setCurrentStage, currentStage, selections, setSelections }) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [purpleCount, setPurpleCount] = useState(0);
    const {alertProps, setAlertProps} = useGlobalContext()

    useEffect(() => {
        if(selections[currentStage].length > 0){
            setDispPrompts([...selections[currentStage], ...prompts.filter((p) => p.color === 'white')]);
            setPurpleCount(selections[currentStage].length)
        } else {
            setDispPrompts(prompts)
        }
    }, [prompts]);

    const handleSelect = (prompt, i) => {
        setDispPrompts(prevPrompts => 
            prevPrompts.map((p, index) => {
                if (index === i) {
                    const isCurrentlyWhite = p.color === 'white';
                    const isCurrentlyPurple = p.color === '#c956ff';

                    if (isCurrentlyPurple) {
                        setPurpleCount(prevCount => prevCount - 1);
                        return { ...p, color: 'white' };
                    }

                    if (purpleCount >= 6) {
                        return p;
                    }

                    setPurpleCount(prevCount => prevCount + 1);
                    return { ...p, color: '#c956ff' };
                }
                return p;
            })
        );
    };

    const handleNextStage = () => {

        if(selections[currentStage +1].length > 0) {
            setSelections(prev => ({
                ...prev,
                [currentStage +1]: []
            }))
        }

        setSelections(prev => ({
            ...prev,
            [currentStage]: dispPrompts.filter((p) => p.color === purple)
        }))
        
        setCurrentStage(2)
        
        setPrompts(dispPrompts)
    }

    return (
        <Stack userData='21things stage1 prompt list' height={'100%'}>
            <Typography variant="h6">Select the your top 6 things: {purpleCount}/6</Typography>
            <ImageList sx={{ width: 500, height: '75vh', overflow: 'scroll'}} cols={3} rowHeight={1000}>
                {dispPrompts.map((p, i) => (
                    <Stack key={i} padding={0.3} onClick={() => handleSelect(p, i)}>
                        <Prompt prompt={p.prompt} color={p.color} />
                    </Stack>
                ))}
            </ImageList>
            <Stack direction={'row'}>
                <Button onClick={() => setCurrentStage(0)}>Back</Button>
                {purpleCount == 6 && <Button onClick={() => handleNextStage()}>Next</Button>}

            </Stack>
        </Stack>
    );
};

const Stage2 = ({ prompts, setCurrentStage, setPrompts, setSelections, currentStage, selections}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [yellowCount, setYellowCount] = useState(0);
    const {alertProps, setAlertProps} = useGlobalContext()

    useEffect(() => {
        if(selections[currentStage].length > 0){
            setDispPrompts([...selections[currentStage], ...prompts.filter((p) => p.color === purple)]);
            setYellowCount(selections[currentStage].length)
        } else {
            setDispPrompts(prompts.filter((p) => p.color === purple))
        }
    }, [prompts]);

    const handleSelect = (prompt, i) => {
        setDispPrompts(prevPrompts => 
            prevPrompts.map((p, index) => {
                if (index === i) {
                    const isCurrentlyPurple = p.color === purple;
                    const isCurrentlyYellow = p.color === yellow;

                    if (isCurrentlyYellow) {
                        setYellowCount(prevCount => prevCount - 1);
                        return { ...p, color: purple };
                    }

                    if (yellowCount >= 3) {
                        return p;
                    }

                    setYellowCount(prevCount => prevCount + 1);
                    return { ...p, color: yellow };
                }
                return p;
            })
        );
    };

    const handleNextStage = () => {
        if(selections[currentStage +1].length > 0) {
            setSelections(prev => ({
                ...prev,
                [currentStage +1]: []
            }))
        }
        setSelections(prev => ({
            ...prev,
            [currentStage]: dispPrompts.filter((p) => p.color === yellow)
        }))
        setCurrentStage(3)
        setPrompts([...dispPrompts, ...prompts.filter((p) => p.color === 'white')])
    }
    

    return (
        <Stack userData='21things stage2 prompt list'  height={'100%'} alignItems="center">
            <Typography variant="h6">Now narrow it down to 3: {yellowCount}/3</Typography>
            <ImageList sx={{ width: 500, height: '75%', justifyItems:'center', alignContent: 'center' }} cols={3} rowHeight={1}>
                {dispPrompts.map((p, i) => (
                    <Stack key={i} padding={0.3} onClick={() => handleSelect(p, i)}>
                        <Prompt prompt={p.prompt} color={p.color} />
                    </Stack>
                ))}
            </ImageList>
            <Stack  userData='21things button wrapper'  direction={'row'} spacing={2} mt={2}>
                <Button onClick={() => setCurrentStage(1)}>Back</Button>
                {yellowCount === 3 && <Button onClick={() => handleNextStage()}>Next</Button>}
            </Stack>
        </Stack>
    );
};

const Stage3 = ({ prompts, setCurrentStage, setPrompts, currentStage, selections, setSelections}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);
    const {alertProps, setAlertProps} = useGlobalContext()

    useEffect(() => {
        if(selections[currentStage].length > 0){
            setDispPrompts([...selections[currentStage], ...prompts.filter((p) => p.color === yellow)]);
            setGreenCount(selections[currentStage].length)
        } else {
            setDispPrompts(prompts.filter((p) => p.color === yellow))
        }
    }, [prompts]);

    const handleSelect = (prompt, i) => {
        setDispPrompts(prevPrompts => 
            prevPrompts.map((p, index) => {
                if (index === i) {
                    const isCurrentlyYellow = p.color === yellow;
                    const isCurrentlyGreen = p.color === green;

                    if (isCurrentlyGreen) {
                        setGreenCount(0);
                        return { ...p, color: yellow };
                    }

                    if (greenCount >= 1) {
                        return p;
                    }

                    setGreenCount(1);
                    return { ...p, color: green };
                }
                return p;
            })
        );
    };

    const handleNextStage = () => {
        if(selections[currentStage +1]?.length > 0) {
            setSelections(prev => ({
                ...prev,
                [currentStage +1]: []
            }))
        }
        setSelections(prev => ({
            ...prev,
            [currentStage]: dispPrompts.filter((p) => p.color === green)
        }))
        setCurrentStage(4)
        setPrompts([...dispPrompts, ...prompts.filter((p) => p.color === purple || p.color === 'white')])
    }

    return (
        <Stack height={'100%'} alignItems="center">
            <Typography variant="h6">Now choose your favorite: {greenCount}/1</Typography>
            <ImageList sx={{ width: 500, height: '75vh' }} cols={3} rowHeight={100}>
                {dispPrompts.map((p, i) => (
                    <Stack key={i} padding={0.3} onClick={() => handleSelect(p, i)}>
                        <Prompt prompt={p.prompt} color={p.color} />
                    </Stack>
                ))}
            </ImageList>
            <Stack direction={'row'} spacing={2} mt={2}>
                <Button onClick={() => setCurrentStage(2)}>Back</Button>
                {greenCount === 1 && <Button onClick={() => handleNextStage()}>Next</Button>}
            </Stack>
        </Stack>
    );
};

const Stage4 = ({prompts, setCurrentStage, selections, currentStage, setSelections, user, date}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);
    const [favorite, setFavorite] = useState(null)
    const [userNote, setUserNote] = useState(null)
    const [warning, setWarning] = useState(null)
    const [readyToSave, setReadyToSave] = useState(false)
    const {alertProps, setAlertProps} = useGlobalContext()

    useEffect(() => {
        // console.log('stage4',prompts)
        setDispPrompts(prompts.filter((p) => p.color !== 'white'));
        let fav = prompts.filter((p) => p.color === green).prompt
    }, [prompts]);

    const handleNote = (val) => {

        if(val.length < 180){
            setUserNote(val)
            setWarning(null)
        } else {
            setWarning('You have reached the limit of 180 characters')
        }

        return
    }

    const handleSubmit = async () => {

        const addGame = async (u, n) => {
            const res = await addGameToUser(u, n)
            if(res && res.disposition){
                setAlertProps({
                    text: res.message,
                    severity: res.disposition,
                    display: true
                })
            }
        }

        setSelections(prev => {
            const newSelections = {
                ...prev,
                
            };
    
            
            const gameDataObject = {
                game: 'TwentyOneThings',
                stages: [
                    newSelections[1], newSelections[2], newSelections[3]
                ],
                game_date: date,
                note: userNote
            }
            
            console.log(gameDataObject);
            addGame(user, gameDataObject);
    
            return gameDataObject;
        });
    
        setCurrentStage(0);
        setUserNote(null);
    
        // Reset selections after API call
        setTimeout(() => {
            setSelections({
                1: [],
                2: [],
                3: [],
                note: ''
            });
        }, 500);  // Adding a small delay
    };
    

    return (
        <Stack userData='21things stage4 wrapper' sx={{overflow: 'scroll'}} height={'80%'} alignItems="center">
            <Stack userData='21things stage4 inner' width={'100%'} justifyContent={'center'}>
                <ImageList userData='21things stage4 prompt list' sx={{ width: 500, height: '100%', overFlowY: 'hidden'}} cols={3}>
                    {selections['1']
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>
            <Stack userData='21things stage4 prompt list' width={'100%'} justifyContent={'center'}>
                <ImageList sx={{ width: 500, height: '75%', overFlowY: 'hidden' }} cols={3}>
                    {selections['2']
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>

            <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
                <ImageList sx={{ width: 500, height: '75%', justifyContent: 'center', alignItems: 'center', overFlowY: 'hidden'}} cols={1}>
                    {selections['3']
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>

            <Stack width={'75%'}>
                Write something about why <Typography margin={1} borderRadius={20} boxShadow={'2px 3px 7px 1px #00000070'} padding={2} backgroundColor={green}>{`${selections['3'][0].prompt}`}</Typography> boosts your mood the most!
                <Stack height={50}>
                    <Typography color={'red'}>{warning && warning}</Typography>
                </Stack>
                <TextField onChange={(e) => handleNote(e.target.value)} value={userNote} width={'100%'} alignItems={'flex-start'} multiline={true} rows={4} />
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2}>
                <Button onClick={() => setCurrentStage(3)}>Back</Button>
                {userNote && userNote.length > 10 && <Button onClick={() => handleSubmit()}>Submit</Button>}
            </Stack>
        </Stack>
    );
};




const TwentyOneThings = ({user}) => {

    // console.log(user)
    const {alertProps, setAlertProps} = useGlobalContext()

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

    useEffect(() => {
        console.log(allData)
    }, [allData])

    const fetchPrompts = async (date) => {
        const res = await get21Things(date)

        const sorted = [...res].sort((a, b) => new Date(a.date) - new Date(b.date));
        setAllData(sorted)
        // console.log(sorted)

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
    <Stack userData='21things main wrapper' direction={'column'} sx={{ height: '100%', width: '75%'}} alignItems={'center'}>
        
        {prompts && currentStage === 0 && allData && 
            <Home handleDateChange={handleDateChange} date={date} author={author} prompts={prompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections}/>
        }

        {prompts && currentStage === 1 &&
            <Stage1 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections} currentStage={currentStage}/>
        }

        {prompts && currentStage === 2 &&
            <Stage2 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections} currentStage={currentStage}/>
        }

        {prompts && currentStage === 3 &&
            <Stage3 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections} currentStage={currentStage}/>
        }

        {prompts && currentStage === 4 &&
            <Stage4 user={user} date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} currentStage={currentStage} selections={selections} setSelections={setSelections}/>
        }


    </Stack>
  );
};

export default TwentyOneThings;