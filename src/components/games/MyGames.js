import React from 'react'
import { useState, useEffect } from 'react'
import { Stack } from '@mui/system'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import {List, ListItem} from '@mui/material'
import { getUserGames, addGameToUser } from '../../business/apiCalls'

const purple = '#c956ff'
const yellow = '#fff200'
const green = '#45d500'

const MyGames = ({user}) => {
    const[games, setGames] = useState([]) 

    const stageColors = {
        1: purple,
        2: yellow,
        3: green
    }

    const fetchMyGames = async () => {
        const res = await getUserGames(user) 
        // console.log(Object.entries(res.games)) 
        setGames(Object.entries(res.games)) 
    }

    useEffect(() => {
        if(user){
            fetchMyGames()
        }
    }, [])

  return (
    <Stack backgroundColor={'white'} height={'100%'} width={'100%'} justifyContent={'center'} alignItems={'center'} alignSelf={'center'} justifySelf={'center'}>
        {
            games.map((g, i) => {
                console.log(g[1])
                return(
                <Stack width={'80%'}>
                    <Accordion>
                        <AccordionSummary>
                            {g[0]}
                        </AccordionSummary>
                        <AccordionDetails>
                        {
                            g[1]
                            .filter((g) => g !== "NA")
                            .map((g) => {
                                return(
                                    <Accordion>
                                    {
                                        g
                                        .filter((d) => typeof d !== 'string')
                                        .map((d, i) => {
                                            console.log(d)
                                            return (
                                                <>
                                                <AccordionSummary sx={{background: stageColors[i+1]}}>
                                                    {`Stage ${i+1}`}
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {
                                                        d.map((s) => {
                                                            // console.log(s.prompt)
                                                            return(
                                                                <Typography>{s.prompt}</Typography>
                                                            )})  
                                                        }
                                                </AccordionDetails>

                                                        </>
                                            )

                                        })
                                    }
                                    </Accordion>

                                    )
                                    })
                                }
                            </AccordionDetails>
                    </Accordion>
                </Stack>
            )})
        }
    </Stack>
  )
}

export default MyGames
