import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { Suspense } from 'react';

const VideoObject = ({fileInfo, URL, videoRef, w, h, outerWidth, outerHeight}) => {
  
    const [isHover, setIsHover] = useState(false)
  
  return (
    <Stack
     direction={'column'} 
     sx={{ height: outerHeight ? outerHeight : '100%', width: outerWidth ? outerWidth : '50%' }} 
     padding={1}
     justifyContent={'center'}
     alignItems={'center'}
     > 
        <video
             onMouseOver={() => setIsHover(true)}
             onMouseOut={() => setIsHover(false)}
            ref={videoRef}
            src={fileInfo?.URL || URL}
            preload="metadata"
            width={w || '50%'}
            height={h || 'auto'}
            style={{border: '1px solid black'}}
            onLoadedMetadata={(e) => {
                e.target.currentTime = e.target.duration; 
            }}
            controls={isHover}
        />
    </Stack>
  );
};

export default VideoObject;