import { useEffect, useState, useRef } from 'react';
import { Button, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { checkExistingPack, getGifs, getSixPicsPack, uploadVid, removeGifByName, addNewCategory, updatePackLogo } from '../business/apiCalls';


const AddPics = ({size}) => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [answer, setAnswer] = useState(null)
    const [category, setCategory] = useState(null)
    const [payload, setPayload] = useState()
    const [categories, setCategories] = useState()
    const [selectedCat, setSelectedCat] = useState()
    const [selectedData, setSelectedData] = useState()
    const [toggleEditPhoto, setToggleEditPhoto] = useState(false)
    const [toggleAddVid, setToggleAddVid] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [newCat, setNewCat] = useState()
    const [packLogo, setPackLogo] = useState()
    const [videoUrl, setVideoUrl] = useState(null);

    const videoRef = useRef()

    useEffect(() => {

        if(selectedCat && selectedCat !== "new"){
            fetchSelectedCat(selectedCat)
        }

    }, [selectedCat])

    useEffect(() => {
        if(selectedData){
            console.log(selectedData)
        }
    }, [selectedData])

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if(selectedFile){
            setAnswer(selectedFile.name?.replace('.mp4', ''))
        }
    }, [selectedFile])

    useEffect(() => {
        console.log(packLogo, videoUrl)
    }, [packLogo, videoUrl])

    const fetchSelectedCat = async (cat) => {
        const res = await getGifs(cat)
        setSelectedData(res)
    }

    const fetchCategories = async () => {
        const res = await getSixPicsPack()
        setCategories(res)
    }

    const handleUploadVid = async () => {
        const res = await uploadVid(selectedFile)

        let dataObject = {
            url: '',
            name: selectedFile.name,
            answer: selectedFile.name,
            length: selectedFile.name.split('').length
        }
        
        if(res){
            console.log(res)
            dataObject.url = res

            const add = await checkExistingPack(selectedCat, dataObject)
            if(add === 'success'){
                setSelectedFile(null)
                setAnswer(null)
                setToggleAddVid(false)
                fetchSelectedCat(selectedCat)
                setRefreshKey(prev => prev +1)
            }
        }
    }

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };

      const handlePackLogoChange = (event) => {
        const file = event.target.files[0];

    if (file && file.type === "video/mp4") {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setPackLogo(file)
    } else {
      alert("Please select a valid MP4 file.");
    }
      };

      const handleSavePackLogo = async () => {
        const res = await updatePackLogo(packLogo, selectedCat)

        if(res === 'success'){
            console.log(res)
        }
      }

    const handleUploadFile = () => {
        document.getElementById("fileInput").click(); // Trigger file input
      };

      useEffect(() => {
        console.log(size)
      }, [size])

      const handleDeleteVid = async (cat, answer) => {
        const res = await removeGifByName(selectedCat, answer)

        if(res === 'success'){
            console.log(res)
            fetchSelectedCat(selectedCat)
            setRefreshKey(prev => prev +1)
        }
      }

      const handleAddNewCat = async (catName) => {
       const res = await addNewCategory(catName)
       if(res === 'success'){
        setNewCat('')
        await fetchCategories()
        setSelectedCat(catName)
       }
      }

      useEffect(() => {
        if(videoRef.current){
            videoRef.current.play()
            console.log(videoRef.current)
        }
      }, [videoRef])

    return (
        <Stack width={size.width} height={size.height * 0.50}>
            <Stack>
                <Select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} sx={{width: '90%'}}>
                    <MenuItem value={'new'}>New</MenuItem>
                    {categories && categories.map((c) => {

                        return (
                            <MenuItem value={c.pack_name}>{c.pack_name.toUpperCase()}</MenuItem>
                        )
                    })}
                </Select>
            </Stack>
            {selectedCat === 'new' ? 
            <Stack width={'20%'}>
                <TextField onChange={(e) => setNewCat(e.target.value)} sx={{padding: 3}} placeholder={'Category name'} value={newCat}></TextField>
                <Button onClick={() => handleAddNewCat(newCat)}>Add</Button>
            </Stack>
            : 
            <>
            <Stack sx={{position: 'relative', padding: 3}} onMouseOver={() => setToggleEditPhoto(true)} onMouseOut={() => setToggleEditPhoto(false)} justifyContent={'center'} alignItems={'center'}>
                {videoUrl ? 
                <>
                <video ref={videoRef} style={{height: '100%'}} autoplay loop>
                    <source src={videoUrl} type="video/mp4"/>
                </video>
                <Button onClick={() => handleSavePackLogo()}>Update</Button>
                </>
                :
                <video ref={videoRef} style={{height: '100%'}} autoplay loop>
                    <source src={selectedData?.graphic} type="video/mp4"/>
                </video>
                }
                {toggleEditPhoto && selectedCat && 
                <input
                 type='file'

                 onChange={handlePackLogoChange} 
                 sx={{
                    fontWeight: 100,
                    cursor: 'pointer', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    alignContent: 'center', 
                    position: 'absolute', 
                    clipPath: 'circle(50% at 50% 50%)', 
                    width: '88px', 
                    height: '88px', 
                    textAlign: 'center', 
                    background: '#808080d6'
                    }}/>
                }
            </Stack>

            {toggleAddVid &&
            <Stack direction={'row'} width={'50%'} alignItems={'center'} padding={2}>
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }} // Hide default file input
                onChange={handleFileChange}
            />
            
            <Typography marginRight={3}>{`${selectedFile?.name ? selectedFile?.name.replace(".mp4", '') + '.mp4' : ''}`}</Typography>
            <Button sx={{margin: 3}} variant="contained" color="primary" onClick={handleUploadFile}>
                Upload File
            </Button>
            
        <Stack direction={'row'} width={'50%'}>
            <TextField placeholder='Answer' onChange={(e) => setAnswer(e.target.value)} value={answer}></TextField>
        </Stack>
        {answer && <Button onClick={() => handleUploadVid()}>Submit</Button>}
        </Stack>
        }
            <List key={refreshKey}>
                <ListItem sx={{margin: 3}}>
                    <Button onClick={() => setToggleAddVid(true)} variant='contained'>Add</Button>
                    <Button onClick={() => setToggleAddVid(false)} variant='contained'>Cancel</Button>
                </ListItem>
                {
                    selectedData && selectedData.gifs && selectedData.gifs.map((d) => {
                        return (
                            <ListItem sx={{border: '1px solid black', margin: 3, width: '80%'}}>
                                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
                                    <Typography>{d.answer}</Typography>
                                    <i onClick={(e) => handleDeleteVid(selectedCat, d.answer)} style={{cursor: 'pointer'}} className="fi fi-sr-trash"></i>                                   
                                </Stack>
                            </ListItem>
                        )
                    })
                }
                </List>
            </>
            }
        </Stack>
    )

}

const Admin = ({size}) => {
  return (
    <Stack direction={'column'} sx={{ height: '98%', width: '100%', overflow: 'scroll'}}>
      <AddPics size={size}/>
    </Stack>
  );
};

export default Admin;