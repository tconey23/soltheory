import React, { useRef, useState, useEffect } from "react";
import { MenuItem, Select, Slider, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const FrequencyTuner = ({
  tunerRef, freq, setFreq,
  toggleFineTune, setToggleFineTune,
  fineTuneStep, setFinetuneStep,
  MIN, MAX, isPlaying, channel
}) => {
  const [sliderVal, setSliderVal] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (sliderVal === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const absVal = Math.abs(sliderVal);
    const minInterval = 50; // ms
    const maxInterval = 300; // ms
    const intervalMs = Math.max(
      minInterval,
      maxInterval - ((absVal / 100) * (maxInterval - minInterval))
    );

    intervalRef.current = setInterval(() => {
      setFreq(prev => {
        let next = prev + (sliderVal > 0 ? fineTuneStep : -fineTuneStep);
        if (next > MAX) next = MAX;
        if (next < MIN) next = MIN;
        return Number(next.toFixed(4));
      });
    }, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [sliderVal, fineTuneStep, MIN, MAX, setFreq]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <Stack justifyContent={'flex-start'} alignItems={'center'} width={'50%'} height={'100%'} minHeight={'500px'} spacing={10}>

    <Stack ref={tunerRef} justifyContent={'flex-start'} alignItems={'center'} width={'100%'}>
        <Typography>Fine Tune Amt</Typography>
        <Select value={fineTuneStep} onChange={(e) => {
            setFinetuneStep(e.target.value)
            }}>
            <MenuItem value={0.01}>0.01</MenuItem>
            <MenuItem value={0.10}>0.10</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={10}>10</MenuItem>
        </Select>
    </Stack>

    <Stack ref={tunerRef} justifyContent={'flex-start'} alignItems={'center'} width={'100%'} height={'50%'} minHeight={'250px'}>
        <Typography>{`${channel} Frequency`}</Typography>
        <Typography>{freq} Hz</Typography>
        <Slider
                orientation="vertical"
                min={-100}
                max={100}
                value={sliderVal}
                onChange={(_, val) => {
                if(val >= 10){
                    setSliderVal(val)
                } else if(val <= -10){
                    setSliderVal(val)
                } else {
                    setSliderVal(0)
                }
            }}
                onChangeCommitted={() => setSliderVal(0)}
                step={1}
                sx={{ height: "80%"}}
        />
    </Stack>
    </Stack>
  );
};

export default FrequencyTuner;
