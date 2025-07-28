import { useEffect, useState } from 'react';
import { Stack, TextField, Typography, Button, Box, Slider } from '@mui/material';

const MoreHints = ({levelScore, index, longestWord, reloadHints, setReloadHints, getMoreHints, setMoreHints}) => {
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
      <Stack height={'30%'} width={'75%'} bgcolor={'white'} justifyContent={'center'} alignItems={'center'} borderRadius={2}>
            {levelScore[index]?.score > longestWord && !levelScore[index]?.reloadedHints &&
              <>              
                <Typography textAlign={'center'} fontFamily={'fredoka regular'} fontSize={18}>{levelScore[index]?.score > longestWord ? `You can reload a maximum of ${Math.floor(longestWord /2)} hints.`: 'You cannot afford to reload points for this level'}</Typography>
                <Typography textAlign={'center'} fontFamily={'fredoka regular'} fontSize={15}>{`Additional hints will count against your total score`}</Typography>
                <Typography marginTop={'10px'} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={15}>{`Are you sure you want to get ${reloadHints} more hints?`}</Typography>
                <Box sx={{width: '75%', display: 'flex', flexDirection: 'column'}}>
                  <Slider min={1} max={Math.floor(longestWord /2)} step={1} valueLabelDisplay={true} value={reloadHints} onChange={(e) => setReloadHints(e.target.value)}/>
                  <Button
                  onClick={() => {
                    
                    if(reloadHints){
                      getMoreHints(reloadHints)
                    } else {
                      setMoreHints(false)
                    }
                    
                    }}>{reloadHints? 'Reload!' : 'Cancel'}</Button>
                </Box>
              </>
            }

            {levelScore[index]?.reloadedHints &&
            <>
              <Typography marginX={2} marginY={'10px'} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={18}>{`You can only reload hints once per level`}</Typography>
              <Box sx={{width: '75%', display: 'flex', flexDirection: 'column'}}>
                <Button onClick={() => setMoreHints(false)}>Ok</Button>
              </Box>
            </>
            }
          </Stack>
    </Stack>
  );
};

export default MoreHints;