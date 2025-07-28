import { useEffect, useRef, useState, useMemo } from "react";
import { Stack, Button, CircularProgress, Typography, Box } from "@mui/material";
import useGlobalStore from "../../../business/useGlobalStore";
import ReactPlayer from 'react-player'
import LoadingAnimation from "../../../ui_elements/LoadingAnimation";

const EPSILON = 0.05; // Used for time comparison

const SixPicsVideoPlayer = ({
  level,
  width,
  height, 
  setShowGiveUp,
  showGiveUp,
  setEnablePlay,
  setAttempts,
  playStage,
  setPlayStage,
  stage,
  setStage,
  isPlaying, 
  setIsPlaying
}) => {
  const videoRef = useRef(null);
  const screen = useGlobalStore((state) => state.screen);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [type, setType] = useState('clip');

  // --- 1. Per-level state reset ---
  useEffect(() => {
    setStage(0);
    setPlayStage(false);
    setIsPlaying(false);
    setFrom(0);
    setTo(0);
    setCurrentTime(0);
    setEndTime(0);
    setType('clip');
    setIsLoaded(false);
    setAttempts(0);
    setShowGiveUp(false)
    // any other resets needed here
  }, [level]);

  // --- 2. Stages memo ---
  const stages = useMemo(() => {
    if (!level?.stops?.length || !level?.loops?.length) return [];
    const stagesArr = [];
    if (level.stops[0] !== undefined) stagesArr.push({ type: "play", from: 0, to: level.stops[0] });
    const loopCount = Math.min(level.loops.length, Math.floor(level.stops.length / 2));
    for (let i = 0; i < loopCount; i++) {
      const loop = level.loops[i];
      const playFrom = level.stops[i * 2 + 1];
      const playTo = level.stops[i * 2 + 2];
      if (loop?.start !== undefined && loop?.end !== undefined)
        stagesArr.push({ type: "loop", from: loop.start, to: loop.end });
      if (playFrom !== undefined && playTo !== undefined)
        stagesArr.push({ type: "play", from: playFrom, to: playTo });
    }
    return stagesArr;
  }, [level]);

  // --- 3. Stage setup ---
  useEffect(() => {
    if (stages.length === 0) return;
    setTo(Math.floor(stages[stage]?.to));
    setFrom(Math.floor(stages[stage]?.from));
    setType(stages[stage]?.type || 'clip');
  }, [stage, stages]);

  // --- 4. Only enable playStage after video is loaded and on first stage ---
  useEffect(() => {
    if (isLoaded && stage === 0) {
      setPlayStage(true);
    }
  }, [isLoaded, stage]);

  // --- 5. Degenerate loop skip, debounced (runs only on relevant stage change) ---
  useEffect(() => {
    if (stages.length === 0) return;
    const isLoop = type === 'loop';
    const isDegen = stages[stage]?.from === stages[stage]?.to;
    const isLast = stage >= stages.length - 1;
    if (!isPlaying && isLoop && isDegen && !isLast) {
      setStage(s => s + 1); // Only advance once
    }
  }, [isPlaying, type, stage, stages]);

  // --- 6. Play state changes ---
  useEffect(() => {
    setEnablePlay(!isPlaying && !showGiveUp);
  }, [isPlaying, showGiveUp, setEnablePlay]);

  // --- 7. Handle progress (advance on to/endTime, EPSILON aware) ---
  useEffect(() => {
    if (endTime > 0 && currentTime >= endTime - EPSILON) {
      setPlayStage(false);
      handleGiveUp();
    }
    if (to && currentTime >= to - EPSILON) {
      setPlayStage(false);
      setStage(prev => prev + 1);
    }
  }, [currentTime, to, type, endTime]);

  // --- 8. Set endTime on stages load ---
  useEffect(() => {
    if (stages.length && endTime === 0) {
      setEndTime(Math.floor(stages[stages.length - 1]?.to));
    }
  }, [stages, endTime]);

  // --- 9. Real time video progress polling (only when playing) ---
  useEffect(() => {
    if (!playStage) return;
    const interval = setInterval(() => {
      const t = videoRef.current?.currentTime;
      if (typeof t === 'number') setCurrentTime(t);
    }, 100); // 10 FPS is plenty
    return () => clearInterval(interval);
  }, [playStage]);

  // --- 10. On video loaded ---
  const handleLoaded = () => {
    setTimeout(() => setIsLoaded(true), 100);
  };

  const handleGiveUp = () => {
    setShowGiveUp(true);
    setEnablePlay(false);
  };

  // --- 11. UI ---
  const vidStyle = screen === 'xl'
    ? { boxShadow: "4px 2px 10px 1px #00000038", padding: 1, marginBlock: 10, width: 'auto', height: '75%' }
    : { boxShadow: "4px 2px 10px 1px #00000038", padding: 1, marginBlock: 10, width: '80%', height: '70%' };

  return (
    <Stack userdata='videowrap1' backgroundColor="white" justifyContent="center" alignItems="center" height={'100%'} width={'45%'}>
      <Stack userdata='videowrap2' width="100%" height="100%" justifyContent="center" alignItems="center" sx={{ opacity: isLoaded ? 1 : 1 }}>
        <Stack userdata='videowrap3' justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'} paddingY={0}>
          <Typography fontFamily={'fredoka regular'}>{level.pack_name}</Typography>
          <ReactPlayer
            ref={videoRef}
            src={level?.public_url}
            playing={playStage}
            controls={false}
            loop={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onCanPlay={handleLoaded}
            start={from || 0}
            playsInline={true}
            autoplay={true}
            style={{width: '100%', height: 'auto'}}
          />
        </Stack>
      </Stack>

        {/* <Stack width="100%" height='10%' justifyContent="center" alignItems="center" direction={'row'}>
          <Stack>
            {isPlaying && (
              <Box sx={{height: '100%', width: '64px'}}>
                <LoadingAnimation />
              </Box>
            )}
          </Stack>
        </Stack> */}
      {/* {!isLoaded && (
        <Stack width="100%" height="100%" justifyContent="center" alignItems="center" position="absolute">
          <CircularProgress size={24} />
        </Stack>
      )} */}
    </Stack>
  );
};

export default SixPicsVideoPlayer;
