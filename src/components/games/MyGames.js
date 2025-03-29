import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Stack } from '@mui/system'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import {List, ListItem} from '@mui/material'
import { getUserGames, addGameToUser } from '../../business/apiCalls'
import Hexagon from './Hexagon'
import SixPics from '../../assets/SixPics';
import { useGlobalContext } from '../../business/GlobalContext'

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
    const {alertProps, setAlertProps} = useGlobalContext()
    // console.log(gameData)
    const videoRef = useRef()

    const formattedDate = (date) => {

        const options = { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric', 
            // hour: '2-digit', 
            // minute: '2-digit', 
            // second: '2-digit' 
        }

        return new Intl.DateTimeFormat('en-US', options).format(date)

    }

    useEffect(() =>{
        if(videoRef.current){
            console.log(videoRef.current)
            videoRef.current.play()
        }
    }, [videoRef])

    const capitalizeWords = (str) => {
        return str.split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
    }

    const mediaType = (media) => {
        return(media?.split('').splice(-3).join().replaceAll(',', ''))
    }



    return (
               <Accordion>
                <AccordionSummary>
                    <Typography>{gameData.game_date || formattedDate(gameData.date_played)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {gameData.stages
                        ? Object.values(gameData.stages).map((st,i) => {
                            // console.log(st)
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
                        })
                        :
                            <ListItem sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Stack>
                                    {mediaType(gameData.graphic) === 'mp4' ?
                                    <>
                                        <video height={'110px'} ref={videoRef} mute autoplay loop>
                                            <source src={gameData.graphic} type='video/mp4'/>
                                        </video>
                                    </>
                                    :
                                    <>
                                        <img src={gameData.graphic} />
                                    </>
                                    }
                                </Stack>
                                <Stack direction={'row'}>
                                    <Typography>Pack: </Typography>
                                    <Typography>{capitalizeWords(gameData.pack)}</Typography>
                                </Stack>
                                <Stack direction={'row'}>
                                    <Typography>Score: </Typography>
                                    <Typography>{gameData.score}</Typography>
                                </Stack>
                            </ListItem>
                        }
                    </List>
                </AccordionDetails>
               </Accordion>
    );
    
    
};
const MyGames = ({user, setSelectedOption}) => {
    const[games, setGames] = useState([]) 
    const {alertProps, setAlertProps} = useGlobalContext()
    
    const fetchMyGames = async () => {
        try {
            const gamesData = await getUserGames(user);

            
            if (gamesData) {
                console.log(
                    gamesData.map((g) => (
                        g
                    ))
                )
                console.log(gamesData);
                setGames(gamesData);
            } else {
                console.warn("No games found for user.");
                setGames([]); // Set to empty array if no data
            }
        } catch (error) {
            console.error("Error fetching games:", error);

        }
    };
    

    useEffect(() => {
        // console.clear()
        if(user){
            fetchMyGames() 
        }
    }, [])

    useEffect(() =>{
       if(games){
        // console.log(
        //     games.filter((g) => g.game === 'TwentyOneThings')
        // )
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
                            {
                                games
                                .filter((g) => g.game === 'SixPics')
                                .map((gm) => {
                                    
                                    return (
                                        <GameRecord title={gm.game} gameData={gm} />
                                    )
                                })
                            }
                        </AccordionDetails>
                    </Accordion>
    </Stack>
  )
}

export default MyGames
