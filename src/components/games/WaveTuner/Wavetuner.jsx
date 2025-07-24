import React, { useRef, useState, useEffect } from "react";
import { Stack, Typography, Button, Input, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import WaveType from "./WaveType";
import FrequencyTuner from "./FrequencyTuner";
import BinauralPresets from "./BinauralPresets";
import WaveForm from "./WaveForm";
import Compressor from "./Compressor";
import SpectrumAnalyzer from "./SpectrumAnalyzer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import * as Tone from "tone"
import Header from "./Header";
import MuiSlider from '@mui/material/Slider';

function usePeakMeter(analyser, isActive) {
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    if (!analyser || !isActive) return;

    let running = true;
    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);

    function checkPeak() {
      if (!running) return;
      analyser.getByteTimeDomainData(data);
      let max = 0;
      for (let i = 0; i < bufferLength; i++) {
        const deviation = Math.abs(data[i] - 128);
        if (deviation > max) max = deviation;
      }
      const percent = Math.round((max / 128) * 100)
      setPeak(percent);
      requestAnimationFrame(checkPeak);
    }
    checkPeak();

    return () => { running = false; };
  }, [analyser, isActive]);

  return peak;
}

const MIN_FREQ = 20;
const MAX_FREQ = 1000;
const DEFAULT_LEFT = 40;
const DEFAULT_RIGHT = 41;

const COMPRESSOR_DEFAULTS = {
  threshold: -25,
  knee: 17,
  ratio: 14.5,
  attack: 0.024,
  release: 0.280,
};

const MotionStack = motion(Stack)

