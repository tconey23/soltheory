import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box, TextField } from '@mui/material';
import {ImageList} from '@mui/material';
import { get21Things } from '../../business/apiCalls';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const Hexagon = () => {

    const [size] = useState(200)
    const [strokeColor] = useState("#000")
    const [strokeSize] = useState(1)
    const [purple] = useState('#c956ff')
    const [yellow] = useState('#fff200')
    const [green] = useState('#45d500')


    return (
          <svg width={size} height={size} viewBox="0 0 186 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M135.435 25.5L93 99L50.5648 25.5L135.435 25.5Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M7.56476 99.5L50 26L92.4352 99.5H7.56476Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M93.5648 99.5L136 26L178.435 99.5H93.5648Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M50.5648 174.5L93 101L135.435 174.5H50.5648Z" fill={green} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M178.435 100.5L136 174L93.5648 100.5L178.435 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M92.4352 100.5L50 174L7.56476 100.5L92.4352 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
          </svg>
        
      );

}

const Prompt = ({prompt, color}) => {

    return (
        <Stack justifyContent={'center'} boxShadow={'1px 1px 7px 1px #0000007a'} borderRadius={10} width={'150px'} height={'85px'} backgroundColor={color}>
            <Typography padding={2} fontSize={13}>{prompt}</Typography>
        </Stack>
    )
}

const Home = ({date, author, setCurrentStage, setSelections, setResetRef}) => {

    const handlePlayGame = () => {
        setSelections({
            a: [],
            b: [],
            c: []
        })
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


const Stage1 = ({ prompts, setPrompts, setSelections, setCurrentStage, selections }) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [purpleCount, setPurpleCount] = useState(0);

    useEffect(() => {
        setDispPrompts(prompts);
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
        setCurrentStage(2)
        setPrompts(dispPrompts)
    }

    return (
        <Stack height={'100%'}>
            <Typography variant="h6">Selected: {purpleCount}/6</Typography>
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

const Stage2 = ({ prompts, setCurrentStage, setPrompts}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [yellowCount, setYellowCount] = useState(0);

    useEffect(() => {
        setDispPrompts(prompts.filter((p) => p.color === purple));
    }, [prompts, purple]);

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
        setCurrentStage(3)
        setPrompts(dispPrompts)
    }
    

    return (
        <Stack height={'100%'} alignItems="center">
            <Typography variant="h6">Selected: {yellowCount}/3</Typography>
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

const Stage3 = ({ prompts, setCurrentStage, setPrompts}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);

    useEffect(() => {
        console.log(prompts)
        setDispPrompts(prompts.filter((p) => p.color === yellow));
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
        setCurrentStage(4)
        setPrompts([...dispPrompts, ...prompts.filter((p) => p.color === purple)])
    }

    return (
        <Stack height={'100%'} alignItems="center">
            <Typography variant="h6">Selected: {greenCount}/1</Typography>
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

const Stage4 = ({prompts, setCurrentStage}) => {
    const [dispPrompts, setDispPrompts] = useState([]);
    const [greenCount, setGreenCount] = useState(0);
    const [favorite, setFavorite] = useState(null)

    useEffect(() => {
        console.log(prompts)
        setDispPrompts(prompts.filter((p) => p.color !== 'white'));
        let fav = prompts.filter((p) => p.color === green).prompt
        console.log(fav)
    }, [prompts]);


    return (
        <Stack height={'100%'} alignItems="center">
            <Typography variant="h6">Selected: {greenCount}/1</Typography>
            <Stack width={'100%'} justifyContent={'center'}>
                <ImageList sx={{ width: 500, height: '75%' }} cols={3}>
                    {dispPrompts
                    .filter((p) => p.color === purple)
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>
            <Stack width={'100%'} justifyContent={'center'}>
                <ImageList sx={{ width: 500, height: '75%' }} cols={2}>
                    {dispPrompts
                    .filter((p) => p.color === yellow)
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>

            <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
                <ImageList sx={{ width: '100%', height: '75%', justifyContent: 'center', alignItems: 'center'}} cols={1}>
                    {dispPrompts
                    .filter((p) => p.color === green)
                    .map((p, i) => (
                        <Stack key={i} padding={0.3} justifyContent={'center'} alignItems={'center'}>
                            <Prompt prompt={p.prompt} color={p.color} />
                        </Stack>
                    ))}
                </ImageList>
            </Stack>

            <Stack>
                <Typography>Right something about why <Typography margin={1} borderRadius={20} boxShadow={'2px 3px 7px 1px #00000070'} padding={2} backgroundColor={green}>{`${prompts.filter((p) => p.color === green)[0].prompt}`}</Typography> boosts your mood the most!</Typography>
                <TextField width={'100%'} multiline={true}/>
            </Stack>

            <Stack direction={'row'} spacing={2} mt={2}>
                <Button onClick={() => setCurrentStage(3)}>Back</Button>
                <Button>Submit</Button>
            </Stack>
        </Stack>
    );
};




const TwentyOneThings = () => {

    const [prompts, setPrompts] = useState()
    const [date, setDate] = useState(null)
    const [author, setAuthor] = useState(null)
    const [today, setToday] = useState('01/25/2025')
    const [currentStage, setCurrentStage] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [selections, setSelections] = useState({
        a: [],
        b: [],
        c: [],
    })

    const [resetRef, setResetRef] = useState(0)

    const fetchPrompts = async (date) => {
        const res = await get21Things(date)
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
        setIsReady(false)
    }, [])
    
    useEffect(() =>{
        setPrompts([])
        fetchPrompts(today)
    }, [setResetRef])

  return (
    <Stack direction={'column'} sx={{ height: '100%', width: '75%'}} alignItems={'center'}>
        
        {prompts && currentStage === 0 &&
            <Home date={date} author={author} prompts={prompts} setCurrentStage={setCurrentStage} setSelections={setSelections} setResetRef={setResetRef}/>
        }

        {prompts && currentStage === 1 &&
            <Stage1 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setSelections={setSelections} setResetRef={setResetRef}/>
        }

        {prompts && currentStage === 2 &&
            <Stage2 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setSelections={setSelections} setResetRef={setResetRef}/>
        }

        {prompts && currentStage === 3 &&
            <Stage3 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setSelections={setSelections} setResetRef={setResetRef}/>
        }

        {prompts && currentStage === 4 &&
            <Stage4 date={date} author={author} prompts={prompts} setPrompts={setPrompts} setCurrentStage={setCurrentStage} setSelections={setSelections} setResetRef={setResetRef}/>
        }


    </Stack>
  );
};

export default TwentyOneThings;