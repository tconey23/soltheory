import { motion, AnimatePresence } from 'framer-motion';
import { Stack } from '@mui/material';

const FadeStack = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { duration: 0.5 },
  ...props
}) => {
  const MotionWrapper = motion(Stack);
  return (
    <AnimatePresence>
        <MotionWrapper
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            {...props}
        >
            {children}
        </MotionWrapper>
    </AnimatePresence>
  );
};

export default FadeStack;
