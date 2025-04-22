import { useEffect, useState, useRef } from 'react';
import { Button, InputLabel, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { checkExistingPack, getGifs, getSixPicsPack, uploadVid, removeGifByName, addNewCategory, updatePackLogo } from '../business/apiCalls'; 
import { useGlobalContext } from '../business/GlobalContext';
import Papa from 'papaparse';
import { addNewPrompts } from '../business/apiCalls';
import EditablePromptItem from './EditablePromptItem';
import { useNavigate } from 'react-router-dom';
import Hexagon from './games/Hexagon';
import TwentOneThingsButton from './games/TwentOneThingsButton';
import SixPicsButton from './games/SixPicsButton';

const AddPrompts = () => {
    const [date, setDate] = useState('');
    const [author, setAuthor] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [newPrompt, setNewPrompt] = useState('');
    const [toggleMulti, setToggleMulti] = useState(false);
    const [data, setData] = useState([]);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    const { user, isMobile } = useGlobalContext();
  
    useEffect(() => {
      if (user) setAuthor(user.name);
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
      <Stack alignItems='center' paddingTop={4}>
        <Typography variant='h6'>Add Prompts</Typography>
        {readyToSubmit && <Button onClick={handlePost}>Upload</Button>}
  
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
      </Stack>
    );
  };


  export const AddPics = ({ size }) => {
    const { isMobile } = useGlobalContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [toggleAddVid, setToggleAddVid] = useState(false);
    const [newCat, setNewCat] = useState('');
    const [packLogo, setPackLogo] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const videoRef = useRef();
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    useEffect(() => {
      if (selectedCat && selectedCat !== 'new') fetchSelectedCat(selectedCat);
    }, [selectedCat]);
  
    useEffect(() => {
      if (selectedFile) setAnswer(selectedFile.name.replace('.mp4', ''));
    }, [selectedFile]);
  
    const fetchCategories = async () => {
      const res = await getSixPicsPack();
      setCategories(res);
    };
  
    const fetchSelectedCat = async (cat) => {
      const res = await getGifs(cat);
      setSelectedData(res);
    };
  
    const handleUploadVid = async () => {
      const res = await uploadVid(selectedFile);
      if (res) {
        const dataObject = {
          url: res,
          name: selectedFile.name,
          answer,
          length: answer.length,
        };
        const add = await checkExistingPack(selectedCat, dataObject);
        if (add === 'success') {
          setSelectedFile(null);
          setAnswer('');
          setToggleAddVid(false);
          fetchSelectedCat(selectedCat);
        }
      }
    };
  
    const handleFileChange = (e) => {
      if (e.target.files.length > 0) setSelectedFile(e.target.files[0]);
    };
  
    const handlePackLogoChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'video/mp4') {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setPackLogo(file);
      } else {
        alert('Please select a valid MP4 file.');
      }
    };
  
    const handleSavePackLogo = async () => {
      const res = await updatePackLogo(packLogo, selectedCat);
      if (res === 'success') {
        console.log('Logo updated');
      }
    };
  
    const handleDeleteVid = async (cat, answer) => {
      const res = await removeGifByName(cat, answer);
      if (res === 'success') fetchSelectedCat(cat);
    };
  
    const handleAddNewCat = async (catName) => {
      const res = await addNewCategory(catName);
      if (res === 'success') {
        setNewCat('');
        fetchCategories();
        setSelectedCat(catName);
      }
    };
  
    return (
      <Stack width={'90%'} spacing={3} padding={isMobile ? 2 : 4}>
        <Typography variant="h6">6Pics Controls</Typography>
  
        <Select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} fullWidth>
          <MenuItem value="new">New</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.pack_name} value={c.pack_name}>
              {c.pack_name.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
  
        {selectedCat === 'new' && (
          <Stack direction={'row'} spacing={2}>
            <TextField
              placeholder="Category name"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={() => handleAddNewCat(newCat)}>
              Add
            </Button>
          </Stack>
        )}
  
        {selectedData && selectedData.graphic && (
          <Stack alignItems="center" spacing={2}>
            {selectedData.graphic.endsWith('.mp4') ? (
              <video
                ref={videoRef}
                src={selectedData.graphic}
                controls
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            ) : (
              <img
                src={selectedData.graphic}
                alt="Pack Visual"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            )}
  
            <input type="file" onChange={handlePackLogoChange} />
            {packLogo && <Button onClick={handleSavePackLogo}>Save Logo</Button>}
          </Stack>
        )}
  
        {toggleAddVid && (
          <Stack spacing={2}>
            <input type="file" onChange={handleFileChange} />
            <TextField
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleUploadVid}>
              Upload Video
            </Button>
          </Stack>
        )}
  
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
          <Button onClick={() => setToggleAddVid(true)} variant='contained'>Add Video</Button>
          <Button onClick={() => setToggleAddVid(false)} variant='outlined'>Cancel</Button>
        </Stack>
  
        <List>
          {selectedData?.gifs?.map((d, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <Button onClick={() => handleDeleteVid(selectedCat, d.answer)}>
                  <i className="fi fi-sr-trash"></i>
                </Button>
              }
            >
              <Typography>{d.answer}</Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    );
  };

const Admin = ({size}) => {
    const {alertProps, setAlertProps} = useGlobalContext() 
    const [selection, setSelection] = useState()
    const nav = useNavigate()

    useEffect(() =>{
      switch(selection){
        case '6Pics': nav('/account/admin/6pics');
        break;
        case '21Things': nav('/account/admin/21things');
        break;

      }
    }, [selection])

  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%'}}>
        <Stack width={'50%'}>
            <Select value={selection} onChange={(e) => setSelection(e.target.value)} sx={{padding: 2}}>
                <MenuItem value={'6Pics'} sx={{margin: 1}}>
                  <SixPicsButton admin={true}/>
                </MenuItem>
                <MenuItem value={'21Things'} sx={{margin: 1}}>
                  <TwentOneThingsButton admin={true}/>
                </MenuItem>
            </Select>
        </Stack>
    </Stack>
  );
};

export default Admin;