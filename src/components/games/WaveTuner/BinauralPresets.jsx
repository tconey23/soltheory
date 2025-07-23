import React, { useRef, useState, useEffect } from "react";
import { Slider, Stack, Typography, Input, Select, MenuItem, Link } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const fineTuneStep = 0.5;
const MIN_TONE = 20;
const MAX_TONE = 200;
const MotionStack = motion(Stack)

const BinauralPresets = ({ setLeftFreq, setRightFreq }) => {
  const [preset, setPreset] = useState('delta');
  const [baseTone, setBaseTone] = useState(100);
  const [sliderVal, setSliderVal] = useState(0);
  const [toggleMenu, setToggleMenu] = useState(false)
  const intervalRef = useRef();

  const presets = [
    { name: 'delta', display: "Delta", use: 'Sleep', diff: 2.5 },
    { name: 'theta', display: "Theta", use: 'Meditation', diff: 6 },
    { name: 'alpha', display: "Alpha", use: 'Relax', diff: 10 },
    { name: 'beta',  display: "Beta", use: 'Focus', diff: 20 },
    { name: 'gamma', display: "Gamma", use: 'Memory', diff: 40 }
  ];

  useEffect(() => {
    const { diff } = presets.find(p => p.name === preset);
    setLeftFreq(baseTone);
    setRightFreq(Number(baseTone) + Number(diff));
  }, [preset, baseTone, setLeftFreq, setRightFreq]);

  useEffect(() => {
    if (sliderVal === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const absVal = Math.abs(sliderVal);
    const minInterval = 25, maxInterval = 250;
    const intervalMs = Math.max(
      minInterval,
      maxInterval - ((absVal / 100) * (maxInterval - minInterval))
    );

    intervalRef.current = setInterval(() => {
      setBaseTone(prev => {
        let next = prev + (sliderVal > 0 ? fineTuneStep : -fineTuneStep);
        if (next > MAX_TONE) next = MAX_TONE;
        if (next < MIN_TONE) next = MIN_TONE;
        return Number(next.toFixed(4));
      });
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [sliderVal]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <Stack alignItems="center" width="100%" spacing={2} justifyContent={'center'} sx={{zoom: 0.9}}>
      <Stack direction="column" width="100%" alignItems={'center'}>
                <Select value={preset} onChange={e => setPreset(e.target.value)} sx={{bgcolor: 'white'}}>
                    {presets.map(p =>
                        <MenuItem key={p.name} value={p.name}>
                        {p.display} — {p.use}
                        </MenuItem>
                    )}
                </Select>

                <Stack alignItems="center" width="100%">
                    <Typography color='white' variant="body2">{`Base Tone ${baseTone}hz`}</Typography>
                    <Slider
                        orientation="vertical"
                        min={-100}
                        max={100}
                        value={sliderVal}
                        onChange={(_, val) => setSliderVal(val)}
                        onChangeCommitted={() => setSliderVal(0)}
                        step={1}
                        sx={{ height: 120 }}
                    />
                </Stack>
      </Stack>


    </Stack>
  );
};

export default BinauralPresets;
