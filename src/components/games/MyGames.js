import React from 'react'
import { useState, useEffect } from 'react'
import { Stack } from '@mui/system'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import {List, ListItem} from '@mui/material'
import { getUserGames, addGameToUser } from '../../business/apiCalls'
import Hexagon from './Hexagon'
import SixPics from '../../assets/SixPics';

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const stageColors = {
    1: purple,
    2: yellow,
    3: green
}

const gameObjects = {
    'TwentyOneThings': 
        <Stack direction={'row'} alignItems={'center'}>
            <Hexagon dims={80}/>
            <Typography fontSize={40} fontFamily={'Fredoka'}>21Things</Typography>
        </Stack>
    ,
    'sixPics': 
    <Stack direction={'row'} alignItems={'center'}>
            <SixPics dims={100}/>
            <Typography fontSize={40} fontFamily={'Fredoka'}>6Pics</Typography>
    </Stack>
}

const GameRecord = ({ title, gameData }) => {
    const [font] = useState('Fredoka')

    return (
               <>
                    {gameData.map((gd, i) => {
                        // console.log(gd)
                        return (
                            <Accordion>
                                <AccordionSummary>
                                    <Typography>Game {i}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                       gd !== 'NA' && gd.map((g, i) => {

                                        return(
                                            <>
                                            {i && 
                                            <Accordion>
                                                <AccordionSummary sx={{background: stageColors[i]}}>
                                                    <Typography>
                                                        {
                                                            i < 4 ? 'Stage ' + i : 'Note'
                                                        }
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <List>
                                                    {
                                                        i < 4 
                                                        ? g.map((sel) => {
                                                            console.log(sel)
                                                            return (
                                                                <ListItem>
                                                                    <Typography>{sel.prompt}</Typography>
                                                                </ListItem>
                                                            )
                                                        })
                                                        :
                                                        <>
                                                            {
                                                                <ListItem>
                                                                    <Typography>{g}</Typography>
                                                                </ListItem>
                                                            }
                                                        </>
                                                    }
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                            }
                                            </>
                                        )

                                        })
                                    }
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
               </>
    );
    
    
};
const MyGames = ({user, setSelectedOption}) => {
    const[games, setGames] = useState([]) 
    const fetchMyGames = async () => {
        const res = await getUserGames(user) 
        // console.log(Object.entries(res.games)) 
        setGames(Object.entries(res.games)) 
    }

    useEffect(() => {
        console.clear()
        if(user){
            fetchMyGames()
        }
    }, [])

  return (
    <Stack sx={{overflow: 'auto', paddingTop: 8}} backgroundColor={'white'} height={'100%'} width={'100%'} justifyContent={'flex-start'} alignItems={'center'} justifySelf={'center'}>
        <Stack alignItems={'flex-end'} padding={2} width={'80%'}>
            <Button onClick={() => setSelectedOption(null)} variant='contained'>X</Button>
        </Stack>
        {games &&
            games.map(([title, gameData]) => {
                return (
                    <Accordion sx={{width: '80%'}}>
                        <AccordionSummary>
                            {
                                gameObjects[title]
                            }
                        </AccordionSummary>
                        <AccordionDetails>
                            <GameRecord key={title} title={title} gameData={gameData} />
                        </AccordionDetails>
                    </Accordion>
            )})
        }
    </Stack>
  )
}

export default MyGames
