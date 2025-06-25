import { useEffect, useRef, useState, useMemo } from "react";
import { Stack, Typography, Button, CircularProgress } from "@mui/material";
import useGlobalStore from "../../../business/useGlobalStore";

const SixPicsVideoPlayer = ({
  level,
  setLevelScore,
  levelScore,
  index,
  next,
  setShowGiveUp,
  showGiveUp,
  isWin,
  setAlertContent,
  width,
  height, 
  giveUp, 
  setGiveUp
}) => {

  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const screen = useGlobalStore((state) => state.screen)

  const [stage, setStage] = useState(0);
  const [start, setStart] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false)
  const [vidStyle, setVidStyle] = useState(
    {
      boxShadow: "4px 2px 10px 1px #00000038", 
      padding: 1, 
      marginBlock: 10,
      width: '80%',
      height: '70%',
    }
  )

  // console.log('level', level)
  // console.log('level stops', level.stops)
  // console.log('level loops', level.loops)
  // console.log(width, height)
  // console.log('giveup', giveUp)

  useEffect(() =>{
    // console.log(isWin)
  }, [isWin])
 
  const stages = useMemo(() => {
    if (!level?.stops?.length || !level?.loops?.length) return [];
  
    const stages = [];
  
    // Always start with a play from 0 to the first stop
    if (level.stops[0] !== undefined) {
      stages.push({ type: "play", from: 0, to: level.stops[0] });
    }
  
    // Dynamically interleave loop/play pairs as long as valid data exists
    const loopCount = Math.min(level.loops.length, Math.floor(level.stops.length / 2));
  
    for (let i = 0; i < loopCount; i++) {
      const loop = level.loops[i];
      const playFrom = level.stops[i * 2 + 1];
      const playTo = level.stops[i * 2 + 2];
  
      if (loop?.start !== undefined && loop?.end !== undefined) {
        stages.push({ type: "loop", from: loop.start, to: loop.end });
      }
  
      if (playFrom !== undefined && playTo !== undefined) {
        stages.push({ type: "play", from: playFrom, to: playTo });
      }
    }
  
    // console.log(levelScore)
    return stages;
  }, [level]);
  

  // console.log('stages length', stages.length)

  // Apply score penalty when user clicks "Next" during a loop
  const handleNext = () => {
    setShowGiveUp(false);
    setLevelScore((prev) =>
      prev.map((entry) =>
        entry.level === index
          ? {
              ...entry,
              score: parseInt((entry.score - 100 / 3).toFixed(0), 10)
            }
          : entry
      )
    );

    videoRef.current?.pause();
    setStage(prev => {
      const nextStage = prev + 1;
      return nextStage < stages.length ? nextStage : prev;
    });;
  };

  // Trigger Give Up effect
  useEffect(() => {
    if (giveUp) {
      setLevelScore((prev) =>
        prev.map((entry) =>
          entry.level === index ? { ...entry, score: 0 } : entry
        )
      );
    }
  }, [giveUp, index, setLevelScore]);

  // Handle start of playback
  useEffect(() => {
    // console.log('start', start, 'videoref.current', videoRef.current, 'stages', stages)  
    if (!start || !videoRef.current || !stages.length || !stages[stage]) return;
    
    const { from } = stages[stage];
    videoRef.current.currentTime = from; 

    videoRef.current.play().catch((err) => {
      console.warn("Autoplay failed:", err);
    });

  const check = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    const { type, from, to } = stages[stage];

    // console.log(stage+1, stages?.length)
    // console.log('isPaused', videoRef?.current.paused)
    setIsPlaying(true)

    if(stage +1 === stages?.length){
      // videoRef.current.pause();
      setShowGiveUp(true)
      setDisableNext(true)
      setIsPlaying(false);
      return
    }

    if (type === "play") {
      if (current >= to) {
        const nextStage = stage + 1;
        if (nextStage >= stages.length) {
          videoRef.current.pause();
          setShowGiveUp(true);
          setDisableNext(true);
          setIsPlaying(false);
        } else {
          setStage(nextStage);
        }
        return;
      }
    } else if (type === "loop") {
      if (from === to) {
        // Degenerate loop: pause and wait for player to click "Next"
        videoRef.current.pause();
        videoRef.current.currentTime = from;
        setDisableNext(false); // allow user to continue
        setIsPlaying(false);
        // setTimeout(() => {
        //   setShowGiveUp(true);
        // }, 2000);
        return; // stop frame loop
      }

      if (current >= to) {
        videoRef.current.currentTime = from;
      }
    }

    frameRef.current = requestAnimationFrame(check);
  };



    frameRef.current = requestAnimationFrame(check);

    return () => {
      setIsPlaying(false)
      cancelAnimationFrame(frameRef.current);
    };
  }, [start, stage, stages, setShowGiveUp]);

  // Enable Next button for loops only
  useEffect(() => {
      const currentStage = stages[stage];
    if (!currentStage) return;

    if (currentStage.type === "loop") {
      setDisableNext(false);
    } else {
      const playing = videoRef.current?.paused || videoRef.current?.ended;
      setDisableNext(!!playing);
    }
  }, [stage, stages]);

  // Toggle Give Up button visibility
  useEffect(() => {
    setGiveUp(false); // reset giveUp on every stage
  }, [stage]);

  useEffect(() => {
    if (showGiveUp) {
      setGiveUp(false); // reset state to allow "Give Up" UI to show again
    }
  }, [showGiveUp]);

  useEffect(() => {
    // console.log(isWin)
    if(isWin){
      setShowGiveUp(false)
      setDisableNext(true)
    } else {
      setShowGiveUp(false)
      setDisableNext(false)
    }
  }, [isWin])

  useEffect(()=>{
    if(screen === 'xl'){
      setVidStyle(prev => ({
        ...prev, 
        width: 'auto', 
        height: '75%',
      }))
    }
  }, [screen])


  return (
    <Stack backgroundColor="white" justifyContent="center" alignItems="center" height={height * .33} width={screen === 'xs' ? width * 0.95 : '50%'}>
      <Stack
        width={"100%"}
        height="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ opacity: isLoaded ? 1 : 1}}
      >
        <video
          ref={videoRef}
          preload="metadata"
          muted
          playsInline
          style={vidStyle} 
          onLoadedMetadata={(e) => {
            e.target.currentTime = 0;
          }}
          onCanPlay={() => {
            setIsLoaded(true)}}
        >
          <source src={level?.public_url} type="video/mp4" />
        </video>

      <Stack width="100%" minHeight="37px" justifyContent="center" alignItems="center" direction={'row'}>
        {!start && (
          <Button disabled={!!isWin || isPlaying} onClick={() => setStart(true)} variant="contained">
            <i className="fi fi-sr-play-pause"></i>
          </Button>
        )}

        {start && !giveUp && !showGiveUp && (
          <Button disabled={disableNext || isPlaying} onClick={handleNext} variant="contained">
            <i className="fi fi-sr-play-pause"></i>
          </Button>
        )}

        {showGiveUp && !giveUp && (
          <Button  disabled={!!isWin} onClick={() => setGiveUp(true)} variant="outlined" sx={{backgroundColor: '#880202'}}>
            Give Up
          </Button>
        )}

        {giveUp && (
          <Button
            onClick={() => {
              next();
              setShowGiveUp(false);
            }}
            variant="contained"
          >
            Continue
          </Button>
        )}
      </Stack>


      </Stack>




      {!isLoaded &&<Stack width="100%" height="100%" justifyContent="center" alignItems="center" position="absolute">
        <CircularProgress size={24} />
      </Stack>}
    </Stack>
  );
};

export default SixPicsVideoPlayer;
