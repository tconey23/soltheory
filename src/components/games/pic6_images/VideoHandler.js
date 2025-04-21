import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar, Accordion, AccordionSummary, AccordionDetails, Input, Modal } from '@mui/material';
import { Box } from '@mui/system';
import { Slider } from '@mui/material';
import { useGlobalContext } from '../../../business/GlobalContext';
import { addNewCategory, getSixPicsPack, getSixPicsPacks, addNewPack } from '../../../business/apiCalls';
import { supabase } from '../../../business/supabaseClient';
import VideoImporter from './VideoImporter';
import VideoEditor from './VideoEditor';

const DeleteConfirmation = ({name, deletePack, setPackToDelete, setPendingDelete}) => {
    return(
        <Stack backgroundColor='white' direction={'column'} justifyContent={'center'} alignItems={'center'} width={300} height={300}>
            <Box sx={{height: 100, padding: 1}}>
                <Typography textAlign={'center'}>{`Are you sure you want to delete the ${name} pack?`}</Typography>
            </Box>
            <Box sx={{height: 100, padding: 1}}>
                <Typography textAlign={'center'}>This will delete all of the files contained in the pack as well</Typography>
            </Box>
            <Stack direction={'row'}>
                <Button variant='contained' sx={{marginRight: 1}} onClick={() => {
                    deletePack(name)
                }}>YES</Button>
                <Button variant='contained' sx={{marginLeft: 1}}
                    onClick={() => {
                        setPackToDelete(null);
                        setPendingDelete(false);
                    }}
                >NO</Button>
            </Stack>
        </Stack>
    )
}

const Graphic = ({pack}) => {

    const [hasGraphic, setHasGraphic] = useState()

    const getGraphic = async () => {
            let {data, error} = await supabase
                .from('sixpicspacks')
                .select("graphic")
                .eq("pack_name", pack)
                .single();
            
            if(data){
                setHasGraphic(data.graphic)
            } else {
                setHasGraphic(false)
            }
    }

    useEffect(() => {
        getGraphic()
        console.log(hasGraphic)
    }, [])

    return (
       <>
        {
            hasGraphic ? 
            <video
                src={hasGraphic}
                preload="metadata"
                width={'50%'}
                onLoadedMetadata={(e) => {
                    e.target.currentTime = e.target.duration; // Tiny seek to get the actual first frame in some browsers
                }}
            />
        :
            <VideoImporter pack={pack} type={'graphic'} getGraphic={getGraphic}/>
        }
       </>
    )


}

