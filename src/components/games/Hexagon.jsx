import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { motion } from 'framer-motion';

const Hexagon = ({dims}) => {
    const [size, setSize] = useState(100)
    const [strokeColor] = useState("#000")
    const [strokeSize] = useState(1)
    const [purple] = useState('#dd95ff')
    const [yellow] = useState('#fff200')
    const [green] = useState('#45d500')

    useEffect(()=>{
        if(dims){
            setSize(dims)
        }
    }, [dims])

    return (
          <motion.svg
           width={size} 
           height={size} 
           viewBox="0 0 186 200" 
           fill="none" 
           xmlns="http://www.w3.org/2000/svg"
           animate={{
            rotate: [0,360]
           }}
           transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
           }}
           >
            <path d="M135.435 25.5L93 99L50.5648 25.5L135.435 25.5Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M7.56476 99.5L50 26L92.4352 99.5H7.56476Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M93.5648 99.5L136 26L178.435 99.5H93.5648Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M50.5648 174.5L93 101L135.435 174.5H50.5648Z" fill={green} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M178.435 100.5L136 174L93.5648 100.5L178.435 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
            <path d="M92.4352 100.5L50 174L7.56476 100.5L92.4352 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
          </motion.svg>
        
      );
};

export default Hexagon;