import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar, Accordion, AccordionSummary, AccordionDetails, Input, setRef } from '@mui/material';
import { Box } from '@mui/system';
import { useGlobalContext } from '../../../business/GlobalContext';
import { addNewCategory, getSixPicsPack, getSixPicsPacks } from '../../../business/apiCalls';
import { supabase } from '../../../business/supabaseClient';
import {CircularProgress} from '@mui/material';

const NewVideo = ({file, pack, index, setRefreshKey, setUploaded, uploaded}) => {
    const {alertProps, setAlertProps} = useGlobalContext()
    const [name, setName] = useState()
    const [type, setType] = useState('')
    const [pubURL, setPubURL] = useState()
    const [uploading, setUploading] = useState(false)

    const uploadVideo = async () => {
        if (!name || !type || !file || !pack) {
          setAlertProps({
            text: 'Missing fields: name, type, or file',
            severity: 'error',
            display: true,
          });
          return;
        }

        setUploading(true)
      
        const filePath = `videos/${pack}/${name}.mp4`;
      
        const { data, error } = await supabase.storage
          .from('6picsvideos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'video/mp4',
          });
      
        if (error) {
          console.error('Upload error:', error.message);
          setAlertProps({
            text: 'Upload failed',
            severity: 'error',
            display: true,
          });
          return;
        }
      
        const { data: publicUrlData } = supabase
          .storage
          .from('6picsvideos')
          .getPublicUrl(filePath);
      
        const payload = {
          name,
          video_type: type,
          pack_name: pack,
          public_url: publicUrlData.publicUrl,
        };
      
        const { error: insertError } = await supabase
          .from('sixpicksvideos')
          .insert([payload]);
      
        if (insertError) {
          console.error('Insert error:', insertError.message);
          setAlertProps({
            text: 'Failed to save video metadata',
            severity: 'error',
            display: true,
          });
          return;
        }
      
        setAlertProps({
          text: 'Video saved successfully!',
          severity: 'success',
          display: true,
        });
      
        setPubURL(publicUrlData.publicUrl);
        setUploading(false)
      };

      useEffect(() => {
        if(type && type === 'graphic'){
            setName('Main graphic')
        }
      }, [type])

      useEffect(() => {
        if(pubURL){
            setRefreshKey([prev => prev +1])
            setUploaded(prev => [
                ...prev,
                index
            ])
        }
      }, [pubURL])

    return (
        <>
        {  !uploaded.includes(index) && <Stack width={'98%'} height={150} justifyContent={'flex-start'} alignItems={'center'} border={'1px solid grey'} marginBottom={1}>
                <Stack direction={'row'} alignItems={'space-between'} width={'95%'} justifyContent={'flex-start'} paddingY={1}>
                    <Stack width={'10%'} height={'10%'}>
                        {pubURL && <i style={{color: 'limeGreen'}} class="fi fi-sr-check-circle"></i>}
                    </Stack>
                    <Stack width={'70%'} direction={'row'} justifyContent={'center'}>
                        <InputLabel >File name: </InputLabel>
                        <Typography marginLeft={2}>{file.name}</Typography>
                    </Stack>
                    <Stack width={'10%'} direction={'row'}>
                        <InputLabel >Level: </InputLabel>
                        <Typography>{index}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'} overflow={'hidden'}>
                    <video
                        src={file.URL}
                        preload="metadata"
                        height={'100%'}
                        onLoadedMetadata={(e) => {
                            e.target.currentTime = e.target.duration;
                        }}
                        />
                    <TextField disabled={name === 'Main graphic'} inputProps={{autoComplete: 'off'}} value={name} onChange={(e) => setName(e.target.value)} placeholder='Name (answer)' />
                    <Select
                    displayEmpty
                    placeholder='Video Type' 
                    sx={{minWidth: 100}} 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    >
                        <MenuItem value="" disabled>
                            Select an option
                        </MenuItem>
                        <MenuItem value={'graphic'}>Pack Graphic</MenuItem>
                        <MenuItem value={'object'}>Game Object</MenuItem>
                    </Select>
                    {
                        uploading ?
                        
                        <CircularProgress />
                        :
                        <Button disabled={!name || !type} onClick={uploadVideo}>Save</Button> 
                    }
                </Stack>
            </Stack>}
        </>
    )

}