const Videos = ({pack, setVideoToEdit}) => {
    const [videos, setVideos] = useState([])
    const [addNewVideo, setAddNewVideo] = useState(false)

    
    const getVids = async () => {
        const { data, error } = await supabase
        .storage
        .from('6picsvideos')
        .list(pack);
        
        console.log(pack)
        
        if (error) {
            console.error('Could not list files:', error);
            return [];
        }
        
        const mp4s = data.filter((f) => f.name.endsWith('.mp4'));
        
        const publicUrls = mp4s.map((file) =>
            supabase.storage.from('6picsvideos').getPublicUrl(`oscars/${file.name}`).data.publicUrl
    );
    
    setVideos(publicUrls)
    
    
    
    return publicUrls;
};
const deleteFileByPublicUrl = async (publicUrl) => {
    const match = publicUrl.match(/\/storage\/v1\/object\/public\/6picsvideos\/(.+)$/);
  
    if (!match || !match[1]) {
      console.error('Invalid public URL or unable to extract file path');
      return false;
    }
  
    const filePath = decodeURIComponent(match[1]);
    const { error } = await supabase
      .storage
      .from('6picsvideos')
      .remove([filePath]);
  
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  
    console.log(`Deleted "${filePath}" successfully`);
    getVids()
    return true;
  };

    useEffect(() => {
        getVids()
    }, [])

        return (
            <Stack direction={'column'} alignItems={'flex-start'} justifyContent={'flex-start'}> 
                <Stack>
                    <Button onClick={() => setAddNewVideo(prev => !prev)} >
                        <Avatar>
                            <i class="fi fi-sr-video-plus"></i>
                        </Avatar>
                    </Button>
                </Stack>

            {addNewVideo &&
                <>
                    <VideoImporter pack={pack} getVids={getVids} type={'video'}/>
                </>
            }


            <Stack direction={'column'}>
                    {videos.map((v, i) => (
                        <Stack key={i} direction={'row'} border={'1px solid grey'} height={'100px'} alignItems={'center'}>
                                <video
                                    src={v}
                                    preload="metadata"
                                    height={'100%'}
                                    onLoadedMetadata={(e) => {
                                        e.target.currentTime = e.target.duration; // Tiny seek to get the actual first frame in some browsers
                                    }}
                                />
                                <Box>
                                    <Button onClick={() => setVideoToEdit({url: v, pack: pack})}>
                                        <Avatar>
                                            <i class="fi fi-rr-customize"></i>
                                        </Avatar>
                                    </Button>
                                </Box>
                                <Box>
                                    <Button onClick={() => deleteFileByPublicUrl(v)}>
                                        <Avatar>
                                            <i class="fi fi-sr-trash"></i>
                                        </Avatar>
                                    </Button>
                                </Box>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
        )

}

const VideoHandler = () => {

    const [packs, setPacks] = useState([])
    const [addNewPack, setAddNewPack] = useState(false)
    const [newPackName, setNewPackName] = useState()
    const {alertProps, setAlertProps} = useGlobalContext()
    const [pendingDelete, setPendingDelete] = useState(false)
    const [packToDelete, setPackToDelete] = useState()
    const [videoToEdit, setVideoToEdit] = useState()
    const [packGraphic, setPackGraphic] = useState()

    const importPacks = async () => {

        const res = await getSixPicsPacks()

        if(res){
            setPacks(res.map((p) => (
                p.pack_name
            )))
        }
    }

    useEffect(() => {
            importPacks()
    }, [])

    const handleSubmitPack = async () => {
        const folderName = newPackName.toLowerCase().replace(' ', '_')
        const fileName = 'placeholder.mp4'

        const filePath = `${folderName}/${fileName}`

        const file = new Blob([], {
            type:'video/mp4'
        });

        const{ data, error } = await supabase.storage
            .from(
                '6picsvideos'
            )
            .upload(filePath, file);

        if(error) {
            console.error('Error uploading file:', error);
        }
        else {
            const { data: insertData, error: insertError } = await supabase
            .from('sixpicspacks')
            .insert([{ pack_name: newPackName, gifs: [], graphic: '' }])
            .select();

            setAlertProps({
                text: 'Pack added successfully',
                display: true,
                disposition: 'success'
            })    

            setNewPackName(null)
            setAddNewPack(false)

            importPacks()
        }
      };

      const deletePack = async (packName) => {
        const folderPath = packName.toLowerCase().replace(/\s+/g, '_');

        const { data: files, error: listError } = await supabase.storage
          .from('6picsvideos')
          .list(folderPath);
      
        if (listError) {
          console.error('Error listing pack contents:', listError);
          return;
        }
      
        if (!files || files.length === 0) {
          console.warn('No files found in pack:', folderPath);
        }
      
        const filePaths = files.map((file) => `${folderPath}/${file.name}`);
      
        const { error: deleteError } = await supabase.storage
          .from('6picsvideos')
          .remove(filePaths);
      
        if (deleteError) {
          console.error('Error deleting pack files:', deleteError);
          return;
        }
    
        const { error: dbError } = await supabase
          .from('sixpicspacks')
          .delete()
          .eq('pack_name', packName);
      
        if (dbError) {
          console.error('Error deleting pack from DB:', dbError);
          return;
        }
      
        setAlertProps({
          text: 'Pack deleted successfully',
          display: true,
          disposition: 'success',
        });
      
        setPackToDelete(null);
        setPendingDelete(false);
        importPacks();
      };

      const confirmDelete = (index, name) => {
        setPackToDelete(packs[index])
        setPendingDelete(true)
      }


    return (
        <Stack direction={'column'} width={'80%'} height={'90%'} overflow={'auto'} justifyContent={'flex-start'} alignItems={'center'}>
            <Stack width={'30%'} justifyContent={'center'} alignItems={'center'}>
                {!addNewPack ?
                    <Button onClick={() => setAddNewPack(prev => !prev)} variant='contained' >Add Pack</Button>
                :
                <>
                    <Box sx={{justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column'}} >
                        <TextField inputProps={{ autoComplete: 'off' }} value={newPackName} onChange={(e) => setNewPackName(e.target.value)} ></TextField>
                    </Box>
                    <Box sx={{justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', marginTop: 1}} >
                        <Button variant='contained' onClick={() => handleSubmitPack()} >Submit</Button>
                    </Box>
                </>
                }
            </Stack>
            
            <Stack width={'100%'}>
            {packs.map((p, i) => {
                return (
                    <Accordion key={i}>
                        <AccordionSummary sx={{backgroundColor: 'skyBlue', borderRadius: 2}}>
                            <Stack direction={'row'} alignItems={'center'}>
                                <Typography sx={{marginRight: 1}} >{p}</Typography>
                                <i onClick={() => confirmDelete(i, p)} class="fi fi-sr-trash"></i>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{boxShadow: 'inset 3px 3px 12px 0px #00000063', borderRadius: 2}} >
                            <Stack direction={'column'}>
                                <Graphic pack={p}/>
                                <Videos pack={p} setVideoToEdit={setVideoToEdit}/>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
            </Stack>
            <Modal
                open={pendingDelete && packToDelete}
            >
                <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
                    <DeleteConfirmation name={packToDelete} deletePack={deletePack} setPackToDelete={setPackToDelete} setPendingDelete={setPendingDelete}/>
                </Stack>
            </Modal>
            <Modal
                open={videoToEdit}
            >
                <VideoEditor videoURL={videoToEdit} setVideoToEdit={setVideoToEdit} />
            </Modal>
        </Stack>
    )

}

export default VideoHandler