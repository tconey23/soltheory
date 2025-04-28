import { FormControl, Input, InputLabel, List, ListItem, Switch, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'

const DataDisplay = ({data}) => {
    const [type, setType] = useState()
    const [edit, setEdit] = useState(true)

    useEffect(() => {
        setType(typeof data[1])
    }, [data])

return (
    <Stack direction={'row'} height={'52px'}>

        {type === 'string' &&
        <Stack direction={'row'} width={'100%'} justifyContent={'flex-start'}>
            <InputLabel sx={{marginX: 2}}>{data[0]}</InputLabel>
            
            {
              edit 
              ? 
              <Input></Input>
              :
                <Typography>{data[1]}</Typography>
            }

        </Stack>}

        {type === 'boolean' &&
        <Stack direction={'row'} width={'100%'} justifyContent={'flex-start'}>
            <InputLabel sx={{marginX: 2}}>{data[0]}</InputLabel>

            {
                edit ? 
                <Switch checked={data[1]}></Switch>
                :
                <Typography>{data[1].toString()}</Typography>
            }

        </Stack>}

        {type === 'object' &&
        <Stack direction={'row'} width={'100%'} justifyContent={'flex-start'}>
            <Typography>{data[0]}</Typography>
            <Typography>{data[1].toString()}</Typography>
            {
                data[1]?.map((d) => {
                    if(data[0] === 'friends'){
                        return (
                            <List>
                                {data[1].map((dt) => {
                                    console.log(dt)
                                    return (
                                        <ListItem>{dt.primary_id}</ListItem>
                                    )
                                })}
                            </List>
                        )
                    }
                })
            }
        </Stack>}



    </Stack>
)

}

const SuperUserDetail = ({user}) => {

    const[metadata, setMetadata] = useState(user?.user_metadata)
    const [diaplyElements, setDisplayElements] = useState([])

    
    useEffect(() => { 

    }, [metadata])

  return (
    <Stack bgcolor={'white'} width={'75%'} height={'75%'} justifyContent={'center'}>
        {Object.entries(metadata).map((d) => {
            // console.log(d)
            return (
            <DataDisplay data={d}/> 
        )})}
    </Stack>
  )
}

export default SuperUserDetail
