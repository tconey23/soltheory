import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button} from "@mui/material";
import { motion } from "framer-motion";
import useBreakpoints from "../../../business/useBreakpoints";
import useGlobalStore from "../../../business/useGlobalStore";

const MotionStack = motion(Stack);


const TextBoxes = ({answer, setWins, next, levelScore, index, setShowGiveUp, wins}) => {

  

  const [inputLetters, setInputLetters] = useState([])
  const [letterCount, setLetterCount] = useState(0)
  const [letterTarget, setLetterTarget] = useState(0)
  const [isWin, setIsWin] = useState(false)
  const [autoAnswer, setAutoAnswer] = useState(false)
  const [autoGiveUp, setAutoGiveUp] = useState(true)

   const screen = useGlobalStore((state) => state.screen)
   
   useEffect(() =>{
    console.log(screen)
    
  }, [screen])
  
   const inputRefs = useRef([]);
   
   

  useEffect(() => {
    if(autoAnswer){
      setIsWin(true)
    }
  }, [autoAnswer])

  useEffect(() => {
    console.log(levelScore)
  }, [levelScore])

  useEffect(() => { 
    if(isWin) {setWins(prev => prev +1)}
  }, [isWin])

  useEffect(() => {
  }, [inputLetters])

  useEffect(() => {
    setLetterTarget(0)
    // console.log(letterTarget)
  }, [])

  useEffect(() => {
    inputRefs?.current.forEach((r) => {
      let addAmount = r.length
      // console.log(typeof addAmount)
      setLetterTarget(prev => prev + r.length)
    })
  }, [inputRefs])

  const handleRightAnswer = () => {
    setIsWin(true)
    setShowGiveUp(false)
  }

  const handleWrongAnswer = () => {
    setIsWin(false)
    setShowGiveUp(true)
  }

    const checkAnswer = () => {
        let ans = answer.replaceAll(' ','').toLowerCase()
        let check = inputLetters?.toLowerCase()
        check === ans ? handleRightAnswer() : handleWrongAnswer()
      }

    const handleInputChange = (event, wordIndex, letterIndex) => {
        const { value } = event.target;

        setLetterCount(prev => prev +1)
    
        let letters = [];
        inputRefs.current.forEach((w) => {
            letters.push(...w.map((t) => t?.value || ""));
        });
        setInputLetters(letters.join("").replaceAll(",", ""));
        if (value.length === 1 || value === " ") {
            const nextIndex = letterIndex + 1;
            if (
              nextIndex < inputRefs.current[wordIndex].length && 
              inputRefs.current[wordIndex][nextIndex]
            ) {
                inputRefs.current[wordIndex][nextIndex].focus();
            }  else if (value === " " && wordIndex + 1 < inputRefs.current.length) {
                inputRefs.current[wordIndex + 1][0].focus();
            } else {
              try {
                inputRefs.current[wordIndex + 1][0].focus()
              } catch (error) {
                  console.error(error);
              }
            }
        }
    };

    const handleKeyDown = (e, wordIndex, letterIndex) => {
      const key = e.key;
    
      if (key === "Backspace") {
        const currentInput = inputRefs.current[wordIndex][letterIndex];
        if (currentInput?.value === "") {
          if (letterIndex > 0) {
            inputRefs.current[wordIndex][letterIndex - 1]?.focus();
          } else if (wordIndex > 0) {
            const prevWord = inputRefs.current[wordIndex - 1];
            prevWord[prevWord.length - 1]?.focus();
          }
        }
      }
    };
    
    const isLocked = levelScore?.[index]?.score === 0;

  return (
    <>
    <Stack direction={"row"} width={"100%"} justifyContent={"center"} flexWrap={'wrap'}>
      {isWin && 
        <MotionStack
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
         bgcolor={'#00000082'} width={'100%'} height={'25vh'} justifyContent={"center"} alignItems={'center'}>
          <Typography fontSize={25} fontFamily={'Fredoka Regular'}>{`Answer: ${answer}`}</Typography>
          <Typography fontSize={25} fontFamily={'Fredoka Regular'}>CORRECT!</Typography>
          <Button onClick={() => {
            // setIsWin(false)
            next()
            }} variant="contained">Continue</Button>
        </MotionStack>
      }
    {!isWin && answer?.split(" ").map((word, wordIndex) => {
        inputRefs.current[wordIndex] = [];
        
        return (
            <Stack  key={wordIndex} justifyContent={"center"} alignItems={'center'} direction={"row"} marginLeft={0} marginBottom={0} padding={1}>
          {word.split("").map((letter, letterIndex) => {
              
              return (
                  <Stack id='textbox-wrapper' key={letterIndex} marginLeft={0} direction={"row"} justifyContent={"center"} alignItems={'center'}  flexWrap={'wrap'}>
                    <TextField
                      value={isLocked ? letter : undefined}
                      disabled={isLocked}
                      sx={{ opacity: 1, transition: 'all 1s ease-in' }}
                      autoComplete="off"
                      inputRef={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                      onChange={(event) => handleInputChange(event, wordIndex, letterIndex)}
                      onKeyDown={(e) => handleKeyDown(e, wordIndex, letterIndex)}
                      inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: 30, width: 40 }
                      }}
                    />
                  </Stack>
              )})}
        </Stack>
      );
    })}
  </Stack>
    <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
        {inputLetters?.length === letterTarget && !isWin && !isLocked && <Button onClick={() => checkAnswer()} variant='contained'>Check Answer</Button>}
    </Stack>
    </>
  );
};

export default TextBoxes;