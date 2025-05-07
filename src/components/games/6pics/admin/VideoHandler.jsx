import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar, Accordion, AccordionSummary, AccordionDetails, Input, Modal, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
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

const Videos = ({pack, setVideoToEdit, refresh, readyPacks, setReadyPacks}) => {
    const [videos, setVideos] = useState([])
    const [addNewVideo, setAddNewVideo] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isReady, setIsReady] = useState({
        graphic: false,
        objects: false
    })
    
    const getVids = async () => {
        let { data: sixpicksvideos, error } = await supabase
            .from('sixpicksvideos')
            .select("*")
            .eq('pack_name', pack)

        
        if (error) {
            console.error('Could not list files:', error);
            return [];
        }
        
    if(sixpicksvideos) {
        setVideos(sixpicksvideos)
    }
    
    return 
};


const checkReady = async (v) => {


    if(v.ready){

    }
    if (readyPacks.includes(v.pack_name)) return;
  
    const {
      id,
      name,
      public_url,
      pack_name,
      video_type,
      stops,
      loops,
      ready,
    } = v;
  
    const requiredFields = {
        name,
        public_url,
        pack_name,
        video_type,
        stops,
        loops,
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => {
          if (Array.isArray(value)) return value.length === 0; // empty arrays are missing
          return !value; // falsy strings, null, undefined
        })
        .map(([key]) => key);
  
        const updateReady = async (key) => {
            console.log(`Updating ${key}...`);
            const { data, error } = await supabase
              .from('sixpicksvideos')
              .update({ ready: true })
              .eq('id', id)
              .select();
          
            if (error) {
              console.error(`Failed to update ready for ${name}:`, error.message);
              return;
            }
          
            console.log(`${name} updated successfully`, data);
          
            setIsReady((prev) => ({
              ...prev,
              [key]: true,
            }));
          };
  
    // Check for object type videos
    if (name && name !== 'Main graphic' && !ready) {
      await updateReady('objects');
    }
  
    // Check for the main graphic
    if (name === 'Main graphic' && !ready) {
      await updateReady('graphic');
    }
  };

