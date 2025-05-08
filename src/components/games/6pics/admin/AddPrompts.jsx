import { useEffect, useState, useRef } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Stack, Switch, TextField, Typography } from '@mui/material';
import { addNewPrompts } from '../../../../business/games_calls';
import Papa from 'papaparse';
import EditablePromptItem from './EditablePromptItem';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../../business/useGlobalStore';
import PromptCalendar from './PromptCalendar';
import { useTheme } from '@mui/material/styles'
import { getPrompts } from '../../../../business/games_calls';

const AddPrompts = () => {
    const [date, setDate] = useState('');
    const [author, setAuthor] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [newPrompt, setNewPrompt] = useState('');
    const [toggleMulti, setToggleMulti] = useState(false);
    const [data, setData] = useState([]);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const {user, screen, userMeta} = useGlobalStore()
    const theme = useTheme()

    const nav = useNavigate()
  
    useEffect(() => {
      if (userMeta) setAuthor(userMeta.user_name);

    }, [userMeta]);
  
    useEffect(() => {
      // console.log(date)
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
      console.log(updatedText)
      if (type === 'data') {
        setData(prev => prev.map((item, i) => i === index ? { ...item, prompt: updatedText } : item));
      } else if (type === 'prompts') {
        setPrompts(prev => prev.map((item, i) => i === index ? updatedText : item));
      }
    };
  
    return (
      <Stack alignItems='center' height={'100%'} width={'100%'}>
        <Typography variant='h6'>Add Prompts</Typography>
        <Stack width={'85%'} marginY={3} >
          <Accordion
            onChange={() => {
              if(userMeta?.user_name){
                console.log(userMeta?.user_name)
                setAuthor(userMeta?.user_name)
              }
            }}
          >
            <AccordionSummary>Prompt Options</AccordionSummary>
            <AccordionDetails sx={{bgcolor: theme.palette.secondary.main, justifyItems:'center'}}>


        <Stack  marginY={1} bgcolor={'white'} width={'50%'} padding={2} alignItems={'center'} borderRadius={2}>
          <PromptCalendar setDate={setDate}/>
    
          <TextField
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            label="Author"
            sx={{ marginTop: 2 }}
            />
        </Stack>


              <Stack bgcolor={'white'} width={'50%'} padding={2} alignItems={'center'} borderRadius={2}>

              <Typography>{!toggleMulti ? 'Single Prompt' : 'Upload CSV'}</Typography>
              <Switch checked={!toggleMulti} onChange={() => setToggleMulti(prev => !prev)}/>              

              {toggleMulti ? (
                <Stack marginY={3}>
                  <input type="file" accept=".csv" onChange={handleFileUpload} />
                </Stack>
              ) : (
                <Stack direction={'row'} justifyContent={'center'} marginY={3}>
                  <TextField
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    label="New Prompt"
                    sx={{ marginTop: 2, marginLeft: 3}}
                    />
                  <Button sx={{marginX: 3, marginY: 2}} onClick={handleAddPrompt} disabled={!newPrompt}>Add</Button>
                </Stack>
              )}



              </Stack>
              
              </AccordionDetails>
            </Accordion>
          </Stack>

        <List sx={{ width: screen === 'xs' ? '98%' : '75%', overflowY: 'auto', justifySelf: 'center', boxShadow: 'inset 0px 0px 13px 1px #00000021'}}>
          {(toggleMulti ? data : prompts).map((item, i) => (
            <EditablePromptItem
            key={i}
            index={i}
            value={item}
            type={toggleMulti ? 'data' : 'prompts'}
            onDelete={handleDelete}
            onSave={handleSaveEdit}
            isMobile={!!screen === 'xs'}
            />
          ))}
        </List>
        <Stack direction={'row'} width={'25%'} justifyContent={'space-evenly'}>
          <Button onClick={() => nav('/account')}>Back</Button>
          {readyToSubmit && <Button onClick={handlePost}>Upload</Button>}
        </Stack>
      </Stack>
    );
  };

export default AddPrompts;