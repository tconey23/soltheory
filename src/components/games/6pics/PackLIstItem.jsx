import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {ListItem} from '@mui/material';

const PackLIstItem = ({name, value, percentWidth}) => {
    // console.log({
    //     [name]: value
    // })
  return (
        <Stack direction={'column'} width={`${percentWidth}%`} alignItems={'center'} justifyContent={'flex-start'} height={'100px'}>
                <Typography fontSize={20}>{name}</Typography>
                {name === 'Graphic' 
                ?
                    <video
                    src={value}
                    preload="metadata"
                    width={'95%'}
                    height={'80%'}
                    onLoadedMetadata={(e) => {
                        e.target.currentTime = e.target.duration;
                    }}
                    />
                :
                    <>
                        {
                            typeof value === "string" &&
                            <Typography>{value}</Typography>
                        }
                        {
                            typeof value === "number" &&
                            <Typography>{value}</Typography>
                        }
                        {
                            name === 'Videos' &&
                            <Typography>{value?.length}</Typography>
                        }
                    </>
                }
        </Stack>
  );
};

export default PackLIstItem;