import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, MenuList, MenuItem} from "@mui/material";
import { fetchPacks } from "./helpers/functions";
import PackButton from "./PackButton";
import GameWrapper from './GameWrapper';
import useGlobalStore from "../../../business/useGlobalStore";

const Pic6 = () => {
  const [gamePack, setGamePack] = useState(null)
  const [packs, setPacks] = useState([])
  const [playedGames, setPlayedGames] = useState([])

  const userMeta = useGlobalStore((state) => state.userMeta) 

  const hasFetched = useRef(false);

  const checkIfPlayed = async (pack) => {
    let { data: pack_data, error } = await supabase
            .from('six_pics_data')
            .select("*")
            .eq('pack_name', pack)

            let foundPlayed = pack_data?.find((p) => p.user_id === userMeta.primary_id)

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
    console.log(playedGames) 
  }, [playedGames])

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;
  
    const getPacks = async () => {
      try {
        const res = await fetchPacks();
        if (res) setPacks(res);
      } catch (err) {
        console.error(err);
      }
    };
  
    getPacks();
  }, []);

  // useEffect(() => {
  //   console.log("Pic6 mounted");
  // }, []);

  return (
    <Stack
      direction={"column"}
      sx={{ height: "100%", width: "100%" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >

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

              return (
                  <PackButton key={i} pack={p} setGamePack={setGamePack} disable={disable} playedDate={played}/>
              )})}
          </MenuList>
        </Stack>
      }

    </Stack>
  );
};

export default Pic6;

