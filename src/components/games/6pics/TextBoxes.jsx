import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, Modal } from "@mui/material";
import { motion } from "framer-motion";
import useGlobalStore from "../../../business/useGlobalStore";
import { Link } from "react-router-dom";

const MotionStack = motion(Stack);

const TextBoxes = ({ answer, setWins, next, levelScore, index, setShowGiveUp, wins, isWin, setIsWin, setLevelScore, width, height, totalScore, giveUp }) => {
  const [inputLetters, setInputLetters] = useState([]);
  const [letterCount, setLetterCount] = useState(0);
  const [letterTarget, setLetterTarget] = useState(0);
  const [autoAnswer, setAutoAnswer] = useState(false);
  const [toggleCheckAnswer, setToggleCheckAnswer] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [toggleHint, setToggleHint] = useState(true)
  const [wrongAnswer, setWrongAnswer] = useState(false)

  const screen = useGlobalStore((state) => state.screen);
  const inputRefs = useRef([]);

  const words = answer.split(" ");

  // Calculate expected letter count once on mount
  useEffect(() => {
    const target = words.reduce((acc, word) => acc + word.length, 0);
    setLetterTarget(target);
  }, [answer]);

  // Auto win logic
  useEffect(() => {
    if (autoAnswer) setIsWin(true);
  }, [autoAnswer]);

  useEffect(() => {
    if (isWin) {
      setWins(prev => prev + 1);
    }
  }, [isWin]);

  // Toggle "Check Answer" button
  useEffect(() => {
    // console.log(letterCount, letterTarget)
    setToggleCheckAnswer(letterCount === letterTarget);
  }, [letterCount, letterTarget]);
  
  useEffect(() => {

    let calculatedScore = levelScore?.[index]?.score -5 
    // console.log(levelScore?.[index]?.score)
    // console.log(calculatedScore, calculatedScore > 0)
    // console.log(hintIndex, letterTarget)
    // console.log(hintIndex, letterCount)

    if (calculatedScore > 0){
      setToggleHint(true)
    } else {
      setToggleHint(false)
    }

    if(isWin || giveUp){
      setToggleHint(false)    
    }

  }, [hintIndex, letterTarget, isWin, giveUp])

  const getHint = () => {
  if (hintIndex >= letterTarget) return;

  let count = 0;
  for (let w = 0; w < words.length; w++) {
    for (let l = 0; l < words[w].length; l++) {
      if (count === hintIndex) {
        const correctLetter = words[w][l];
        const input = inputRefs.current[w][l];

        if (input) {
          input.value = correctLetter;

          // Trigger input change manually to update state
          handleInputChange({ target: { value: correctLetter } }, w, l);

          setHintIndex(letterCount);
          setLevelScore(prev => {
            const updated = [...prev];
            updated[index].score = Math.max(0, updated[index].score - 5);
            return updated;
          });
        }
        return;
      }
      count++;
    }
  }
};


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

  const checkAnswer = () => {
    const ans = answer.replaceAll(" ", "").toLowerCase();
    const check = inputLetters.toLowerCase();
    check === ans ? handleRightAnswer() : handleWrongAnswer();
  };

const handleInputChange = (event, wordIndex, letterIndex) => {
  const { value } = event.target;
  const val = value.slice(0, 1); // Only allow 1 character
  event.target.value = val;

  // Update refs directly
  inputRefs.current[wordIndex][letterIndex].value = val;

  // Build updated inputLetters flat array
  const letters = inputRefs.current.flatMap((wordRefs) =>
    wordRefs.map((ref) => ref?.value || "")
  );

  // Count non-empty letters
  const filledCount = letters.filter((c) => c !== "").length;

  setInputLetters(letters.join(""));
  setLetterCount(filledCount);

  // Auto-focus to next box
  if (val.length === 1) {
    const nextIndex = letterIndex + 1;
    if (
      nextIndex < inputRefs.current[wordIndex].length &&
      inputRefs.current[wordIndex][nextIndex]
    ) {
      inputRefs.current[wordIndex][nextIndex].focus();
    } else if (wordIndex + 1 < inputRefs.current.length) {
      inputRefs.current[wordIndex + 1][0]?.focus();
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

useEffect(() => {
  if (!giveUp && !isWin) return;

  let count = 0;
  for (let w = 0; w < words.length; w++) {
    for (let l = 0; l < words[w].length; l++) {
      const correctLetter = words[w][l];
      const input = inputRefs.current[w]?.[l];

      if (input) {
        input.value = correctLetter;
      }

      count++;
    }
  }

  setLetterCount(words.join("").length);
}, [giveUp, isWin, words]);

  const [longestWord, setLongestWord] = useState(0)
  const [textBoxWidth, setTextBoxWidth] = useState(0)

  const getCharCount = (chars) => {
    if(chars > longestWord){
      setLongestWord(chars)
    } else { 
      return
    }
  }

  useEffect(() =>{
    let styledWidth = width * 0.80
    let calculatedTextBoxWidth = styledWidth / longestWord
    // console.log(calculatedTextBoxWidth)

    setTextBoxWidth(Math.min(50, Math.max(10, calculatedTextBoxWidth)));
    
  }, [longestWord, width])
    
  const [dev, setDev] = useState('')
  const [windowVPH, setWindowVPH] = useState(0)
  const [initialVPH, setInitialVPH] = useState(0)

  useEffect(() => {
    const onResize = () => {
      setDev(window.visualViewport.height);
    };

    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', onResize)
      setWindowVPH(document?.getElementById('game_stage')?.offsetHeight)
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
    // Clear previous inputRefs and text box values
    inputRefs.current.forEach((row) =>
      row.forEach((input) => {
        if (input) input.value = '';
      })
    );
    inputRefs.current = [];
    setLetterCount(0);
    setInputLetters('');
    setHintIndex(0);
    setWrongAnswer(false);
    setIsWin(false);
    setToggleCheckAnswer(false);
  }, [answer, index]);

  return (
    <Stack direction="column" width="100%" justifyContent="center" alignItems={'center'}>
    <Stack direction="row" width="98%" justifyContent="center" alignItems={'center'} flexWrap="wrap" id="letter_wrapper" height={height * 0.33} overflow={'auto'} boxShadow={'inset 0px 0px 5px 3px #0000001a'}>
      {!isWin &&
        words.map((word, wordIndex) => {
          getCharCount(word?.length)
          if (!inputRefs.current[wordIndex]) {
            inputRefs.current[wordIndex] = [];
          }
          
          return (
            <Stack key={`word-${wordIndex}`}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                marginLeft={0}
                marginBottom={0}
                padding={1}
                >
                {word.split("").map((letter, letterIndex) => (
                  <Stack
                  key={`letter-${wordIndex}-${letterIndex}`}
                  id="textbox-wrapper"
                  marginLeft={0}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  flexWrap="wrap"
                  >
                    <TextField
                      disabled={false}
                      slotProps={{
                        input: {
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: 30, width: textBoxWidth },
                        }
                      }}
                      sx={{ opacity: 1, transition: "all 1s ease-in" }}
                      autoComplete="off"
                      inputRef={(el) => {
                        if (!inputRefs.current[wordIndex]) {
                          inputRefs.current[wordIndex] = []; // Initialize the row array if it doesn't exist
                        }
                        inputRefs.current[wordIndex][letterIndex] = el;
                      }}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 1); // Only allow 1 character
                        e.target.value = val;
                        handleInputChange(e, wordIndex, letterIndex);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, wordIndex, letterIndex)}
                      />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          );
        })}

      </Stack>

      <Stack alignItems={'center'} justifyContent={'flex-start'} height={'100%'} marginTop={3} width={'75%'}>
        {toggleHint && <Link onClick={getHint} disabled={hintIndex >= letterTarget}>Hint</Link>}

        {!isWin &&
        <Button
        disabled={!toggleCheckAnswer}
        sx={{ margin: 2 }}
        onClick={checkAnswer}
        variant="contained"
        >
          Check Answer
        </Button>}
      </Stack>
      <Modal
        open={!!isWin}
        >
        <Stack height={'100%'} bgcolor={'#00000063'} justifyContent={'center'}>
            <MotionStack
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            bgcolor="#ffffffe0"
            width="100%"
            height="25vh"
            justifyContent="center"
            alignItems="center"
            >
            <Typography color="green" fontSize={30}><i className="fi fi-rr-laugh-beam"></i></Typography>
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">{`Answer: ${answer}`}</Typography>
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">CORRECT!</Typography>
            <Button onClick={next} variant="contained">Continue</Button>
            </MotionStack>
        </Stack>
      </Modal>
      <Modal
        open={!!wrongAnswer}
        >
        <Stack height={'100%'} bgcolor={'#00000063'} justifyContent={'center'}>
            <MotionStack
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              bgcolor="#ffffffe0"
              width="100%"
              height="33vh"
              justifyContent="center"
              alignItems="center"
            >
            <Typography color="blue" fontSize={30}><i className="fi fi-rs-face-sad-sweat"></i></Typography>
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">{`Sorry! Your answer:`}</Typography>
            {inputLetters?.length && <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">{`"${inputLetters.toLowerCase()}"`}</Typography>}
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">Is incorrect!</Typography>
            <Button onClick={() => setWrongAnswer(false)} variant="contained">Try again</Button>
            </MotionStack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TextBoxes;