import { useEffect, useState } from 'react';
import { Stack, Checkbox, Table, TableBody, TableCell, TableRow, TableContainer, InputLabel, Typography, Avatar, Button } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';

const FriendSettings = ({friend, setEditFriendSettings}) => {
    const {user, setAlertProps} = useGlobalContext()

    const [settings, setSettings] = useState({
  
    })

    const [friendData, setFriendData] = useState()

    const saveSettings = async () => {

        const friendIndex = user?.metadata?.friends?.findIndex(
          (f) => f.primary_id === friend.primary_id
        );
      
        if (friendIndex > -1) {
          const updatedFriends = [...user.metadata.friends];

          updatedFriends[friendIndex] = {
            ...updatedFriends[friendIndex],
            settings: { ...settings }
          };
      
          const { data, error } = await supabase
            .from('users')
            .update({ friends: updatedFriends })
            .eq('primary_id', user.metadata.primary_id)
            .select();
      
          if (error) {
            console.log(error)
            setAlertProps({
                text: `Error saving user settings - Code: ${error.code}`,
                severity: 'error',
                display: true
            })
          } else {
            setAlertProps({
                text: 'User settings saved',
                severity: 'success',
                display: true
            })
          }
        }
      };
      

    const getFriendSettings = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('primary_id', user.metadata.primary_id);
        if(data){
            const findFriend = data[0].friends.find((f) => f.primary_id === friend.primary_id)?.settings
            setSettings(findFriend)
        }
    return data;
    }

    const getFriendData = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('primary_id', friend.primary_id);
        if(data){
            setFriendData(data[0])
        }
        return data;
    }

    const handleRemoveFriend = async () => {
        console.log(user?.metadata?.primary_id, friend)
        const userId = user?.metadata?.primary_id;
        const friendId = friend?.primary_id;
      
        if (!userId || !friendId) {
          console.error("Missing user or friend ID");
          return;
        }
      
        try {
          // 1. Fetch current user friend list
          const { data: userData, error: userFetchError } = await supabase
            .from('users')
            .select('friends')
            .eq('primary_id', userId)
            .single();
      
          if (userFetchError) throw userFetchError;
      
          const updatedUserFriends = (userData?.friends || []).filter(f => f.primary_id !== friendId);
      
          await supabase
            .from('users')
            .update({ friends: updatedUserFriends })
            .eq('primary_id', userId);
      
          // 2. Fetch friend's friend list
          const { data: friendData, error: friendFetchError } = await supabase
            .from('users')
            .select('friends')
            .eq('primary_id', friendId)
            .single();
      
          if (friendFetchError) throw friendFetchError;
      
          const updatedFriendFriends = (friendData?.friends || []).filter(f => f.primary_id !== userId);
      
          await supabase
            .from('users')
            .update({ friends: updatedFriendFriends })
            .eq('primary_id', friendId);
      
          // 3. Confirm and clean up UI
          console.log(`Removed friend ${friendId} from user ${userId}`);
          setEditFriendSettings(null);
        } catch (error) {
          console.error("Failed to remove friend:", error);
        }
      };
      

    useEffect(() =>{
        if(friendData){
            getFriendSettings()
            console.log(friendData)
        } else {
            getFriendData()
        }
    }, [friendData])

  return (
    <Stack direction={'column'} sx={{ height: '50%', width: '50%', bgcolor: 'white'}} justifyContent={'flex-start'} alignItems={'center'} padding={3}>
        
        <Stack direction={'row'} justifyContent={'flex-end'}>
            <Avatar sx={{scale: 1.5}} src={friendData?.avatar} />
        </Stack>

        <Stack direction={'row'} justifyContent={'center'} marginY={3} width={'100%'}>
            <Stack width={'50%'} alignItems={'center'}>
                <InputLabel>User name</InputLabel>
                <Typography>{friendData?.user_name}</Typography>
            </Stack>
            <Stack width={'50%'} alignItems={'center'}>
                <InputLabel>Email</InputLabel>
                <Typography>{friendData?.email}</Typography>
            </Stack>
        </Stack>

        <Typography>User-Specific Settings</Typography>

        <Stack direction={'column'} justifyContent={'center'} marginY={2} border={'1px solid grey'} height={'25%'} padding={1}>

        <Stack direction={'row'} justifyContent={'center'} marginY={2} height={'25%'} padding={1}>
            {Object.entries(settings).map((s) => {
                let rawDesc = s[0]
                let splitDesc = rawDesc.split('_')
                let capFirstLetter = splitDesc[0].split(',')[0].split('')[0].toUpperCase()
                let capFirstWord = `${capFirstLetter}${splitDesc[0].split(',')[0].split('').splice(1, splitDesc[0].split(',')[0].split('').length-1).join('')}`
                let formatFirstWord = `${capFirstWord} ${splitDesc.splice(1, 2).join(' ')}`
                return (
                    <Stack marginX={2}>
                    <InputLabel>{formatFirstWord}</InputLabel>
                    <Checkbox checked={s[1]} onChange={(e) => setSettings(prev => ({
                        ...prev,
                        [rawDesc]: e.target.checked
                    }))}/>
                </Stack>
                )
            })}
        </Stack>
            <Button onClick={() => handleRemoveFriend()} >End Friendship</Button>
        </Stack>
        <Stack justifyContent={'space-evenly'} direction={'row'} width={'25%'}>
            <Button sx={{marginY: 2}} onClick={() => saveSettings()}> Save</Button>
            <Button sx={{marginY: 2}} onClick={() => setEditFriendSettings(null)} >Done</Button>
        </Stack>
    </Stack>
  );
};

export default FriendSettings;