const VideoImporter = ({pack, getVids, type, getGraphic, setRefreshKey}) => {

    const [importMethod, setImportMethod] = useState('fileUpload')
    const [dropBoxURL, setDropBoxURL] = useState(null)
    const [file, setFile] = useState(null)
    const {alertProps, setAlertProps} = useGlobalContext()
    const [osFileKey, setOsFileKey] = useState(0)
    const [graphicURL, setGraphicURL] = useState()
    const [videoObjects, setVideoObjects] = useState([])
    const [uploaded, setUploaded] = useState([])

    const handleUploadGraphic = async (URL) => {
        console.log(URL)
        const { data, error } = await supabase
        .from('sixpicspacks')
        .update({ 'graphic': URL })
        .eq('pack_name', pack)
        .select()
        
        if(data){
            getGraphic()
        }
    }


    const handleUploadVideo = async (event, packName) => {

        const uploadFile = file.target.files[0]
        if (!file) return;
      
        const folderName = packName.toLowerCase().replace(/\s+/g, '_'); // normalize folder
        const filePath = `${folderName}/${uploadFile.name}`;
      
        const { data, error } = await supabase.storage
          .from('6picsvideos')
          .upload(filePath, uploadFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'video/mp4',
          });
      
        if (error) {
          console.error('Upload error:', error);
          setAlertProps({
            text: 'Upload failed',
            display: true,
            disposition: 'error',
          });
        } else {
          
            const { data: publicUrlData } = supabase.storage
            .from('6picsvideos')
            .getPublicUrl(filePath);

            if(data){
                const URL = `//bueukhsebcjxwebldmmi.supabase.co/storage/v1/object/public/${data.fullPath}`
                const encURL = encodeURIComponent(URL).replace(/%2F/g, "/")
                setGraphicURL(`https:${encURL}`)
            }
            
          setAlertProps({
            text: 'Video uploaded successfully',
            display: true,
            disposition: 'success',
          });

          if(type !== 'graphic'){
              getVids();
          }
        }
      };

      useEffect(() => {
        if(graphicURL){
            handleUploadGraphic(graphicURL)
        }
      }, [graphicURL])

      useEffect(() => {
        if(alertProps && alertProps.text === 'Video uploaded successfully'){
            setFile(null)
            setOsFileKey(prev => prev +1)
            setAlertProps(prev => ({
                ...prev,
                text: null,
                display: false
            }))
        }
        if(file){
            console.log(file.target.files[0].name)
        }
      }, [alertProps, file])

      const handleMultiFiles = async  (files) => {
        if(files){
            setVideoObjects([])
            Object.values(files).forEach((f, i) => {
                f.URL = URL.createObjectURL(f)
                f.index = i
                setVideoObjects(prev => [
                    ...prev,
                    f
                ])
            })
        }

      }


    return (
        <>
                {importMethod === 'dropbox' && 
                    <Stack>
                        <TextField onChange={(e) => setDropBoxURL(e.target.value)} inputProps={{ autoComplete: 'off' }} autoComplete={false} sx={{length: '75%'}} placeholder='dropbox link' ></TextField>
                    </Stack>
                }

                {importMethod === 'fileUpload' && videoObjects.length == 0 &&
                    <Stack sx={{ alignItems: 'center', display: 'flex' }}>
                    <Input
                      key={osFileKey}
                      type="file"
                      accept="video/mp4"
                      multiple
                      autoComplete="off"
                      inputProps={{ multiple: true, accept: 'video/mp4' }}
                      onChange={(e) => handleMultiFiles(e.target.files)}
                      sx={{ marginLeft: 2 }}
                    />
                  </Stack>
                }

                {videoObjects && 
                <Stack userdata="new video wrapper" sx={{overflowY: 'scroll', overflowX: 'hidden'}} height={'50%'} width={'100%'} marginTop={2}>
                    {videoObjects
                    .sort((a, b) => b.index - a.index)
                    .map((v, i) => {
                        return <NewVideo key={i} file={v} pack={pack} index={i} setRefreshKey={setRefreshKey} uploaded={uploaded} setUploaded={setUploaded}/>
                    })}
                </Stack>
                }
        </>
    )

}

export default VideoImporter