const Wavetuner = ({}) => {
    const [leftFreq, setLeftFreq] = useState(DEFAULT_LEFT);
    const [rightFreq, setRightFreq] = useState(DEFAULT_RIGHT);
    const [isPlaying, setIsPlaying] = useState(false);
    const [finetuneStepL, setFinetuneStepL] = useState(0.1)
    const [finetuneStepR, setFinetuneStepR] = useState(0.1)
    const [toggleFineTuneLeft, setToggleFineTuneLeft] = useState(false)
    const [toggleFineTuneRight, setToggleFineTuneRight] = useState(false)
    const [leftWave, setLeftWave] = useState('sine');
    const [rightWave, setRightWave] = useState('sine')
    const [compVals, setCompVals] = useState(COMPRESSOR_DEFAULTS)
    const [activeSlide, setActiveSlide] = useState(1);
    const [slides, setSlides] = useState(<></>)
    const [voiceType, setVoiceType] = useState("oscillator"); // or "tonejs"
    const [toneInstrument, setToneInstrument] = useState("Synth"); // or "AMSynth", "MonoSynth", etc.
    const [selectedTab, setSelectedTab] = useState('presets')
    const [binauralBeat, setBinauralBeat] = useState(null)
    const [leftVolume, setLeftVolume] = useState(1);
    const [rightVolume, setRightVolume] = useState(1);
    const [analyserUpdate, setAnalyserUpdate] = useState(0);
    const [lPeakMax, setLPeakMax] = useState(0)
    const [rPeakMax, setRPeakMax] = useState(0)
    const [vuRelease, setVuRelease] = useState(300)

    const sliderRef = useRef();
    const audioCtxRef = useRef(null);
    const leftOscRef = useRef(null);
    const rightOscRef = useRef(null);
    const leftPanRef = useRef(null);
    const rightPanRef = useRef(null);
    const ftlRef = useRef(null)
    const ftrRef = useRef(null)
    const leftGainRef = useRef(0)
    const rightGainRef = useRef(0)
    const leftAnalyserRef = useRef();
    const rightAnalyserRef = useRef()
    const compressorRef = useRef(null);
    const masterAnalyserRef = useRef(null);
    const toneSynthRef = useRef(null);

    const leftPeak = usePeakMeter(leftAnalyserRef.current, isPlaying);
    const rightPeak = usePeakMeter(rightAnalyserRef.current, isPlaying);

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        afterChange: setActiveSlide,
    };

    useEffect(() => {
        if (leftPeak > lPeakMax) {
            setLPeakMax(leftPeak);
        }
        if (rightPeak > rPeakMax) {
            setRPeakMax(rightPeak);
        }
    }, [leftPeak, rightPeak, lPeakMax, rPeakMax]);

    useEffect(() => {
        if (lPeakMax === 0) return;
        const timeout = setTimeout(() => setLPeakMax(0), vuRelease);
        return () => clearTimeout(timeout);
    }, [lPeakMax, vuRelease]);

    useEffect(() => {
        if (rPeakMax === 0) return;
        const timeout = setTimeout(() => setRPeakMax(0), vuRelease);
        return () => clearTimeout(timeout);
    }, [rPeakMax, vuRelease]);

    useEffect(() => {
        if(rightFreq && rightFreq){
            let binBeat = Math.abs(leftFreq - rightFreq).toFixed(2)
            setBinauralBeat(binBeat)
        }
    }, [leftFreq, rightFreq])

    const setupAudioContext = () => {
        if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        // Set up compressor
        if (!compressorRef.current) {
        compressorRef.current = ctx.createDynamicsCompressor();
        const c = compressorRef.current;
        Object.entries(COMPRESSOR_DEFAULTS).forEach(([k, v]) => c[k].value = v);
        }
        // Master analyser
        if (!masterAnalyserRef.current) {
        masterAnalyserRef.current = ctx.createAnalyser();
        compressorRef.current.connect(masterAnalyserRef.current);
        masterAnalyserRef.current.connect(ctx.destination);
        }
    };

    const startAudio = async () => {
        setupAudioContext();
        const ctx = audioCtxRef.current;
        const compressor = compressorRef.current;

        if (voiceType === "oscillator") {
        // Disconnect any Tone synth
        if (toneSynthRef.current) {
            toneSynthRef.current.dispose();
            toneSynthRef.current = null;
        }

        // LEFT OSC
        leftOscRef.current = ctx.createOscillator();
        leftOscRef.current.type = leftWave;
        leftOscRef.current.frequency.value = leftFreq;
        const leftPan = ctx.createStereoPanner(); leftPan.pan.value = -1;
        const leftGain = ctx.createGain();
        leftGain.gain.value = leftVolume;
        leftAnalyserRef.current = ctx.createAnalyser();

        leftOscRef.current
            .connect(leftPan)
            .connect(leftGain)
            .connect(leftAnalyserRef.current)
            .connect(compressor);

        // RIGHT OSC
        rightOscRef.current = ctx.createOscillator();
        rightOscRef.current.type = rightWave;
        rightOscRef.current.frequency.value = rightFreq;
        const rightPan = ctx.createStereoPanner(); rightPan.pan.value = 1;
        const rightGain = ctx.createGain();
        rightGain.gain.value = rightVolume;
        rightAnalyserRef.current = ctx.createAnalyser();

        rightOscRef.current
            .connect(rightPan)
            .connect(rightGain)
            .connect(rightAnalyserRef.current)
            .connect(compressor);

        leftGainRef.current = leftGain;
        rightGainRef.current = rightGain;

        if (ctx.state === "suspended") await ctx.resume();
        leftOscRef.current.start();
        rightOscRef.current.start();
        setIsPlaying(true);

        } else if (voiceType === "tonejs") {
        // Dispose native oscillators if switching from oscillator mode
        leftOscRef.current?.stop(); leftOscRef.current = null;
        rightOscRef.current?.stop(); rightOscRef.current = null;

        Tone.setContext(ctx);
        // Clean up Tone synth if exists
        if (toneSynthRef.current) {
            toneSynthRef.current.dispose();
        }
        // Create chosen synth
        let synth;
        switch (toneInstrument) {
            case "AMSynth": synth = new Tone.AMSynth(); break;
            case "MonoSynth": synth = new Tone.MonoSynth(); break;
            default: synth = new Tone.Synth();
        }
        synth.disconnect(); // disconnect from Tone.Master
        synth.connect(compressor);
        toneSynthRef.current = synth;

        // Visualizer: just use the masterAnalyser for Tone.js
        leftAnalyserRef.current = masterAnalyserRef.current;
        rightAnalyserRef.current = masterAnalyserRef.current;

        if (ctx.state === "suspended") await ctx.resume();
            setIsPlaying(true);
            synth.triggerAttack(leftFreq, "+0", 0.8);
            synth.triggerAttack(rightFreq, "+0", 0.9);
        }
    };

        useEffect(() => {
            // console.log(leftVolume)
        if (leftGainRef.current) {
            leftGainRef.current.gain.setValueAtTime(leftVolume, audioCtxRef.current.currentTime);
        }
        }, [leftVolume]);

        useEffect(() => {
            // console.log(rightVolume)
        if (rightGainRef.current) {
            rightGainRef.current.gain.setValueAtTime(rightVolume, audioCtxRef.current.currentTime);
        }
        }, [rightVolume]);


  useEffect(() => {
        // if (isPlaying && leftOscRef.current) leftOscRef.current.type = leftWave;
        if (isPlaying && leftOscRef.current && leftGainRef.current) {
            crossfadeOscillator("left", leftWave);
        }
    }, [leftWave, isPlaying]);

    useEffect(() => {
        // if (isPlaying && rightOscRef.current) rightOscRef.current.type = rightWave;
        if (isPlaying && rightOscRef.current && rightGainRef.current) {
            crossfadeOscillator("right", rightWave);
        }
    }, [rightWave, isPlaying])

