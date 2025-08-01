import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography, Box } from '@mui/material';
import useGlobalStore from '../../../business/useGlobalStore';
import Hexagon from '../Hexagon';
import MyGames from '../../game_data/MyGames';
import DropStack from '../../../ui_elements/DropStack';
import { motion } from 'framer-motion';
import { useLocation } from "react-router-dom";
import Info from './Info';

const MotionStack = motion(Stack)

const Home = ({ onPlay, payload }) => {
    const screen = useGlobalStore((state) => state.screen)
    const gameIndex = useGlobalStore((state) => state.gameIndex)

    const [clicked, setClicked] = useState(1)
    const [showInfo, setShowInfo] = useState(false)
    const [infoColor, setInfoColor] = useState()
    const [selectedPPT, setSelectedPPT] = useState(null)
    const [select2, setSelect2] = useState([])
    const [person, setPerson] = useState(null)
    const [place, setPlace] = useState(null)
    const [thing, setThing] = useState(null)

    const people = [
      {name: 'Steve Huff', val: 'stevehuff'},
      {name: 'Gerard Jardin', val: 'gerardjardin'},
      {name: 'Tom Coney', val: 'tomconey'}
    ]

    const places = [
      {name: 'Denver', val: 'denver'},
      {name: 'Chicago', val: 'chicago'},
      {name: 'Coney Island', val: 'coneyisland'}
    ]

    const things = [
      {name: 'Apple pie', val: 'applepie'},
      {name: 'Black Metal', val: 'blackmetal'},
      {name: 'One million Dollars', val: 'onemilliondollars'},
    ]

    useEffect(() => {

      if(selectedPPT === 'people'){
        setSelect2(people)
      } else if(selectedPPT === 'places'){
        setSelect2(places)
      } else if (selectedPPT === 'things'){
        setSelect2(things)
      } else {
        setSelect2([])
      }
    }, [selectedPPT])

    const infoRef = useRef(null)

    const loc = useLocation()

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setTimeout(() => {
            setClicked(0)
        }, 100);
    }, [clicked])

    const shareGame = async () => {
      await navigator.share({
        title: 'I just played this fun new game',
        text: 'Think you can beat my scores?', 
        url: loc.pathname
      })
    }
  
    return (
      <Stack alignItems="center" height="100%" width="100%" sx={{ scale: screen ? 1 : 1 }}>
        <Stack height={'10%'} width={'100%'} direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
          <Box
            ref={infoRef}
            onMouseOver={() => setInfoColor('white')}
            onMouseOut={() => setInfoColor('black')}
            onClick={() => {
              setShowInfo(true)
              console.log(showInfo)
            }}
            sx={{
              width: 'fit-content',
              height: 'auto',
              display: 'flex',
              padding: 1,
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', 
              '&:focus': { outline: 'none' },
            }}
          >
            <i
              style={{
                fontSize: 23,
                display: 'block',
                lineHeight: 1,
                margin: 0,
                padding: 0,
                color: 'black',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              className="fi fi-sr-info" 
            />
          </Box>
          <Box
            onMouseOver={() => setInfoColor('white')}
            onMouseOut={() => setInfoColor('black')}
            onClick={() => shareGame()}
            sx={{
              width: 'fit-content',
              height: 'auto',
              display: 'flex',
              padding: 1,
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', 
              '&:focus': { outline: 'none' },
            }}
          >
            <i
              style={{
                fontSize: 23,
                display: 'block',
                lineHeight: 1,
                margin: 0,
                padding: 0,
                color: infoColor,
                cursor: 'pointer',
                userSelect: 'none'
              }}
              className="fi fi-rr-share" 
            />
          </Box>
          <Box
          sx={{
              width: 'fit-content',
              height: 'auto',
              display: 'flex',
              padding: 1,
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', 
              '&:focus': { outline: 'none' },
            }}>
            <Select value={selectedPPT} onChange={(e) => setSelectedPPT(e.target.value)}>
              <MenuItem value={null}>Select option</MenuItem>
              <MenuItem value={'people'}>People</MenuItem>
              <MenuItem value={'places'}>Places</MenuItem>
              <MenuItem value={'things'}>Things</MenuItem>
            </Select>
          </Box>
          <Box
          sx={{
              width: 'fit-content',
              height: 'auto',
              display: 'flex',
              padding: 1,
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', 
              '&:focus': { outline: 'none' },
            }}
          >
            <Select >
              {select2.map((s) => {
                return (<MenuItem value={s.val}>{s.name}</MenuItem>)
              })}
            </Select>
          </Box>
        </Stack>
        
        <Stack>
          <Hexagon dims={100}/>
        </Stack>
  
        <Stack>
          <Box mb={2}>
            <Typography fontSize={30}>21 Things</Typography>
          </Box>
  
          <Stack width="100%">
            <Typography fontSize={20}>Date:</Typography>
            <Stack direction="row" justifyContent="center" alignItems="center">
                <i style={{ marginRight: 10, fontSize: 20, color: clicked === 1 ? 'white' : 'black' }} className="fi fi-sr-angle-circle-left" onClick={() => {
                    useGlobalStore.setState((state) => ({
                        gameIndex: state.gameIndex + 1
                      }));
                    setClicked(1)
                }}></i>
              <Typography>{payload?.date}</Typography>
                {today !== payload.date && <i style={{ marginLeft: 10, fontSize: 20, color: clicked === 2 ? 'white' : 'black' }} className="fi fi-sr-angle-circle-right" onClick={() => {

                    if(gameIndex > 0){
                        useGlobalStore.setState((state) => ({
                            gameIndex: state.gameIndex - 1
                        }));
                    }

                    setClicked(2)
                }}></i>}
            </Stack>
          </Stack>
  
          <Stack mb={2} mt={2} alignItems="center">
            <Typography fontSize={20}>Author:</Typography>
            <Typography>{payload?.author}</Typography>
          </Stack>
  
          <Stack mb={2}>
            <Button variant="contained" onClick={onPlay}>PLAY!</Button>
          </Stack>
        </Stack>
        <Stack borderTop={'1px solid grey'} width={'95%'} height={'50%'} overflow={'auto'}>
          <Typography fontSize={20} fontWeight={'bold'} fontFamily={'Fredoka Regular'}>Your games</Typography>
          <MyGames displayGame={'twentyonethings'}/>
        </Stack>

        <DropStack showInfo={showInfo} setShowInfo={setShowInfo} storageKey={'21things_dontShowInfo'} top={infoRef?.current?.offsetTop + infoRef?.current?.offsetHeight}>
                <Stack bgcolor={'white'} width={'95%'} height={'90%'}>
                  <MotionStack 
                    marginTop={2}
                    alignItems={'center'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  > 
                    <Info />
                  </MotionStack>
                </Stack>
        </DropStack>
      </Stack>
    )
  }

export default Home;