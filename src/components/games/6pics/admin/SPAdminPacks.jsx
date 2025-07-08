import { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, List, ListItem, Stack, Tooltip, Typography, Modal } from '@mui/material';
import { listAllPacks } from '../../../../business/games_calls';
import PackLIstItem from '../PackLIstItem';
import {ButtonBase} from '@mui/material';
import AddPackForm from '../../6pics/admin/AddPackForm'
import VideoEditor from './VideoEditor';
import ViewPack from '../ViewPack';
import useGlobalStore from '../../../../business/useGlobalStore';

// const packList = [
//     {
//         "id": 15,
//         "created_at": "2025-04-22T15:29:45+00:00",
//         "pack_name": "Oscars",
//         "videos": null,
//         "graphic": 'https://bueukhsebcjxwebldmmi.supabase.co/storage/v1/object/public/6picsvideos/videos/Oscars/Main%20graphic.mp4'
//     }
// ]

const SPAdminPacks = ({setForceRefresh, forceRefresh, setSelectedOption}) => { 
    const [packs, setPacks] = useState([])
    const [fieldCount, setFieldCount] = useState()
    const [isHover, setisHover] = useState(false)
    const [selection, setSelection] = useState()
    const [expandAddNewPack, setExpandAddNewPack] = useState(false)
    const [resetForm, setResetForm] = useState(0)
    const [mobile, setMobile] = useState(false)

    const {screen} = useGlobalStore()
    
    useEffect(() => {
        switch(screen){
            case 'xs': setMobile(true)
            break
            case 'sm': setMobile(true)
            break
            case 'md': setMobile(false)
            break
            case 'lg': setMobile(false)
        }
    }, [screen])

    const packRef = useRef()

    const getAllPacks = async () => {
        const packList = await listAllPacks()
        if(packList){
            setPacks(packList.map((p) => (
                p
            )))
        }
    }

    useEffect(() => {
        if(resetForm > 1){
            getAllPacks()
        }
    }, [resetForm])

    useEffect(() =>{
        if(packs.length == 0){
            getAllPacks()
        }
    }, [packs])

  return (
            <Stack direction={'column'} sx={{ height: '85%', width: '85%', overflowY: 'auto'}}>
                {selection
                ?
                    <>
                        <Modal open={!!selection}>
                            <Stack userdata='modal_1' justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'}>
                                <Stack userdata='modal_2' bgcolor={'white'} justifyContent={'center'} alignItems={'center'} width={'95%'} height={'75%'}>
                                    <ViewPack setSelection={setSelection} selection={selection} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} setResetForm={setResetForm}/> 
                                </Stack>
                            </Stack>
                        </Modal>
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
                        <AccordionDetails title='add_pack_accordion'>
                            <AddPackForm setPacks={setPacks} setExpandAddNewPack={setExpandAddNewPack} resetData={resetForm}/>
                        </AccordionDetails>
                    </Accordion>
                <Accordion onChange={(e) => {

                    if(!e.target.classList.contains('Mui-expanded')){
                        getAllPacks()
                    }
                    }}>
                    <AccordionSummary>
                        Existing packs
                    </AccordionSummary>
                    <AccordionDetails>
                    
                <List>
                    {packs.length > 0 &&
                        packs.filter((pk) => !pk.marked_for_delete)
                        .map((p, i) => {
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
                                    <Tooltip
                                        title={`Edit ${p['pack_name']}`}
                                        placement="top"
                                        followCursor
                                        enterDelay={300} 
                                        leaveDelay={200}
                                        >
                                        <Stack
                                            direction={'row'}
                                            sx={{transition: 'all 1s ease-in-out', cursor: isHover == i ? 'pointer' : 'none', width: '100%'}}
                                            
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
                            </ListItem>
                        );
                    })}
                </List>    
                    </AccordionDetails>
                </Accordion>
                </>
                }
            <Modal open={!!mobile}>
                <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                    <Stack width={'50%'} height={'20%'} bgcolor={'white'} direction={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                        <Typography textAlign={'center'}>
                            <i style={{color: 'red', fontSize: '20px', margin: 20}} className="fi fi-sr-exclamation"></i>
                        </Typography>
                        <Typography textAlign={'center'}>This option must be viewed on a desktop device</Typography>
                        <Button onClick={() => setSelectedOption(null)} >Back</Button>
                    </Stack>
                </Stack>
            </Modal>
            </Stack>

  );
};

export default SPAdminPacks;