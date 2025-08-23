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


  const adImgs = [
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
      image: isMobile ? '/mom_ad_desktop.png' : '/mom_ad_desktop.png',
      url: 'https://www.andreasnlp.com/trainings/metaphors-of-movement/l1/',
      dims: {
        width: isMobile ? '100%' : '728px', 
        height: isMobile ? '60px' : '169px'
      }
    },
    {
      name: isMobile ? 'crochet_life_banner' : 'crochet_life_banner',
      type: isMobile ? 'mobile' : 'desktop',
      image: isMobile ? '/crochetlife_banner.png' : '/crochetlife_banner.png',
      url: 'https://www.andreasnlp.com/trainings/metaphors-of-movement/l1/',
      dims: {
        width: isMobile ? '100%' : '100%', 
        height: isMobile ? '60px' : '169px'
      }
    }
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAdIndex((prev) => (prev + 1) % adImgs.length); 
    }, 8000);

    return () => clearTimeout(timeout);
  }, [adIndex]);

  return (
    <div className='adSpace'>
      <AnimatePresence >
        <motion.div
          key={adImgs[adIndex].name + adIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
        >
          <img src={adImgs[adIndex].image} width='100%' height='auto'/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdSpace;