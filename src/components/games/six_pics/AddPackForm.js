import { useEffect, useState } from 'react';
import { Button, Checkbox, FormLabel, List, ListItem, Stack, Typography } from '@mui/material';
import {FormControl, InputLabel, Input, FormHelperText} from '@mui/material';
import VideoObject from './VideoObject';
import { supabase } from '../../../business/supabaseClient';
import { useGlobalContext } from '../../../business/GlobalContext';
import { display } from '@mui/system';

const AddPackForm = ({setExpandAddNewPack, resetData}) => {

    const {alertProps, setAlertProps} = useGlobalContext()

    const [uploadVideos, setUploadVideos] = useState(true)
    const [videoObjects, setVideoObjects] = useState([])
    const [uploadGraphic, setUploadGraphic] = useState(true)
    const [graphicObject, setGraphicObject] = useState()
    const [acceptGraphic, setAcceptGraphic] = useState(false)
    const [acceptVideos, setAcceptVideos] = useState(null)
    const [packName, setPackName] = useState('');
    const [errors, setErrors] = useState({});

    const formStyles = {
        width: '50%', 
        alignItems: 'flex-start'
    }

    const resetForm = () => {
        setPackName('');
        setGraphicObject(undefined);
        setAcceptGraphic(false);
        setUploadGraphic(true);
        setVideoObjects([]);
        setAcceptVideos([]);
        setUploadVideos(true);
        setErrors({});
        setExpandAddNewPack(false)
      };

      useEffect(() => {
        resetForm()
      }, [resetData])

      useEffect(() =>{
        // console.log(uploadVideos, acceptVideos, videoObjects)
      }, [uploadVideos, acceptVideos, videoObjects])

    const uploadFileAndGetUrl = async (file, pathPrefix) => {
        console.log(file)
        const filePath = `${pathPrefix}/${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('6picsvideos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'video/mp4',
          });
      
        if (error) throw error;
      
        const { data: publicUrlData } = supabase
          .storage
          .from('6picsvideos')
          .getPublicUrl(filePath);
      
        return publicUrlData.publicUrl;
      };

      const handleSubmit = async () => {
        let newErrors = {};
        if (!packName.trim()) newErrors.packName = 'Pack name is required';
        if (!graphicObject || !acceptGraphic) newErrors.graphic = 'You must upload and accept a main graphic';
      
        const acceptedVideos = videoObjects.filter((_, i) => acceptVideos[i]?.accepted);
        if (acceptedVideos.length !== videoObjects.length) newErrors.videos = 'All videos must be accepted';
      
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      
        try {
          // Upload main graphic
          const graphicFile = graphicObject;
          const graphicUrl = await uploadFileAndGetUrl(graphicFile, `videos/${packName}`);
      
          // Upload each video and get public URLs
          const uploadedVideos = await Promise.all(
            videoObjects.map(async (file) => {
              const publicUrl = await uploadFileAndGetUrl(file, `videos/${packName}`);
              return {
                name: file.name,
                public_url: publicUrl,
                pack_name: packName,
                video_type: 'video', // adjust as needed
                stops: [], // initial empty
                loops: [],
                playback_speed: 1,
                ready: false,
              };
            })
          );
      
          // Insert the new row in sixpicspacks
          const { data, error } = await supabase
            .from('sixpicspacks')
            .insert([
              {
                created_at: new Date().toISOString(),
                pack_name: packName,
                graphic: graphicUrl,
                videos: uploadedVideos,
              },
            ]);

            console.log(error)
      
          if (error) throw error;
      
          resetForm()
          setAlertProps({
            text: 'Pack submitted successfully!',
            severity: 'success',
            display: true
          })
        } catch (err) {
            setAlertProps({
                text: err,
                severity: 'error',
                display: true
              })
        }
      };
      
      

    useEffect(() => {
        const releaseInput = acceptVideos?.filter((c) => c.accepted === true)
        if(releaseInput?.length > 0 && releaseInput?.length == videoObjects?.length){
            console.log(releaseInput)
            setUploadVideos(false)
        } else {
            setUploadVideos(true)
        }
    }, [acceptVideos])

    const handleMultiFiles = async  (files) => {
        setAcceptVideos([])
        if(files){
            setVideoObjects([])
            Object.values(files).forEach((f, i) => {
                f.URL = URL.createObjectURL(f)
                f.index = i
                setVideoObjects(prev => [
                    ...prev,
                    f
                ])
                setAcceptVideos(prev => [
                    ...prev,
                    {accepted: false}
                ])
            })
        }

      }

  return (
    <Stack key={resetData} direction={'column'} sx={formStyles}>
                  <FormControl sx={{width: '100%'}}>
                      <InputLabel htmlFor="pack-input">Pack name</InputLabel>
                      <Input
                          id="pack-name"
                          value={packName}
                          onChange={(e) => setPackName(e.target.value)}
                      />
                        <FormHelperText error={errors.packName}>
                          {errors.packName || 'Enter the name of the pack as you would like it to appear in game'}
                      </FormHelperText>
                  </FormControl>
                  <br></br>
        <FormControl sx={formStyles}>
            <FormLabel>Main graphic</FormLabel>
                <Stack width={'100%'} height={'20%'}>
                    {uploadGraphic && !acceptGraphic &&
                        <>
                        <Input
                         id="pack-input" 
                         type='file' 
                         inputProps={{ multiple: false, accept: 'video/mp4' }} 
                         onChange={(e) => {
                            let object = e?.target?.files?.[0] || null
                            if(object){
                                object.URL = URL.createObjectURL(object)
                            }
                            console.log(object)
                            setGraphicObject(object)
                         }}/>
                            {errors.graphic && (
                                <FormHelperText error>{errors.graphic}</FormHelperText>
                            )}
                        </>
                    }
                    {graphicObject && graphicObject.URL &&
                        <>
                            <VideoObject fileInfo={graphicObject}/>
                            {!acceptGraphic && <Button onClick={() => setAcceptGraphic(true)}>Accept</Button>}
                        </>
                    }
                </Stack>
        </FormControl>
        <br></br>


        <FormControl sx={formStyles}>
            <FormLabel>Upload videos</FormLabel>
                <Stack width={'100%'} height={'20%'}>
                {uploadVideos &&
                    <Input id="pack-input" type='file' multiple inputProps={{ multiple: true, accept: 'video/mp4' }} onChange={(e) => handleMultiFiles(e.target.files)}/>
                }
                {
                    videoObjects.length > 0 && 
                    <List sx={{overflowY: 'scroll', height: '255px'}}>
                        {
                            videoObjects.map((v, i) => {
                                return (
                                    <ListItem key={v.name + v.index}>
                                        <Stack direction={'row'}>
                                          
                                                <VideoObject fileInfo={v}/>
                                                <Stack justifyContent={'center'} padding={1}>

                                                    <Typography>Accepted</Typography>
                                                    <Checkbox
                                                        checked={acceptVideos[i]?.accepted || false}
                                                        onChange={() =>
                                                            setAcceptVideos(prev =>
                                                                prev.map((item, index) =>
                                                                    index === i ? { ...item, accepted: !item.accepted } : item
                                                    )
                                                )
                                            }
                                            />
                                            </Stack>
                                        </Stack>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                }
                {errors.videos && (
                    <FormHelperText error>{errors.videos}</FormHelperText>
                )}
                </Stack>
        </FormControl>
        <br></br>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Pack
        </Button>
    </Stack>
  );
};

export default AddPackForm;