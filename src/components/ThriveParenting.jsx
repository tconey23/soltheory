import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, Menu, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../business/useGlobalStore';
import MotionStack from '../ui_elements/MotionStack';
import { useNavigate } from 'react-router-dom';
import InProgress from '../ui_elements/InProgress';

const ThriveParenting = () => {
    const MotionText = motion(Typography); 
    const MotionAvatar = motion(Avatar);
    const [hasMounted, setHasMounted] = useState(false);
    const [renderObj, setRenderObj] = useState(<InProgress />)

return (
    <Stack
        direction="column"
        width="90%"
        height="95%"
        alignItems="center"
        justifyContent="flex-start"
        bgcolor={'#ffffffbd'}
        borderRadius={5}
        overflow={'auto'}
    >
        <MotionText
          paddingY={2}
          fontFamily="Fredoka Regular"
          fontSize={22}
          initial={hasMounted ? false : { y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Thrive Parenting
        </MotionText>

        <MotionStack
          key="account_select"
          width="85%"
          sx={{ height: '80%' }}
          alignItems="center"
          justifyContent="center"
          direction="column"
          paddingY={2}
          initial={hasMounted ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 1.5}}
        >
            {renderObj}
        </MotionStack>

    </Stack>
  );
};

export default ThriveParenting;