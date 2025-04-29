import { useEffect, useState, useRef } from 'react';
import { Button, InputLabel, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { checkExistingPack, getGifs, getSixPicsPack, uploadVid, removeGifByName, addNewCategory, updatePackLogo } from '../business/apiCalls'; 
import { useGlobalContext } from '../business/GlobalContext';
import { useNavigate } from 'react-router-dom';
import Hexagon from './games/Hexagon';
import TwentOneThingsButton from './games/TwentOneThingsButton';
import SixPicsButton from './games/SixPicsButton'


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
    const {alertProps, setAlertProps, user} = useGlobalContext() 
    const [gameSelection, setGameSelection] = useState()
    const [userSelection, setUserSelection] = useState()
    const nav = useNavigate()

    useEffect(() =>{
      switch(gameSelection){
        case '6Pics': nav(user?.is_admin ? '/account/admin/6pics' : '/error');
        break;
        case '21Things': nav(user?.is_admin ? '/account/admin/21things' : '/error');
        break;
      }
    }, [gameSelection])

    useEffect(() =>{
      switch(userSelection){
        case 'adminrights': nav('/account/admin/adminrights');
        break;
        case 'userstatus': nav('/account/admin/adminrights');
        break;

      }
    }, [userSelection])

  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%'}}>
        <Stack width={'40%'} height={'10%'} paddingY={1}>
            <Typography>Games</Typography>
            <Select
             value={gameSelection} 
             onChange={(e) => setGameSelection(e.target.value)} 
             sx={{padding: 2, height: '10px'}} 
             displayEmpty
             renderValue={(selected) => {
              if (!selected) {
                return <em>Select game</em>;
              }
              return selected;
            }}
             >
                <MenuItem value='' disabled>
                  <em>Select game</em>
                </MenuItem>
                <MenuItem value={'6Pics'} sx={{margin: 1, height: '50px'}}>
                  <SixPicsButton admin={true}/>
                </MenuItem>
                <MenuItem value={'21Things'} sx={{margin: 1, height: '50px'}}>
                  <TwentOneThingsButton admin={true}/>
                </MenuItem>
            </Select>
        </Stack>



        <Stack width={'40%'} height={'10%'} paddingY={1}>
            <Typography>Users</Typography>
            <Select
             value={userSelection} 
             onChange={(e) => setUserSelection(e.target.value)} 
             sx={{padding: 2, height: '10px'}} 
             displayEmpty
             renderValue={(selected) => {
              if (!selected) {
                return <em>Select option</em>;
              }
              return selected;
            }}
             >
                <MenuItem value='' disabled>
                  <em>Select option</em>
                </MenuItem>
                <MenuItem value={'adminrights'} sx={{margin: 1, height: '50px'}}>
                  <Typography>Manage admin rights</Typography>
                </MenuItem>
            </Select>
        </Stack>
            
    </Stack>
  );
};

export default Admin;