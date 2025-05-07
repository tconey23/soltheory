import { useEffect, useState } from 'react';
import { Avatar, Button, CircularProgress, List, ListItem, MenuItem, Modal, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import VideoObject from './VideoObject';
import { Box } from '@mui/system';
import { Suspense, lazy } from 'react';
import VideoEditor from './admin/VideoEditor';

const ViewPack = ({setSelection, selection, setResetForm}) => {
    const [packData, setPackData] = useState()
    const [videoToEdit, setVideoToEdit] = useState()
    const [packVideos, setPackVideos] = useState([])
    const [editPackName, setEditPackName] = useState(false)
    const [newPackName, setNewPackName] = useState(null)
    const [packReady, setPackReady] = useState(false)
    const [videoCount, setVideoCount] = useState(0)
    const [readyCount, setReadyCount] = useState(0)
    const [isHover, setIsHover] = useState(false)
    const [hoverDelay, setHoverDelay] = useState(3)
    const [canDelete, setCanDelete] = useState(false)

    const markForDelete = async () => {
        const { data, error } = await supabase
        .from('sixpicspacks')
        .update({marked_for_delete: true})
        .eq('id', packData?.id)
        .select()
        
        if(data){
            setResetForm(prev => prev +1)
            setSelection(null)
            
        }
        
    }

    const updateReady = async () => {
        const { data, error } = await supabase
        .from('sixpicspacks')
        .update({ ready: true })
        .eq('id', packData?.id)
        .select()
        
        if(data){
            setPackReady(data[0].ready)
        }
    }

    useEffect(() =>{
       setPackReady(packData?.ready)
    }, [packData])

    useEffect(() =>{
        if(isHover && hoverDelay > 0){
            setTimeout(() => {
                setHoverDelay(prev => prev -1)
            }, 1000);
            setCanDelete(false)
        }

        if(!isHover){
            setCanDelete(false)
            setHoverDelay(3)
        }

       if(hoverDelay == 0){
            setCanDelete(true)
       }

    }, [hoverDelay, isHover])

    useEffect(() => {
        if(!packReady && videoCount === readyCount){
            setPackReady(true)
        }

        if(packReady && !packData?.ready){
            updateReady()
        }

    }, [packReady])

    useEffect(() =>{
        setVideoCount(0)
        setReadyCount(0)
        packVideos?.forEach((p) =>{
            setVideoCount(prev => prev +1)
            if(p.ready){
                setReadyCount(prev => prev +1)
            }
        })
    }, [packVideos])

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
    <Stack userdata='video_editor_wrapper' key={1} direction={'column'} sx={{ height: '96%', width: '100%' }} justifyContent={'center'} alignItems={'center'}>
        {packData && packVideos &&
        <>
            <Stack width={'50%'} justifyContent={'center'} alignItems={'center'}>
            {packReady
                ? 
                    <i style={{color: 'limeGreen'}} className="fi fi-sr-thumbs-up"></i>
                : 
                    <i style={{color: 'red'}} className="fi fi-sr-thumbs-down"></i>
            }
            <Tooltip
             title={`Are you sure? ${hoverDelay}`}
            >
                <Button
                    sx={{
                        bgcolor: canDelete ? 'primary.main' : 'grey',
                        '&:hover': {
                          bgcolor: canDelete ? 'primary.dark' : 'grey', // prevent hover color change if not deletable
                        },
                      }}
                    onMouseOver={() => setIsHover(true)}
                    onMouseOut={() => setIsHover(false)}
                    onClick={() => {
                        if(canDelete){
                            markForDelete()
                        }
                    }}
                    >
                    Delete Pack
                </Button>
            </Tooltip>
                {editPackName
                 ? 
                    <>
                        <TextField value={newPackName} onChange={(e) => setNewPackName(e.target.value)}></TextField>
                        <Stack userdata='video_editor_3' direction={'row'}>
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
                        <Typography fontFamily={'Fredoka Regular'} onClick={() => setEditPackName(true)} fontSize={'3vw'}>{packData.pack_name}</Typography>
                    </Tooltip>
                }

            </Stack>

            <Stack userdata='video_editor_4' width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Stack sx={{width: '75%', height: '25%'}} justifyContent={'center'} alignItems={'center'}>
                    <VideoObject URL={packData.graphic}/>
                </Stack>
            </Stack>
            <Stack userdata='video_editor_5' width={'50%'} justifyContent={'flex-start'} alignItems={'center'} sx={{height: '400px', overflowY: 'scroll'}}> 
                <List>
                    {packVideos?.map((v) => {
                        if(v){
                            return (
                                <MenuItem disableRipple>
                                <Stack width={'25%'} justifyContent={'center'} alignItems={'center'}>
                                    <VideoObject w={'100%'} URL={v.public_url}/>
                                </Stack>

                                <Stack direction={'row'} width={'75%'} justifyContent={'space-evenly'} alignItems={'center'}>
                                <Button onClick={() => setVideoToEdit(v)}>
                                    <Tooltip title={`Edit Video`}>
                                        <Avatar>
                                            <i className="fi fi-rr-customize"></i>
                                        </Avatar>
                                    </Tooltip>
                                    </Button>
                                    <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                    <Typography>{v.answer || v.name}</Typography>
                                    <Select sx={{width: '85%', height: '25%'}}>                                        
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
                                            </Stack>
                                            <Typography paddingX={1}>Ready?</Typography>
                                            {v.ready 
                                                ? 
                                                    <i style={{color: 'limeGreen'}} className="fi fi-sr-thumbs-up"></i>
                                                : 
                                                    <i style={{color: 'red'}} className="fi fi-sr-thumbs-down"></i>
                                            }
                                    </Stack>
                                    </MenuItem> 
                                        )
                                    }
                                    })}
                            </List>
            </Stack>
        </>
        }
        <Stack userdata='video_editor_6' padding={2}>
            <Button onClick={() => {
                setSelection(null)
                setForceRefresh(prev => prev +1)
                }} variant='contained'>Done</Button>
        </Stack>
        <Modal userdata='video_editor_modal' open={videoToEdit}>
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <Suspense fallback={<CircularProgress />}>
                    <VideoEditor video={videoToEdit} setSelection={setVideoToEdit} setForceRefresh={setResetForm}/>
                </Suspense>
            </Stack>
        </Modal>
    </Stack>
  );
};

export default ViewPack;