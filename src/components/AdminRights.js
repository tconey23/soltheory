import { useEffect, useState } from 'react';
import { Avatar, Button, List, ListItem, Modal, Stack, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import UserInfo from './UserInfo';

const AdminRights = () => {
    const nav = useNavigate()
    const {setAlertProps, user} = useGlobalContext()
    const [userList, setUserList] = useState()
    const [columns, setColumns] = useState([])
    const [selectedUser, setSelectedUser] = useState()

    const getUsers = async () => {
        try {
            let { data: users, error } = await supabase
            .from('users')
            .select('*')
            
            if(users){
                setUserList(users)
                let colNames = Object.keys(users[0])
                setColumns(colNames.map((c) => (c)))
            } else if(error) {
                throw new Error(error)
            }
        } catch (err) {
            console.log(err);
            setAlertProps({
                text: err,
                severity: 'error',
                display: true
            })
        }
    }

    useEffect(() => {
        getUsers()
        
    }, [])

  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '90%' }}>

    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow>
            <TableCell align="left">Edit</TableCell>
                {columns.map((c) => (
                    <TableCell align="left">{c}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {userList?.map((u) => {
                let userCells = Object.values(u)
                
                let currentUser = u.primary_id === user.metadata.primary_id
                return (
                <TableRow
                key={u.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: currentUser ? 'grey' : 'white' }}
                >
                <TableCell>
                    <Tooltip title={currentUser ? 'You can not edit the details of the current user' : 'Edit this user'}>
                        <Button disabled={currentUser} onClick={() => {
                            if(!currentUser){
                                    setSelectedUser(u)
                                    return
                                }
                            }} >
                            <Avatar>
                                <i className="fi fi-rr-customize"></i>
                            </Avatar>
                        </Button>
                    </Tooltip>
                </TableCell>
                {
                    userCells.map((c) => {

                        let data

                        if(typeof c === 'boolean'){
                            data = c.toString()
                        }

                        if(typeof c === 'string'){
                            data = c
                        }

                        if(typeof c === 'object' && c?.length > -1){
                            
                            data = 
                            <List sx={{overflowY: 'auto', height: '40px'}}>
                                {c.map((d) => (
                                    <ListItem>{d.email}</ListItem>
                                ))}
                            </List>
                            
                        }

                        return (
                            <TableCell align="left">{data}</TableCell>
                        )
                    })
                }
                </TableRow>
            )})}
            </TableBody>
        </Table>
        </TableContainer>
      
      <Button onClick={() => nav('/account')} ></Button>
        <Modal
            open={selectedUser}
        >
            <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <UserInfo setSelectedUser={setSelectedUser} selectedUser={selectedUser} columns={columns}/>
            </Stack>
        </Modal>

    </Stack>
  );
};

export default AdminRights;