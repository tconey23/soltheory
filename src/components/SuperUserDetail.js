import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, FormControl, Input, InputLabel, List, ListItem, Menu, MenuItem, Select, Switch, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'

const BooleanDisplay = ({keyName, value}) =>{

    return (
        <Stack marginLeft={2} direction={'row'} alignItems={'center'}>
            <Typography>{keyName}</Typography> 
            <Switch checked={value}/>
        </Stack>
    )

}

const FriendCard = ({value}) => {

    return (
        <>
            <Stack width={300} justifyContent={'center'} alignItems={'flex-start'}>
                <Stack width={'100%'} height={'25%'} direction={'row'} alignItems={'flex-start'} justifyContent={'center'}>
                    <Avatar sx={{marginX: 2}} src={value.avatar}/>
                    <Stack justifyContent={'flex-start'}>
                        <Typography fontSize={12}>{value.user_name}</Typography>
                        <Typography fontSize={12}>{value.email}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )

}

const ArrayDisplay = ({keyName, value, edit}) => {

    return (
        <>
            <Stack marginLeft={2} height={'24%'} justifyContent={'flex-start'}>
                {
                    keyName === 'friends' &&
                    <Stack bgcolor={'white'} height={'25%'} width={350}>
                        <Accordion>
                            <AccordionSummary>Friends</AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {value.map((f) => {
                                        return (
                                            <MenuItem>
                                            <FriendCard value={f}/>
                                        </MenuItem>)
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                }
                {
                    keyName === 'game_data' &&
                        <Stack height={'24%'}>
                            <Accordion>
                                <AccordionSummary>Game Data</AccordionSummary>
                                <AccordionDetails>

                            
                            <Stack>
                                <Typography>21Things</Typography>
                                <Typography>
                                    {
                                        value.filter((g) => g.game === 'TwentyOneThings').length
                                    }
                                </Typography>
                                <Typography>6pics</Typography>

                                <Typography>
                                    {
                                        value.filter((g) => g.game === 'SixPics').length
                                    }
                                </Typography>
                            </Stack> 
                                </AccordionDetails>
                            </Accordion>
                        </Stack>
                }
            </Stack>
        </>
    )
}


const StringDisplay = ({keyName, value, edit}) =>{

    return (
        <>
            {edit? 
            <Stack>
                <FormControl>
                    <InputLabel>{keyName}</InputLabel>
                    <Input></Input>
                </FormControl> 
            </Stack>
              : 
                <Stack direction={'row'}>
                    <Stack marginX={2}>
                        <Typography>{keyName}</Typography>
                    </Stack>
                    <Stack marginX={2} flexWrap={true}>
                        <Typography>{value}</Typography>
                    </Stack>
                </Stack>
            }
        </>
    )

}

const DataDisplay = ({data, keyName, value, type}) => {
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        
        if (!keyName || !value) return;
        // console.log(keyName, value); 
      }, [keyName, value]);

    useEffect(() => {
        // setType(getDataType(value))

    }, [data])

return (
    <Stack direction={'column'} height={'100%'} paddingX={2}>
        { keyName !== 'avatar' ?
                <>
                    {type === 'string' && <StringDisplay keyName={keyName} value={value} edit={edit} />}
                    {type === 'array' && <ArrayDisplay keyName={keyName} value={value} edit={edit} />}
                    {type === 'boolean' && <BooleanDisplay keyName={keyName} value={value} edit={edit} />}

                </>
            :
                <>
                    <Stack>
                        <Avatar src={value}/>
                    </Stack>
                </>    
    }
    </Stack>
)

}

const ControlCenter = () => {

    const [addKVP, setAddKVP] = useState(false)
    const [newKey, setNewKey] = useState('display_name')
    const [newValue, setNewValue] = useState('tito')
    const [arrayValue, setArrayValue] = useState()
    const [dataType, setDataType] = useState(['string'])
    const [newData, setNewData] = useState()

    useEffect(() =>{

        

        const obj = {
            [newKey]: newValue
        }

        console.log(obj)
        

    }, [newData, dataType, newValue, newKey])

    useEffect(() => {
        if(dataType[0] === 'array'){
            setNewValue([])
        }
    }, [dataType])

    return (
        <Stack>
            <Button>Add Object</Button>
            <Stack direction={'row'}>
                <FormControl sx={{margin: 1}}>
                    <InputLabel>New Key</InputLabel>
                    <Input value={newKey} onBlur={(e) => setNewKey(e.target.value)}/>
                </FormControl>
                {newKey && 
                <FormControl sx={{margin: 1}}>
                    <InputLabel>Value Type</InputLabel>
                    <Select value={dataType[0]}
                     onChange={(e) => 
                     {
                        setDataType(prev => {
                            const newArray = [...prev]; // copy the array (important!)
                            newArray[0] = e.target.value; // update index i
                            return newArray; // return the new array
                          });
                     }}
                     sx={{width: 200}}>
                        <MenuItem value={'string'}>String</MenuItem>
                        <MenuItem value={'array'}>Array</MenuItem>
                        <MenuItem value={'boolean'}>Boolean</MenuItem>
                        <MenuItem value={'object'}>Object</MenuItem>
                    </Select>
                </FormControl>}
            </Stack>
                <FormControl sx={{margin: 1}}>
                    {dataType[0] === 'string' &&
                        <>
                            <InputLabel>New Value</InputLabel>
                            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)}/>
                        </>
                    }
                    {dataType[0] === 'array' &&
                        <>
                            <FormControl sx={{margin: 1}}>
                                <InputLabel>Value Type</InputLabel>
                                <Select
                                 value={dataType[1]} 
                                 onChange={(e) => 
                                    {
                                    setDataType(prev => {
                                        const newArray = [...prev]; // copy the array (important!)
                                        newArray[1] = e.target.value; // update index i
                                        return newArray; // return the new array
                                        });
                                    }}
                                  sx={{width: 200}}>
                                    <MenuItem value={'string'}>String</MenuItem>
                                    <MenuItem value={'array'}>Array</MenuItem>
                                    <MenuItem value={'boolean'}>Boolean</MenuItem>
                                    <MenuItem value={'object'}>Object</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>New Value</InputLabel>
                                <Input value={arrayValue} onChange={(e) => setArrayValue(e.target.value)}/>
                            </FormControl>
                            <Button onClick={() => {
                                setNewValue(prev=> [
                                    ...prev, 
                                    arrayValue
                                ])
                            }}>Add</Button>
                        </>
                    }
                </FormControl>
        </Stack>
    )
}

