import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, MenuList, MenuItem} from "@mui/material";
import { fetchPacks } from "./helpers/functions";
import PackButton from "./PackButton";
import GameWrapper from './GameWrapper';

const Pic6 = () => {
  const [gamePack, setGamePack] = useState(null)
  const [packs, setPacks] = useState([])

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
  
    const getPacks = async () => {
      console.log('fetching packs');
      try {
        const res = await fetchPacks();
        if (res) setPacks(res);
      } catch (err) {
        console.error(err);
      }
    };
  
    getPacks();
  }, []);

  useEffect(() => {
    console.log("Pic6 mounted");
  }, []);

  return (
    <Stack
      direction={"column"}
      sx={{ height: "100%", width: "100%" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >

      {gamePack ? 
        <GameWrapper pack={gamePack}/>
      :
        <Stack width={'75%'} height={'100%'} alignItems={'center'} sx={{overflowY: 'auto'}}>
          <Typography fontFamily={'Fredoka regular'} fontSize={20}>Select Game Pack</Typography>
          <MenuList width={54}>
            {packs?.filter((pk) => !pk.marked_for_delete)
            .map((p, i) => { 
            {packs?.filter((p) => !p.marked_for_delete)
            .map((p, i) => { 
              console.log(p)
              return (
                  <PackButton key={i} pack={p} setGamePack={setGamePack}/>
              )})}
          </MenuList>
        </Stack>
      }

    </Stack>
  );
};

export default Pic6;