const crossfadeOscillator = async (channel, newWave) => {
  const ctx = audioCtxRef.current;
  if (!ctx) return;
  audioCtxRef.current.suspend();
  const compressor = compressorRef.current;

  const freq = channel === "left" ? leftFreq : rightFreq;
  const oldOscRef = channel === "left" ? leftOscRef : rightOscRef;
  const oldGainRef = channel === "left" ? leftGainRef : rightGainRef;
  const oldPanRef = channel === "left" ? leftPanRef : rightPanRef;

  // Fade out
  const now = ctx.currentTime;
  const FADE_OUT = 0.035;
  if (oldGainRef.current) {
    oldGainRef.current.gain.cancelScheduledValues(now);
    oldGainRef.current.gain.setValueAtTime(oldGainRef.current.gain.value, now);
    oldGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_OUT);
  }

  setTimeout(() => {
    oldOscRef.current?.stop();
    oldOscRef.current?.disconnect();
    oldGainRef.current?.disconnect();
    oldPanRef.current?.disconnect();

    // ---- Here's the important bit: create new analyser for the correct channel
    const newOsc = ctx.createOscillator();
    newOsc.type = newWave;
    newOsc.frequency.value = freq;

    const newPan = ctx.createStereoPanner();
    newPan.pan.value = channel === "left" ? -1 : 1;

    const newGain = ctx.createGain();
    const targetVol = channel === "left" ? leftVolume : rightVolume;
    newGain.gain.value = 0;

    const newAnalyser = ctx.createAnalyser();

    // Connect: osc → pan → gain → analyser → compressor
    newOsc.connect(newPan);
    newPan.connect(newGain);
    newGain.connect(compressor);
    compressor.connect(newAnalyser); 
    newOsc.start();

    const startTime = ctx.currentTime;
    const FADE_IN = 0.045;
    newGain.gain.cancelScheduledValues(startTime);
    newGain.gain.setValueAtTime(0, startTime);
    newGain.gain.linearRampToValueAtTime(targetVol, startTime + FADE_IN);

    // Re-assign refs correctly
    if (channel === "left") {
      leftOscRef.current = newOsc;
      leftGainRef.current = newGain;
      leftPanRef.current = newPan;
      leftAnalyserRef.current = newAnalyser;
    } else {
      rightOscRef.current = newOsc;
      rightGainRef.current = newGain;
      rightPanRef.current = newPan;
      rightAnalyserRef.current = newAnalyser;
    }

    audioCtxRef.current.resume();

    setAnalyserUpdate(prev => prev +1)
  }, FADE_OUT * 1000 + 10);
};

    const stopAudio = () => {
        // OSC
        leftOscRef.current?.stop(); leftOscRef.current = null;
        rightOscRef.current?.stop(); rightOscRef.current = null;
        // Tone.js
        if (toneSynthRef.current) {
        toneSynthRef.current.dispose();
        toneSynthRef.current = null;
        }
        setIsPlaying(false);
    };


  useEffect(() => {
    if (isPlaying && voiceType === "oscillator") {
      if (leftOscRef.current) leftOscRef.current.frequency.setValueAtTime(leftFreq, audioCtxRef.current.currentTime);
      if (rightOscRef.current) rightOscRef.current.frequency.setValueAtTime(rightFreq, audioCtxRef.current.currentTime);
      if (leftOscRef.current) leftOscRef.current.type = leftWave;
      if (rightOscRef.current) rightOscRef.current.type = rightWave;
    }
    if (isPlaying && voiceType === "tonejs" && toneSynthRef.current) {
      toneSynthRef.current.triggerAttack(leftFreq, "+0", 0.8);
      toneSynthRef.current.triggerAttack(rightFreq, "+0", 0.8);
    }
  }, [leftFreq, rightFreq, leftWave, rightWave, isPlaying, voiceType, toneInstrument]);

  useEffect(() =>{
    if(!leftAnalyserRef.current, !rightAnalyserRef.current) return;

    setSlides(
        [<SpectrumAnalyzer
            key="bars_sine"
            leftAnalyser={leftAnalyserRef.current}
            rightAnalyser={rightAnalyserRef.current}
            showBars={true}
            showSine={true}
            width={280}
            height={sliderRef?.current?.offsetHeight}
            minFreq={MIN_FREQ}
            maxFreq={MAX_FREQ}
        />,
        <SpectrumAnalyzer
            key="sine"
            leftAnalyser={leftAnalyserRef.current}
            rightAnalyser={rightAnalyserRef.current}
            showBars={false}
            showSine={true}
            width={280}
            height={sliderRef?.current?.offsetHeight}
            minFreq={MIN_FREQ}
            maxFreq={MAX_FREQ}
        />,
        <SpectrumAnalyzer
            key="bars"
            leftAnalyser={leftAnalyserRef.current}
            rightAnalyser={rightAnalyserRef.current}
            showBars={true}
            showSine={false}
            width={280}
            height={sliderRef?.current?.offsetHeight}
            minFreq={MIN_FREQ}
            maxFreq={MAX_FREQ}
        />,
        <WaveForm 
            leftFreq={leftFreq} 
            rightFreq={rightFreq} 
            width={280} 
            isPlaying={isPlaying}
        />]
    )
  }, [leftAnalyserRef, rightAnalyserRef, isPlaying, analyserUpdate])

  useEffect(() => {
        // console.log(leftAnalyserRef.current)
  }, [leftGainRef, rightGainRef, leftVolume, rightVolume])

    const updateCompValue = (key, val) => {
    setCompVals(prev => {
        // Update actual compressor node, too!
        if (compressorRef.current && compressorRef.current[key]) {
        compressorRef.current[key].value = val;
        }
        return { ...prev, [key]: val };
    });
    };

  return (
    <Stack spacing={0} alignItems="center" justifyContent={'center'} sx={{ p: 4, maxWidth: 500, mx: "auto", height: '100%', width: '100%'}} bgcolor={'black'}>

        <Stack alignItems={'center'}>
            <Typography color="white" fontFamily={'fredoka regular'} fontSize={20} variant="h7">SOL Vibes</Typography>
            <Stack height='10%'>
                {binauralBeat && 
                    <Typography color='white' fontFamily={'fredoka regular'} fontSize={20}>{`Binaural beat: ${binauralBeat}hz`}</Typography>
                }
            </Stack>


            <Stack justifyItems={'center'} alignItems={'center'} height='max-content' paddingBottom='5px' width={'90vw'}>
                <Header tab={selectedTab} setTab={setSelectedTab}/>
            </Stack>

            <Stack height='25svh' width='100%' justifyContent={'flex-start'}>

                <AnimatePresence>
                    <MotionStack  sx={{overflow: 'hidden'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'presets'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                        <BinauralPresets 
                            leftFreq={leftFreq} 
                            rightFreq={rightFreq} 
                            setLeftFreq={setLeftFreq} 
                            setRightFreq={setRightFreq}
                            minFreq={MIN_FREQ}
                            maxFreq={MAX_FREQ}
                        />
                    </MotionStack>
                </AnimatePresence>

                <AnimatePresence>
                    <MotionStack justifyContent={'flex-start'} paddingTop={1} alignItems={'center'} sx={{overflow: 'hidden'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'wavetypes'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                        <WaveType leftWave={leftWave} rightWave={rightWave} setLeftWave={setLeftWave} setRightWave={setRightWave}/>
                    </MotionStack>
                </AnimatePresence>

                <AnimatePresence>
                    <MotionStack sx={{overflow: 'hidden', width: '100%'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'tuner'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'} sx={{zoom: 0.75}} borderRadius={3}>
                            <FrequencyTuner 
                                tunerRef={ftlRef} 
                                freq={leftFreq} 
                                setFreq={setLeftFreq} 
                                toggleFineTune={toggleFineTuneLeft} 
                                setToggleFineTune={setToggleFineTuneLeft} 
                                fineTuneStep={finetuneStepL}
                                setFinetuneStep={setFinetuneStepL}
                                MIN={MIN_FREQ}
                                MAX={MAX_FREQ}
                                isPlaying={isPlaying}
                                channel={'Left'}
                            />
                            <FrequencyTuner 
                                tunerRef={ftrRef} 
                                freq={rightFreq} 
                                setFreq={setRightFreq} 
                                toggleFineTune={toggleFineTuneRight} 
                                setToggleFineTune={setToggleFineTuneRight} 
                                fineTuneStep={finetuneStepR}
                                setFinetuneStep={setFinetuneStepR}
                                MIN={MIN_FREQ}
                                MAX={MAX_FREQ}
                                isPlaying={isPlaying}
                                channel={'Right'}
                            />
                        </Stack>
                    </MotionStack>
                </AnimatePresence>
                
                <AnimatePresence>
                    <MotionStack sx={{overflow: 'hidden'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'compressor'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                        <Compressor values={compVals} setValue={updateCompValue} />
                    </MotionStack>
                </AnimatePresence>

                <AnimatePresence>
                    <MotionStack justifyContent={'center'} sx={{overflow: 'hidden', width: '100%'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'volume'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                       <Stack direction="row" spacing={2} height={'100%'} width={'100%'}>
                        
                        <Stack spacing={2} alignItems={'center'} width={'33%'}>
                        <Typography color="white">Left Vol</Typography>
                        <MuiSlider
                            min={0}
                            max={1}
                            step={0.01}
                            value={leftVolume}
                            onChange={(_, val) => setLeftVolume(val)}
                            style={{ width: 50 }}
                            orientation="vertical"
                            />
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} width={'33%'}>
                        <Typography color="white">Main Vol</Typography>
                        <MuiSlider
                            min={0}
                            max={1}
                            step={0.01}
                            value={Math.min(rightVolume, leftVolume)}
                            onChange={(_, val) => {
                                setRightVolume(val)
                                setLeftVolume(val)
                            }}
                            style={{ width: 50 }}
                            orientation="vertical"
                            />
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} width={'33%'}>
                        <Typography color="white">Right Vol</Typography>
                        <MuiSlider
                            min={0}
                            max={1}
                            step={0.01}
                            value={rightVolume}
                            onChange={(_, val) => setRightVolume(val)}
                            style={{ width: 50 }}
                            orientation="vertical"
                            />
                        </Stack>
                        </Stack>
                    </MotionStack>
                </AnimatePresence>

                <AnimatePresence>
                    <MotionStack sx={{overflow: 'hidden'}} initial={{height: 0, opacity: 0, display: 'none'}} animate={selectedTab === 'vumeter'? {height: '100%', opacity: 1, display: 'flex'} : {height: 0, display: 'none'}} exit={{height: 0, opacity: 0, display: 'none'}} transition={{duration: 1}}>
                        <Stack direction="row" spacing={2} height={'100%'} width={'100%'}>
                            <Stack spacing={2} alignItems={'center'} width={'50%'}>
                            <Typography color="white">{`L ${leftPeak}`}</Typography>
                            <Typography color="white">{`${lPeakMax}`}</Typography>
                            <MuiSlider
                                min={0}
                                max={100}
                                step={0.01}
                                value={leftPeak}
                                style={{ width: 50 }}
                                orientation="vertical"
                                sx={{
                                    '& .MuiSlider-thumb': { display: 'none' },
                                    '& .MuiSlider-track': { bgcolor: lPeakMax == 100 ? 'red' : '#1976d2'}
                                }}
                                />
                            </Stack>

                            <Stack spacing={2} alignItems={'center'} width={'50%'}>
                            <Typography color="white">Monitor Rls</Typography>
                            <Typography color="white">{`${vuRelease / 1000}s`}</Typography>
                            <MuiSlider
                                min={0}
                                max={3000}
                                step={100}
                                onChange={(_, val) => setVuRelease(val)}
                                value={vuRelease}
                                style={{ width: 50}}
                                orientation="vertical"
                                />
                            </Stack>

                            <Stack spacing={2} alignItems={'center'} width={'50%'}>
                            <Typography color="white">{`R ${rightPeak}`}</Typography>
                            <Typography color="white">{`${rPeakMax}`}</Typography>
                            <MuiSlider
                                min={0}
                                max={100}
                                step={0.01}
                                value={rightPeak}
                                style={{ width: 50 }}
                                orientation="vertical"
                                sx={{
                                    '& .MuiSlider-thumb': { display: 'none' },
                                    '& .MuiSlider-track': { bgcolor: rPeakMax == 100 ? 'red' : '#1976d2'}
                                }}
                                />
                            </Stack>
                        </Stack>
                    </MotionStack>
                </AnimatePresence>
            </Stack>

            <Stack width="100%" height='33svh' justifyContent={'center'} alignItems={'center'} overflow='hidden'>
                    {/* <WaveForm leftFreq={leftFreq} rightFreq={rightFreq} width={400} height={300} isPlaying={isPlaying}/> */}
                    {leftAnalyserRef.current && rightAnalyserRef.current && (
                        <Slider ref={sliderRef} {...settings} style={{width:300, height: '50%'}}>
                            {slides}
                        </Slider>
                        )}
            </Stack>
            <Stack direction="row" spacing={2} bgcolor={'grey'} padding={2} borderRadius={2}>
                <Button variant="contained" onClick={startAudio} disabled={isPlaying}>
                    Start
                </Button>
                <Button variant="contained" onClick={stopAudio} disabled={!isPlaying}>
                    Stop
                </Button>
            </Stack>
        </Stack>
    </Stack>
  );
}

export default Wavetuner
