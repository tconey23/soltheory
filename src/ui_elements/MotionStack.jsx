// ui_elements/MotionStack.jsx
import { motion } from 'framer-motion';
import { Stack } from '@mui/material';

const MotionStack = ({
  children,
  initial = { x: -200 },
  animate = { x: 0 },
  exit = { x: -200 },
  transition = { duration: 0.5 },
  ...props
}) => {
  const MotionWrapper = motion(Stack);

  return (
    <MotionWrapper
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
};

export default MotionStack;
