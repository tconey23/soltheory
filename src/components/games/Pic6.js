import { useState, useRef, useEffect } from "react";
import { Stack, Typography, TextField, Button, Slider } from "@mui/material";
import lambGif from "../../assets/silence_of_the_lambs.gif";
import { getGifs } from "../../business/apiCalls";
import { useLocation } from "react-router-dom";
import SixPicsPacks from "./SixPicsPacks";

const Countdown = ({setStart}) => {

  const [ref, setRef] = useState(0)
  const videoRef=useRef()

  useEffect(() => {

    
    if(videoRef.current && !videoRef.current.ended){

      try {
        videoRef.current.play()
        videoRef.current.playbackSpeed = 0.25
      } catch (error) {
          console.error(error);
          
      }
    }
    
    if(videoRef.current && !videoRef.current.paused){
      setRef(prev => prev +1)
    }

    if(videoRef.current && videoRef.current.ended){
      setStart(true)
    }
  }, [videoRef, ref])

  return (
    <Stack height={'50vh'} width={'100%'}>
      <Typography fontSize={80}>Get ready!</Typography>
      <video style={{height: '100%', width: '100%'}} ref={videoRef} mute autoplay
      preload="metadata"
      onLoadedMetadata={() => {
        if(videoRef.current){
          videoRef.current.playbackRate = 0.75
        }
      }}
      >
        <source src={'https://tzzljniuogvssdbhxsql.supabase.co/storage/v1/object/public/6pics_videos//countdown.mp4'} type='video/mp4'/>
      </video>
      <Typography fontSize={10}><a href="https://www.flaticon.com/free-animated-icons/countdown" title="countdown animated icons">Countdown animated icons created by Freepik - Flaticon</a></Typography>
    </Stack>
  )
}

const interpolateColor = (startHex, endHex, progress) => {
  const start = parseInt(startHex.slice(1), 16);
  const end = parseInt(endHex.slice(1), 16);

  const r1 = (start >> 16) & 0xff, g1 = (start >> 8) & 0xff, b1 = start & 0xff;
  const r2 = (end >> 16) & 0xff, g2 = (end >> 8) & 0xff, b2 = end & 0xff;

  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `rgb(${r}, ${g}, ${b})`;
};

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

