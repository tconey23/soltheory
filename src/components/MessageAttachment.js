import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import VideoObject from './games/six_pics/VideoObject';



const MessageAttachment = ({url}) => {
    const [fileType, setFileType] = useState()
    const [fileName, setFileName] = useState()
    const [displayComponent, setDisplayComponent] = useState()

    const getFileType = async (url) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Range: 'bytes=0-0'
            }
          });
      
          if (!response.ok && response.status !== 206 && response.status !== 200) {
            throw new Error(`Failed to fetch file headers. Status: ${response.status}`);
          }
      
          const contentType = response.headers.get('Content-Type');
          setFileType(contentType);
          const getFileNameFromUrl = (url) => {
            return decodeURIComponent(url.split('/').pop());
          };
          setFileName(getFileNameFromUrl(url))
          return contentType;
        } catch (err) {
          console.error("Error detecting file type:", err);
          return null;
        }
      };
      
      useEffect(() => {
        if (!fileType) return;
      
        console.log('Detected file type:', fileType);
      
        if (fileType.startsWith('video/')) {
          setDisplayComponent(
            <VideoObject URL={url} w="100%" h="100%" />
          );
          return;
        }
      
        if (fileType.startsWith('image/')) {
          setDisplayComponent(
            <img src={url} alt="attachment" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          );
          return;
        }
      
        if (fileType.startsWith('audio/')) {
          setDisplayComponent(
            <audio src={url} controls style={{ width: '100%' }} />
          );
          return;
        }
      
        if (
          fileType === 'application/pdf' ||
          fileType === 'application/msword' ||
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          setDisplayComponent(
            <iframe src={url} style={{ width: '100%', height: '100%' }} title="Document preview" />
          );
          return;
        }
      
        setDisplayComponent(
          <Button href={url} target="_blank" rel="noopener noreferrer" sx={{maxWidth: '300px'}}>
            <Typography
                sx={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                title={fileName} 
            >
                {`Download ${fileName}`}
            </Typography>
          </Button>
        );
      }, [fileType, url]);
      

    useEffect(() => {
        getFileType(url)
    }, [])

  return (
    <Stack direction={'column'} sx={{ height: '130px', width: '130px' }} justifyContent={'center'}  >
      {displayComponent}
    </Stack>
  );
};

export default MessageAttachment;