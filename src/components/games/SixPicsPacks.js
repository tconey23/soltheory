import { useEffect, useRef, useState } from 'react';
import { List, ListItem, Stack, Typography } from '@mui/material';
import { getSixPicsPack } from '../../business/apiCalls';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../business/GlobalContext';

const PackButton = ({name, icon, iconType, hover}) => {
    const {isMobile} = useGlobalContext()
    const [font, setFont] = useState('Fredoka')
    const videoRef = useRef()

    useEffect(() =>{
        if(videoRef.current && hover){
            videoRef.current.play()
        }
    }, [videoRef, hover])

    return (
        <Stack
            padding={2} 
            direction={'row'}
            height={100} justifyContent={'center'} alignItems={'center'}
            sx={{

                transition: 'all 0.25s ease-in-out',
                "&:hover": {
                    cursor: 'pointer',
                    boxShadow: '3px 3px 7px 1px #9a1fd94a',
                    borderRadius: 20,
                    scale: 1.05
                }
            }}>
                {
                    iconType === 'svg' ? 
                <img height={'80px'}  src={icon}/>
                :
                <video ref={videoRef} style={{height: '60px', margin: 5}} muted autoplay loop>
                    <source src={icon} type="video/mp4"/>
                </video>
                }
            <Typography fontSize={50} fontFamily={font}>{name.toUpperCase()}</Typography>
        </Stack>
    )
}

const SixPicsPacks = ({setGamePack, gamePack}) => {

    const {isMobile} = useGlobalContext()
    const [packs, setPacks] = useState([])
    const [hover, setHover] = useState(false)

    const fetchPacks = async () => {
        try {
            const res = await getSixPicsPack()
            res.forEach((r) => {
                setPacks(prev => [
                    ...prev,
                    r
                ])
            })
            
        } catch (error) {
            console.error(error);
        }
    }

useEffect(() => {
    fetchPacks()
}, [])

  return (
    <Stack direction={'column'} sx={{ height: '90%', width: '100%', scale: isMobile ? 0.8 : 1,}} justifyContent={'flex=start'} alignItems={'center'} >
        <Typography fontFamily={'Fredoka Regular'} fontSize={40}>Select Pack</Typography>
        <Stack sx={{overflow: 'auto'}}>
            <List sx={{width: '100%'}}>
                {packs && packs.map((p, i) => {
                    let fileType = p.graphic.split('')
                    return (
                        <ListItem onClick={() => setGamePack(p.pack_name)} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
                            <PackButton name={p.pack_name} icon={p.graphic} iconType={fileType?.slice(-3).join().replaceAll(',','')} hover={hover}/>
                        </ListItem>
                    )
                })}
            </List>
        </Stack>
    </Stack>
  );
};

export default SixPicsPacks;