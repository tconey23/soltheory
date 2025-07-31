import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, Modal, Slider, Box } from "@mui/material";
import useGlobalStore from "../../../business/useGlobalStore";
import WrongAnswer from "./WrongAnswer";

import { motion } from "framer-motion";
import RightAnswer from "./RightAnswer";
import MoreHints from "./MoreHints";
const MotionStack = motion(Stack);
const MotionText = motion(TextField)

const TextBoxes = ({ 
  level,
  setEnablePlay, 
  answer, 
  setWins, 
  next, 
  levelScore, 
  index, 
  setShowGiveUp,  
  isWin, 
  setIsWin, 
  setLevelScore,
  width, 
  giveUp, 
  setLevelsPlayed, 
  isDemo, 
  setGiveUp,
  setAttempts,
  setPlayStage,
  stage,
  setVph,
  keyboardInput,
  setKeyboardInput,
  hintIndex,
  setHintIndex,
  toggleCheckAnswer,
  setToggleCheckAnswer
}) => {
  const [inputLetters, setInputLetters] = useState([]);
  const [letterCount, setLetterCount] = useState(0);
  const [letterTarget, setLetterTarget] = useState(0);
  const [autoAnswer, setAutoAnswer] = useState(false);
  const [toggleHint, setToggleHint] = useState(true)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [nextFocusIndex, setNextFocusIndex] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0)
  const [moreHints, setMoreHints] = useState(false)
  const [reloadHints, setReloadHints] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(0);

  const videoRef = useRef()


  const screen = useGlobalStore((state) => state.screen);
  const userMeta = useGlobalStore((state) => state.userMeta)
  const inputRefs = useRef([]);
  const styleInputRef = useRef([])

  const parsedAnswer = answer.split("");
  const wordChunks = answer.match(/[\w']+|[^\w\s]/g);

  const cleanedChars = answer
  .split("")
  .filter((char) => /[a-z0-9]/i.test(char));

useEffect(() => {
  const cleaned = answer.replace(/[^\w]|_/g, ""); // remove punctuation and spaces
  setLetterTarget(cleaned.length);
}, [answer]);

useEffect(() =>{

  if(keyboardInput){
    if(keyboardInput === '{hint}'){
      getHint()
    } else if(keyboardInput === '{gethint}'){
      setMoreHints(true)
    } else if(keyboardInput === '{check}'){
      checkAnswer()
    } else if (keyboardInput === '{bksp}') {
      const safeIndex = Math.max(0, Math.min(focusedIndex, inputLetters.length - 1));
      handleCharBackspace(keyboardInput, safeIndex);
    } else if(keyboardInput === '{giveup}'){
      setGiveUp(true)
      setLevelScore(prev =>
          prev.map((obj, idx) =>
              idx === index
            ? { ...obj, score: 0 }
            : obj
        )
      );
    } else if(keyboardInput === '{next}'){
      next()
      setGiveUp(false)
      setShowGiveUp(false)
      setEnablePlay(false)
      setLevelsPlayed(prev => prev +1)
      setAttempts(0)
    } else if(keyboardInput === '{play}' && stage < 5){
      
      if(stage > 0){
        let score = levelScore[index].score
        setLevelScore(prev =>
          prev.map((obj, idx) =>
              idx === index
            ? { ...obj, score: score-10 }
            : obj
        )
      );
      }
      setPlayStage(true)
    } else {
      handleCharInput(keyboardInput, letterCount)
    }
    setKeyboardInput('')
    
  }
  
}, [keyboardInput])

  useEffect(() => {
    // console.log(autoAnswer)
    if (autoAnswer){
      setIsWin(true)
    };
  }, [autoAnswer, answer, inputLetters]);

  useEffect(() =>{
    // if(isDemo){
    //   setAutoAnswer(false)
    // }
  }, [isDemo])

  useEffect(() => {
    if (isWin) {
      setWins(prev => prev + 1);
    }
  }, [isWin]);

  useEffect(() => {
    setToggleCheckAnswer(letterCount === letterTarget);
  }, [letterCount, letterTarget]);

useEffect(() => {
  if (isWin || giveUp) {
    setToggleHint(false);
    return;
  }

  const score = levelScore?.[index]?.score;
  if (levelScore[index]?.hints > 0) {
    setToggleHint(true);
  } else {
    setToggleHint(false);
  }

}, [hintIndex, letterTarget, isWin, giveUp, index, levelScore, answer]);


useEffect(()=>{
  let currentHints = levelScore[index]?.hints - 1
  if(hintsUsed > 0){
    setLevelScore(prev =>
          prev.map((obj, idx) =>
              idx === index
            ? { ...obj, hints: currentHints, hintsUsed: hintsUsed }
            : obj
        )
      );
  }
}, [hintsUsed, index])

const getHint = () => {

  let currentStep
  currentStep = 'getHint() function init'

  if (isWin || giveUp) return;
  currentStep = 'checking for isWin or giveUp'
  currentStep = 'checking inputLetters.length'

  for (let i = 0; i < inputLetters.length; i++) {
    currentStep = 'checking that index is valid'

    if (!inputLetters[i]) {
      currentStep = 'getting the correctLetter'
      const correctLetter = cleanedChars[i];


      currentStep = 'checking for valid cleaned letter at index'

      currentStep = 'checking for valid correctLetter'

      if (!correctLetter) return;

      const updatedLetters = [...inputLetters];
      updatedLetters[i] = correctLetter;
      setInputLetters(updatedLetters);
      setLetterCount(prev => prev +1)

      setLevelScore((prev) => {
        const updated = [...prev];
        updated[index].score = Math.max(0, updated[index].score - 1);
        return updated;
      });

      setHintIndex(i + 1);

      setTimeout(() => {
        const nextRef = inputRefs.current[i + 1];
        if (nextRef) nextRef.focus();
      }, 0);

      setHintsUsed(prev => prev +1)

      return;
    }
  }
  const allFilled = cleanedChars.every((_, i) => inputLetters[i]);
  if (allFilled) {
    setToggleHint(false);
  }
};

const getMoreHints = () => {
let currentHints = levelScore[index]?.hints

  setLevelScore(prev =>
          prev.map((obj, idx) =>
              idx === index
            ? { ...obj, hints: currentHints + reloadHints, reloadedHints: true}
            : obj
        )
      );

  setMoreHints(false)
}

  const handleRightAnswer = () => {
    setIsWin(true);
    setShowGiveUp(false);
    setToggleCheckAnswer(false)
  };

  const handleWrongAnswer = () => {
    setIsWin(false);
    setShowGiveUp(true);
    setWrongAnswer(true)
  };

const stripPunctuation = (text) => text.replace(/[^\w]|_/g, "");

const checkAnswer = () => {
  const ans = stripPunctuation(answer).toLowerCase();
  const check = inputLetters.join('').toLowerCase(); // ✅ FIXED
  check === ans ? handleRightAnswer() : handleWrongAnswer();
};

const handleCharInput = (char, index) => {
  const val = char.toLowerCase().slice(0, 1);
  if (!val.match(/[a-z0-9]/i)) return;

  const newLetters = [...inputLetters];
  newLetters[index] = val;
  setInputLetters(newLetters);

  const filledCount = newLetters.filter(Boolean).length;
  setLetterCount(filledCount);

  // Move to next input
  if (val) {
    setNextFocusIndex(index + 1);
  }
};

useEffect(() => {
  if (nextFocusIndex !== null) {
    const nextRef = inputRefs.current[nextFocusIndex];
    if (nextRef) nextRef.focus();
    setNextFocusIndex(null);
  }
}, [inputLetters, nextFocusIndex]);


const handleClear = () => {
  setInputLetters([]);
  setLetterCount(0);
  setHintIndex(0);
  setWrongAnswer(false);
  setToggleCheckAnswer(false);

  inputRefs.current[0]?.focus();
};


const handleCharBackspace = (key, index) => {
  if (key === "{bksp}") {
    const newLetters = [...inputLetters];

    // Case 1: current box has a value, clear it
    if (newLetters[index]) {
      newLetters[index] = "";
      setInputLetters(newLetters);
      setLetterCount(newLetters.filter(Boolean).length);
      setFocusedIndex(index); // stay on same box
    }
    // Case 2: current box is empty, move back and clear
    else if (index > 0) {
      newLetters[index - 1] = "";
      setInputLetters(newLetters);
      setLetterCount(newLetters.filter(Boolean).length);

      const prev = inputRefs.current[index - 1];
      if (prev) prev.focus();
      setFocusedIndex(index - 1);
    }
  }
};



useEffect(() => {
  if (!giveUp && !isWin) return;

  const cleanedAnswer = answer.replace(/[^\w]|_/g, "").toLowerCase();
  const letters = cleanedAnswer.split("");
  setInputLetters(letters);
  setLetterCount(letters.length);
}, [giveUp, isWin, answer]);


  const [longestWord, setLongestWord] = useState(0)
  const [textBoxWidth, setTextBoxWidth] = useState(50)

  const [textBoxScale, setTextBoxScale] = useState(1)

  useEffect(() =>{
    let ansArray = answer?.split(' ')
    let longest = 0

    ansArray.forEach((a) => {
      if(a.length > longest) {
        longest = a.length
      }
      setLongestWord(longest)
    })

  }, [answer])

  useEffect(() =>{
    let styledWidth = width * 0.9
    let calculatedTextBoxWidth = 40
    
    if(longestWord){
      calculatedTextBoxWidth = styledWidth / longestWord
    }
    if(styledWidth > 330){
      setTextBoxWidth(Math.min(40, Math.max(50, calculatedTextBoxWidth)));
      setTextBoxScale(1)
    } else {
      let widthDiff = 330 - styledWidth
      let calcWidthDiff = widthDiff * 0.01
      setTextBoxScale(1 - calcWidthDiff)
    }

  }, [longestWord, width])
    
  const [dev, setDev] = useState('')
  const [windowVPH, setWindowVPH] = useState(0)
  const [windowVPW, setWindowVPW] = useState(0)
  const [initialVPH, setInitialVPH] = useState(0)

  useEffect(() => {
    const onResize = () => {
      setDev(window.visualViewport.height);
    };

    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', onResize)
      setWindowVPH(document?.getElementById('game_stage')?.offsetHeight)
      setWindowVPW(document?.getElementById('game_stage')?.offsetWidth)
    }
  }, []);

  useEffect(() => {
    setInitialVPH(window.visualViewport.height)
  }, [])

  useEffect(() => {

    if(windowVPH === 0){
      setInitialVPH(document.getElementById('game_stage').offsetHeight)
    }

    if(dev > initialVPH){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  }, [windowVPH, dev])

  useEffect(() => {
    const cleaned = answer.replace(/[^\w]|_/g, "");
    setLetterTarget(cleaned.length);
    setInputLetters(new Array(cleaned.length).fill(""));
    setHintIndex(0);
    setWrongAnswer(false);
    setIsWin(false);
    setToggleCheckAnswer(false);
    setToggleHint(true);
    setLetterCount(0);
    inputRefs.current = [];
  }, [answer, index]);

useEffect(() => {
  // console.log(keyboardInput)
}, [keyboardInput])


useEffect(() => {
  let inputWidth = styleInputRef?.current.offsetWidth
  styleInputRef.current?.forEach((r) => {
    r.children[0].firstChild.style.backgroundColor = ''
  })

  setAutoAnswer(false)
  
}, [styleInputRef, windowVPW]) 

useEffect(() => {
  setVph(initialVPH)
}, [initialVPH])

  let cleanedIndex = 0;

  return (
    <Stack userdata='textbox' direction="column" width="95%" height={'100%'} justifyContent="center" alignItems={'center'} sx={{zoom: 0.85}} marginBottom={4}>
      <Stack 
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        alignContent={'flex-start'}
        id="letter_wrapper"
        height={'auto'}
        overflow="auto"
        sx={{
          gap: 1,
          rowGap: '1px',
          wordBreak: "keep-all",  // optional
        }}
        >
        {wordChunks.map((word, wordIndex) => (
          <Stack
            key={`word-${wordIndex}`} 
            direction="row"
            justifyContent="center"
            alignItems="center"
            margin={0.5}
            flexWrap="nowrap"
            sx={{ whiteSpace: 'nowrap' }}
            spacing={0.2}
          > 
            {word.split("").map((char, charIndex) => {
        const isAlphaNum = /[a-z0-9]/i.test(char);

        if (isAlphaNum) {
          const currentIndex = cleanedIndex++;
          return (
              <MotionText
                initial={{transform: 'rotate3d(0, 1, 0, 344deg)', boxShadow: '1px 0px 3px 0px #00000045'}}
                animate={{transform: 'rotate3d(0, 1, 0, 0deg)', boxShadow: '1px 0px 3px 0px #0000000'}}
                transition={{duration: 1, delay: currentIndex * 0.07 }}
                key={`char-${wordIndex}-${charIndex}`}
                ref={el => styleInputRef.current[currentIndex] = el}
                id='sixpicsinput'
                value={inputLetters[currentIndex]?.toUpperCase() || ""}
                inputRef={(el) => (inputRefs.current[currentIndex] = el)}
                onClick={() => setNextFocusIndex(currentIndex)} // for focus movement
                onFocus={() => setFocusedIndex(currentIndex)}
                slotProps={{
                  input: {
                    readOnly: true,
                    style: { 
                      textAlign: "center", 
                      fontSize: "1.5rem", 
                      width: textBoxWidth, 
                      fontWeight: 'bolder', 
                      height: '3rem',
                      borderWidth: '0px'
                    },
                  },
                }}
                sx={{ 
                  textAlign: 'center', 
                  marginX: 0.25, 
                  transition: "all 0.3s", 
                  textTransform: 'uppercase',
                  display: 'flex',
                  fontSize: "1.5rem",
                  borderWidth: '0px',
                  
                }}
              />
                );
              } else {
                return (
                  <Typography
                    key={`punct-${wordIndex}-${charIndex}`}
                    variant="h5"
                    component="span"
                    mx={0.5}
                    fontFamily="Fredoka"
                    sx={{textTransform: 'uppercase' }}
                  >
                    {char}
                  </Typography>
                )
              }
            })}
          </Stack> 
        ))}

      </Stack>

      <Modal open={!!isWin} next={next} setLevelsPlayed={setLevelScore} answer={answer}><RightAnswer next={next} answer={answer} setLevelsPlayed={setLevelsPlayed} level={level}/></Modal>
      <Modal open={!!wrongAnswer}><WrongAnswer letterCount={letterCount} setWrongAnswer={setWrongAnswer} /></Modal>
      <Modal open={!!moreHints}><MoreHints levelScore={levelScore} index={index} longestWord={longestWord} reloadHints={reloadHints} setReloadHints={setReloadHints} getMoreHints={getMoreHints} setMoreHints={setMoreHints}/></Modal>
    
    </Stack>
  );
};

export default TextBoxes;