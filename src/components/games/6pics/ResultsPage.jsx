
import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, List, ListItem, Box, Modal} from "@mui/material";
import { addGameToUser, getGifs } from "../../../business/games_calls";
import { Link, useNavigate } from "react-router-dom";
import SixPicsPacks from "./SixPicsPacks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "../../../business/supabaseClient";
import confetti from 'canvas-confetti';
import useGlobalStore from "../../../business/useGlobalStore";
import { render } from "@react-three/fiber";
import { motion } from 'framer-motion'
import { Helmet } from "react-helmet";

  const ResultsPage = ({score, gamePack, demo=true, levels, levelScore}) => {
    const [shotCount, setShotCount] = useState(0)
    const nav = useNavigate()
    const user = useGlobalStore((state) => state.user)
    const [renderScores, setRenderScores] = useState(false)
    const [showMsg, setShowMsg] = useState(true)
    const MotionStack = motion(Stack)

    // const isDemo = useGlobalStore((state) => state.isDemo)
    let isDemo = true
  
    useEffect(() => {
      setShotCount(0)
      // console.log(levelScore)
    }, [])

    useEffect(() => {
      console.log('demo', isDemo)
      if(isDemo) {
        setShowMsg(true)
      }
    }, [isDemo])

    const shootConfetti = (count) => {
     
      if(shotCount % 2 === 0){
        confetti({
          particleCount: count,
          spread: 80,
          angle: 75,
          origin: { y: 1, x:0 }, 
          useWorker: true,
          decay: 0.95,
          startVelocity: 45,
          resize: true
        })
      } else {
        confetti({
          particleCount: count,
          spread: 80,
          angle: 100,
          origin: { y: 1, x:1 }, 
          useWorker: true,
          decay: 0.95,
          startVelocity: 45,
          resize: true
        })
      }
      


      setShotCount(prev =>  prev +1)
      // console.log(shotCount)
    }

    useEffect(() => {

      if(shotCount == 0){
        shootConfetti(100)
      }


      if(shotCount < (score / 100)){
        // console.log(score)
      const confettiInterval = setInterval(() => {
        shootConfetti(shotCount * 500)
      }, 400);

        return () =>{ 
          clearInterval(confettiInterval)
          setRenderScores(false)
        }
      } else {
        setRenderScores(true)
      }
    }, [shotCount])
  
    const handleSaveGame = async () => {
      const gameDataObject = {
        user_id: user.id,
        pack_name: gamePack?.pack_name,
        score: score,
        game_date: Date.now()
      };

      const { data, error } = await supabase
      .from('six_pics_data')
      .upsert(gameDataObject)
      .select();

      if (error) {
        console.error("Failed to save game:", error);
        return; // Optional: stop navigation if there's an error
      }

      console.log("Game saved:", data);
      nav('/games');
    };

    const shareGame = async () => {
      await navigator.share({
        text: 'Think you can beat my scores?', 
        title: 'I just played this fun new game', 
        url: `https://soltheory.com/avett`
      })
    }

    console.log(gamePack)
  
    return (
      <Stack width={'100%'} height={'80dvh'} justifyContent={'center'} alignItems={'center'} overflow={'auto'}>
      <Helmet>
        <title>6 Pics – Avett Bros Demo</title>
        <link rel="icon" type="image/png" href="https://soltheory.com/AvettBros.png" />
        <meta property="og:image" content="https://soltheory.com/AvettBros.png" />
        <meta property="og:url" content="https://soltheory.com/avett" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!demo ?
          <>
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
              <Stack width={'30%'} height={'25%'} justifyContent={'center'} alignItems={'center'} marginBottom={5}>
                <video
                  preload="metadata"
                  style={{ boxShadow: '4px 2px 10px 1px #00000038', padding: 1, marginBlock: 10, width: '30%', height: 'auto'}}
                  muted
                  autoPlay = {false}
                  onLoadedMetadata={(e) => {
                    e.target.currentTime = e.target.duration
                  }}
                  >
                  <source src={gamePack?.graphic} type="video/mp4" />
                </video>
              </Stack>
              <Typography fontSize={25}>Your Score</Typography>
              <Typography fontSize={35}>{`${score} / ${gamePack?.videos?.length *100}`}</Typography>
              <Stack>
                <List>
                  {
                    gamePack?.videos?.map((p, i) => {
                      if(renderScores){
                        // console.log(p)
                      }
                      return (
                        <ListItem>
                          <Typography>{`${i+1}: ${p.answer} - ${levelScore[i].score} pts - ${levelScore[i].hintsUsed} hint(s)`}</Typography>
                        </ListItem>
                      )
                    })
                  }
                </List>
              </Stack>
            </Stack>
            <Stack width={'10%'}>
              <Button disabled={!user} onClick={() => handleSaveGame()} variant="contained">{user ? 'Save' : 'Login to save'}</Button>
            </Stack>
          </>
          :
          <>
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
              <Stack width={'30%'} height={'100%'} justifyContent={'center'} alignItems={'center'} marginBottom={5}>
                <video
                  preload="metadata"
                  style={{ boxShadow: '4px 2px 10px 1px #00000038', padding: 1, marginBlock: 10, width: '30%', height: 'auto'}}
                  muted
                  autoPlay = {false}
                  onLoadedMetadata={(e) => {
                    e.target.currentTime = e.target.duration
                  }}
                  >
                  <source src={gamePack?.graphic} type="video/mp4" />
                </video>
              </Stack>
              <Typography fontSize={25}>Your Score</Typography>
              <Typography fontSize={35}>{`${score} / ${gamePack?.videos?.length *100}`}</Typography>
              <Stack>
                <List>
                  {
                    gamePack?.videos?.map((p, i) => {
                      if(renderScores){
                        // console.log(p)
                        return (
                          <ListItem>
                            <MotionStack
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: 0 }}
                            >
                              <Typography>{`${i+1}: ${p.answer} - ${levelScore[i].score} pts - ${levelScore[i].hintsUsed} hint(s)`}</Typography>
                            </MotionStack>
                          </ListItem>
                      )
                    }
                    })
                  }
                </List>
              </Stack>
            </Stack>
            <Link onClick={() => shareGame()}>Share</Link>
          </>
        }
        {renderScores && showMsg && isDemo &&
        <Modal
        open={showMsg}
        >

        <MotionStack 
          position={'absolute'} 
          height={'100%'} 
          width={'100%'} 
          bgcolor={'#0000008c'}
          initial={{opacity: 0 }}
          animate={{opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          justifyContent={'center'}
          alignItems={'center'}
          >
            <MotionStack
              justifyContent={'center'} 
              alignItems={'center'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              position={'absolute'}
              boxShadow={'1px 1px 1px 1px #0000002e'}
              borderRadius={2}
              height={'60%'}
              width={'75dvw'}
              bgcolor={'white'}
              padding={2}
              zIndex={10000}
              >
              <Typography textAlign={'center'} fontSize={30} fontFamily={'fredoka regular'}>Thank you for playing 6 Pics!</Typography>
              <Typography textAlign={'center'} sx={{marginTop: '10px'}} fontFamily={'fredoka regular'}>Dismiss this window, take a screenshot of your scores and send it to </Typography>
              <Typography textAlign={'center'} sx={{marginTop: '10px'}} fontFamily={'fredoka regular'}>
                <Link onClick={() => window.location.href = `sms:+18326910649?&body=I just played 6 Pics ${gamePack?.pack_name} by SOL Theory%0AMy score was ${score} / ${gamePack?.videos?.length *100}`}>720.588.2002</Link>
              </Typography>
              <Typography textAlign={'center'} sx={{marginTop: '10px'}} fontFamily={'fredoka regular'}>to be entered to win a SOL Theory t-shirt</Typography>

              <Box sx={{marginTop: 5}}>
                <Button
                  onClick={() => setShowMsg(false)}
                  >
                  Dismiss
                </Button>
              </Box>
            </MotionStack>
            </MotionStack>
            </Modal>
          }
      </Stack>
    )
  }

  export default ResultsPage