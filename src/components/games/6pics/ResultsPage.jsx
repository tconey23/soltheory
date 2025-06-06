
import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button} from "@mui/material";
import { addGameToUser, getGifs } from "../../../business/games_calls";
import { useNavigate } from "react-router-dom";
import SixPicsPacks from "./SixPicsPacks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "../../../business/supabaseClient";
import confetti from 'canvas-confetti';
import useGlobalStore from "../../../business/useGlobalStore";

const ResultsPage = ({score, gamePack}) => {
    const [shotCount, setShotCount] = useState(0)
    const nav = useNavigate()
    const user = useGlobalStore((state) => state.user)
  
    useEffect(() => {
      setShotCount(0)
    }, [])

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

      const confettiInterval = setInterval(() => {
        shootConfetti(shotCount * 500)
      }, 400);

        return () =>{ 
          clearInterval(confettiInterval)
        }
      }
    }, [shotCount])
  
    const handleSaveGame = async () => {
  
      const gameDataObject = {
        game: 'SixPics',
        pack: gamePack,
        score: score,
        date_played: Date.now()
      }

      let originalGameData
      
      let { data: users, error } = await supabase
      .from('users')
      .select("*")
      .eq('primary_id', user.id)

      if(users?.[0]){
        originalGameData = users?.[0].game_data
      }

      originalGameData.push(gameDataObject)


      const { data, error: err } = await supabase
      .from('users')
      .update({ game_data: originalGameData})
      .eq('primary_id', user.id)
      .select()

      if(!err){
        console.log(err)
      }
        
      // console.log(data, err)
      
      nav('/games')
    }
  
    return (
      <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Stack width={'3%'} height={'100%'} justifyContent={'center'} alignItems={'center'} marginBottom={5}>
            <video
              width="80%"
              height="80%"
              preload="metadata"
              style={{ boxShadow: '4px 2px 10px 1px #00000038', padding: 1, marginBlock: 10}}
              muted
              autoPlay = {false}
              onLoadedMetadata={(e) => {
                e.target.currentTime = e.target.duration
              }}
              onCanPlay={(e) => {

                // console.log(e)

              }}
              >
              <source src={gamePack?.graphic} type="video/mp4" />
            </video>
          </Stack>
          <Typography fontSize={25}>Your Score</Typography>
          <Typography fontSize={35}>{`${score} / ${gamePack?.videos?.length *100}`}</Typography>
        </Stack>
        <Stack width={'10%'}>
          <Button disabled={!user} onClick={() => handleSaveGame()} variant="contained">{user ? 'Save' : 'Login to save'}</Button>
        </Stack>
      </Stack>
    )
  }

  export default ResultsPage