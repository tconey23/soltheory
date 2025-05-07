import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button} from "@mui/material";
import SixPicsVideoPlayer from "./SixPicsVideoPlayer";
import TextBoxes from "./TextBoxes";


const Stage = ({handleGoToSlide, level, setLevels, levels, setGameOver}) => {
    const [vidDur, setVidDur] = useState(null)
  
    const [start, setStart] = useState(false);
    const [giveUp, setGiveUp] = useState(false)
  
    const [inputLetters, setInputLetters] = useState();
    const [answer, setAnswer] = useState("cat on a hot tin roof");
    const [isWin, setIsWin] = useState(false);
    const [letterCount, setLetterCount] = useState(0);
    const [drawNum, setDrawNum] = useState(1)
    const [animTextNum, setAnimTextNum] = useState(0)
    const [levelScore, setLevelScore] = useState(100)
    
    const inputRefs = useRef([]);
    const videoRef = useRef(null);
  
  
    useEffect(() => {
      if (!giveUp && level.level != null) {
        let target = levelScore;
    
        switch (drawNum) {
          case 1:
            target = 100;
            break;
          case 2:
            target = levelScore - 34;
            break;
          case 3:
            target = levelScore - 33;
            break;
          default:
            return;
        }
    
        const interval = setInterval(() => {
          setLevelScore(prev => {
            if (prev > target) {
              return prev - 1;
            } else {
              clearInterval(interval);
              return prev; // return current value to avoid undefined
            }
          });
        }, 50);
    
        return () => clearInterval(interval);
      }
  
      if(giveUp){
        let target = 0
        const interval = setInterval(() => {
          setLevelScore(prev => {
            if (prev > target) {
              return prev - 1;
            } else {
              clearInterval(interval);
              return prev;
            }
          });
        }, 50);
    
        return () => clearInterval(interval); 
      }
  
  
    }, [drawNum, giveUp]);
     
    useEffect(() => {
      console.log(level, levels)
    }, [level, levels])
  
    useEffect(() => {
      if (level) {
        setAnswer(level.answer);
      }
    }, [level]);
  
    useEffect(() => {
      if (answer) {
        setLetterCount(answer.replaceAll(" ", "").split("").length);
      }
    }, [answer]);
  
    useEffect(() => {
      if (start && inputRefs.current[0]?.[0]) {
        inputRefs.current[0][0].focus();
      }
    }, [start]);
  
    useEffect(() => {
      let inputLength;
      if (inputLetters && videoRef?.current) {
  
      }
    }, [inputLetters, videoRef]);
  
  
    const getDuration = async () => {
      const res = await getVideoDuration(level.url)
      setVidDur(res)
    }
  
    useEffect(() => {
      if(videoRef?.current && start){
        videoRef?.current.play()
      }
    }, [start, videoRef])
  
    useEffect(() => {
      if (animTextNum < letterCount) {
        const timeout = setTimeout(() => {
          setAnimTextNum(prev => prev + 1);
        }, 200);
    
        return () => clearTimeout(timeout);
      }
    }, [animTextNum, letterCount]);
  
    useEffect(() => {
      getDuration()
    }, []);
  
    const handleNextLevel = async (dir, score) => {
      let levelCount = levels.length-1
      
      if(level.level < levelCount){
        handleGoToSlide(dir, score)
      } else {
        console.log('end')
        handleGoToSlide('end', score)
      }
    }
  
    return (
      <>
  
        <Stack>
            <SixPicsVideoPlayer videoRef={videoRef} level={level} levelScore={levelScore} setLevelScore={setLevelScore}/>
        </Stack>

        <Stack>
            <TextBoxes answer={answer}/>
        </Stack>
        
          {isWin && 
            <Stack width={'100%'} alignItems={'center'} justifyContent={'center'}>
              <Stack width={'25%'}>
                <Typography fontSize={60}>Correct!</Typography>
                <Button onClick={() => handleNextLevel('next', levelScore)} variant="contained">Next</Button>
              </Stack>
            </Stack>
      }
      </>
    );
  };

  export default Stage