const deleteFileByPublicUrl = async (publicUrl) => {
    console.log(publicUrl)
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
    }, [refreshKey, refresh])

    useEffect(() => {
        console.log(isReady)
    }, [isReady])

    useEffect(() => {
        setRefreshKey(prev => prev +1)
    }, [])

        return (
            <Stack direction={'column'} alignItems={'flex-start'} justifyContent={'flex-start'}> 
                <Stack direction={'row'}>
                    {
                        !isReady.objects || !isReady.graphic ?
                    <Button onClick={() => setAddNewVideo(prev => !prev)} >
                        <Avatar>
                            <i className="fi fi-sr-video-plus"></i>
                        </Avatar>
                    </Button>
                    :
                    <Button>
                        <Avatar>
                            <i className="fi fi-sr-thumbs-up-trust"></i>
                        </Avatar>
                    </Button>
                    }
                </Stack>



            <Stack key={refreshKey} direction={'column'} width={'100%'}>
                    {videos.map((v, i) => {
                        // checkReady(v)
                        return (
                            <Stack key={i} direction={'row'} border={'1px solid grey'} height={'100px'} alignItems={'center'}>
                                <video
                                    src={v.public_url}
                                    preload="metadata"
                                    height={'100%'}
                                    onLoadedMetadata={(e) => {
                                        e.target.currentTime = e.target.duration;
                                    }}
                                    />
                                <Box>
                                {v.name !== 'Main graphic' &&
                                    <Button onClick={() => setVideoToEdit({url: v.public_url, pack: v.pack_name, id: v.id, name: v.name})}>
                                        <Avatar>
                                            <i className="fi fi-rr-customize"></i>
                                        </Avatar>
                                    </Button>
                                    }
                                </Box>
                                <Box>
                                    <Button onClick={() => deleteFileByPublicUrl(v)}>
                                        <Avatar>
                                            <i className="fi fi-sr-trash"></i>
                                        </Avatar>
                                    </Button>
                                </Box>
                                {v &&
                                 <Stack direction={'row'} width={'75%'} justifyContent={'space-evenly'}>
                                    {
                                        !v.ready ? 
                                    <>
                                        <Stack>
                                            <InputLabel>Name</InputLabel>
                                            <Checkbox disabled checked={!!v.name} 
                                            sx={{
                                                color: 'gray', 
                                                '&.Mui-checked': {
                                                    color: 'limeGreen'
                                                }
                                            }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputLabel>Public URL</InputLabel>
                                            <Checkbox disabled checked={!!v.public_url} 
                                            sx={{
                                                color: 'gray', 
                                                '&.Mui-checked': {
                                                    color: 'limeGreen'
                                                }
                                            }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputLabel>Pack assigned</InputLabel>
                                            <Checkbox disabled checked={!!v.pack_name} 
                                            sx={{
                                                color: 'gray', 
                                                '&.Mui-checked': {
                                                    color: 'limeGreen'
                                                }
                                            }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputLabel>Stops</InputLabel>
                                            <Checkbox disabled checked={!!v.stops} 
                                            sx={{
                                                color: 'gray', 
                                                '&.Mui-checked': {
                                                    color: 'limeGreen'
                                                }
                                            }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputLabel>Loops</InputLabel>
                                            <Checkbox disabled checked={!!v.loops} 
                                            sx={{
                                                color: 'gray', 
                                                '&.Mui-checked': {
                                                    color: 'limeGreen'
                                                }
                                            }}
                                            />
                                        </Stack>
                                    </>
                                    :
                                        <Stack>
                                            <InputLabel>Ready</InputLabel>
                                            <Checkbox disabled checked={!!v.ready} 
                                                sx={{
                                                    color: 'gray', 
                                                    '&.Mui-checked': {
                                                        color: 'limeGreen'
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    }
                                    

                                </Stack>}
                        </Stack>
                    )}
                    
                )}
            </Stack>
                {addNewVideo &&
                    <>
                        <VideoImporter pack={pack} getVids={getVids} type={'video'} setRefreshKey={setRefreshKey}/>
                    </>
                }
        </Stack>
        )
        
    }
    
    const VideoHandler = () => {
        
        const [packs, setPacks] = useState([])
        const [addNewPack, setAddNewPack] = useState(false)
        const [newPackName, setNewPackName] = useState()
        const [pendingDelete, setPendingDelete] = useState(false)
    const [packToDelete, setPackToDelete] = useState()
    const [videoToEdit, setVideoToEdit] = useState()
    const [packGraphic, setPackGraphic] = useState()
    const [refresh, setRefresh] = useState(0)
    const [expandedPack, setExpandedPack] = useState(null);
    const [readyPacks, setReadyPacks] = useState([])

    const handleChange = (packName) => (event, isExpanded) => {
      setExpandedPack(isExpanded ? packName : null);
    };
    

    const importPacks = async () => { 
        
        let { data: sixpicksvideos, error } = await supabase
        .from('sixpicksvideos')
        .select('*')
    
        const uniqueKeys = [...new Set(sixpicksvideos.map(child => child.pack_name))];
        if(uniqueKeys){
            setPacks(uniqueKeys);
        } else {

        }


    }

    const getReadyPacks = async () => {
        
        let { data: sixpicspacks, error } = await supabase
        .from('sixpicspacks')
        .select('*')
        
        setReadyPacks(sixpicspacks)

    }

    useEffect(() => {
            importPacks()
            getReadyPacks()
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
            const { data, error } = await supabase
            .from('sixpicksvideos')
            .insert([
                { name: 'Placeholder', public_url: '', pack_name: newPackName, video_type: null, stops: [], loops: [], ready: false},
            ])
            .select()

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
            <Stack width={'30%'} justifyContent={'center'} alignItems={'center'} marginTop={1}>
                {!addNewPack ?
                    <Button onClick={() => setAddNewPack(prev => !prev)} variant='contained' >Add Pack</Button>
                :
                <>
                    <Box sx={{justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column'}} >
                        <TextField
                         placeholder={'Pack name'} 
                         inputProps={{ autoComplete: 'off' }} 
                         value={newPackName} 
                         onChange={(e) => setNewPackName(e.target.value)} 
                         onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                if(e.target.value){
                                    handleSubmitPack()
                                } else {
                                    setAlertProps({
                                        text: 'Missing pack name',
                                        display: true,
                                        severity: 'error'
                                    })
                                }
                            }
                         }}
                         >
                         
                        </TextField> 
                    </Box>
                    <Box sx={{justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', marginTop: 1}} >
                        <Button disabled={!newPackName} variant='contained' onClick={() => handleSubmitPack()} >Submit</Button>
                    </Box>
                </>
                }
            </Stack>
            
            <Stack width={'100%'}>
            {packs.map((p, i) => (
        <Accordion key={i} expanded={expandedPack === p} onChange={handleChange(p)}>
          <AccordionSummary
            sx={{ backgroundColor: 'skyBlue', borderRadius: 2 }}
            expandIcon={null}
          >
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: 1 }}>{p}</Typography>
            </Stack>
          </AccordionSummary>

          {expandedPack === p && (
            <AccordionDetails sx={{ boxShadow: 'inset 3px 3px 12px 0px #00000063', borderRadius: 2 }}>
              <Stack direction="column">
                <Button onClick={() => confirmDelete(i, p)}>
                  <Avatar>
                    <i className="fi fi-sr-trash"></i>
                  </Avatar>
                </Button>
                <Videos pack={p} setVideoToEdit={setVideoToEdit} refresh={1} setReadyPacks={setReadyPacks} readyPacks={readyPacks}/>
              </Stack>
            </AccordionDetails>
          )}
        </Accordion>
      ))}
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
                <VideoEditor videoURL={videoToEdit} setVideoToEdit={setVideoToEdit} video={videoToEdit} setRefresh={setRefresh}/>
            </Modal>
        </Stack>
    )

}

export default VideoHandler