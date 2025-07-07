
import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, List, ListItem} from "@mui/material";
import { addGameToUser, getGifs } from "../../../business/games_calls";
import { useNavigate } from "react-router-dom";
import SixPicsPacks from "./SixPicsPacks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "../../../business/supabaseClient";
import confetti from 'canvas-confetti';
import useGlobalStore from "../../../business/useGlobalStore";
import { render } from "@react-three/fiber";
import { motion } from 'framer-motion'

const ResultsPage = ({score, gamePack, demo, levels, levelScore}) => {
    const [shotCount, setShotCount] = useState(0)
    const nav = useNavigate()
    const user = useGlobalStore((state) => state.user)
    const [renderScores, setRenderScores] = useState(false)
    const MotionStack = motion(Stack)
  
    useEffect(() => {
      setShotCount(0)
      // console.log(levelScore)
    }, [])

    useEffect(() => {
      // console.log('demo', demo)
      // console.log(gamePack)
    }, [demo, gamePack])

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
  
    return (
      <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
      {!demo ?
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
                      }
                      return (
                        <ListItem>
                          <Typography>{`${i+1}: ${p.answer} - ${levelScore[i].score} pts`}</Typography>
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
                              transition={{ duration: 2, delay: 0 }}
                            >
                              <Typography>{`${i+1}: ${p.answer} - ${levelScore[i].score} pts - ${levelScore[i].hintsUsed} hints`}</Typography>
                            </MotionStack>
                          </ListItem>
                      )
                    }
                    })
                  }
                </List>
              </Stack>
            </Stack>
          </>
        }
      </Stack>
    )
  }

  export default ResultsPage