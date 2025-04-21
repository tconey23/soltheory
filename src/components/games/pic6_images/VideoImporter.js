import { useEffect, useState, useRef } from 'react';
import { Avatar, Button, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography, Snackbar, Accordion, AccordionSummary, AccordionDetails, Input } from '@mui/material';
import { Box } from '@mui/system';
import { useGlobalContext } from '../../../business/GlobalContext';
import { addNewCategory, getSixPicsPack, getSixPicsPacks } from '../../../business/apiCalls';
import { supabase } from '../../../business/supabaseClient';
import { easeInOut } from 'framer-motion';

const VideoImporter = ({pack, getVids, type, getGraphic}) => {

    const [importMethod, setImportMethod] = useState('fileUpload')
    const [dropBoxURL, setDropBoxURL] = useState(null)
    const [file, setFile] = useState(null)
    const {alertProps, setAlertProps} = useGlobalContext()
    const [osFileKey, setOsFileKey] = useState(0)
    const [graphicURL, setGraphicURL] = useState()

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


    return (
        <>
                {/* <Stack>
                    <Select defaultValue={'Import type'} value={importMethod} onChange={(e) => setImportMethod(e.target.value)}>
                        <MenuItem value={'dropbox'} >Dropbox Link</MenuItem>
                        <MenuItem value={'fileUpload'}>OS File System</MenuItem>
                    </Select>
                </Stack> */}

                {importMethod === 'dropbox' && 
                    <Stack>
                        <TextField onChange={(e) => setDropBoxURL(e.target.value)} inputProps={{ autoComplete: 'off' }} autoComplete={false} sx={{length: '75%'}} placeholder='dropbox link' ></TextField>
                    </Stack>
                }

                {importMethod === 'fileUpload' &&
                    <Stack sx={{alignItems: 'center', display: 'flex'}} >
                        <Input key={osFileKey} onChange={(e) => setFile(e)} autoComplete={false} sx={{marginLeft: 2}} type='file' />
                    </Stack>
                }

                {importMethod && 
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'flex-start'}>
                        {
                            importMethod === 'fileUpload' && 
                            <Button onClick={(e) => handleUploadVideo(e, pack)} disabled={!file} variant="contained" >Submit</Button>
                        }
                    </Stack>
                }
        </>
    )

}

export default VideoImporter