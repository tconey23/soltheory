import { Stack, Typography, Slider, Box, Link } from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

const MotionStack = motion(Stack)

const paramMeta = [
  { key: 'threshold', label: 'Threshold (dB)', min: -100, max: 0, step: 1, default: -24 },
  { key: 'knee',      label: 'Knee (dB)',      min: 0,    max: 40, step: 1,  default: 30 },
  { key: 'ratio',     label: 'Ratio',          min: 1,    max: 20, step: 0.1,default: 12 },
  { key: 'attack',    label: 'Attack (s)',     min: 0.001,max: 1,  step: 0.001,default: 0.003 },
  { key: 'release',   label: 'Release (s)',    min: 0.01, max: 1,  step: 0.01, default: 0.25 },
];

const Compressor = ({ values, setValue }) => {
    const [toggleMenu, setToggleMenu] = useState(false)
  return (
    <Stack direction="column" spacing={2} width="100%">
      <Link onClick={() => setToggleMenu(prev => !prev)}>Compressor Settings</Link>
      <AnimatePresence>
                  <MotionStack
                      sx={{overflow: 'hidden', width: '100%'}}
                      justifyContent={'center'}
                      initial={{height: 0, display: 'none'}}
                      animate={
                          toggleMenu ? {height: '100%', display: 'block'} : {height: 0, display: 'none'}
                      }
                      exit={{height: 0, display: 'none'}}
                      transition={{duration: 1}}
      
                  > 
                        {paramMeta.map(meta => (
                            <Box key={meta.key}>
                            <Stack direction="row" alignItems="center" spacing={1} width={'100%'}>
                                <Typography sx={{minWidth: 80}}>{meta.label}</Typography>
                                <Slider
                                min={meta.min}
                                max={meta.max}
                                step={meta.step}
                                value={values[meta.key]}
                                onChange={(_, val) => setValue(meta.key, val)}
                                sx={{ flex: 1, mx: 2 }}
                                />
                                <Typography variant="body2" sx={{width: 48}}>
                                {meta.key === 'ratio'
                                    ? values[meta.key].toFixed(1) + ':1'
                                    : meta.key === 'attack' || meta.key === 'release'
                                    ? values[meta.key].toFixed(3)
                                    : values[meta.key].toFixed(0)
                                }
                                </Typography>
                            </Stack>
                            </Box>
                        ))}
                   </MotionStack>
        </AnimatePresence>
    </Stack>
  );
};

export default Compressor;
