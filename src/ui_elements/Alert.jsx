import { AlertTitle, Alert, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useGlobalStore from '../business/useGlobalStore';

const UserAlert = ({type}) => {

    const {screen, height, alertContent} = useGlobalStore()
    

    const [show, toggleShow] = useState(false)
    const [title, setTitle] = useState('')

    useEffect(() => {
        if(show){
            setTimeout(() => {
               toggleShow(false) 
            }, 3000);
        }
    }, [show])

    useEffect(() => {
        if(alertContent?.type){
            switch(alertContent?.type){
                case 'error': setTitle('Error');
                break
                case 'success': setTitle('Success')
                break
                case 'warning': setTitle('Warning')
                break
                case 'info': setTitle('Info')
                break
            }
        }
    }, [alertContent])

    useEffect(() => {
        if(alertContent?.text) toggleShow(true)
            console.log(alertContent)
    }, [alertContent])

  return (
    <Stack position={'fixed'} width={'80%'} sx={{transform: `translateY(${height - 208}px)`}}>
        {show && 
            <Alert variant='filled' severity={type}>
                <AlertTitle>{title}</AlertTitle> 
                {alertContent?.text}
            </Alert>
        }
    </Stack>
  )
}

export default UserAlert
