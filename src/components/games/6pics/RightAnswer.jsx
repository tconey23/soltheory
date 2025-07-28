import { useEffect, useState, useRef } from 'react';
import { Stack, TextField, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';


const MotionStack = motion(Stack)

function VideoLastFrame({ src, width = "100%", height = "auto" }) {
  const videoRef = useRef();
 
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const showLastFrame = () => {
      video.currentTime = video.duration || 0;
      // Pause so it doesn't play the last moment
      video.pause();
    };

    video.addEventListener("loadedmetadata", showLastFrame);

    // In case metadata was loaded before this effect runs
    if (video.readyState >= 1) showLastFrame();

    return () => {
      video.removeEventListener("loadedmetadata", showLastFrame);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      width={width}
      height={height}
      muted
      preload="metadata"
      style={{ objectFit: "contain", borderRadius: 8 }}
      controls={false}
    />
  );
}

const RightAnswer = ({next, setLevelsPlayed, answer, level}) => {
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} justifyContent={'center'}>
      <MotionStack
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              bgcolor="#ffffffe0"
              width="100%"
              height="50vh"
              justifyContent="center"
              alignItems="center"
            >
              <Typography color="green" fontSize={30}><i className="fi fi-rr-laugh-beam"></i></Typography>
              <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">{`Answer: ${answer}`}</Typography>
              <VideoLastFrame src={level?.public_url} width="100%" height={150} />
              <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">CORRECT!</Typography>
              <Button onClick={() => {
                next()
                setLevelsPlayed(prev => prev +1)
              }} variant="contained">Continue</Button>
            </MotionStack>
    </Stack>
  );
};

export default RightAnswer;