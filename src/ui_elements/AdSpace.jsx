import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdSpace = () => {
  const [adIndex, setAdIndex] = useState(0);

  const ads = [
    {
      name: 'personos_mobile',
      type: 'mobile',
      image: '/personos_ad_mobile.jpeg',
      url: 'https://www.personos.ai/'
    },
    {
      name: 'mom_mobile',
      type: 'mobile',
      image: '/mom_ad_mobile.jpeg',
      url: 'https://www.andreasnlp.com/trainings/metaphors-of-movement/l1/'
    }
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAdIndex((prev) => (prev + 1) % ads.length); 
    }, 8000);

    return () => clearTimeout(timeout);
  }, [adIndex]);

  return (
    <Stack sx={{cursor: 'pointer'}} height={'60px'} width={'100%'} overflow="hidden" position="fixed">
      <AnimatePresence mode="wait">
        <motion.div
          key={ads[adIndex].name + adIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <Link to={ads[adIndex].url} target="_blank" rel="noopener noreferrer">
            <img
              src={ads[adIndex].image}
              alt={ads[adIndex].name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </Stack>
  );
};

export default AdSpace;