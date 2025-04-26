import { useEffect, useState, useRef } from 'react';
import { Button, List, Stack, TextField, Typography } from '@mui/material';
import { useGlobalContext } from '../../../business/GlobalContext';
import { addNewPrompts } from '../../../business/apiCalls';
import Papa from 'papaparse';
import EditablePromptItem from '../../EditablePromptItem';
import { useNavigate } from 'react-router-dom';

const AddPrompts = () => {
    const [date, setDate] = useState('');
    const [author, setAuthor] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [newPrompt, setNewPrompt] = useState('');
    const [toggleMulti, setToggleMulti] = useState(false);
    const [data, setData] = useState([]);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const { user, isMobile } = useGlobalContext();

    const nav = useNavigate()
  
    useEffect(() => {
      if (user) setAuthor(user.name);
      console.log(user)
    }, [user]);
  
    useEffect(() => {
      const valid = date && author && ((prompts.length === 21) || (data.length === 21));
      setReadyToSubmit(valid);
    }, [data, prompts, date, author]);
  
    const handlePost = async () => {
      const formatted = new Date(date).toLocaleDateString("en-US");
      const promptList = prompts.length ? prompts : data;
  
      const payload = {
        date: formatted,
        author,
        prompts: promptList,
      };
  
      const res = await addNewPrompts(payload);
      if (res === 'success') {
        setDate('');
        setData([]);
        setPrompts([]);
        setAuthor('');
      }
    };
  
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const promptArray = results.data.map(row => ({ prompt: row[0]?.trim() })).filter(p => p.prompt);
          setData(promptArray);
        }
      });
    };
  
    const handleAddPrompt = () => {
      if (newPrompt) {
        setPrompts(prev => [...prev, newPrompt]);
        setNewPrompt('');
      }
    };
  
    const handleKeyDown = (key) => {
      if (key === "Enter" && prompts.length < 21 && newPrompt) {
        handleAddPrompt();
      }
    };
  
    const handleDelete = (index, type) => {
      if (type === 'data') setData(prev => prev.filter((_, i) => i !== index));
      if (type === 'prompts') setPrompts(prev => prev.filter((_, i) => i !== index));
    };
  
    const handleSaveEdit = (index, updatedText, type) => {
      if (type === 'data') {
        setData(prev => prev.map((item, i) => i === index ? { ...item, prompt: updatedText } : item));
      } else if (type === 'prompts') {
        setPrompts(prev => prev.map((item, i) => i === index ? updatedText : item));
      }
    };
  
    return (
      <Stack alignItems='center' height={'100%'} width={'100%'}>
        <Typography variant='h6'>Add Prompts</Typography>
  
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ marginTop: 2 }}
          />
        <TextField
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          label="Author"
          sx={{ marginTop: 2 }}
          />
  
        <Button onClick={() => setToggleMulti(!toggleMulti)} sx={{ mt: 2 }}>
          {toggleMulti ? 'Single Prompt' : 'Upload CSV'}
        </Button>
  
        {toggleMulti ? (
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        ) : (
          <Stack direction={'column'} alignItems={'center'}>
            <TextField
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e.key)}
              label="New Prompt"
              sx={{ marginTop: 2 }}
              />
            <Button onClick={handleAddPrompt} disabled={!newPrompt}>Add</Button>
          </Stack>
        )}
  
        {readyToSubmit && <Button onClick={handlePost}>Upload</Button>}
        
        <List sx={{ width: isMobile ? '100%' : '75%' }}>
          {(toggleMulti ? data : prompts).map((item, i) => (
            <EditablePromptItem
            key={i}
            index={i}
              value={item}
              type={toggleMulti ? 'data' : 'prompts'}
              onDelete={handleDelete}
              onSave={handleSaveEdit}
              isMobile={isMobile}
            />
          ))}
        </List>
        <Button onClick={() => nav('/account')}>Back</Button>
      </Stack>
    );
  };

export default AddPrompts;