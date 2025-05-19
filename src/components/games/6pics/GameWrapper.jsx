import { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { fetchVideos } from './helpers/functions';
import SixPicsVideoPlayer from './SixPicsVideoPlayer';
import TextBoxes from './TextBoxes';
import ResultsPage from './ResultsPage';
import confetti from 'canvas-confetti';

const GameWrapper = ({ pack }) => { 
  const [levels, setLevels] = useState([]);
  const [levelScore, setLevelScore] = useState([]);
  const [wins, setWins] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [refreshScore, setRefreshScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [isWin, setIsWin] = useState(false)

  const sliderRef = useRef();

  const next = () => sliderRef.current?.slickNext();
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

  // Fetch level data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchVideos(pack?.id);
        if (res) {
          setLevels(res);
          console.log('Fetched levels:', res);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    })();
  }, [pack]);

  // Initialize level scores
  useEffect(() => {
    if (levels.length > 0 && levelScore.length === 0) {
      const newScores = levels.map((_, i) => ({ level: i, score: 100 }));
      setLevelScore(newScores);
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
  }, [wins, gameOver]);

  // End game when last slide reached
  useEffect(() => {
    if (activeSlide === levels.length - 1) {
      setGameOver(true);
    }
  }, [activeSlide, levels.length]);

  return (
    <Stack direction="column" sx={{ height: '98%', width: '100%' }} justifyContent="flex-start" alignItems="center" marginTop={2}>
      {!gameOver && levelScore[activeSlide] && (
        <Typography key={refreshScore}>{`Points ${levelScore[activeSlide]?.score}/100`}</Typography>
      )}

      <Slider ref={sliderRef} {...settings} style={{width:'100%', height: '100%'}}>
        {!gameOver &&
          levels.map((level, i) => (
            <Stack userData='game_stage' key={i} height={'100%'}>
              {i === activeSlide && (
                <Stack  justifyContent="center" alignItems="center" direction="column" sx={{ height: '98%', width: '100%' }}>
                  <SixPicsVideoPlayer
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
                  />
                  <TextBoxes
                    isWin={isWin}
                    setIsWin={setIsWin}
                    answer={level.answer}
                    setWins={setWins}
                    wins={wins}
                    next={next}
                    prev={prev}
                    levelScore={levelScore}
                    index={i}
                    setShowGiveUp={setShowGiveUp}
                  />
                </Stack>
              )}
            </Stack>
          ))}

        {gameOver && <ResultsPage score={totalScore} gamePack={pack} />}
      </Slider>
    </Stack>
  );
};

export default GameWrapper;
