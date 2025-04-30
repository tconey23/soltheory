import { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, FormControl, Input, InputLabel, List, Menu, MenuItem, MenuList, Modal, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import FullMessage from './FullMessage';
import { useGlobalContext } from '../business/GlobalContext';

export const MessageItem = ({data, origin}) => {
    const {isMobile, getUserData} = useGlobalContext()
    const [isHover, setIsHover] = useState(false)
    const [pendingDelete, setPendingDelete] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null) 
    const [to, setTo] = useState()
    const [from, setFrom] = useState()
    
    const fetchUser = async (toUser, fromUser) => {

        const tofrom = await getUserData(toUser, fromUser)

        if(tofrom) {
            setTo(tofrom.to)
            setFrom(tofrom.from)
        }
    }

    useEffect(() => {
        if(data.to && data.from){
            fetchUser(data.to, data.from)
        }
    }, [data])

    const handleDelete = async (data) => {
        try {
          // 1. If there's an attachment, delete it from Supabase Storage
          if (data.attachment) {
            // Extract path from public URL
            const filePath = decodeURIComponent(
              data.attachment.split('/messagingobjects/')[1]
            );
      
            const { error: storageError } = await supabase
              .storage
              .from('messagingobjects')
              .remove([filePath]);
      
            if (storageError) {
              console.error('Storage deletion error:', storageError);
            }
          }
      
          // 2. Delete the message from the table
          const { error: dbError } = await supabase
            .from('messaging')
            .delete()
            .eq('message_id', data.message_id);
      
          if (!dbError) {
            setPendingDelete(false);
          } else {
            console.error('Database deletion error:', dbError);
          }
      
        } catch (err) {
          console.error('Unexpected deletion error:', err);
        }
      };
      

    return (
        <>
            <TableRow
                title='messagerow'
                onMouseOut={() => setIsHover(false)} 
                onMouseOver={() => setIsHover(true)}
                sx={{
                    backgroundColor: isHover ? 'skyBlue' : 'white',
                    cursor: isHover ? 'pointer' : '',
                    transition: 'all 1s ease-in-out'
                }}
                >
                <TableCell>
                    <MenuItem onClick={() => setPendingDelete(data)} ><i className="fi fi-sr-trash"></i></MenuItem>
                </TableCell>
                <TableCell 
                    onClick={(e) =>{ 

                        if(e.target.className !== 'fi fi-sr-trash'){
                            setSelectedMessage(data)
                        }
                    }}
                >{data.created_at}</TableCell>
                <TableCell 
                    onClick={(e) =>{ 

                        if(e.target.className !== 'fi fi-sr-trash'){
                            setSelectedMessage(data)
                        }
                    }}
                >{origin === 'sent' ? to : from}</TableCell>
                <TableCell 
                    open
                    onClick={(e) =>{ 

                        if(e.target.className !== 'fi fi-sr-trash'){
                            setSelectedMessage(data)
                        }
                    }}
                >{data.subject}</TableCell>
            </TableRow>
            <Modal open={pendingDelete?.message_id || selectedMessage}>
                <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                    {
                        pendingDelete.message_id ?
                            <Stack width={isMobile ? '80%' : '25'} height={'25%'} bgcolor={'white'} justifyContent={'center'} alignItems={'center'}>
                                <Typography fontFamily={'Fredoka Regular'} fontSize={isMobile ? '3.5vw': 16} paddingX={1}>Are you sure you want to delete the message?</Typography>
                                <Typography fontFamily={'Fredoka Regular'} fontSize={isMobile ? '3.5vw': 15}>This action cannot be undone</Typography>
                                <Stack direction={'row'}>
                                    <Button onClick={() => handleDelete(pendingDelete)}>Yes</Button>
                                    <Button onClick={() => setPendingDelete(false)}>Cancel</Button>
                                </Stack>
                            </Stack>
                    :
                        <FullMessage message={data} setSelectedMessage={setSelectedMessage} setPendingDelete={setPendingDelete}/>
                    }
                </Stack>
            </Modal>
        </>
    )
}