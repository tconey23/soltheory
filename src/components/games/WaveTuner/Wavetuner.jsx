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

const MIN_FREQ = 20;
const MAX_FREQ = 200;
const DEFAULT_LEFT = 40;
const DEFAULT_RIGHT = 41;

const COMPRESSOR_DEFAULTS = {
  threshold: -58,
  knee: 40,
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
    const [toggleWaveType, setToggleWaveType] = useState(false)
    const [leftWave, setLeftWave] = useState('sine');
    const [rightWave, setRightWave] = useState('sine')
    const [toggleMenu, setToggleMenu] = useState(false)
    const [compVals, setCompVals] = useState(COMPRESSOR_DEFAULTS)
    const [activeSlide, setActiveSlide] = useState(1);
    const [slides, setSlides] = useState(<></>)
    const [voiceType, setVoiceType] = useState("oscillator"); // or "tonejs"
    const [toneInstrument, setToneInstrument] = useState("Synth"); // or "AMSynth", "MonoSynth", etc.

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
        const leftGain = ctx.createGain(); leftGain.gain.value = 0.9;
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
        const rightGain = ctx.createGain(); rightGain.gain.value = 0.9;
        rightAnalyserRef.current = ctx.createAnalyser();

        rightOscRef.current
            .connect(rightPan)
            .connect(rightGain)
            .connect(rightAnalyserRef.current)
            .connect(compressor);

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

    const setValue = (key, val) => {
        setCompVals(prev => ({ ...prev, [key]: val }));
        // Also update the actual DynamicsCompressorNode if it exists:
        if (audioCtxRef.current?.compressor) {
        audioCtxRef.current.compressor[key].value = val;
        }
    };
const crossfadeOscillator = async (channel, newWave) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    audioCtxRef.current.suspend()
    const compressor = ctx.compressor;

    const freq = channel === "left" ? leftFreq : rightFreq;
    const oldOscRef = channel === "left" ? leftOscRef : rightOscRef;
    const oldGainRef = channel === "left" ? leftGainRef : rightGainRef;
    const oldPanRef = channel === "left" ? leftPanRef : rightPanRef;

    // 1. Fade out old gain quickly
    const now = ctx.currentTime;
    const FADE_OUT = 0.035; // 35ms
    if (oldGainRef.current) {
        oldGainRef.current.gain.cancelScheduledValues(now);
        oldGainRef.current.gain.setValueAtTime(oldGainRef.current.gain.value, now);
        oldGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    }

    // 2. After fade out, stop/disconnect old osc, then start new one
    setTimeout(() => {
        oldOscRef.current?.stop();
        oldOscRef.current?.disconnect();
        oldGainRef.current?.disconnect();
        oldPanRef.current?.disconnect();

        // Create new osc
        const newOsc = ctx.createOscillator();
        newOsc.type = newWave;
        newOsc.frequency.value = freq;
        const newPan = ctx.createStereoPanner();
        newPan.pan.value = channel === "left" ? -1 : 1;
        const newGain = ctx.createGain();
        newGain.gain.value = 0; // Start silent
        newOsc.connect(newPan).connect(newGain).connect(compressor);
        newOsc.start();

        // Fade in
        const startTime = ctx.currentTime;
        const FADE_IN = 0.045;
        newGain.gain.cancelScheduledValues(startTime);
        newGain.gain.setValueAtTime(0, startTime);
        newGain.gain.linearRampToValueAtTime(1, startTime + FADE_IN);

        // Re-assign refs
        if (channel === "left") {
            leftOscRef.current = newOsc;
            leftGainRef.current = newGain;
            leftPanRef.current = newPan;
        } else {
            rightOscRef.current = newOsc;
            rightGainRef.current = newGain;
            rightPanRef.current = newPan;
        }
        audioCtxRef.current.resume()
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
            height={240}
        />,
        <SpectrumAnalyzer
            key="sine"
            leftAnalyser={leftAnalyserRef.current}
            rightAnalyser={rightAnalyserRef.current}
            showBars={false}
            showSine={true}
            width={280}
            height={240}
        />,
        <SpectrumAnalyzer
            key="bars"
            leftAnalyser={leftAnalyserRef.current}
            rightAnalyser={rightAnalyserRef.current}
            showBars={true}
            showSine={false}
            width={280}
            height={240}
        />,
        <WaveForm 
            leftFreq={leftFreq} 
            rightFreq={rightFreq} 
            width={280} 
            isPlaying={isPlaying}
        />]
    )
  }, [leftAnalyserRef, rightAnalyserRef, isPlaying])

  return (
    <Stack spacing={0} alignItems="center" justifyContent={'flex-start'} sx={{ p: 4, maxWidth: 500, mx: "auto", height: '100%', width: '100%'}} bgcolor={'black'}>
        <AnimatePresence>
        <MotionStack
            spacing={4}
            width={'100%'}
            position={'absolute'}
            sx={{bgcolor: 'white', zIndex: 1, justifyContent: 'flex-start'}}
            initial={{opacity: 1, height: '0px'}}
            animate={
                toggleMenu ? 
                {
                    height: '25%',
                    opacity: 1,
                    overflow: 'scroll'
                }
                :
                {
                    height: '0px',
                    overflow: 'hidden'
                }
            }
            transition={{duration: 1}}
            exit={{opacity: 1, height: '0px'}}
        >
            <Stack justifyContent={'flex-start'} alignItems={'center'}  width={'100%'} sx={{zoom: 0.75}}>
                <Typography>
                    {`Binaural Wave: ${isPlaying ? `${Math.abs(rightFreq - leftFreq).toFixed(1)} hz` : ''}`}
                </Typography>

                <Stack width={'90%'}>
                    <WaveType leftWave={leftWave} rightWave={rightWave} setLeftWave={setLeftWave} setRightWave={setRightWave}/>

                    <BinauralPresets leftFreq={leftFreq} rightFreq={rightFreq} setLeftFreq={setLeftFreq} setRightFreq={setRightFreq}/>

                    <Compressor values={compVals} setValue={setValue} />
                </Stack>

                <Stack direction={'row'} height={'100%'} width={'100%'}>
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

                <Button onClick={() => setToggleMenu(false)}>Close</Button>
            </Stack>

        </MotionStack>
        </AnimatePresence>

        <Stack alignItems={'center'}>
            <Typography color="white" variant="h7">{`Binaural Wave Tuner`}</Typography>
            <Button onClick={() => setToggleMenu(prev => !prev)}>Menu</Button>
            <Stack width="100%" height='50%' minHeight={'500px'} justifyContent={'center'} alignItems={'center'} direction={'row'}>
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