const SuperUserDetail = ({user, setUser}) => {
    // console.clear() 

    const[metadata, setMetadata] = useState()
    const [typedData, setTypedData] = useState([])
    const [sortKey, setSortKey] = useState([
        'string',
        'boolean',
        'array',
        'object',
    ])
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        setRefresh(prev => prev +1)
    }, [sortKey])

    useEffect(() => {
        setMetadata(Object.entries(user?.user_metadata))
        
    }, [])

    const getDataType = (val) => {
        if (Array.isArray(val)) return 'array';
        if (val === null) return 'null'; 
        return typeof val;
    }

    useEffect(() => { 

        setTypedData([])
   
        metadata?.forEach((m) => {
            let obj = {
                keyName: m[0],
                value: m[1],
                type: getDataType(m[1])
            }
            
            setTypedData(prev => [
                ...prev, 
                obj
            ])
        })

    }, [metadata])

  return (
    <Stack width={'75%'} height={'75%'} bgcolor={'white'}>
    <Stack width={'100%'} alignItems={'flex-end'}>
        <Stack width={100}>
            <Button onClick={() => setUser(null)} >Close</Button>
        </Stack>
    </Stack>
    <Stack key={refresh}  width={'100%'} height={'75%'} justifyContent={'center'} direction={'row'}>
        <Stack width={'50%'} padding={1}>
            {typedData && typedData
            .sort((a, b) => (sortKey.indexOf(a.type) === -1 ? 999 : sortKey.indexOf(a.type)) - (sortKey.indexOf(b.type) === -1 ? 999 : sortKey.indexOf(b.type)))
            .map((d) => {
                return (
                    <DataDisplay keyName={d.keyName} value={d.value} type={d.type}/> 
                )
            })}
        </Stack>
        <Stack width={'50%'} alignItems={'center'} padding={1}>
            <Stack>
                <Typography>Control Center</Typography>
            </Stack>
            <Stack>
                <ControlCenter />
            </Stack>
        </Stack>
    </Stack>
    </Stack>
  )
}

export default SuperUserDetail
