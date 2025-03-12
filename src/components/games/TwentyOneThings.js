import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box, TextField } from '@mui/material';
import {ImageList} from '@mui/material';
import { get21Things } from '../../business/apiCalls';
import Hexagon from './Hexagon';
import { addGameToUser } from '../../business/apiCalls';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const Prompt = ({prompt, color}) => {

    return (
        <Stack sx={{transition: 'all 0.25s ease-in-out', '&:hover': {cursor: 'pointer', scale: 1.05}}} justifyContent={'center'} boxShadow={'1px 1px 7px 1px #0000007a'} borderRadius={10} width={'150px'} height={'85px'} backgroundColor={color}>
            <Typography padding={2} fontSize={13}>{prompt}</Typography>
        </Stack>
    )
}

const Home = ({date, author, setCurrentStage, setResetRef}) => {

    const handlePlayGame = () => {
        setCurrentStage(prev => prev + 1)
        setResetRef(prev => prev +1)
    }


    return (
        <Stack alignItems={'center'} height={'100%'} width={'100%'}>
            <Stack>
                <Hexagon />
            </Stack>

            <Stack>
                <Box sx={{marginBottom: 2}}>
                    <Typography fontSize={40}>21 Things</Typography>
                </Box>
                <Box sx={{marginBottom: 2}}>
                    <Typography fontSize={20}>Date: </Typography>
                    <Typography>{date}</Typography>
                </Box>
                <Box sx={{marginBottom: 2}}>
                    <Typography fontSize={20}>Author: </Typography>
                    <Typography>{author}</Typography>
                </Box>
                <Box sx={{marginBottom: 2}}>
                    <Button variant='contained' onClick={() => handlePlayGame()}>PLAY!</Button>
                </Box>
            </Stack>

        </Stack>
    )
}


const Stage1 = ({ prompts, setPrompts, setCurrentStage, currentStage, selections, setSelections }) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [purpleCount, setPurpleCount] = useState(0);

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
        <Stack height={'100%'}>
            <Typography variant="h6">Select the your top 6 things: {purpleCount}/6</Typography>
            <ImageList sx={{ width: 500, height: '75vh' }} cols={3} rowHeight={1000}>
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
        <Stack height={'100%'} alignItems="center">
            <Typography variant="h6">Now narrow it down to 3: {yellowCount}/3</Typography>
            <ImageList sx={{ width: 500, height: '75%' }} cols={3} rowHeight={1}>
                {dispPrompts.map((p, i) => (
                    <Stack key={i} padding={0.3} onClick={() => handleSelect(p, i)}>
                        <Prompt prompt={p.prompt} color={p.color} />
                    </Stack>
                ))}
            </ImageList>
            <Stack direction={'row'} spacing={2} mt={2}>
                <Button onClick={() => setCurrentStage(1)}>Back</Button>
                {yellowCount === 3 && <Button onClick={() => handleNextStage()}>Next</Button>}
            </Stack>
        </Stack>
    );
};

const Stage3 = ({ prompts, setCurrentStage, setPrompts, currentStage, selections, setSelections}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);

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

const Stage4 = ({prompts, setCurrentStage, selections, currentStage, setSelections, user}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);
    const [favorite, setFavorite] = useState(null)
    const [userNote, setUserNote] = useState(null)
    const [warning, setWarning] = useState(null)
    const [readyToSave, setReadyToSave] = useState(false)

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

    const handleSubmit = () => {
        setSelections(prev => {
            const newSelections = {
                ...prev,
                note: userNote
            };
    
            console.log(newSelections); // Debugging log
    
            // Call API before resetting selections
            addGameToUser(user, newSelections);
    
            return newSelections;
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
        <Stack sx={{overflow: 'scroll'}} height={'80%'} alignItems="center">
            <Stack width={'100%'} justifyContent={'center'}>
                <ImageList sx={{ width: 500, height: '100%' }} cols={3}>
                    {selections['1']
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>
            <Stack width={'100%'} justifyContent={'center'}>
                <ImageList sx={{ width: 500, height: '75%' }} cols={3}>
                    {selections['2']
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>

            <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
                <ImageList sx={{ width: 500, height: '75%', justifyContent: 'center', alignItems: 'center'}} cols={1}>
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

    const [resetRef, setResetRef] = useState(0)

    const fetchPrompts = async (date) => {
        const res = await get21Things(date)
        console.log(res)
        let array = []
        if(res) {
            setDate(res.date)
            setAuthor(res.author)
            res.prompts.forEach((p) => {
                array.push({
                    prompt: p,
                    color: 'white'
                })
            })

            setPrompts(array)
        }
    }

    useEffect(() => {
        // console.log(selections)
    }, [selections])

    useEffect(() => {   
        setIsReady(false)
    }, [])
    
    useEffect(() =>{
        setPrompts([])
        fetchPrompts(today)
    }, [setResetRef])

  return (
    <Stack direction={'column'} sx={{ height: '100%', width: '75%'}} alignItems={'center'}>
        
        {prompts && currentStage === 0 &&
            <Home date={date} author={author} prompts={prompts} setCurrentStage={setCurrentStage} setResetRef={setResetRef} setSelections={setSelections} selections={selections}/>
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