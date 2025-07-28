import { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from 'react-router-dom';
import { fetchVideos } from './helpers/functions';
import SixPicsVideoPlayer from './SixPicsVideoPlayer';
import TextBoxes from './TextBoxes';
import ResultsPage from './ResultsPage';
import confetti from 'canvas-confetti';
import useGlobalStore from '../../../business/useGlobalStore';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

const GameWrapper = ({ pack, setPack }) => { 
  const [levels, setLevels] = useState([]);
  const [levelScore, setLevelScore] = useState([]);
  const [levelsPlayed, setLevelsPlayed] = useState(0)
  const [wins, setWins] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [refreshScore, setRefreshScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [giveUp, setGiveUp] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const {width, height } = useScreenSize();
  const [forceRefresh, setForceRefresh] = useState(0)
  const [enablePlay, setEnablePlay] = useState()
  const [attempts, setAttempts] = useState(0)
  const [playStage, setPlayStage] = useState(false)
  const [stage, setStage] = useState(0)

  const inGame = useGlobalStore((state) => state.inGame)
  const setInGame = useGlobalStore((state) => state.setInGame)
  const userMeta = useGlobalStore((state) => state.userMeta)


  
  const loc = useLocation()
  const isDemo = loc?.pathname?.includes('/promo/')

  const sliderRef = useRef();

  const navTo = useNavigate()

  const next = () => {
  setIsWin(false); 
  setShowGiveUp(false)
  setPlayStage(false)                
  setStage(0)
  setTimeout(() => {
    sliderRef.current?.slickNext();
  }, 50);
};
  const prev = () => sliderRef.current?.slickPrev();

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    afterChange: setActiveSlide,
  };

  useEffect(() => {
    if(inGame){
      setInGame(false)
    }
  }, [inGame])

  // Fetch level data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchVideos(pack?.id);
        if (res) {
          setLevels(res);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    })();
  }, [pack]);

  // Initialize level scores
  useEffect(() => {
    if (levels.length > 0 && levelScore.length === 0) {

      const getHintAllowance = (ans) =>{
        let hintLength = ans.replaceAll(" ",'').length / 2
        
        return Math.floor(hintLength)
      }
      
      const newScores = levels.map((_, i) => (
        { 
          level: i, 
          score: 100, 
          hints: getHintAllowance(levels[i].answer), 
          hintsUsed: 0,
          reloadedHints: false
        }));
      setLevelScore(newScores);
      setInGame(true)
    }

    if(levels?.length < 1){
      setInGame(false)
    }

  }, [levels]);

  // Calculate total score
  useEffect(() => {
    const total = levelScore.reduce((acc, l) => acc + (l.score || 0), 0);
    setTotalScore(total);
    setRefreshScore((prev) => prev + 1);
  }, [levelScore]);

  // Trigger confetti on win
  useEffect(() => {
    if (wins > 0 && !gameOver) {
      const confettiSettings = {
        particleCount: 300,
        spread: 80,
        startVelocity: 100,
        origin: { y: 0.8 },
        useWorker: true,
      };
      confetti({ ...confettiSettings, angle: 45, origin: { y: 0.8, x: 0 } });
      confetti({ ...confettiSettings, angle: 135, origin: { y: 0.8, x: 1 } });
    }
    if(gameOver){
      setInGame(false) 
    }
  }, [wins, gameOver]);



  // End game when last slide reached
  useEffect(() => {
    if (levels.length > 0 && activeSlide >= levels.length -1) {
      // setGameOver(true);
    }
  }, [activeSlide, levels.length]);

  useEffect(() => {
  }, [isWin])

  const startOver = () => {
    setWins(0);
    setTotalScore(0);
    setRefreshScore(0);
    setGameOver(false);
    setShowGiveUp(false);
    setGiveUp(false);
    setIsWin(false);
    setLevelScore([]);        // Re-initialize once levels are fetched again
    setActiveSlide(0);
    sliderRef.current?.slickGoTo(0);  // Reset the slider to first slide

    // Optionally refetch videos (if you want a full reset of content)
    (async () => {
      try {
        const res = await fetchVideos(pack?.id);
        if (res) {
          setLevels(res);
        }
      } catch (error) {
        console.error('Error fetching videos on restart:', error);
      }
    })();
    setForceRefresh(prev => prev +1)
  };

  useEffect(() =>{
    if(levels?.length > 0 && levelsPlayed == levels?.length){
      setGameOver(true)
    }
  }, [levelsPlayed])

  return (
    <Stack direction="column" sx={{ height: '100%', width: '100%' }} justifyContent="flex-start" alignItems="center" marginTop={2}>
      <Stack key={forceRefresh} direction={'row'} width={'100%'} justifyContent={'space-evenly'} alignItems={'center'}>
        
          <Box sx={{width: '33%', marginBottom: 2}}>
            <Button onClick={() => {
              if(isDemo){
                navTo(loc?.pathname)
              } else {
                navTo('/games/6pics')
              }
              setPack('')

              }}>Start over</Button>
          </Box>
        
        <Stack key={refreshScore} sx={{width: '33%'}}>
          {!gameOver && levelScore[activeSlide] && (
            <>
              <Typography>{`Points ${levelScore[activeSlide]?.score}/100`}</Typography>
            </>
          )}
        </Stack>
        <Box sx={{width: '33%'}}>
          {gameOver ? 
            <Typography></Typography>
          :
            <Typography>{`Pic# ${activeSlide +1}`}</Typography>
          }
        </Box>
      </Stack>

      <Slider ref={sliderRef} {...settings} style={{width:'100%', height: '77.5dvh'}}>
        {!gameOver &&
          levels.map((level, i) => {
            return (
            <Stack id='game_stage' key={i} height={'100%'}>
              {i === activeSlide && (
                <Stack  justifyContent="center" alignItems="center" direction="column" sx={{ height: '98%', width: '100%' }}>
                  <SixPicsVideoPlayer
                    isDemo={isDemo}
                    isWin={isWin}
                    setIsWin={setIsWin}
                    wins={wins}
                    level={level}
                    setWins={setWins}
                    next={next}
                    setLevelScore={setLevelScore}
                    levelScore={levelScore}
                    setRefreshScore={setRefreshScore}
                    index={i}
                    setShowGiveUp={setShowGiveUp}
                    showGiveUp={showGiveUp}
                    width={width}
                    height={height}
                    giveUp={giveUp}
                    setGiveUp={setGiveUp}
                    forceRefresh={forceRefresh}
                    setGameOver={setGameOver}
                    setLevelsPlayed={setLevelsPlayed}
                    levelsPlayed={levelsPlayed}
                    levels={levels}
                    setEnablePlay={setEnablePlay}
                    enablePlay={enablePlay}
                    attempts={attempts}
                    setAttempts={setAttempts}
                    playStage={playStage}
                    setPlayStage={setPlayStage}
                    stage={stage}
                    setStage={setStage}
                  />
                  <TextBoxes
                    isDemo={isDemo}
                    forceRefresh={forceRefresh}
                    isWin={isWin}
                    setIsWin={setIsWin}
                    answer={level.answer}
                    setWins={setWins}
                    wins={wins}
                    next={next}
                    prev={prev}
                    levelScore={levelScore}
                    setLevelScore={setLevelScore}
                    index={i}
                    setShowGiveUp={setShowGiveUp}
                    showGiveUp={showGiveUp}
                    width={width}
                    height={height}
                    totalScore={totalScore}
                    giveUp={giveUp}
                    setLevelsPlayed={setLevelsPlayed}
                    setGiveUp={setGiveUp}
                    setEnablePlay={setEnablePlay}
                    attempts={attempts}
                    setAttempts={setAttempts}
                    playStage={playStage}
                    setPlayStage={setPlayStage}
                    level={level}
                    stage={stage}
                    setStage={setStage}
                  />
                </Stack>
              )}
            </Stack>
          )}
          )}

        {gameOver && <ResultsPage levels={levels} levelScore={levelScore} demo={isDemo} score={totalScore} gamePack={pack} width={width} height={height} />}
      </Slider>
        <Stack
        width={'100%'}
        height={'10dvh'}
        justifyContent={'flex-start'}
      >
        {pack?.promo_name &&
          <a href={pack?.promo_url} target="_blank" rel="noopener noreferrer">
            <img
              width="100%"
              height="auto"
              src={pack?.promo_image}
              alt="Promo"
              style={{ display: "block" }}
            />
          </a>
        }
      </Stack>
    </Stack>
  );
};

export default GameWrapper;
