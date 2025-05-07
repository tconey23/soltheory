import { useEffect, useRef, useState, useMemo } from "react";
import { Stack, Typography, Button, CircularProgress } from "@mui/material";

const SixPicsVideoPlayer = ({
  level,
  setLevelScore,
  levelScore,
  index,
  next,
  setShowGiveUp,
  showGiveUp
}) => {

  const videoRef = useRef(null);
  const frameRef = useRef(null);

  const [stage, setStage] = useState(0);
  const [start, setStart] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [giveUp, setGiveUp] = useState(false);

  // console.log('level', level)
  // console.log('level stops', level.stops)
  // console.log('level loops', level.loops)
 
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
    setStage((prev) => prev + 1);
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
    if (!start || !videoRef.current || !stages.length) return

    const { from } = stages[stage];
    videoRef.current.currentTime = from; 

    videoRef.current.play().catch((err) => {
      console.warn("Autoplay failed:", err);
    });

    const check = () => {
      if (!videoRef.current) return;
      const current = videoRef.current.currentTime;
      const { type, from, to } = stages[stage];

      if (type === "play" && current >= to) {
        if (stage === 0) setStage(1);
        else if (stage === 2) setStage(3);
        else if (stage === 4) {
          videoRef.current.pause();
          setShowGiveUp(true);
          setDisableNext(true);
        }
      } else if (type === "loop" && current >= to) {
        videoRef.current.currentTime = from;
      }

      frameRef.current = requestAnimationFrame(check);
    };

    frameRef.current = requestAnimationFrame(check);

    return () => {
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



  return (
    <Stack backgroundColor="white" justifyContent="center" alignItems="center">
      <Stack
        width={"45%"}
        height="45%"
        justifyContent="center"
        alignItems="center"
        sx={{ opacity: isLoaded ? 1 : 1}}
      >
        <video
          ref={videoRef}
          width="80%"
          height="80%"
          preload="metadata"
          muted
          playsInline
          style={{ boxShadow: "4px 2px 10px 1px #00000038", padding: 1, marginBlock: 10 }} 
          onLoadedMetadata={(e) => {
            e.target.currentTime = 0;
          }}
          onCanPlay={() => {
            setIsLoaded(true)}}
        >
          <source src={level?.public_url} type="video/mp4" />
        </video>
      </Stack>

      <Stack width="100%" height="100%" justifyContent="center" alignItems="center" position="absolute">
        {!isLoaded && <CircularProgress size={24} />}
      </Stack>

      <Stack width="100%" minHeight="37px" justifyContent="center" alignItems="center">
        {!start && (
          <Button onClick={() => setStart(true)} variant="contained">
            Start
          </Button>
        )}

        {start && !giveUp && !showGiveUp && (
          <Button disabled={disableNext} onClick={handleNext} variant="contained">
            Next
          </Button>
        )}

        {showGiveUp && !giveUp && (
          <Button onClick={() => setGiveUp(true)} variant="outlined">
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
  );
};

export default SixPicsVideoPlayer;
