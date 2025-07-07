import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, Modal, Slider, Box } from "@mui/material";
import { motion } from "framer-motion";
import useGlobalStore from "../../../business/useGlobalStore";
import { Link } from "react-router-dom";

const MotionStack = motion(Stack);

const TextBoxes = ({ answer, setWins, next, levelScore, index, setShowGiveUp, wins, isWin, setIsWin, setLevelScore, width, height, totalScore, giveUp, forceRefresh, setLevelsPlayed, isDemo}) => {
  const [inputLetters, setInputLetters] = useState([]);
  const [letterCount, setLetterCount] = useState(0);
  const [letterTarget, setLetterTarget] = useState(0);
  const [autoAnswer, setAutoAnswer] = useState(false);
  const [toggleCheckAnswer, setToggleCheckAnswer] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [toggleHint, setToggleHint] = useState(true)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [nextFocusIndex, setNextFocusIndex] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0)
  const [moreHints, setMoreHints] = useState(false)
  const [reloadHints, setReloadHints] = useState(0)


  const screen = useGlobalStore((state) => state.screen);
  const userMeta = useGlobalStore((state) => state.userMeta)
  const inputRefs = useRef([]);

  const parsedAnswer = answer.split("");
  const wordChunks = answer.match(/[\w']+|[^\w\s]/g);

  const cleanedChars = answer
  .split("")
  .filter((char) => /[a-z0-9]/i.test(char));

useEffect(() => {
  const cleaned = answer.replace(/[^\w]|_/g, ""); // remove punctuation and spaces
  setLetterTarget(cleaned.length);
}, [answer]);

  // Auto win logic
  useEffect(() => {
    if (autoAnswer){
      setIsWin(true)
    };
  }, [autoAnswer, answer, inputLetters]);

  useEffect(() =>{
    if(isDemo){
      setAutoAnswer(false)
    }
  }, [isDemo])

  useEffect(() => {
    if (isWin) {
      setWins(prev => prev + 1);
    }
  }, [isWin]);

  useEffect(() => {
    // console.log(
    //   `
    //   letterCount = ${letterCount}
    //   letterTarget = ${letterTarget}
    //   `
    // )
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

  console.log(levelScore)

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

  console.clear()

  // console.log('hint button clicked!')

  currentStep = 'getHint() function init'
  // console.log('start getHint()')

  if (isWin || giveUp) return;

  currentStep = 'checking for isWin or giveUp'
  // console.log('not isWin or giveUp')

  currentStep = 'checking inputLetters.length'
  // console.log(`input letters length ${inputLetters?.length}`)

  for (let i = 0; i < inputLetters.length; i++) {
    currentStep = 'checking that index is valid'
    // console.log(`index is ${i}`)

    if (!inputLetters[i]) {
      currentStep = 'getting the correctLetter'
      const correctLetter = cleanedChars[i];


      currentStep = 'checking for valid cleaned letter at index'
      // console.log(`Cleaned letter at ${i} is ${cleanedChars[i]}`)

      currentStep = 'checking for valid correctLetter'
      // console.log(`Correct letter is ${correctLetter}`)

      if (!correctLetter) return;

      // console.log('no valid correctLetter!')

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

      // Focus next empty input
      setTimeout(() => {
        const nextRef = inputRefs.current[i + 1];
        if (nextRef) nextRef.focus();
      }, 0);

      // console.log('Setting hint at index', i, 'to', correctLetter);

      setHintsUsed(prev => prev +1)

      return;
    }
  }

  // console.log(`Something went wrong and the function returned early while **${currentStep.toUpperCase()}**`)

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

const handleCharInput = (e, index) => {
  const val = e.target.value.toLowerCase().slice(0, 1);
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


const handleCharBackspace = (e, index) => {
  if (e.key === "Backspace") {
    // If current box has a letter, just clear it
    if (inputLetters[index]) {
      const newLetters = [...inputLetters];
      newLetters[index] = "";
      setInputLetters(newLetters);
      setLetterCount(newLetters.filter(Boolean).length);
    }
    // If current box is empty, move focus and clear previous box
    else if (inputRefs.current[index]?.value === "") {
      const prev = inputRefs.current[index - 1];
      if (prev) prev.focus();
      if (index > 0) {
        const newLetters = [...inputLetters];
        newLetters[index - 1] = "";
        setInputLetters(newLetters);
        setLetterCount(newLetters.filter(Boolean).length);
      }
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

    console.log(calculatedTextBoxWidth)

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

  let cleanedIndex = 0;

  console.log(userMeta)

  return (
    <Stack direction="column" width="90%" justifyContent="center" alignItems={'center'} sx={{scale: 0.90}}>
    <Stack 
      direction="row"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      padding={1}
      id="letter_wrapper"
      height={height * 0.33}
      overflow="auto"
      sx={{
        gap: 1,
        rowGap: 1.5,
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
          sx={{ whiteSpace: 'nowrap' }} // prevent internal wrap
        > 
          {word.split("").map((char, charIndex) => {
      const isAlphaNum = /[a-z0-9]/i.test(char);

      if (isAlphaNum) {
        const currentIndex = cleanedIndex++;
        return (
            <TextField
              key={`char-${wordIndex}-${charIndex}`}
              value={inputLetters[currentIndex] || ""}
              inputRef={(el) => (inputRefs.current[currentIndex] = el)}
              onChange={(e) => handleCharInput(e, currentIndex)}
              onKeyDown={(e) => handleCharBackspace(e, currentIndex)}
              slotProps={{
                input: {
                  maxLength: 1,
                  style: { textAlign: "center", fontSize: "1rem", width: textBoxWidth },
                },
              }}
              sx={{ marginX: 0.25, transition: "all 0.3s" }}
              autoComplete="off"
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
                >
                  {char}
                </Typography>
              )
            }
          })}
        </Stack>
      ))}

    </Stack>

      <Stack alignItems={'center'} justifyContent={'flex-start'} height={'100%'} marginTop={3} width={'75%'}>
        {<Link onClick={() => {
          if(levelScore[index]?.hints > 0){
            getHint()
          } else {
            setMoreHints(true)
          }
        }} disabled={hintIndex >= letterTarget}>{levelScore[index]?.hints > 0 ? `Hint (${levelScore[index]?.hints})` : 'Get more hints'}</Link>}

        {!isWin && !giveUp &&
        <Button
          disabled={!toggleCheckAnswer}
          sx={{ margin: 2 }}
          onClick={checkAnswer}
          variant="contained"
        >
          Check Answer
        </Button>}
        {!giveUp && userMeta?.is_admin && <Link onClick={() => setIsWin(true)}>Skip</Link>}
        {/* {!giveUp && <Link onClick={() => handleClear()}>Clear</Link>} */}
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
            <Button onClick={() => {
              next()
              setLevelsPlayed(prev => prev +1)
            }} variant="contained">Continue</Button>
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
            {inputLetters?.length > 0 && (
              <Typography>
                {`"${inputLetters.join('').toLowerCase()}"`}
              </Typography>
            )}
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">Is incorrect!</Typography>
            <Button onClick={() => setWrongAnswer(false)} variant="contained">Try again</Button>
            </MotionStack>
        </Stack>
      </Modal>
      <Modal 
        open={!!moreHints}
      >
        <Stack height={'100%'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Stack height={'30%'} width={'75%'} bgcolor={'white'} justifyContent={'center'} alignItems={'center'} borderRadius={2}>
            {levelScore[index]?.score > longestWord && !levelScore[index]?.reloadedHints &&
              <>              
                <Typography textAlign={'center'} fontFamily={'fredoka regular'} fontSize={18}>{levelScore[index]?.score > longestWord ? `You can reload a maximum of ${Math.floor(longestWord /2)} hints.`: 'You cannot afford to reload points for this level'}</Typography>
                <Typography textAlign={'center'} fontFamily={'fredoka regular'} fontSize={15}>{`Additional hints will count against your total score`}</Typography>
                <Typography marginTop={'10px'} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={15}>{`Are you sure you want to get ${reloadHints} more hints?`}</Typography>
                <Box sx={{width: '75%', display: 'flex', flexDirection: 'column'}}>
                  <Slider min={1} max={Math.floor(longestWord /2)} step={1} valueLabelDisplay={true} value={reloadHints} onChange={(e) => setReloadHints(e.target.value)}/>
                  <Button disabled={reloadHints > 0} onClick={() => getMoreHints(reloadHints)}>Reload!</Button>
                </Box>
              </>
            }

            {levelScore[index]?.reloadedHints &&
            <>
              <Typography marginX={2} marginY={'10px'} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={18}>{`You can only reload hints once per level`}</Typography>
              <Box sx={{width: '75%', display: 'flex', flexDirection: 'column'}}>
                <Button onClick={() => setMoreHints(false)}>Ok</Button>
              </Box>
            </>
            }
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TextBoxes;