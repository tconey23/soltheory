import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../business/useGlobalStore';

const AdSpace = () => {
  const [adIndex, setAdIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true)
  const screen = useGlobalStore((state) => state.screen)

  
  useEffect(() =>{ 
    if(screen === 'xs'){
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [screen])


  const mobileAds = [
    {
      name: isMobile ? 'personos_mobile' : 'personos_desktop',
      type: isMobile ? 'mobile' : 'desktop',
      image: isMobile ? '/personos_ad_mobile.png' : '/personos_ad_mobile.png',
      url: 'https://www.personos.ai/', 
      dims: {
        width: isMobile ? '100%' : '728px', 
        height: isMobile ? '60px' : '169px'
      }
    },
    {
      name: isMobile ? 'mom_mobile' : 'mom_desktop',
      type: isMobile ? 'mobile' : 'desktop',
      image: isMobile ? '/mom_ad_mobile.jpeg' : '/mom_ad_desktop.png',
      url: 'https://www.andreasnlp.com/trainings/metaphors-of-movement/l1/',
      dims: {
        width: isMobile ? '100%' : '728px', 
        height: isMobile ? '60px' : '169px'
      }
    }
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAdIndex((prev) => (prev + 1) % mobileAds.length); 
    }, 8000);

    return () => clearTimeout(timeout);
  }, [adIndex]);

  return (
    <Stack sx={{cursor: 'pointer', zIndex: 100}} height={'auto'} width={'100%'} overflow="hidden" justifyContent={'center'} alignItems={'center'}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mobileAds[adIndex].name + adIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignItem: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Link to={mobileAds[adIndex].url} target="_blank" rel="noopener noreferrer" style={{maxHeight: '100%', display:'flex', alignItems: 'flex-start'}}>
            <img
              src={mobileAds[adIndex].image}
              alt={mobileAds[adIndex].name}
              style={{ width: mobileAds[adIndex]?.dims?.width, height: 'auto', objectFit: 'contain' }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </Stack>
  );
};

export default AdSpace;