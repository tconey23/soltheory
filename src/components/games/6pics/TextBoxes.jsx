import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import useGlobalStore from "../../../business/useGlobalStore";

const MotionStack = motion(Stack);

const TextBoxes = ({ answer, setWins, next, levelScore, index, setShowGiveUp, wins }) => {
  const [inputLetters, setInputLetters] = useState([]);
  const [letterCount, setLetterCount] = useState(0);
  const [letterTarget, setLetterTarget] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [autoAnswer, setAutoAnswer] = useState(false);
  const [toggleCheckAnswer, setToggleCheckAnswer] = useState(false);

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
    setToggleCheckAnswer(letterCount === letterTarget);
  }, [letterCount, letterTarget]);

  const handleRightAnswer = () => {
    setIsWin(true);
    setShowGiveUp(false);
  };

  const handleWrongAnswer = () => {
    setIsWin(false);
    setShowGiveUp(true);
  };

  const checkAnswer = () => {
    const ans = answer.replaceAll(" ", "").toLowerCase();
    const check = inputLetters.toLowerCase();
    check === ans ? handleRightAnswer() : handleWrongAnswer();
  };

  const handleInputChange = (event, wordIndex, letterIndex) => {
    const { value } = event.target;

    setLetterCount(prev => {
      const current = inputRefs.current[wordIndex][letterIndex]?.value || "";
      if (current === "" && value !== "") return prev + 1;
      if (current !== "" && value === "") return prev - 1;
      return prev;
    });

    // Rebuild full input string
    const letters = [];
    inputRefs.current.forEach((w) => {
      letters.push(...w.map((t) => t?.value || ""));
    });
    setInputLetters(letters.join("").replaceAll(",", ""));

    // Auto-advance focus
    if (value.length === 1 || value === " ") {
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

  const isLocked = levelScore?.[index]?.score === 0;

  return (
    <Stack direction="row" width="100%" justifyContent="center" flexWrap="wrap" id="letter_wrapper">
      {isWin && (
        <MotionStack
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          bgcolor="#00000082"
          width="100%"
          height="25vh"
          justifyContent="center"
          alignItems="center"
        >
          <Typography fontSize={25} fontFamily="Fredoka Regular">{`Answer: ${answer}`}</Typography>
          <Typography fontSize={25} fontFamily="Fredoka Regular">CORRECT!</Typography>
          <Button onClick={next} variant="contained">Continue</Button>
        </MotionStack>
      )}

      {!isWin &&
        words.map((word, wordIndex) => {
          if (!inputRefs.current[wordIndex]) {
            inputRefs.current[wordIndex] = [];
          }

          return (
            <Stack key={`word-${wordIndex}`} userData="word_wrapper">
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
                      value={isLocked ? letter : undefined}
                      disabled={isLocked}
                      sx={{ opacity: 1, transition: "all 1s ease-in" }}
                      autoComplete="off"
                      inputRef={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                      onChange={(e) => handleInputChange(e, wordIndex, letterIndex)}
                      onKeyDown={(e) => handleKeyDown(e, wordIndex, letterIndex)}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", fontSize: 30, width: 40 },
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          );
        })}

      <Button
        disabled={!toggleCheckAnswer}
        sx={{ margin: 4 }}
        onClick={checkAnswer}
        variant="contained"
      >
        Check Answer
      </Button>
    </Stack>
  );
};

export default TextBoxes;