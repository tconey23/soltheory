import { useEffect, useState, useRef } from 'react';
import { Button, InputLabel, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

const EditablePromptItem = ({
    index,
    value,
    type,
    onSave,
    onDelete,
    isMobile
  }) => {
    const [isEditing, setIsEditing] = useState(false); 
    const [editValue, setEditValue] = useState(value);
  
    const handleSave = () => {
      console.log(index, editValue, type)
      onSave(index, editValue, type);
      setIsEditing(false);
    };

    useEffect(() => {
      console.log(editValue)
    }, [editValue])
  
    return (
      <Stack
        direction={'row'}
        sx={{
          padding: 0.5,
          margin: 2,
          border: '1px solid black',
          borderRadius: '10px',
          scale: isMobile ? 0.8 : 1,
          width: '95%',
          boxShadow: '2px 1px 13px 1px rgba(0, 0, 0, 0.34)'
        }}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button sx={{ scale: isMobile ? 0.5 : 1 }} variant='contained' onClick={() => onDelete(index, type)}>
          <i className="fi fi-bs-cross-circle" style={{ padding: 5 }}></i>
        </Button>
  
        <Button sx={{ scale: isMobile ? 0.5 : 1 }} variant='contained' onClick={() => setIsEditing(!isEditing)}>
          <i className="fi fi-br-pencil" style={{ padding: 5 }}></i>
        </Button>
  
        <ListItem>
          {isEditing ? (
            <Stack direction={'row'} width={'100%'} bgcolor={'white'}>
              <TextField
                sx={{ width: '100%', marginRight: 2}}
                value={editValue?.prompt}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <Button sx={{ scale: isMobile ? 0.5 : 1 }} onClick={handleSave} variant='contained'>Save</Button>
            </Stack>
          ) : (
            <Stack bgcolor={'white'} width={'100%'}>
              <Typography fontFamily={'Fredoka Regular'}>{type === 'data' ? value.prompt : value}</Typography>
            </Stack>
          )}
        </ListItem>
      </Stack>
    );
  };
  
  export default EditablePromptItem;
  