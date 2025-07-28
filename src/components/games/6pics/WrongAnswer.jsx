import { useEffect, useState } from 'react';
import { Stack, TextField, Typography, Button } from '@mui/material';
import { motion } from "framer-motion";

const MotionStack = motion(Stack);
const MotionText = motion(TextField)

const WrongAnswer = ({inputLetters, setWrongAnswer}) => {
  return (
     <Stack height={'100%'} bgcolor={'#00000063'} justifyContent={'center'}>
            <MotionStack
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              bgcolor="#ffffffe0"
              width="100%"
              height="33vh"
              justifyContent="center"
              alignItems="center"
            >
            <Typography color="blue" fontSize={30}><i className="fi fi-rs-face-sad-sweat"></i></Typography>
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">{`Sorry! Your answer:`}</Typography>
            {inputLetters?.length > 0 && (
              <Typography>
                {`"${inputLetters.join('').toLowerCase()}"`}
              </Typography>
            )}
            <Typography color="black" fontSize={25} fontFamily="Fredoka Regular">Is incorrect!</Typography>
            <Button onClick={() => setWrongAnswer(false)} variant="contained">Try again</Button>
            </MotionStack>
        </Stack>
  );
};

export default WrongAnswer;