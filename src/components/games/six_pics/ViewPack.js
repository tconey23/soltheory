import { useEffect, useState } from 'react';
import { Avatar, Button, CircularProgress, List, ListItem, MenuItem, Modal, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import VideoObject from './VideoObject';
import { Box } from '@mui/system';
import { Suspense, lazy } from 'react';
import { useGlobalContext } from '../../../business/GlobalContext';

const VideoEditor = lazy(() => import('../pic6_images/VideoEditor'));

const ViewPack = ({setSelection, selection, forceRefresh, setForceRefresh}) => {
    const [packData, setPackData] = useState()
    const [videoToEdit, setVideoToEdit] = useState()
    const [packVideos, setPackVideos] = useState([])
    const [editPackName, setEditPackName] = useState(false)
    const [newPackName, setNewPackName] = useState(null)
   

    const {alertProps, setAlertProps} = useGlobalContext()

    const updatePackName = async () => {
        const { data: existing, error: checkError } = await supabase
        .from('sixpicspacks')
        .select('id')
        .eq('pack_name', newPackName)
        .neq('pack_name', selection);
      
      if (checkError) {
        console.error('Error checking existing name:', checkError);
        return;
      }
      
      if (existing.length > 0) {
        setAlertProps({
            text: 'A pack with this name already exists. Please choose a different name.',
            severity: 'error',
            display: true
        })
        return;
      }
      
      const { data, error } = await supabase
        .from('sixpicspacks')
        .update({ pack_name: newPackName })
        .eq('pack_name', selection)
        .select();
      
      if (error) {
        setAlertProps({
            text: error,
            severity: 'error',
            display: true
        })
      } else {
          
          
          
          try {

            let array = []
            let data

            let { data: sixpicspacks, error } = await supabase
            .from('sixpicspacks')
            .select("*")
            .eq('pack_name', newPackName)
            console.log(sixpicspacks)
            data = sixpicspacks[0]

            data?.videos?.forEach((v) => {
                v.pack_name = newPackName
                array.push(v)
            })

            if(array?.length > 0){
                const { data, error } = await supabase
                .from('sixpicspacks')
                .update({ videos: array })
                .eq('pack_name', newPackName)
                .select()
            }

            if(error){ throw new Error(error)}
            
        } catch (err) {
            console.error(err);
            setAlertProps({
                text: 'Error saving pack name',
                severity: 'error',
                display: true
            })
        }


        setPackData(data[0])
        setForceRefresh(prev => prev +1)
        setAlertProps({
            text: 'Pack name changed successfully',
            severity: 'success',
            display: true
        })
      }
    }

    const handleUpdateName = () => {
        if(editPackName && newPackName){
            updatePackName()
        }
    }


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
        setEditPackName(false)
        setNewPackName(null)
        if(packData && packVideos.length < 1){
            if(packData.videos){
                setPackVideos(packData.videos.map((v) => {
                    return v
                }))
            }
        }
    }, [packData])

    useEffect(() => {
        if(selection){
            getSelectedPack()
        }
    }, [selection])

    const handleDeletePack = async () => {
        const { error } = await supabase
        .from('sixpicspacks')
        .delete()
        .eq('id', packData?.id)

        if(error){
            console.log(error)
        } else {
            setAlertProps({
                text: 'Successfully deleted pack',
                severity: 'success',
                display: true
            })
            setSelection(null)
        }
    }
    
  return (
    <Stack key={forceRefresh} direction={'column'} sx={{ height: '98%', width: '100%' }} justifyContent={'center'} alignItems={'center'}>
        {packData && packVideos &&
        <>
            <Stack width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Button onClick={() => {
                    handleDeletePack()
                }}>Delete Pack</Button>
                {editPackName
                 ? 
                    <>
                        <TextField value={newPackName} onChange={(e) => setNewPackName(e.target.value)}></TextField>
                        <Stack direction={'row'}>
                            <Button
                                onClick={() => {
                                    handleUpdateName()
                                }}
                                >Save</Button>
                            <Button onClick={() => {
                                setEditPackName(false)
                            }} >Cancel</Button>
                        </Stack>
                    </>
                 :
                    <Tooltip title='Click to change pack name' followCursor sx={{cursor: 'pointer'}}>
                        <Typography onClick={() => setEditPackName(true)} fontSize={'4vw'}>{packData.pack_name}</Typography>
                    </Tooltip>
                }

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
                                            <i className="fi fi-rr-customize"></i>
                                        </Avatar>
                                    </Tooltip>
                                    </Button>
                                    <Select sx={{width: '30%'}}>
                                        <Typography>{v.pack_name}</Typography>
                                        
                                        {
                                            Object.entries(v)?.map((f) => {
                                                return  (
                                                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} padding={1}>
                                                        {
                                                            f[1] && typeof f[1] !== 'object' &&
                                                            <i style={{color: 'limeGreen'}} className="fi fi-sr-thumbs-up"></i>
                                                        }

                                                        {
                                                            typeof f[1] === 'object' && 
                                                            <>
                                                                {f[1].length > 0 ?

                                                                    <i style={{color: 'limeGreen'}} className="fi fi-sr-thumbs-up"></i>
                                                                :
                                                                    <i style={{color: 'red'}} className="fi fi-sr-thumbs-down"></i>
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
                                            <i style={{color: 'limeGreen'}} className="fi fi-sr-thumbs-up"></i>
                                            : 
                                            <i style={{color: 'red'}} className="fi fi-sr-thumbs-down"></i>
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
            <Button onClick={() => {
                setSelection(null)
                setForceRefresh(prev => prev +1)
                }} variant='contained'>Done</Button>
        </Stack>
        <Modal open={videoToEdit}>
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <Suspense fallback={<CircularProgress />}>
                    <VideoEditor video={videoToEdit} setSelection={setVideoToEdit} setForceRefresh={setForceRefresh}/>
                </Suspense>
            </Stack>
        </Modal>
    </Stack>
  );
};

export default ViewPack;