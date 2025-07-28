import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Key = ({d, v, w, children, setKeyboardInput}) => {

    return (
        <Stack onClick={() => setKeyboardInput(v)} sx={{height: '50px', width: w*3, justifyContent: 'center', alignItems: 'center', m: 0.2, boxShadow: '1px 0px 14px 1px #0000006e'}} borderRadius={1} bgcolor='white'>
            <Box sx={{width: '100%', fontSize: 25}}>{children ? children : d.toUpperCase()}</Box>
        </Stack>
    )

}

const CustomKeyBoard = ({ setKeyboardInput, hintIndex, toggleCheckAnswer, giveUp, showGiveUp }) => {
  const [topRow, setTopRow] = useState([]);
  const [midRow, setMidRow] = useState([]);
  const [botRow, setBotRow] = useState([]);

  useEffect(() => {
    const top = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    let mid = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ];
    let bot = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

    if (showGiveUp && !giveUp) {
      mid = [...mid, '{hint}', '{giveup}'];
    } else if (!showGiveUp && !giveUp) {
      mid = [...mid, '{del}'];
    }
    if (toggleCheckAnswer) {
      bot = [...bot, '{check}'];
    }

    setTopRow(top);
    setMidRow(mid);
    setBotRow(bot);
  }, [showGiveUp, giveUp, toggleCheckAnswer, hintIndex]);

  const width = 13


  return (
    <Stack userdata="customkey" width={'90svw'} height={'auto'} alignItems={'center'} justifyContent={'center'}>
      <Stack alignItems="center" justifyContent="space-between" direction="column" width="100%">
        
        <Stack direction={'row'}>
          <Key d='q' v='q' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='w' v='w' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='e' v='e' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='r' v='r' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='t' v='t' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='y' v='y' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='u' v='u' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='i' v='i' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='o' v='o' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='p' v='p' w={width} setKeyboardInput={setKeyboardInput}/>
        </Stack>

        <Stack direction={'row'}>
          <Key d='a' v='a' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='s' v='s' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='d' v='d' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='f' v='f' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='g' v='g' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='h' v='h' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='j' v='j' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='k' v='k' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='l' v='l' w={width} setKeyboardInput={setKeyboardInput}/>

          <Key d='<' v='{bksp}' w={width} setKeyboardInput={setKeyboardInput}><i className="fi fi-br-delete"></i></Key>
        </Stack>

        <Stack direction={'row'}>
          <Key d='>' v='{play}' w={width} setKeyboardInput={setKeyboardInput}><i className="fi fi-sr-play-pause"></i></Key>
          
          <Key d='z' v='z' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='x' v='x' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='c' v='c' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='v' v='v' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='b' v='b' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='n' v='n' w={width} setKeyboardInput={setKeyboardInput}/>
          <Key d='m' v='m' w={width} setKeyboardInput={setKeyboardInput}/>

          <Key d='m' v='{giveup}' w={width} setKeyboardInput={setKeyboardInput}><img width='95%' height='auto' src="/i-dont-know.svg"/></Key>
          <Key d='hint' v='{hint}' w={width} setKeyboardInput={setKeyboardInput}><i class="fi fi-sr-lightbulb-on"></i></Key>
          
        </Stack>

        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Key d='check' v='{check}' w={50} setKeyboardInput={setKeyboardInput}/>
          <Key d='next' v='{next}' w={50} setKeyboardInput={setKeyboardInput}/>
        </Stack>

      </Stack>
    </Stack>
  );
};

export default CustomKeyBoard
