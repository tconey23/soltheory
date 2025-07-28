import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, MenuList, MenuItem, Modal, Box, Checkbox, InputLabel, Select, Menu} from "@mui/material";
import { fetchPacks } from "./helpers/functions";
import PackButton from "./PackButton";
import GameWrapper from './GameWrapper';
import useGlobalStore from "../../../business/useGlobalStore";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DropStack from "../../../ui_elements/DropStack";

const Pic6 = ({demo}) => {
  const [gamePack, setGamePack] = useState(null)
  const [packs, setPacks] = useState([])
  const [playedGames, setPlayedGames] = useState([])
  const [loginSkipped, setLoginSkipped] = useState(false)
  const [displayModal, setDisplayModal] = useState(false)
  const [displayPromo, setDisplayPromo] = useState(false)
  const [infoColor, setInfoColor] = useState('black')
  const [showInfo, setShowInfo] = useState(false)
  const [dontShowInfo, setDontShowInfo] = useState(false)
  const [packType, setPackType] = useState('standard')

  const loc = useLocation()
  const MotionStack = motion(Stack);

  const userMeta = useGlobalStore((state) => state.userMeta) 

  const hasFetched = useRef(false);

  const checkIfPlayed = async (pack) => {
    let { data: pack_data, error } = await supabase
            .from('six_pics_data')
            .select("*")
            .eq('pack_name', pack)

            let foundPlayed = pack_data?.find((p) => p.user_id === userMeta?.primary_id)

            if(foundPlayed){
              setPlayedGames(prev => ([
                ...prev, 
                {
                  pack_name: foundPlayed?.pack_name,
                  played: foundPlayed?.game_date
                }
              ]))
            }
  }

  useEffect(() => {

    setPlayedGames([])

    packs?.forEach((p) =>{
      if(!p.marked_for_delete){
        checkIfPlayed(p.pack_name)
      }
    })

  }, [packs])

  useEffect(() => {
    const stored = localStorage.getItem('sixpics_dontShowInfo');
    if (stored !== null) setDontShowInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setShowInfo(!dontShowInfo);
  }, [dontShowInfo]);

  const handleInfoClick = () => {
    setInfoColor('blue')

    setTimeout(() => {
      setInfoColor('black')
    }, 100);

    setShowInfo(prev => !prev)

  }

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;
  
    const getPacks = async () => {
      try {
        const res = await fetchPacks();
        if (res) {
          let filteredPacks = res.filter((p) => {
            
            if(demo){
              return !p.marked_for_delete && p.demo
            } else {
              return !p.marked_for_delete
            } 
          })
          let sortedPacks = filteredPacks.sort((a, b) => a.sort_order - b.sort_order);
          
          setPacks(sortedPacks)
        }

      } catch (err) {
        console.error(err);
      }
    };
  
    getPacks();
  }, [displayPromo]);

  useEffect(() => {
    if(loc.pathname.includes('/promo')){
      setPackType('promo')
    } else {
      setPackType('standard')
    }
  }, [loc])

    useEffect(() => {
    if(packType === 'promo'){
      setDisplayPromo(true)
    } else {
      setDisplayPromo(false)
    }
  }, [packType])

  const shareGame = async () => {
      await navigator.share({
        title: 'I just played this fun new game',
        text: 'Think you can beat my scores?', 
        url: loc.pathname
      })
    }

  return (
    <Stack
      direction={"column"}
      sx={{ height: "100%", width: "100%" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Stack width={'100%'} height={'8%'} direction={'row'}>
        <Stack width={'20%'} justifyContent={'center'} alignItems={'center'} sx={{userSelect: 'none'}} direction='row'>
          <Box
            onMouseOver={() => setInfoColor('white')}
            onMouseOut={() => setInfoColor('black')}
            onClick={() => handleInfoClick()}
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
        </Stack>
        <Stack width={'65%'} justifyContent={'center'} alignItems={'center'} direction={'row'}>
          <Typography fontFamily={'fredoka regular'} fontSize={30} >6 Pics</Typography>
        </Stack>
        <Stack title='rightspacer' width={'2%'} justifyContent={'center'} alignItems={'center'} >
          <Select sx={{zoom: 0.7}} value={packType} onChange={(e) => {
            setPackType(e.target.value)
            }}>
            <MenuItem value={'standard'}>Standard Packs</MenuItem>
            <MenuItem value={'promo'}>Promo Packs</MenuItem>
          </Select>
        </Stack>
      </Stack>

          <DropStack showInfo={showInfo}>
              <Stack bgcolor={'white'} width={'95%'} height={'100%'}>
                <MotionStack 
                    marginTop={2}
                    alignItems={'center'}
                    height={'30%'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                >
                    <Typography fontFamily={'fredoka regular'} fontSize={25}>
                        Welcome to 6 Pics!
                    </Typography>

                    <Typography marginTop={-1} fontFamily={'fredoka regular'} fontSize={14}>
                        A SOL Theory game
                    </Typography>
                    <motion.img
                        width='45%'
                        height='auto'
                        src='/6pics_logo.png'
                    />
                </MotionStack>

                <MotionStack 
                    marginTop={1} 
                    alignItems={'center'}
                    height={'68%'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                >
                    <MotionStack 
                        width={'95%'} 
                        height={'85%'} 
                        justifyContent={'space-evenly'} 
                        alignItems={'center'} 
                        marginTop={'10px'}
                        paddingY={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1.1 }}
                    >
                        <Typography fontFamily={'fredoka regular'} fontSize={16}>
                            In this game, you’ll see 6 Pics, each one slowly revealing an image across three stages.
                        </Typography>

                        <Stack height={'100%'} width={'92%'} marginTop={'10px'} alignItems={'flex-start'} overflow={'auto'} paddingLeft={'10px'} borderRadius={2} sx={{boxShadow: 'inset 0px -9px 11px 0px #00000042'}}>
                            <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                                •	Tap play to reveal the first part of each image.
                            </Typography>

                            <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                                •	Guess early to earn max points — or reveal more if you’re unsure.
                            </Typography>

                            <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                                •	But beware: every extra stage costs you 10 points and hints cost 1 point.
                            </Typography>

                            <Typography marginTop={2} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={17}>
                                Can you guess the answer before the final frame?
                            </Typography>
                        </Stack>
                      </MotionStack>
                  <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                    <InputLabel>Don't show this again</InputLabel>
                    <Checkbox 
                    onChange={() => setDontShowInfo(prev => {
                      const updated = !prev;
                      localStorage.setItem('sixpics_dontShowInfo', JSON.stringify(updated));
                      return updated;
                    })} 
                    checked={dontShowInfo}
                  />
                  </Stack>
                  </MotionStack>
              </Stack>
          </DropStack>

      {gamePack ? 
        <GameWrapper pack={gamePack} setPack={setGamePack}/>
      :
        <Stack width={'75%'} height={'100%'} alignItems={'center'} sx={{overflowY: 'auto'}}> 
          <Typography fontFamily={'Fredoka regular'} fontSize={20}>Select Game Pack</Typography>
          <MenuList sx={{width: '100%', height: '100%'}}>
            {packs?.filter((p) => !p.marked_for_delete)

            .map((p, i) => { 

              let disable = false
              let played
              
              let findPlayedGame = playedGames?.find((g) => g.pack_name === p.pack_name)

              if(findPlayedGame){
                disable = true
                played = findPlayedGame?.played
              }

              if(displayPromo && p.promo_name) {
                return (
                  <PackButton key={i} pack={p} setGamePack={setGamePack} disable={disable} playedDate={played}/>
                )
              } else if (!displayPromo && !p.promo_name){
                return (
                  <PackButton key={i} pack={p} setGamePack={setGamePack} disable={disable} playedDate={played}/>
                )
              }
                
                })}
          </MenuList>
        </Stack>
      }
    </Stack>
  );
};

export default Pic6;

