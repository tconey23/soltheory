import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, MenuList, MenuItem, Modal, Box} from "@mui/material";
import { fetchPacks } from "./helpers/functions";
import PackButton from "./PackButton";
import GameWrapper from './GameWrapper';
import useGlobalStore from "../../../business/useGlobalStore";

const Pic6 = ({demo}) => {
  const [gamePack, setGamePack] = useState(null)
  const [packs, setPacks] = useState([])
  const [playedGames, setPlayedGames] = useState([])
  const [loginSkipped, setLoginSkipped] = useState(false)
  const [displayModal, setDisplayModal] = useState(false)

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
    // console.log(playedGames) 
  }, [playedGames])

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
          let sortedPacks = filteredPacks.sort((a, b) => b.id - a.id);
          
          setPacks(sortedPacks)
        }

      } catch (err) {
        console.error(err);
      }
    };
  
    getPacks();
  }, []);

  useEffect(() => {
    // if(userMeta?.primary_id){
    //   setDisplayModal(false)
    // } else if(loginSkipped){
    //   setDisplayModal(false)
    // } else {
    //   setDisplayModal(true)
    // }
  }, [loginSkipped, userMeta])

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
      {/* <Modal
        open={displayModal}
      >
        <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Stack borderRadius={1} bgcolor={'#ffffff85'} width={'80%'} height={'25%'} justifyContent={'center'} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} padding={2} borderRadius={1} bgcolor={'#dd95ff'} width={'90%'} height={'80%'}>
              <Typography sx={{marginBottom: '10px'}} fontFamily={'fredoka regular'} textAlign={'center'}>
                You can play our game without logging in, but creating an account lets you save your game data—which is pretty cool. Totally up to you. Follow your bliss.
              </Typography>
              <Stack direction={'row'} sx={{justifyContent: 'space-evenly', width: '100%'}}>
                <Button>Login</Button>
                <Button>New user</Button>
                <Button onClick={() => setLoginSkipped(true)}>Skip</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Modal> */}
    </Stack>
  );
};

export default Pic6;

