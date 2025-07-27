import { useEffect, useRef, useState, useMemo } from "react";
import { Stack, Button, CircularProgress, Typography, Box } from "@mui/material";
import useGlobalStore from "../../../business/useGlobalStore";
import ReactPlayer from 'react-player'
import LoadingAnimation from "../../../ui_elements/LoadingAnimation";

const SixPicsVideoPlayer = ({
  level,
  width,
  height, 
  setShowGiveUp,
  showGiveUp,
  setGiveUp,
  giveUp,
  next,
  setGameOver,
  setLevelsPlayed,
  setLevelScore,
  levelScore,
  levelsPlayed,
  levels,
  setEnablePlay,
  enablePlay,
  attempts, 
  setAttempts,
  playStage,
  setPlayStage,
  stage,
  setStage
}) => {
  const videoRef = useRef(null);
  const screen = useGlobalStore((state) => state.screen);
  const userMeta = useGlobalStore((state) => state.userMeta)
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false)
  

  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(0)

  const [currentTime, setCurrentTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const [type, setType] = useState('clip')  

useEffect(() => {
  

  if(giveUp){
    setLevelScore(prev =>
      prev.map((obj, idx) =>
        idx === levelsPlayed
          ? { ...obj, score: 0 }
          : obj
      )
    );
    return
  }

  if (attempts > 0 && levelScore?.length > 0 && levelsPlayed > -1) {
    setLevelScore(prev =>
      prev.map((obj, idx) =>
        idx === levelsPlayed
          ? { ...obj, score: 100 - attempts * 33 }
          : obj
      )
    );
  }
}, [attempts, giveUp]);

useEffect(()=>{
  setAttempts(0)
}, [levelsPlayed])


useEffect(() => {

  if(playStage && stage > 0){
    setAttempts(prev => prev +1)
  }

}, [playStage])

  const stages = useMemo(() => {
    if (!level?.stops?.length || !level?.loops?.length) return [];
    const stages = [];
    if (level.stops[0] !== undefined) stages.push({ type: "play", from: 0, to: level.stops[0] });
    const loopCount = Math.min(level.loops.length, Math.floor(level.stops.length / 2));
    for (let i = 0; i < loopCount; i++) {
      const loop = level.loops[i];
      const playFrom = level.stops[i * 2 + 1];
      const playTo = level.stops[i * 2 + 2];
      if (loop?.start !== undefined && loop?.end !== undefined)
        stages.push({ type: "loop", from: loop.start, to: loop.end });
      if (playFrom !== undefined && playTo !== undefined)
        stages.push({ type: "play", from: playFrom, to: playTo });
    }
    return stages;
  }, [level]);

useEffect(() => {

  let isLast = stage >= stages?.length -1
  let isLoop = type === 'loop'
  let isDegen = stages[stage]?.from == stages[stage]?.to

  if(!isPlaying){
    
    setEnablePlay(true)

    if(isLoop && isDegen){
      if(!isLast){
        setStage(prev => prev +1)
      }
    }
    
  } else {
    setEnablePlay(false)
  }

}, [isPlaying]);

useEffect(()=>{
  if(stage == 0){
    setPlayStage(true)
  }

  if(!isNaN(stage)){
    setTo(Math.floor(stages[stage]?.to))
    setFrom(Math.floor(stages[stage]?.from))

    if(stages[stage]?.type === 'loop'){
      setType('loop')
    } else {
      setType('clip')
    }  
  }
}, [stage])

useEffect(() => {

  const EPSILON = 0.05;

  if (endTime > 0 && currentTime >= endTime - EPSILON) {
    setPlayStage(false);
    handleGiveUp();
  }

  if (to && currentTime >= to - EPSILON) {
    setPlayStage(false);
    setStage(prev => prev + 1);
  }


}, [currentTime, to, type]);

useEffect(() => {

  if(endTime == 0){
    setEndTime(Math.floor(stages?.[stages?.length -1]?.to))
  }
  
}, [videoRef, endTime])

useEffect(() => {
  if (!playStage) return;
  const interval = setInterval(() => {
    const t = videoRef.current?.currentTime;
    if (typeof t === 'number') setCurrentTime(t); // Do NOT round here
  }, 0);

  return () => clearInterval(interval);
}, [playStage]);



  useEffect(() => {
    if(isLoaded){
      setEnablePlay(true)
    }
  }, [isLoaded])

  const handleGiveUp = () => {
    setShowGiveUp(true);
    setEnablePlay(false)
  };

  const handleLoaded = (canPlay) => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000);
  }

  const vidStyle = screen === 'xl'
    ? { boxShadow: "4px 2px 10px 1px #00000038", padding: 1, marginBlock: 10, width: 'auto', height: '75%' }
    : { boxShadow: "4px 2px 10px 1px #00000038", padding: 1, marginBlock: 10, width: '80%', height: '70%' };

  return (
    <Stack backgroundColor="white" justifyContent="center" alignItems="center" height={height * .25} width={screen === 'xs' ? width * 0.95 : '50%'}>
      <Stack width="100%" height="auto" justifyContent="center" alignItems="center" sx={{ opacity: isLoaded ? 1 : 1 }}>
          <Stack justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'} paddingY={2}>
          <Typography>{level.pack_name}</Typography>
            <ReactPlayer
              ref={videoRef}
              src={level?.public_url}
              playing={playStage}
              controls={false}
              loop={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onCanPlay={() => handleLoaded(true)}
              start={from || 0}
              playsInline={true}
              autoplay={true}
              style={{zoom: 0.8}}
            />
          </Stack>

        <Stack width="100%" minHeight="37px" justifyContent="center" alignItems="center" direction={'row'} sx={{marginTop: '1px', marginBottom: '10px'}}>
          <Stack>
            {/* <Typography>{`${currentTime} ${to}`}</Typography> */}

            {isPlaying &&

              <Box sx={{height: '36.5px', width: '64px'}}>
                    <LoadingAnimation />
              </Box>
            }
          </Stack>
        </Stack>
      </Stack>
      {!isLoaded && (
        <Stack width="100%" height="100%" justifyContent="center" alignItems="center" position="absolute">
          <CircularProgress size={24} />
        </Stack>
      )}
    </Stack>
  );
};

export default SixPicsVideoPlayer;
