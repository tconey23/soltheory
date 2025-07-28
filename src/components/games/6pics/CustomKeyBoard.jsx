import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IDontKnowSvg from './IDontKnowSvg'
import { motion, AnimatePresence } from 'framer-motion'

const MotionStack = motion(Stack)

const Key = ({d, v, w, children, setKeyboardInput, color, disabled, keyCount}) => {

  const [clicked, setClicked] = useState(false)
  const [grayscale, setGrayscale] = useState(0)

  useEffect(() => {
    if(clicked && !disabled){
      setTimeout(() => {
        setClicked(false)
      }, 100);
    }
  }, [clicked])



    return (
        <AnimatePresence>
          <MotionStack 
            initial={{transform: 'rotate3d(0, 1, 0, 344deg)', boxShadow: '1px 0px 3px 0px #00000045'}}
            animate={{transform: 'rotate3d(0, 1, 0, 0deg)', boxShadow: '1px 0px 14px 1px #0000006e'}}
            transition={{duration: 1, delay: keyCount * 0.04 }}
            onClick={() => {
              if(!disabled){
                setKeyboardInput(v)
                setClicked(true)
              }
            }} 
            sx={{
              height: '50px', 
              width: w*3, 
              justifyContent: 'center', 
              alignItems: 'center', 
              m: 0.2, 
              boxShadow: '1px 0px 14px 1px #0000006e',
            }} 
            borderRadius={1} 
            bgcolor={disabled ? 'grey' : clicked? 'grey' : color}
            >
              <Box sx={{width: '100%', fontSize: '1.75rem', fontFamily: 'fredoka regular'}}>{children ? children : d.toUpperCase()}</Box>
          </MotionStack>
        </AnimatePresence>
    )

}

const CustomKeyBoard = ({ setKeyboardInput, hintIndex, toggleCheckAnswer, giveUp, showGiveUp, isPlaying, levelScore, maxScore, levelId}) => {
  const [topRow, setTopRow] = useState([]);
  const [midRow, setMidRow] = useState([]);
  const [botRow, setBotRow] = useState([]);
  const [keyCount, setKeyCount] = useState(0)
  const [disablePlay, setDisablePlay] = useState(true)
  const [disableHint, setDisableHint] = useState(true)
  const [disableLetters, setDisableLetters] = useState(true)

  useEffect(() =>{

    if(levelScore && levelScore[levelId]?.score > hintIndex){
      setDisableHint(false)
    } else if (levelScore && levelScore[levelId]?.score == 0){
      setDisableHint(true)
    }

    if(levelScore[levelId]?.score >= 10){
      setDisablePlay(false)
    } else if (levelScore[levelId]?.score < 10){
      setDisablePlay(true)
    }

  }, [levelScore, maxScore, levelId, hintIndex])

  useEffect(() =>{
    if(toggleCheckAnswer){
      setDisableLetters(true)
    } else if(!toggleCheckAnswer){
      setDisableLetters(false)
    }
  }, [toggleCheckAnswer])

  useEffect(() =>{
    if(giveUp){
      setDisablePlay(true)
      setDisableHint(true)
    } else if(!giveUp) {
      setDisablePlay(false)
      setDisableHint(false)
    } 
  }, [giveUp])

  useEffect(() =>{
    if(isPlaying){
      setDisablePlay(true)
      setDisableHint(true)
    } else if(!isPlaying) {
      setDisablePlay(false)
      setDisableHint(false)
    }
  }, [isPlaying])

  useEffect(() =>{
    if(showGiveUp){
      setDisablePlay(true)
    } else if(!showGiveUp) {
      setDisablePlay(false)
    }
  }, [showGiveUp])

  useEffect(() => {
    if(keyCount > 32){
      setKeyCount(0)
    }
  }, [keyCount])

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

  const width = 15


  return (
    <Stack userdata="customkey" width={'98%'} height={'auto'} alignItems={'center'} justifyContent={'center'}>
      <Stack alignItems="center" justifyContent="space-between" direction="column" width="100%">
        
        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Key d='q' v='q' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={1}/>
          <Key d='w' v='w' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={2}/>
          <Key d='e' v='e' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={3}/>
          <Key d='r' v='r' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={4}/>
          <Key d='t' v='t' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={5}/>
          <Key d='y' v='y' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={6}/>
          <Key d='u' v='u' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={7}/>
          <Key d='i' v='i' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={8}/>
          <Key d='o' v='o' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={9}/>
          <Key d='p' v='p' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={10}/>
        </Stack>

        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Key d='a' v='a' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={11}/>
          <Key d='s' v='s' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={12}/>
          <Key d='d' v='d' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={13}/>
          <Key d='f' v='f' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={14}/>
          <Key d='g' v='g' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={15}/>
          <Key d='h' v='h' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={16}/>
          <Key d='j' v='j' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={17}/>
          <Key d='k' v='k' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={18}/>
          <Key d='l' v='l' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={19}/>

          <Key d='<' v='{bksp}' w={width} setKeyboardInput={setKeyboardInput} color='#ff8686' disabled={giveUp} setKeyCount={setKeyCount} keyCount={20}><i className="fi fi-br-delete"></i></Key>
        </Stack>

        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          
          <Key d='z' v='z' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={22}/>
          <Key d='x' v='x' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={23}/>
          <Key d='c' v='c' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={24}/>
          <Key d='v' v='v' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={25}/>
          <Key d='b' v='b' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={26}/>
          <Key d='n' v='n' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={27}/>
          <Key d='m' v='m' w={width} setKeyboardInput={setKeyboardInput} color='white' disabled={disableLetters} setKeyCount={setKeyCount} keyCount={28}/>

          
        </Stack>

        <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Key d='>' v='{play}' w={20} setKeyboardInput={setKeyboardInput} color='#009528' disabled={disablePlay} setKeyCount={setKeyCount} keyCount={21}><i className="fi fi-sr-play-pause"></i></Key>


          <Key d='check' v='{check}' w={45} setKeyboardInput={setKeyboardInput} color='#7ae7c7' disabled={!toggleCheckAnswer || giveUp} setKeyCount={setKeyCount} keyCount={32}/>

          <Key d='next' v='{next}' w={45} setKeyboardInput={setKeyboardInput} color='#a263f4' disabled={!giveUp} setKeyCount={setKeyCount} keyCount={33}/>

          <Key d='m' v='{giveup}' w={20} setKeyboardInput={setKeyboardInput} color='#ff8686' disabled={!showGiveUp} setKeyCount={setKeyCount} keyCount={29}>
            <Stack sx={{padding: 1.3}} justifyItems={'center'} alignItems={'center'}>
              <IDontKnowSvg w={'100%'} />
            </Stack>
          </Key>
          
          {
            hintIndex > 0 ? 
            <Key d='hint' v='{hint}' w={20} setKeyboardInput={setKeyboardInput} color='#ffe066' disabled={disableHint} setKeyCount={setKeyCount} keyCount={30}><i class="fi fi-sr-lightbulb-on"></i>{hintIndex}</Key>

            : 

            <Key d='hint' v='{gethint}' w={20} setKeyboardInput={setKeyboardInput} color='#ffe066' disabled={disableHint} setKeyCount={setKeyCount} keyCount={31}><i class="fi fi-sr-lightbulb-on"></i>+</Key>
          }
        </Stack>

      </Stack>
    </Stack>
  );
};

export default CustomKeyBoard
