import React, { useRef, useState, useEffect } from "react";
import { Slider, Stack, Typography, Button, Input, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const WaveType = ({leftWave, rightWave, setLeftWave, setRightWave}) => {
  return (
    <Stack direction={'column'} width={'95%'} justifyContent={'center'} alignItems={'center'}>
        <Typography fontFamily={'fredoka regular'} fontSize={20} color='white'>Wave Types</Typography>
        <Stack direction={'row'} width={'95%'} justifyContent={'center'} alignItems={'center'}>
        <FormControl fullWidth size="small" sx={{ mb: 1}}>
            <Typography color='white' fontFamily={'fredoka regular'}>Left Wave</Typography>
            <Select
                sx={{zIndex: 10001, bgcolor: 'white'}}
                labelId="left-wave-label"
                value={leftWave}
                label="Left Wave"
                onChange={e => setLeftWave(e.target.value)}
                // disabled={!isPlaying}
                >
                <MenuItem value="sine">Sine</MenuItem>
                <MenuItem value="square">Square</MenuItem>
                <MenuItem value="triangle">Triangle</MenuItem>
                <MenuItem value="sawtooth">Sawtooth</MenuItem>
            </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <Typography color='white' fontFamily={'fredoka regular'}>Right Wave</Typography>
            <Select
                sx={{zIndex: 10001, bgcolor: 'white'}}
                labelId="right-wave-label"
                value={rightWave}
                label="Right Wave"
                onChange={e => setRightWave(e.target.value)}
                // disabled={!isPlaying}
                >
                <MenuItem value="sine">Sine</MenuItem>
                <MenuItem value="square">Square</MenuItem>
                <MenuItem value="triangle">Triangle</MenuItem>
                <MenuItem value="sawtooth">Sawtooth</MenuItem>
            </Select>
        </FormControl>
        </Stack>
    </Stack>
  );
};

export default WaveType;