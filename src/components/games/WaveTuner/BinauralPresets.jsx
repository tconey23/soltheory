import React, { useRef, useState, useEffect } from "react";
import { Slider, Stack, Typography, Select, MenuItem } from "@mui/material";

const fineTuneStep = 0.5;
const DEFAULT_MIN = 20;
const DEFAULT_MAX = 200;

const presets = [
  { name: 'delta', display: "Delta", use: 'Sleep', diff: 2.5, base: 83.5 },
  { name: 'earth', display: "Earth Vibration", use: 'Earth Vibe', diff: 7.83, base: 432 },
  { name: 'theta', display: "Theta", use: 'Meditation', diff: 6, base: 100 },
  { name: 'alpha', display: "Alpha", use: 'Relax', diff: 10, base: 100 },
  { name: 'beta',  display: "Beta", use: 'Focus', diff: 20, base: 100 },
  { name: 'gamma', display: "Gamma", use: 'Memory', diff: 40, base: 100 }
];

const BinauralPresets = ({
  setLeftFreq,
  setRightFreq,
  minFreq = DEFAULT_MIN,
  maxFreq = DEFAULT_MAX,
}) => {
  const [preset, setPreset] = useState('delta');
  const [baseTone, setBaseTone] = useState(presets[0].base);
  const [sliderVal, setSliderVal] = useState(0);
  const intervalRef = useRef();

  // When preset changes, update base tone as well!
  const handlePresetChange = (e) => {
    const newPreset = e.target.value;
    setPreset(newPreset);
    const presetObj = presets.find(p => p.name === newPreset);
    setBaseTone(presetObj.base);
    setSliderVal(0);
  };

  // Update frequencies on baseTone or preset change
  useEffect(() => {
    const { diff } = presets.find(p => p.name === preset);
    setLeftFreq(baseTone);
    setRightFreq(Number(baseTone) + Number(diff));
  }, [baseTone, preset, setLeftFreq, setRightFreq]);

  // Fine tune the base tone
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
        if (next > maxFreq) next = maxFreq;
        if (next < minFreq) next = minFreq;
        return Number(next.toFixed(4));
      });
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [sliderVal, minFreq, maxFreq]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <Stack alignItems="center" width="100%" spacing={2} justifyContent="center" sx={{ zoom: 0.9 }}>
      <Stack direction="column" width="100%" alignItems="center">
        <Select value={preset} onChange={handlePresetChange} sx={{ bgcolor: 'white' }}>
          {presets.map(p =>
            <MenuItem key={p.name} value={p.name}>
              {p.display} — {p.use}
            </MenuItem>
          )}
        </Select>

        <Stack alignItems="center" width="100%">
          <Typography color="white" variant="body2">{`Base Tone ${baseTone}hz`}</Typography>
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