import { Button, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../business/GlobalContext';
import { useRef } from 'react';
import SuperUserDetail from './SuperUserDetail';

const SuperUserControls = () => {
  const[refresh, setRefresh] = useState(0)
  const { fetchAuthUsers } = useGlobalContext();
  const [data, setData] = useState();
  const [columns, setColumns] = useState();
  const [colFilter, setColFilter] = useState([
    'confirmation_sent_at',
    'confirmed_at',
    'email_confirmed_at',
    'providers',
    'app_metadata',
    'identities'
  ])
  const [selectedUser, setSelectedUser] = useState(false)

  useEffect(() => {
    setRefresh(prev => prev +1)
    console.log(refresh)
  }, [colFilter])

  useEffect(() => {
    if (data) {
      setColumns(Object.keys(data[0]).filter((c) => !colFilter.includes(c)));
    }
  }, [data,refresh]);

  const getAuthUsers = async () => {
    try {
      const users = await fetchAuthUsers();
      if (users) {
        setData(users.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCell = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    } 
    else if (typeof value === 'object' && value !== null) {
      return (
        <Stack height={100}>
        <List dense sx={{overflow: 'auto'}}>
          {Object.entries(value).map(([key, val], index) => (
              <ListItem key={index} disableGutters>
              <ListItemText 
                primary={`${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`} 
                primaryTypographyProps={{ fontSize: 12 }}
                />
            </ListItem>
          ))}
        </List>
        </Stack>
      );
    } 
    else if (typeof value === 'boolean') {
      return value ? '✅' : '❌';
    } 
    else {
      return value;
    }
  };

  const removeFilter = (e) => {

    const newFilter = colFilter.filter((o) => o !== e)
console.log(newFilter)
    setColFilter(newFilter)
  }

  return (
    <Stack width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
      <Stack marginY={3}>
        <Button onClick={getAuthUsers}>Query Auth Users</Button>
      </Stack>

      <Stack width={'95%'}>
        <Stack flexWrap={'wrap'} direction={'row'} width={'95%'}>
        {colFilter.map((f, i) => (
                <Button
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent dropdown from closing instantly
                        removeFilter(f);
                    }}
                >
                    {f}
                </Button>
            ))}
        </Stack>
        <TableContainer key={refresh}>
          <Table sx={{width:'100px'}}>
            <TableHead>
              <TableRow sx={{maxWidth: '100'}}>
                {columns?.map((col) => (
                  <TableCell 
                    onClick={() => {
                        console.log(col)
                        setColFilter(prev => [
                        ...prev,
                        col
                    ])}}
                     key={col}
                    sx={{ fontWeight: 'bold' }}>
                    {col.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((row, rowIndex) => (
                <TableRow onClick={() =>  setSelectedUser(data[rowIndex])} key={rowIndex}>
                  {columns?.map((col) => (
                    <TableCell key={col}>
                      {renderCell(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <Modal open={selectedUser}>
        <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
              <SuperUserDetail user={selectedUser} setUser={setSelectedUser}/>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default SuperUserControls;