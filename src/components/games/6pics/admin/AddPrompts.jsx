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
    const setAlertContent = useGlobalStore((state) => state.setAlertContent)
    const [date, setDate] = useState('');
    const [author, setAuthor] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [newPrompt, setNewPrompt] = useState('');
    const [toggleMulti, setToggleMulti] = useState(false);
    const [data, setData] = useState([]);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const {user, screen, userMeta} = useGlobalStore()
    const theme = useTheme()
    const [promptCount, setPromptCount] = useState(0)

    const nav = useNavigate()
  
    useEffect(() => {
      if (userMeta) setAuthor(userMeta.user_name);
    }, [userMeta]);
  
    useEffect(() => {
      const valid = date && author && ((prompts.length === 21) || (data.length === 21));
      setReadyToSubmit(valid);
      
      if(data?.length){
        setPromptCount(data.length)
      } else if (prompts?.length){
        setPromptCount(prompts?.length)
      } else if(data?.length == 0 && prompts?.length == 0){
        setPromptCount(0)
      }
    }, [data, prompts, date, author]);

    useEffect(() => {
      handleClear()
    }, [toggleMulti])

    const handleClear = () => {
      setData([])
      setPrompts([])
      setPromptCount(0)
    }
  
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
        setAlertContent({
          text: `Prompts uploaded successfully`,
          type: 'success'
        })
      } else {
        setAlertContent({
          text: `An error occurred while uploading content`,
          type: 'error'
        })
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
        setPromptCount(prev => prev +1)
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
      <Stack alignItems='center' height={'98%'} width={'98%'}>
        <Typography variant='h6' color='white'>Add Prompts</Typography>
        <Stack width={'98%'} height={'90%'} marginY={3} >
          <Accordion
            onChange={() => {
              if(userMeta?.user_name){
                setAuthor(userMeta?.user_name)
              }
            }}
          >
            <AccordionSummary>Prompt Options</AccordionSummary>
            <AccordionDetails sx={{bgcolor: theme.palette.secondary.main, justifyItems:'center'}}>


        <Stack  marginY={1} bgcolor={'white'} width={'98%'} padding={2} alignItems={'center'} borderRadius={2}>
          <PromptCalendar setDate={setDate}/>
    
          <TextField
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            label="Author"
            sx={{ marginTop: 1, width: '50%'}}
            />
        </Stack>


              <Stack bgcolor={'white'} width={'98%'} padding={2} alignItems={'center'} borderRadius={2}>

              <Typography fontWeight={'bolder'}>{!toggleMulti ? 'Single Prompt' : 'Upload CSV'}</Typography>
              <Switch checked={!toggleMulti} onChange={() => setToggleMulti(prev => !prev)}/>              
              <Typography marginTop={2} marginBottom={-4}>{`Prompt count ${promptCount}`}</Typography>

              {toggleMulti ? (
                <Stack marginY={1}>
                  <input type="file" accept=".csv" onChange={handleFileUpload} />
                </Stack>
              ) : (
                <Stack direction={'row'} justifyContent={'center'} marginTop={2}>
                  <TextField
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    label="New Prompt"
                    sx={{ marginTop: 2, marginLeft: 3}}
                    />
                  <Button sx={{marginX: 3, marginY: 3, color: 'white'}} onClick={handleAddPrompt} disabled={!newPrompt}>Add</Button>
                </Stack>
              )}



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
          <Button onClick={() => handleClear()}>Clear</Button>
          <Button onClick={() => nav('/account')}>Back</Button>
          {readyToSubmit && <Button onClick={handlePost}>Upload</Button>}
        </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>

      </Stack>
    );
  };

export default AddPrompts;