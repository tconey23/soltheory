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
    3: green,
    4: green
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
    console.log(gameData)

    return (
               <Accordion>
                <AccordionSummary>
                    <Typography>{gameData.game_date}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {Object.values(gameData.stages).map((st,i) => {
                            console.log(st)
                            return (
                                <ListItem>
                                    <Accordion sx={{width: '80%', background: stageColors[i+1]}}>
                                        <AccordionSummary>
                                            <Typography>
                                                {typeof st === 'object' 
                                                ? 'Stage ' + i
                                                : 'Note'
                                            }
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                typeof st === 'object'

                                                ? <>
                                                    {
                                                        st.map((d) => {
                                                            return (
                                                                <Stack marginBottom={1} borderBottom={'1px solid grey'}>
                                                                    <Typography>{d.prompt}</Typography>
                                                                </Stack>
                                                            )
                                                        })
                                                    }
                                                  </>
                                                : <>
                                                    <Typography>{st}</Typography>
                                                  </>    
                                        }
                                        </AccordionDetails>
                                    </Accordion>
                                </ListItem>
                            )
                        })}
                    </List>
                </AccordionDetails>
               </Accordion>
    );
    
    
};
const MyGames = ({user, setSelectedOption}) => {
    const[games, setGames] = useState([]) 
    const fetchMyGames = async () => {
        try {
            const gamesData = await getUserGames(user);

            console.log(
                gamesData.map((g) => (
                    g
                ))
            )
    
            if (gamesData) {
                console.log(gamesData);
                setGames(gamesData);
            } else {
                console.warn("No games found for user.");
                setGames([]); // Set to empty array if no data
            }
        } catch (error) {
            console.error("Error fetching games:", error);
            setTimeout(() => {
                fetchMyGames(); // Retry fetching after 2 seconds
            }, 2000);
        }
    };
    

    useEffect(() => {
        console.clear()
        if(user){
            fetchMyGames()
        }
    }, [])

    useEffect(() =>{
       if(games){
        console.log(
            games.filter((g) => g.game === 'TwentyOneThings')
        )
       }
    }, [games])

  return (
    <Stack sx={{overflow: 'auto', paddingTop: 8}} backgroundColor={'white'} height={'100%'} width={'100%'} justifyContent={'flex-start'} alignItems={'center'} justifySelf={'center'}>
        <Stack alignItems={'flex-end'} padding={2} width={'80%'}>
            <Button onClick={() => setSelectedOption(null)} variant='contained'>X</Button>
        </Stack>
                    <Accordion sx={{width: '80%'}}>
                        <AccordionSummary>
                            {
                                gameObjects['TwentyOneThings']
                            }
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                games
                                .filter((g) => g.game === 'TwentyOneThings')
                                .map((gm) => {
                                    
                                    return (
                                        <GameRecord title={gm.game} gameData={gm} />
                                    )
                                })
                            }
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{width: '80%'}}>
                        <AccordionSummary>
                            {
                                gameObjects['sixPics']
                            }
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* <GameRecord key={i} title={g.game} gameData={g}/> */}
                        </AccordionDetails>
                    </Accordion>
    </Stack>
  )
}

export default MyGames
