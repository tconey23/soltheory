import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { getUser } from '../business/apiCalls';
import { useGlobalContext } from '../business/GlobalContext';

const Friends = () => {
  
    const {fontTTF} = useGlobalContext()

    const [users, setUsers] = useState([])

    const fetchUsers = async () =>{
        const res = await getUser('tomconey@tomconey.dev')
        setUsers([res])
    }

    useEffect(() =>{
        fetchUsers()
    }, [])

  return (
    <Stack direction={'column'} sx={{ height: '98vh', width:'100%' }} justifyContent={'flex-start'} alignContent={'flex-start'} >
      {users.length > 0 &&

        users.map((u, i) => {
            return (
                <Stack key={i} direction={'column'} justifyContent={'center'} alignContent={'center'} width={'100%'}>
                    <Stack alignItems={'center'} margin={5}>
                      <Typography fontFamily={'Fredoka Regular'} fontWeight={'bold'} fontSize={20} >Friends</Typography>
                    </Stack>
                    <Stack direction={'row'} padding={1}>
                        {/* <div style={{padding: '3px', height: '17px', width: '17px',clipPath: 'circle(50% at 50% 50%)', background: u.currently_online ? 'green' : 'white'}}>
                            <i style={{color: u.currently_online ? 'white' : 'black'}} class="fi fi-bs-wifi"></i>
                        </div>
                        <Typography marginLeft={1}>{u.user_name}</Typography>  */}
                    </Stack>
                </Stack>

            )
        })

      }
    </Stack>
  );
};

export default Friends;