import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button} from "@mui/material";
import { addGameToUser, getGifs } from "../../business/apiCalls";
import { useNavigate } from "react-router-dom";
import SixPicsPacks from "./SixPicsPacks";
import { useGlobalContext } from "../../business/GlobalContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ResultsPage = ({score, gamePack}) => {
  const {alertProps, setAlertProps, user} = useGlobalContext()
  const nav = useNavigate()

  const handleSaveGame = async () => {

    const gameDataObject = {
      game: 'SixPics',
      pack: gamePack,
      score: score,
      date_played: Date.now()
    }
    
    const res = addGameToUser(user.user,gameDataObject)
    console.log(res)
    
    nav('/games')
  }

  return (
    <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
      <Stack width={'100%'} height={'100%'}>
        <Typography fontSize={50}>{gamePack}</Typography>
        <Typography fontSize={40}>Your Score</Typography>
        <Typography fontSize={35}>{score}</Typography>
      </Stack>
      <Stack width={'10%'}>
        <Button disabled={!user} onClick={() => handleSaveGame()} variant="contained">{user ? 'Save' : 'Login to save'}</Button>
      </Stack>
    </Stack>
  )
}

const getVideoDuration = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      resolve(video.duration); // Duration in seconds
      video.remove(); // Clean up the video element
    };

    video.onerror = () => {
      reject("Error loading video metadata.");
    };
  });
};

const Stage = ({handleGoToSlide, level, setLevels, levels, setGameOver}) => {
  const {alertProps, setAlertProps, isMobile} = useGlobalContext()
  const [score, setScore] = useState(100);
  const [currTime, setCurrTime] = useState(10);
  const [vidDur, setVidDur] = useState(null)
  const [start, setStart] = useState(false);
  const [inputLetters, setInputLetters] = useState();
  const [answer, setAnswer] = useState("cat on a hot tin roof");
  const [isWin, setIsWin] = useState(false);
  const [letterCount, setLetterCount] = useState(0);
  const [checkTime, setCheckTime] = useState(1)
  const [drawNum, setDrawNum] = useState(1)
  const [pauseTime, setPauseTime] = useState()
  const [giveUp, setGiveUp] = useState(false)
  const [toggleGiveUp, setToggleGiveUp] = useState(false)
  const [disableNext, setDisableNext] = useState(false)
  const [animTextNum, setAnimTextNum] = useState(0)
  const [levelScore, setLevelScore] = useState(100)
  
  const inputRefs = useRef([]);
  const videoRef = useRef(null);

  useEffect(() => {
    if(currTime == pauseTime && videoRef.current) {
      videoRef.current.pause()
    } 
  }, [currTime, pauseTime, videoRef])

  useEffect(() => {
    if(videoRef.current && start && vidDur) {
      let curr = videoRef.current.currentTime
      let pauseAt 

      let paused = videoRef.current.paused
      let ended = videoRef.current.ended
      let atEnd = curr.toFixed(0) == vidDur

      const isPlaying = 
        !paused &&
        !ended &&
        !atEnd
        ;

        setDisableNext(isPlaying)

      if(drawNum < 3){
        pauseAt = vidDur / 3 * drawNum
      } else {
        pauseAt = vidDur
      }
      
      if(curr < vidDur) {
        setCheckTime(prev => prev +1)
        setCurrTime(curr.toFixed(1))
        setPauseTime(pauseAt.toFixed(1))
      }
      
      if(curr.toFixed(0) == vidDur) {
        setDisableNext(true)
        setTimeout(() => {
          setToggleGiveUp(true)
        }, 2000);
      }

    }
  }, [videoRef, start, vidDur, currTime, checkTime])

  const handleNext = () => {
    if(videoRef && videoRef.current){
      setDrawNum(prev => prev +1)
      setStart(true)
      videoRef.current.play()
    }
  }

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
            return prev; // return current value to avoid undefined
          }
        });
      }, 50);
  
      return () => clearInterval(interval); 
    }


  }, [drawNum, giveUp]);
   

  useEffect(() => {
    if (level) {
      setAnswer(level.answer);
      // console.log(level)
    }
  }, [level]);

  useEffect(() => {
    if (answer) {
      // console.log(answer)
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
    if (inputLetters && videoRef.current) {

    }
  }, [inputLetters]);


  const getDuration = async () => {
    const res = await getVideoDuration(level.url)
    setVidDur(res)
  }

  useEffect(() => {
    if(videoRef.current){
      // console.log(videoRef.current.autoplay)
    }

    if(videoRef.current && start){
      videoRef.current.play()
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

  useEffect(() => {
    if(inputRefs.current){
        // console.log(inputRefs)
    }
  }, [inputRefs, inputLetters])

  const handleInputChange = (event, wordIndex, letterIndex) => {
    const { value } = event.target;

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


  const checkAnswer = () => {
    let ans = answer.replaceAll(' ','').toLowerCase()
    let check = inputLetters
    check === ans ? setIsWin(true) : setIsWin(false)
    console.log(check === ans)
  }

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
        <Stack backgroundColor={"white"} justifyContent={'center'} alignItems={'center'}>
          <Typography>{`Points ${levelScore}/100`}</Typography>
            <Stack width={'45%'} height={'45%'} justifyContent={'center'} alignItems={'center'}>
              <video
                style={{boxShadow: '4px 2px 10px 1px #00000038', padding: 1}}
                ref={videoRef}
                width="80%"
                height="80%"
                preload="metadata"
                mute
              >
                <source src={level.url} type="video/mp4"/>
              </video>
            </Stack>
          {start && !toggleGiveUp && <Button disabled={disableNext} onClick={handleNext}>Next</Button>}
          {toggleGiveUp && !giveUp && <Button onClick={() => setGiveUp(true)}>Give Up</Button>}
          {!start && <Button onClick={() => setStart(true)}>Start</Button>}
        </Stack>

    
        <>
          <Stack direction={"row"} width={"100%"} justifyContent={"center"} flexWrap={'wrap'}>
            {answer.split(" ").map((word, wordIndex) => {
              inputRefs.current[wordIndex] = [];
              
              return (
                <Stack  key={wordIndex} justifyContent={"center"} alignItems={'center'} direction={"row"} marginLeft={0} marginBottom={0} padding={1}>
                  {word.split("").map((letter, letterIndex) => {

                    return (
                    <Stack id='textbox-wrapper' key={letterIndex} marginLeft={0} direction={"row"} justifyContent={"center"} alignItems={'center'}  flexWrap={'wrap'}>
                        {!giveUp 
                        ? <TextField
                          id='textbox'
                          disabled={giveUp}
                          sx={{opacity: animTextNum > letterIndex ? 1 : 0, transition: 'all 1s ease-in'}}
                          autoComplete="off"
                          inputRef={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                          onChange={(event) =>
                            handleInputChange(event, wordIndex, letterIndex)
                          }
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: "center", fontSize: 30, width: 40 }
                          }}
                        /> 
                        : <TextField
                        value={letter}
                        disabled={giveUp}
                        sx={{opacity: animTextNum > letterIndex ? 1 : 0, transition: 'all 1s ease-in'}}
                        autoComplete="off"
                        inputRef={(el) => (inputRefs.current[wordIndex][letterIndex] = el)}
                        onChange={(event) =>
                          handleInputChange(event, wordIndex, letterIndex)
                        }
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: 30, width: 40 }
                        }}
                      />
                        }
                    </Stack>
                  )})}
                </Stack>
              );
            })}
          </Stack>

          <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
            {inputLetters?.length === letterCount && !isWin && <Button onClick={() => checkAnswer()} variant='contained'>Check Answer</Button>}
          </Stack>
        </> 
      
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


