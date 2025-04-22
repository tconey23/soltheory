import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar, setRef } from '@mui/material';
import { Box } from '@mui/system';
import { Slider } from '@mui/material';
import { useGlobalContext } from '../../../business/GlobalContext';
import { useMemo } from 'react';
import VideoObject from '../six_pics/VideoObject';
import { supabase } from '../../../business/supabaseClient';

const getVideoDuration = (videoSrc) => {
  return new Promise((resolve, reject) => {
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = videoSrc;

    vid.onloadedmetadata = () => {
      resolve(vid.duration);
      vid.remove();
    };

    vid.onerror = () => {
      reject("Error loading video metadata.");
    };
  });
};


const VideoEditor = ({setVideoToEdit, video, setRefresh, setSelection}) => {
  const {alertProps, setAlertProps} = useGlobalContext()
  const [ready, setReady] = useState(false);
  const vidDuration = useRef();
  const currentVidTime = useRef();
  const [sliderTime, setSliderTime] = useState(0);
  const [stops, setStops] = useState([]);
  const [loops, setLoops] = useState([]);
  const [loopSpeeds, setLoopSpeeds] = useState({});
  const [selectedLoopIndex, setSelectedLoopIndex] = useState(null);
  const [playBackSpeed, setPlaybackSpeed] = useState(1)
  const [answer, setAnswer] = useState('')


  const derivedLoops = useMemo(() => {
    const loops = [];
    for (let i = 0; i < stops.length - 1; i += 2) {
      const key = `${stops[i]}-${stops[i + 1]}`;
      loops.push({
        start: stops[i],
        end: stops[i + 1],
        speed: loopSpeeds[key] || 1,
      });
    }
    return loops;
  }, [stops, loopSpeeds]);


  const marks = stops.map((s) => ({
    value: s,
    label: `${s.toFixed(1)}s`,
  }));

  const videoRef = useRef(null);

  const handleSliderChange = (e, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      currentVidTime.current = newValue;
      setSliderTime(newValue);
    }
  };

  const getMeta = async () => {
    try {
      const res = await getVideoDuration(video.public_url);
      if (res && typeof res === 'number' && res > 0) {
        setReady(true);
        vidDuration.current = res;
      }         
    } catch (error) {
        console.error(error);
    }
    
  };

  const saveVideoFile = async () => {
    const updatedVideo = {
      stops,
      loops: derivedLoops,
      playback_speed: playBackSpeed,
      name: answer || video.name,
      ready: true,
    };
  
    const { data, error } = await supabase
      .from('sixpicksvideos')
      .update(updatedVideo)
      .eq('id', video.id);
  
    if (error) {
      console.error('Save error:', error);
      setAlertProps({ open: true, message: 'Failed to save video edits.', severity: 'error' });
    } else {
      setAlertProps({ open: true, message: 'Video saved successfully!', severity: 'success' });
      setVideoToEdit(null); // Exit edit mode
      setRefresh((prev) => !prev); // Optional: trigger re-fetch or re-render
    }
  };



  useEffect(() => {
    if (!videoRef.current) return;
    let animationFrameId;

    const logCurrentTime = () => {
        const time = videoRef.current.currentTime;
        currentVidTime.current = time;
      
        setSliderTime((prev) => {
          if (Math.abs(prev - time) > 0.02) {
            return time;
          }
          return prev;
        });
      
        animationFrameId = requestAnimationFrame(logCurrentTime);
      };

    const startLogging = () => {
      animationFrameId = requestAnimationFrame(logCurrentTime);
    };

    const stopLogging = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const video = videoRef.current;
    video.addEventListener('play', startLogging);
    video.addEventListener('pause', stopLogging);
    video.addEventListener('ended', stopLogging);

    return () => {
      video.removeEventListener('play', startLogging);
      video.removeEventListener('pause', stopLogging);
      video.removeEventListener('ended', stopLogging);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ready]);

  useEffect(() => {
    if (selectedLoopIndex !== null && loops[selectedLoopIndex] && videoRef.current) {
      videoRef.current.currentTime = loops[selectedLoopIndex].start;
    }
  }, [selectedLoopIndex]);

  useEffect(() => {
    if(videoRef.current && playBackSpeed){
        const mult = 1 * playBackSpeed
        try {
            videoRef.current.playbackRate = mult
        } catch (error) {
            setPlaybackSpeed(prev => prev - 0.01)
        }
    }
  }, [playBackSpeed, videoRef])

  useEffect(() => {
    getMeta(video)
  }, [video])

  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%' }} justifyContent={'center'} alignItems={'center'} backgroundColor={'#000000ab'}>
            <Stack direction={'column'} width={'60%'} height={'70%'} padding={5} justifyContent={'flex-start'} alignItems={'center'} backgroundColor={'white'}>
                <Stack direction={'row'} width={'100%'} height={'54%'}>
                    <Stack width={'33%'} height={'100%'}>
                        {ready &&
                            <Stack direction="column" spacing={2} mt={2} flexWrap="wrap" height={'100%'}>
                                <Button disabled={!currentVidTime.current} 
                                    onClick={() => {
                                        const currentTime = currentVidTime.current;
                                        setStops((prev) => [...prev, parseFloat(currentTime.toFixed(2))]);
                                    }}>
                                    Add Marker
                                </Button>
                                {stops.map((time, index) => (
                                    <Tooltip key={index} title={'Alt + click to delete'}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={(e) => {
                                                if (e.altKey) {
                                                    setStops((prev) => prev.filter((_, i) => i !== index));
                                                } else if (videoRef.current) {
                                                    videoRef.current.currentTime = time;
                                                }
                                            }}
                                        >
                                        {time.toFixed(2)}s
                                        </Button>
                                    </Tooltip>
                                ))}
                            </Stack>
                        }
                    </Stack>


                    <Stack width={'50%'} height={'80%'} justifyContent={'flex-start'} alignItems={'center'}>
                        {video && video.public_url && (
                           <VideoObject URL={video.public_url} videoRef={videoRef} w={'100%'} h={'100%'}/>
                        )}
                    </Stack>


                    <Stack width={'33%'} height={'70%'}>
                        {ready &&
                            <>
                                <Stack mt={2} spacing={1}>
                                    {derivedLoops.map((loop, index) => (
                                        <Stack key={index} direction="column" spacing={1} alignItems="flex-start" mb={2}>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                          <Typography>{loop.start.toFixed(2)}s - {loop.end.toFixed(2)}s</Typography>
                                      
                                            <Button
                                                onClick={() => {
                                                    if (videoRef.current) {
                                                    videoRef.current.currentTime = loop.start;
                                                    videoRef.current.playbackRate = loop.speed || 1;
                                                    videoRef.current.play();

                                                    const interval = setInterval(() => {
                                                        if (
                                                        videoRef.current.currentTime >= loop.end ||
                                                        videoRef.current.paused ||
                                                        videoRef.current.ended
                                                        ) {
                                                        videoRef.current.currentTime = loop.start;
                                                        if (videoRef.current.paused || videoRef.current.ended) {
                                                            clearInterval(interval);
                                                        } else {
                                                            videoRef.current.play();
                                                        }
                                                        }
                                                    }, 50);

                                                    const stopLoop = () => clearInterval(interval);
                                                    videoRef.current.addEventListener('pause', stopLoop);
                                                    videoRef.current.addEventListener('ended', stopLoop);

                                                    setTimeout(() => {
                                                        videoRef.current.removeEventListener('pause', stopLoop);
                                                        videoRef.current.removeEventListener('ended', stopLoop);
                                                    }, (loop.end - loop.start) * 1000 + 1000); // buffer time
                                                    }
                                                }}
                                                >
                                                Play
                                            </Button>
                                      
                                          <Button onClick={() => setSelectedLoopIndex(index)}>Edit</Button>
                                          <Button onClick={() => setLoops(prev => prev.filter((_, i) => i !== index))}>
                                            Delete
                                          </Button>
                                        </Stack>
                                      
                                        <Stack direction="row" alignItems="center" spacing={2} width="100%">
                                          <Typography variant="caption" minWidth={60}>Speed: {loop.speed?.toFixed(2)}x</Typography>
                                          <Slider
                                            size="small"
                                            value={loop.speed || 1}
                                            step={0.1}
                                            min={0.5}
                                            max={3}
                                            onChange={(e, newSpeed) => {
                                                const key = `${loop.start}-${loop.end}`;
                                                setLoopSpeeds((prev) => ({
                                                  ...prev,
                                                  [key]: newSpeed,
                                                }));
                                              }}
                                            valueLabelDisplay="auto"
                                            sx={{ width: '100px' }}
                                          />
                                        </Stack>
                                      </Stack>
                                      
                                    ))}
                                </Stack>
                                {selectedLoopIndex !== null && loops[selectedLoopIndex] && (
                                    <Stack mt={2}>
                                        <Slider
                                            value={[loops[selectedLoopIndex].start, loops[selectedLoopIndex].end]}
                                            min={0}
                                            max={vidDuration.current || 100}
                                            step={0.01}
                                            onChange={(e, newValue) => {
                                                const [newStart, newEnd] = newValue;
                                                setLoops(prev =>
                                                    prev.map((loop, idx) =>
                                                        idx === selectedLoopIndex ? { start: newStart, end: newEnd } : loop
                                            )
                                        );
                                    }}
                                    valueLabelDisplay="auto"
                                    />
                                        <Button onClick={() => setSelectedLoopIndex(null)}>Done Editing</Button>
                                    </Stack>
                                )}
                            </>
                        }
                    </Stack>
                </Stack>


                <Stack direction={'column'} height={'25%'}>
                {ready &&
                    <>
                            <Button onClick={() => setPlaybackSpeed(1)}>Reset</Button>
                            <Slider valueLabelDisplay width={'80%'} min={1} max={5} step={0.01} value={playBackSpeed} onChange={(e) => setPlaybackSpeed(e.target.value)} />
                        <Stack direction={'row'} height={'54%'}>
                            <Box>
                                <Button
                                    onClick={() => {
                                        if (videoRef.current) {
                                            videoRef.current.currentTime = 0; // ⏪ Reset actual video playback
                                            currentVidTime.current = 0;       // 🧠 Update ref
                                            setSliderTime(0);                 // 🎯 Update slider position in UI
                                        }
                                    }}
                                    >
                                    <Avatar>
                                    <i className="fi fi-br-refresh"></i>
                                    </Avatar>
                                </Button>
                            </Box>
                            <Box>
                                <Button onClick={() => videoRef.current.play()}>
                                <Avatar>
                                    <i className="fi fi-sr-play"></i>
                                </Avatar>
                                </Button>
                            </Box>
                            <Box>
                                <Button onClick={() => videoRef.current.pause()}>
                                <Avatar>
                                    <i className="fi fi-sr-pause"></i>
                                </Avatar>
                                </Button>
                            </Box>
                        </Stack>
                    </> 
                }
                </Stack>

                {ready && 
                    <>
                        <Stack direction={'row'} width={'80%'} height={'25%'} style={{overFlowY: 'auto'}}>
                            <InputLabel sx={{width: '3%'}}>0s</InputLabel>
                            <Slider
                                value={sliderTime}
                                max={vidDuration.current / playBackSpeed || 100}
                                onChange={handleSliderChange}
                                step={0.01}
                                marks={marks}
                                valueLabelDisplay="auto"
                                sx={{
                                    '& .MuiSlider-mark': {
                                        backgroundColor: '#1976d2',
                                        height: 10,
                                        width: 2,
                                    },
                                    marginLeft: 2,
                                    marginRight: 2
                                }}
                                />
                            <InputLabel sx={{width: '7%'}}>
                                {
                                    `${(vidDuration.current / playBackSpeed).toFixed(2)}s`
                                }
                            </InputLabel>
                        </Stack>

                        <Stack alignItems={'center'} width={'80%'} justifyContent={'center'}>
                            <InputLabel>Answer</InputLabel>
                            <TextField sx={{width: '100%', textAlign: 'center'}} value={video.name || answer} onChange={(e) => setAnswer(e.target.value)} />
                            <Button onClick={saveVideoFile} >Save Video</Button>
                            <Button onClick={() => setSelection(null)} >Cancel</Button>
                        </Stack>
                    </>
                }
            </Stack>
      </Stack>

  );
};

export default VideoEditor;
