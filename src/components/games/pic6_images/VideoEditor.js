import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar } from '@mui/material';
import { Box } from '@mui/system';
import { Slider } from '@mui/material';
import { useGlobalContext } from '../../../business/GlobalContext';
import { addNewCategory, getSixPicsPack } from '../../../business/apiCalls';

const getVideoDuration = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      resolve(video.duration);
      video.remove();
    };

    video.onerror = () => {
      reject("Error loading video metadata.");
    };
  });
};

const VideoEditor = () => {
  const {alertProps, setAlertProps} = useGlobalContext()
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [ready, setReady] = useState(false);
  const vidDuration = useRef();
  const currentVidTime = useRef();
  const [sliderTime, setSliderTime] = useState(0);
  const [stops, setStops] = useState([]);
  const [loops, setLoops] = useState([]);
  const [selectedLoopIndex, setSelectedLoopIndex] = useState(null);
  const [fileData, setFileData] = useState()
  const [playBackSpeed, setPlaybackSpeed] = useState(1)
  const [answer, setAnswer] = useState()
  const [packName, setPackName] = useState()
  const [packType, setPackType] = useState('existing')
  const [packs, setPacks] = useState([])

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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'video/mp4') {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid .mp4 video file');
    }
  };

  const getMeta = async () => {
    const res = await getVideoDuration(videoURL);
    if (res && typeof res === 'number' && res > 0) {
      setReady(true);
      vidDuration.current = res;
    } else {
      setReady(false);
    }
  };

  const renameFile = (originalFile, newFileName) => {
    return new File([originalFile], newFileName, {
      type: originalFile.type,
      lastModified: new Date(),
    });
  };

  const saveVideoFile = async  () => {

    if(!packName || !answer || !stops || !loops || !playBackSpeed || !videoFile) {
        setAlertProps({
            text: 'Missing metadata. Please check all require fields',
            disposition: 'error',
            severity: 'error',
            display: true
        })
        return
    }

    
    setFileData(
        {
            pack: packName,
            answer: answer,
            markers: stops,
            loops: loops,
            playBackSpeed: playBackSpeed
        }
    )
    
    const renamedVid = renameFile(videoFile, `${packName.replaceAll(' ', '').toLowerCase()}_${answer.replaceAll(' ', '').toLowerCase()}`)

    const checkPack = await getSixPicsPack (packName)

    
    if(checkPack){

    } else {
        
        const addNewPack = await addNewCategory(packName)

        console.log(addNewPack)
    }

  }

  useEffect(() =>{
    if(fileData){
        console.log(fileData)
    }

    console.log(videoFile)
  }, [fileData, videoFile])

  useEffect(() => {
    if (videoURL) {
      getMeta();
    }
  }, [videoURL, videoFile]);

  useEffect(() => {
    if (!videoRef.current) return;
    let animationFrameId;

    const logCurrentTime = () => {
        const time = videoRef.current.currentTime;
        currentVidTime.current = time;
      
        // Only update state if it differs by > 0.02s to prevent excessive renders
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

  return (
        <Stack direction={'column'} sx={{ height: '100%', width: '100%' }} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'column'} width={'60%'} height={'70%'} padding={5} justifyContent={'flex-start'} alignItems={'center'} backgroundColor={'#80808059'}>
                {
                    packType === 'existing' ? 
                            <Select value={packName} 
                            onChange={(e) => {
                                if (e.target.value === 'NEW') 
                                    {
                                        setPackType(e.target.value)
                                    } else {
                                        setPackType('existing')
                                        setPackName(e.target.value)
                                    }
                            }}>
                                <MenuItem value={'NEW'}>NEW</MenuItem>
                            </Select>
                        :
                        <TextField value={packName} onChange={(e) => setPackName(e.target.value)}></TextField>
                }
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


                    <Stack width={'33%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
                        {videoURL && ready && (
                            <video ref={videoRef} height={'85%'} muted preload='metadata'>
                                <source src={videoURL} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <Stack padding={2}>
                            <input type="file" accept="video/mp4" onChange={handleVideoSelect} />
                        </Stack>
                    </Stack>


                    <Stack width={'33%'} height={'70%'}>
                        {ready &&
                            <>
                                <Button 
                                    onClick={() => {
                                        const time = currentVidTime.current;
                                        setLoops((prev) => [...prev, { start: time, end: time + 2, speed: 1 }]);
                                    }}>
                                        New Loop (2s)
                                </Button>
                                <Stack mt={2} spacing={1}>
                                    {loops.map((loop, index) => (
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

                                                    // Optional: clean up if navigating away
                                                    const stopLoop = () => clearInterval(interval);
                                                    videoRef.current.addEventListener('pause', stopLoop);
                                                    videoRef.current.addEventListener('ended', stopLoop);

                                                    // Clean up event listeners after loop ends
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
                                              setLoops(prev =>
                                                prev.map((l, i) =>
                                                  i === index ? { ...l, speed: newSpeed } : l
                                                )
                                              );
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

                        <Stack>
                            <InputLabel>Answer</InputLabel>
                            <TextField value={answer} onChange={(e) => setAnswer(e.target.value)} />
                            <Button onClick={saveVideoFile} >Save Video</Button>
                        </Stack>
                    </>
                }
            </Stack>
      </Stack>

  );
};

export default VideoEditor;