const Stage = ({ stage, setGifIndex, setTotalPoints, levels, gifIndex}) => {
  const [score, setScore] = useState(100);
  const [seconds, setSeconds] = useState(10);
  const [currTime, setCurrTime] = useState(10);
  const [vidDur, setVidDur] = useState(null)
  const [playbackSpeed, setPlayBackSpeed] = useState(null);
  const [sliderColor, setSliderColor] = useState("#00FF00");
  const [timerOpac, setTimerOpac] = useState(1);
  const [toggleTryAgain, setToggleTryAgain] = useState(false);
  const [start, setStart] = useState(false);
  const [inputLetters, setInputLetters] = useState();
  const [answer, setAnswer] = useState("Silence of the lambs");
  const [paused, setPaused] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [letterCount, setLetterCount] = useState(0);
  const [toggleAnswer, setToggleAnswer] = useState(false);
  const [ref, setRef] = useState(1)
  const [playTimes, setPlayTimes] = useState(0)
  const [allowPlayPause, setAllowPlayPause] = useState(true)

  const inputRefs = useRef([]);
  const videoRef = useRef(null);

  const playPause = async (vidref, type) => {
  if(allowPlayPause){
    setAllowPlayPause(false)
    if(type === 'play' && vidref.paused){
      await vidref.play()
      setAllowPlayPause(true)
      return
    } 
    
    if(type === 'pause' && !vidref.paused){
      await vidref.pause()
      setAllowPlayPause(true)
      console.log('done pausing')
      return
    }
  }

  }

  useEffect(()=>{
    if(videoRef.current && isWin){
      playPause(videoRef.current, 'pause')
      videoRef.current.currentTime = vidDur
    }
    if(isWin){
      setTotalPoints(prev => prev + parseFloat(score))
    }
  }, [isWin, videoRef])

  useEffect(() => {
    if(ref && videoRef.current && playbackSpeed && start && !isWin){
      let currTime = videoRef.current.currentTime / playbackSpeed
      let remTime = 10 - currTime
      setCurrTime(remTime)
      setRef(prev => prev +1)
    }
  }, [ref, videoRef, playbackSpeed, start, isWin])

  useEffect(() => {
    if (stage) {
      setAnswer(stage.answer);
    }
  }, [stage]);

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
    if (inputLetters && videoRef.current) {
      inputLength = inputLetters.length - 1;

      if (inputLetters[inputLength] === answer.replaceAll(" ", "").split("")[inputLength]) {
          playPause(videoRef.current, 'pause')
          setPaused(true)
      } else {
        videoRef.current.play()
      }
    }
  }, [inputLetters]);

  useEffect(()=>{
    if(paused){
      const interval = setInterval(() => {
        try {
          playPause(videoRef.current, 'play')
          setPaused(false)
          console.log('restarting')
            
        } catch (error) {
            console.error(error);
        }
      }, 2000)
      return () => (
        clearInterval(interval)
      )
    }
    if(videoRef.current && inputLetters?.length == letterCount){
      playPause(videoRef.current, 'pause')
    }
  }, [videoRef, start, isWin, inputLetters, letterCount, paused])

  useEffect(() => {
    if (currTime > 0) {
        let scr = currTime * 1 / 0.1;

        if(scr > 50){
          setScore(scr.toFixed(2));
        } else {
          setScore(50)
        }
    }
  }, [currTime]);

  useEffect(()=>{

    if (videoRef.current && start) {
      try {
        playPause(videoRef.current, 'play')
        setPlayTimes(prev => prev +1)
      } catch (error) {
          console.error(error);
          
      }
    }

  }, [start])

  useEffect(() => {
    const progress = 1 - currTime / seconds;
    setSliderColor(interpolateColor("#00FF00", "#FF0000", progress));
    if (currTime < 0) {
      setToggleTryAgain(true);
    }
  }, [currTime, seconds]);

  const getDuration = async () => {
    const res = await getVideoDuration(stage.url)
    setVidDur(res)
    setPlayBackSpeed(res / seconds)
  }

  useEffect(() => {
    getDuration()
  }, []);

  useEffect(() => {
    if (videoRef.current && playbackSpeed !== null) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleStartOver = () => {
    setScore(prev => prev /2)
    setToggleTryAgain(false)
  }

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
  }

  const handleNextLevel = () => {
    console.log(gifIndex, levels)
    if(gifIndex < levels -1 ){
      setGifIndex(prev => prev +1)
    }
  }

  return (
    <>
      <Stack width={"80%"}>
        <Slider
          sx={{
            "& .MuiSlider-thumb": { backgroundColor: sliderColor },
            "& .MuiSlider-track": { backgroundColor: sliderColor },
          }}
          value={currTime}
          max={seconds}
          aria-label={currTime.toFixed(0)}
        />
        <>
          {currTime > 0 && (
            <>
              <Typography sx={{ opacity: timerOpac }}>{`Remaing time: ${currTime.toFixed(0)} sec`}</Typography>
            </>
          )}
          {currTime > -1 && <Typography>{`Remaining points: ${score}`}</Typography>}
        </>
      </Stack>

      <Stack backgroundColor={"white"} height={'45%'}>
        {playbackSpeed && start && (
          <>
            <video
              ref={videoRef}
              width="640"
              height="75%"
              autoPlay
              mute
              preload="metadata"
              onLoadedMetadata={() => {
                if(videoRef.current){
                  videoRef.current.playbackRate = playbackSpeed
                }
              }}
            >
              <source src={stage.url} type="video/mp4"/>
            </video>
          </>
        )}
      </Stack>

      {!isWin ? (
        <>
          <Stack height={'100%'} width={"100%"} justifyContent="flex-start" alignItems="center">
            {!start &&
              <Countdown setStart={setStart}/>
             }
              {toggleTryAgain && 
                <Stack>
                  <Button onClick={() => handleStartOver()}>Try again</Button>
                </Stack>
            }
          </Stack>
          <Stack direction={"row"} width={"100%"} justifyContent={"center"} flexWrap={'wrap'}>
        {answer.split(" ").map((word, wordIndex) => {
          inputRefs.current[wordIndex] = [];
          
          return (
            <Stack  key={wordIndex} justifyContent={"center"} alignItems={'center'} direction={"row"} marginLeft={10} marginBottom={5}>
              {start && word.split("").map((letter, letterIndex) => (
                <Stack key={letterIndex} marginLeft={1} direction={"row"} justifyContent={"center"} alignItems={'center'}  flexWrap={'wrap'}>
                  {toggleAnswer ? (
                    <Typography fontSize={50}>{letter}</Typography>
                  ) : (
                    <TextField
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
                  )}
                </Stack>
              ))}
            </Stack>
          );
        })}
      </Stack>
      <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
        {inputLetters?.length === letterCount && <Button onClick={() => checkAnswer()} variant='contained'>Check Answer</Button>}
      </Stack>
      </> 
      ) : (
        <>
          <Stack>
            <Typography fontSize={60}>{answer.toUpperCase()}</Typography>
            <Typography fontSize={60}>Correct!</Typography>
            <Button onClick={() => handleNextLevel()} variant="contained">Next</Button>
          </Stack>
        </>
      )}
    </>
  );
};


const Pic6 = () => {
  const [gamePack, setGamePack] = useState(null)
  const [gifIndex, setGifIndex] = useState(0)
  const [gifs, setGifs] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [possPoints, setPossPoints] = useState(300)
  const [levels, setLevels] = useState(0)
  
  

  const fetchGifs = async (name) => {
    const res = await getGifs(name)
    if(res){
      setLevels(res.gifs.length)
      setGifs(res)
    }
  }

  useEffect(() => {
    if(gamePack)
      {
        console.log(gamePack)
        fetchGifs(gamePack)
      }
  }, [gamePack])

  useEffect(() => {
    console.log(gifs)
    if(gifs && gifs.gifs){
      console.log(gifs.gifs.length)
      setPossPoints(gifs.gifs.length *100)
    }
  }, [gifs])

  return (
    <Stack
      direction={"column"}
      // border={"1px solid black"}
      key={gifIndex}
      sx={{ height: "80%", width: "75%" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >

     {gifs && gifs.gifs && gifs.gifs.length > 0 && <Typography>{`${totalPoints.toFixed(0)} / ${possPoints}`}</Typography>}

    {
      gifs && gifs.gifs && gifIndex > -1 &&
      <Stage stage={gifs.gifs[gifIndex]} setGifIndex={setGifIndex} setTotalPoints={setTotalPoints} levels={levels} gifIndex={gifIndex}/>
    }

   {gifs && !gifs.gifs &&
    <>
      <SixPicsPacks setGamePack={setGamePack} gamePack={gamePack}/>
     </>  
    } 
    </Stack>
  );
};

export default Pic6;

