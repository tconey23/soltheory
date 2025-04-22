import { useEffect, useState } from 'react';
import { Avatar, Button, List, ListItem, MenuItem, Modal, Select, Stack, Tooltip, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import VideoObject from './VideoObject';
import { Box } from '@mui/system';
import VideoEditor from '../pic6_images/VideoEditor';

const ViewPack = ({setSelection, selection}) => {
    const [packData, setPackData] = useState()
    const [videoToEdit, setVideoToEdit] = useState()
    const [packVideos, setPackVideos] = useState([])


    const getSelectedPack = async () => {
        try {
            let { data: pack, error } = await supabase
            .from('sixpicspacks')
            .select("*")
            .eq('pack_name', selection)

            if(pack && !packData){
                setPackData(pack[0])
            } else if(error){
                throw new Error(error)
            }

        } catch (error) {
            console.log(error); 
        }               

    }

    useEffect(() => {
        if(packData && packVideos.length < 1){
            if(packData.videos){
                setPackVideos(packData.videos.map((v) => {
                    return v
                }))
            }
        }
    }, [packData])

    useEffect(() => {
        if(packVideos){
            packVideos.forEach((v) =>{
                
            })
        }
    }, [packVideos])

    useEffect(() => {
        if(selection){
            getSelectedPack()
        }
    }, [selection])
    
  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%' }} justifyContent={'center'} alignItems={'center'}>
        {packData && packVideos &&
        <>
            <Stack width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Typography fontSize={'4vw'}>{packData.pack_name}</Typography>
            </Stack>
            <Stack width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Box sx={{width: '50%'}}>
                    <VideoObject URL={packData.graphic}/>
                </Box>
            </Stack>
            <Stack width={'50%'} justifyContent={'flex-start'} alignItems={'center'} sx={{height: '400px', overflowY: 'scroll'}}>
                <List>
                    {packVideos?.map((v) => {
                        if(v){
                            return (
                                <MenuItem disableRipple>
                                <Stack width={'50%'} justifyContent={'center'} alignItems={'center'}>
                                    <Box sx={{width: '50%'}}>
                                        <VideoObject URL={v.public_url}/>
                                    </Box>
                                </Stack>
                                <Button onClick={() => setVideoToEdit(v)}>
                                    <Tooltip title={`Edit Video`}>
                                        <Avatar>
                                            <i class="fi fi-rr-customize"></i>
                                        </Avatar>
                                    </Tooltip>
                                    </Button>
                                    <Select sx={{width: '30%'}}>
                                        {
                                            Object.entries(v)?.map((f) => {
                                                return  (
                                                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} padding={1}>
                                                        {
                                                            f[1] && typeof f[1] !== 'object' &&
                                                            <i style={{color: 'limeGreen'}} class="fi fi-sr-thumbs-up"></i>
                                                        }

                                                        {
                                                            typeof f[1] === 'object' && 
                                                            <>
                                                                {f[1].length > 0 ?

                                                                    <i style={{color: 'limeGreen'}} class="fi fi-sr-thumbs-up"></i>
                                                                :
                                                                    <i style={{color: 'red'}} class="fi fi-sr-thumbs-down"></i>
                                                                }
                                                            </>
                                                        }

                                                        

                                                            <ListItem>{f[0]}</ListItem>
                                                        </Stack>
                                                    )
                                                })
                                            }
                                            </Select>
                                            <Typography paddingX={1}>Ready?</Typography>
                                            {v.ready 
                                            ? 
                                            <i style={{color: 'limeGreen'}} class="fi fi-sr-thumbs-up"></i>
                                            : 
                                            <i style={{color: 'red'}} class="fi fi-sr-thumbs-down"></i>
                                            }
                                    </MenuItem>
                                        )
                                    }
                                    })}
                            </List>
            </Stack>
        </>
        }
        <Stack padding={2}>
            <Button onClick={() => setSelection(null)} variant='contained'>Done</Button>
        </Stack>
        <Modal open={videoToEdit}>
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <VideoEditor video={videoToEdit} setSelection={setVideoToEdit}/>
            </Stack>
        </Modal>
    </Stack>
  );
};

export default ViewPack;