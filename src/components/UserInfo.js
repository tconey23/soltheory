import { useEffect, useState } from 'react';
import { Button, FormControl, Input, InputLabel, List, MenuItem, Select, Stack, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';


const UserInfo = ({selectedUser, columns, setSelectedUser}) => {

    const [editField, setEditField] = useState(null);
    const [formFields, setFormFields] = useState({})

    useEffect(() => {
        if(formFields){

            columns.forEach((c) =>{
                setFormFields(prev => ({
                    ...prev,
                    [c]: selectedUser[c]
                }))
            })
        }
    }, [])

    const pushUpdates = async (fields = formFields) => {
        console.log(fields.primary_id)
        try {
          const { data, error } = await supabase
            .from('users')
            .update(fields)
            .eq('primary_id', fields.primary_id)
            .select();
      
          if (error) throw error;
          setSelectedUser(data[0]);
        } catch (err) {
          console.error('Update error:', err);
        }
      };
      

    useEffect(() => {
        const initialFields = {};
        columns.forEach((c) => {
          initialFields[c] = selectedUser[c];
        });
        setFormFields(initialFields);
      }, [selectedUser]);

      const handleUpdatedData = async (field, value, push = false) => {
        const updated = {
          ...formFields,
          [field]: value,
        };

        console.log(updated)
      
        setFormFields(updated);
        setEditField(null);
      
        if (push) {
          await pushUpdates(updated); // pass updated values directly
        }
      };

  return (
    <Stack title='user_info_wrapper' direction={'column'} sx={{ height: '60%', width: '60%', bgcolor: 'white'}} onClick={(e) =>{
        if(e.target.title === 'user_info_wrapper'){
            setEditField(null)
        }
        }}> 
        <List>
            {columns.map((c, i) => {
                if(c === 'primary_id' || typeof selectedUser[c] === 'object'){
                    return 
                }
                return (
                <Stack title='user_info_wrapper' paddingX={3} paddingY={1} direction={'row'} alignItems={'flex-end'} justifyContent={'flex-start'}>
                    <FormControl sx={{paddingX: 3}} >
                    {typeof selectedUser[c] === 'boolean' && (
                <>
                    <Typography>{c}</Typography>
                    {editField === c ? (
                    <Select
                        value={formFields[c]}
                        onChange={(e) => handleUpdatedData(c, e.target.value, true)}
                    >
                        <MenuItem value={true}>TRUE</MenuItem>
                        <MenuItem value={false}>FALSE</MenuItem>
                    </Select>
                    ) : (
                    <Typography onClick={() => setEditField(c)}>
                        {selectedUser[c].toString()}
                    </Typography>
                    )}
                </>
                )}

                {typeof selectedUser[c] === 'string' && (
                <>
                    <Typography>{c}</Typography>
                    {editField === c ? (
                    <>
                        <InputLabel>{c}</InputLabel>
                        <Input
                            value={formFields[c]}
                            onChange={(e) => handleUpdatedData(c, e.target.value)}
                            onBlur={(e) => handleUpdatedData(c, e.target.value, true)}
                        />
                    </>
                    ) : (
                    <Typography onClick={() => setEditField(c)}>
                        {selectedUser[c]}
                    </Typography>
                    )}
                </>
                )}


                    </FormControl>
                </Stack>  
            )})}
         </List>
         <Button onClick={() => setSelectedUser(null)} >Back</Button>
    </Stack>
  );
};

export default UserInfo;