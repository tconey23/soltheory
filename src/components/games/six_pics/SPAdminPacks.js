import { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, List, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import { listAllPacks } from '../../../business/gamesAPICalls';
import { useGlobalContext } from '../../../business/GlobalContext';
import PackLIstItem from './PackLIstItem';
import {ButtonBase} from '@mui/material';
import AddPackForm from './AddPackForm';
import VideoEditor from '../pic6_images/VideoEditor';
import ViewPack from './ViewPack';

// const packList = [
//     {
//         "id": 15,
//         "created_at": "2025-04-22T15:29:45+00:00",
//         "pack_name": "Oscars",
//         "videos": null,
//         "graphic": 'https://bueukhsebcjxwebldmmi.supabase.co/storage/v1/object/public/6picsvideos/videos/Oscars/Main%20graphic.mp4'
//     }
// ]

const SPAdminPacks = ({setForceRefresh, forceRefresh}) => { 

    const [packs, setPacks] = useState([])
    const [fieldCount, setFieldCount] = useState()
    const [isHover, setisHover] = useState(false)
    const [selection, setSelection] = useState()
    const [expandAddNewPack, setExpandAddNewPack] = useState(false)
    const [resetForm, setResetForm] = useState(0)
    

    const packRef = useRef()

    const getAllPacks = async () => {
        const packList = await listAllPacks()

        if(packList){
            setPacks(packList.map((p) => (
                p
            )))
        }
    }

    useEffect(() => {console.log(forceRefresh)
        if(forceRefresh > 1){
            getAllPacks()
        }
    }, [forceRefresh])

    useEffect(() =>{
        if(packs.length == 0){
            getAllPacks()
        }
    }, [packs])

  return (
            <Stack direction={'column'} sx={{ height: '98%', width: '100%' }}>
                {selection
                ?
                    <>
                        <ViewPack setSelection={setSelection} selection={selection} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh}/> 
                    </>
                :
                    <>
                    <Accordion 
                     expanded={expandAddNewPack}
                     onClick={(e) => {
                         let classlist = e.target.classList
                         if(classlist.contains('Mui-expanded') || classlist.contains('MuiAccordionSummary-content')){
                             setExpandAddNewPack(prev => !prev)
                            }
                            if(classlist.contains('Mui-expanded')){
                                setResetForm(prev => prev +1)
                            }
                        }}>
                        <AccordionSummary>
                            Add new pack
                        </AccordionSummary>
                        <AccordionDetails>
                            <AddPackForm setExpandAddNewPack={setExpandAddNewPack} resetData={resetForm}/>
                        </AccordionDetails>
                    </Accordion>
                <Accordion>
                    <AccordionSummary>
                        Existing packs
                    </AccordionSummary>
                    <AccordionDetails>
                    
                <List>
                    {packs.length > 0 &&
                        packs.map((p, i) => {
                            let fields = Object.entries(p);
                            let count = fields.length;
                            const percentWidth = (1 / count) * 85;
                            
                            const priorityOrder = ['graphic', 'pack_name', 'id'];
                            fields.sort((a, b) => {
                                const aIndex = priorityOrder.indexOf(a[0]);
                                const bIndex = priorityOrder.indexOf(b[0]);
                                
                                if (aIndex !== -1 && bIndex !== -1) {
                                    return aIndex - bIndex;
                                }
                                
                                if (aIndex !== -1) return -1;
                                
                                if (bIndex !== -1) return 1;
                                return 0;
                            });
                            
                            return (
                                <ListItem key={i}>
                                    <Accordion sx={{width: '100%'}} defaultExpanded>
                                        <AccordionSummary sx={{transition: 'all 1s ease-in-out', bgcolor: isHover === `pack${i}` ? '#1976d224' : 'white', boxShadow: isHover === `pack${i}` ? '5px 5px 16px 0px #00000045' : 'none'}} onMouseOver={() => setisHover(`pack${i}`)} onMouseOut={() => setisHover(false)}>
                                            {p['pack_name']}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Tooltip
                                             title={`Edit ${p['pack_name']}`}
                                             placement="top"
                                             followCursor
                                             enterDelay={300} 
                                             leaveDelay={200}
                                             >
                                                <Stack
                                                 direction={'row'}
                                                 sx={{transition: 'all 1s ease-in-out', cursor: isHover == i ? 'pointer' : 'none'}}
                                                 
                                                 backgroundColor={isHover == i ? '#1976d224' : 'white'}
                                                 boxShadow={isHover == i ? '5px 5px 16px 0px #00000045' : 'none'}
                                                 borderRadius={10}
                                                 padding={1}
                                                 onClick={() => setSelection(p['pack_name'])}
                                                 onMouseOver={() => setisHover(i)} 
                                                 onMouseOut={() => setisHover(null)}
                                                 >
                                                     <ButtonBase
                                                        sx={{
                                                            bgColor: isHover == i ? '#1976d224' : 'white',
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: 10,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            overflow: 'hidden',
                                                            transition: 'all 1s ease-in-out'
                                                        }}
                                                        >
                                                    {fields.map((f) => {
                                                        let firstLetter = f[0].split('')[0].toUpperCase()
                                                        let nameLength = f[0].split('').length
                                                        let nameEnding = [f[0].replaceAll('_', ' ').split('').splice(1, nameLength -1)]
                                                        let formattedName = `${firstLetter}${nameEnding.join().replaceAll(',', '')}`
                                                        
                                                        return (
                                                            <PackLIstItem key={f[0]} name={formattedName} value={f[1]} percentWidth={percentWidth}/>
                                                        )
                                                    })}
                                                    </ButtonBase>
                                                </Stack>
                                            </Tooltip>
                                        </AccordionDetails>
                                    </Accordion>
                            </ListItem>
                        );
                    })}
                </List>    
                    </AccordionDetails>
                </Accordion>
                </>
                }
            </Stack>

  );
};

export default SPAdminPacks;