import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IDontKnowSvg from './IDontKnowSvg'

const Key = ({d, v, w, children, setKeyboardInput, color, disabled}) => {

    return (
        <Stack 
          onClick={() => {
            if(!disabled){
              setKeyboardInput(v)
            }
          }} 
          sx={{
              height: '50px', 
              width: w*3, 
              justifyContent: 'center', 
              alignItems: 'center', 
              m: 0.2, 
              boxShadow: '1px 0px 14px 1px #0000006e',
              filter: disabled ?  'grayscale(1)' : 'grayscale(0)'
            }} 
          borderRadius={1} 
          bgcolor={disabled ? 'grey' : color}>
            <Box sx={{width: '100%', fontSize: 25, fontFamily: 'fredoka regular'}}>{children ? children : d.toUpperCase()}</Box>
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
    <Stack userdata="customkey" width={'100%'} height={'auto'} alignItems={'center'} justifyContent={'center'}>
      <Stack alignItems="center" justifyContent="space-between" direction="column" width="100%">
        
        <Stack direction={'row'}>
          <Key d='q' v='q' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='w' v='w' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='e' v='e' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='r' v='r' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='t' v='t' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='y' v='y' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='u' v='u' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='i' v='i' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='o' v='o' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='p' v='p' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
        </Stack>

        <Stack direction={'row'}>
          <Key d='a' v='a' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='s' v='s' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='d' v='d' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='f' v='f' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='g' v='g' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='h' v='h' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='j' v='j' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='k' v='k' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='l' v='l' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>

          <Key d='<' v='{bksp}' w={width} setKeyboardInput={setKeyboardInput} color='#ff8686' disabled={giveUp}><i className="fi fi-br-delete"></i></Key>
        </Stack>

        <Stack direction={'row'}>
          <Key d='>' v='{play}' w={width} setKeyboardInput={setKeyboardInput} color='#009528' disabled={giveUp}><i className="fi fi-sr-play-pause"></i></Key>
          
          <Key d='z' v='z' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='x' v='x' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='c' v='c' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='v' v='v' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='b' v='b' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='n' v='n' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>
          <Key d='m' v='m' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={giveUp}/>

          <Key d='m' v='{giveup}' w={width} setKeyboardInput={setKeyboardInput} color='#ff8686' disabled={!showGiveUp}>
            {/* <img width='95%' height='auto' src="/i-dont-know.svg"/> */}
            <IDontKnowSvg w={'100%'} />
          </Key>
          
          {
            hintIndex > 0 ? 
            <Key d='hint' v='{hint}' w={width} setKeyboardInput={setKeyboardInput} color='#ffe066' disabled={giveUp}><i class="fi fi-sr-lightbulb-on"></i>{hintIndex}</Key>

            : 

            <Key d='hint' v='{gethint}' w={width} setKeyboardInput={setKeyboardInput} color='#ffe066' disabled={giveUp}><i class="fi fi-sr-lightbulb-on"></i>+</Key>
          }
          
        </Stack>

        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Key d='✅ check' v='{check}' w={50} setKeyboardInput={setKeyboardInput} color='#7ae7c7' disabled={!toggleCheckAnswer || giveUp}/>
          <Key d='next' v='{next}' w={50} setKeyboardInput={setKeyboardInput} color='#a263f4' disabled={!giveUp}/>
        </Stack>

      </Stack>
    </Stack>
  );
};

export default CustomKeyBoard