const Pic6 = ({user}) => {
  const {alertProps, setAlertProps} = useGlobalContext()
  const [gamePack, setGamePack] = useState(null)
  const [gifIndex, setGifIndex] = useState(0)
  const [levels, setLevels] = useState([])
  const [refKey, setRefKey] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const sliderRef = useRef(null)

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setGifIndex(next),
    slickGoTo: gifIndex
  };

  const fetchGifs = async (name) => {
    const res = await getGifs(name)
    if(res && res?.videos){
      // const gifs = JSON.parse(res.videos[0])
      res.videos.forEach((l, i) => {
        console.log(l['answer'])
        setLevels(prev => [
          ...prev,
          {
            level: i,
            score: 100,
            url: l.public_url,
            answer: l.answer
          }
        ])
      })
    }
  }

  const handleGoToSlide = (dir, score) => {

    if(gifIndex < levels.length-1) {
      if(dir === 'next') {
        let nextIndex = gifIndex +1
        setGifIndex(prev => prev +1);
        sliderRef.current?.slickGoTo(nextIndex);
        setTotalScore(prev => prev + score)
      }

      if(dir === 'prev') {
        let nextIndex = gifIndex -1
        setGifIndex(prev => prev -1);
        sliderRef.current?.slickGoTo(nextIndex);
      }

      
    } 
    
    if(dir === 'end'){
      setTotalScore(prev => prev + score)
      setGifIndex(0)
      sliderRef.current?.slickGoTo(0)
      setGameOver(true)
    }

  };

  const resetGame = () => {
    setGifIndex(0)
    setLevels([])
    fetchGifs(gamePack)
  }


  useEffect(() => {
    resetGame()
  }, [refKey])

  useEffect(() => {
    if(gamePack)
      {
        fetchGifs(gamePack)
      }
  }, [gamePack])

  useEffect(() => {
    if(gameOver, sliderRef.current){
      sliderRef.current?.slickGoTo(levels.length)
    }
  }, [gameOver, sliderRef])


  return (
    <Stack
      direction={"column"}
      key={refKey}
      sx={{ height: "100%", width: "100%" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >

      {gamePack && 
      <Stack direction={'row'} height={'6%'} width={'100%'} marginBottom={0} alignItems={'center'} justifyContent={'space-around'}>
        <Typography>{`Level ${gifIndex +1}`}</Typography>
        <Button onClick={() => setRefKey(prev => prev +1)}>Start over</Button>
        <Typography sx={{width: 100}}>{`Total Score: ${totalScore}`}</Typography>
      </Stack>}

      {
        levels.length > 0 
          ? <Stack height={'75%'} width={'100%'} sx={{scale: 0.9}} alignItems={'center'} justifyContent={'space-around'}>
            <Slider ref={sliderRef} {...settings} style={{width: '100%', height: '100%'}}>
              {levels.map((l) => (
              <Stack justifyContent={'center'} alignItems={'center'}>
                <Stage 
                  handleGoToSlide={handleGoToSlide} 
                  level={l}
                  levels={levels}
                  setLevels={setLevels}
                  setGameOver={setGameOver}
                />
              </Stack>
              ))}
              {gameOver && <ResultsPage score={totalScore} user={user} gamePack={gamePack}/>}
            </Slider>
          </Stack>
        :  
        <Stack justifyContent={'flex-start'}>
          <SixPicsPacks setGamePack={setGamePack} gamePack={gamePack}/>
        </Stack>
      }
    </Stack>
  );
};

export default Pic6;

