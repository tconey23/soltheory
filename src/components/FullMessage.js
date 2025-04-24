import { useEffect, useState } from 'react';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import MessageAttachment from './MessageAttachment';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { sendPush } from '../business/apiCalls';

const FullMessage = ({message, setSelectedMessage}) => {
    const { user, setAlertProps, cipherKey } = useGlobalContext();
    const [showAttachment, setShowAttachment] = useState(false)
    const {id,attachment, from, to, message_content, subject} = message

    const encryptText = async (text) => {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          cipherKey,
          encoder.encode(text)
        );
        return {
          iv: btoa(String.fromCharCode(...iv)),
          data: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
        };
      };

      const updateFriend = async (friendA, friendB) => {
        // 1. Fetch current friends for friendA
        const { data: existingA, error: fetchErrorA } = await supabase
          .from('users')
          .select('friends')
          .eq('primary_id', friendA.primary_id)
          .single();
      
        // 2. Append friendB's ID if not already added
        const updatedFriendsA = existingA?.friends || [];
        if (!updatedFriendsA.includes(friendB.primary_id)) {
          updatedFriendsA.push(friendB.primary_id);
        }
      
        const { data: dataA, error: errorA } = await supabase
          .from('users')
          .update({ friends: updatedFriendsA })
          .eq('primary_id', friendA.primary_id)
          .select();
      
        // Repeat for friendB
        const { data: existingB, error: fetchErrorB } = await supabase
          .from('users')
          .select('friends')
          .eq('primary_id', friendB.primary_id)
          .single();
      
        const updatedFriendsB = existingB?.friends || [];
        if (!updatedFriendsB.includes(friendA.primary_id)) {
          updatedFriendsB.push(friendA.primary_id);
        }
      
        const { data: dataB, error: errorB } = await supabase
          .from('users')
          .update({ friends: updatedFriendsB })
          .eq('primary_id', friendB.primary_id)
          .select();

      };
      

    const handleAcceptedReq = async () => {

        const date = new Date();
  
        const encryptedSubject = await encryptText('SOL Mate request accepted!');
        const encryptedMessage = await encryptText(`${message.from.user_name} has accepted your request to be SOL Mates!`);


        const payload = {
            from: user.metadata,
            to: to,
            subject: encryptedSubject.data,
            subject_iv: encryptedSubject.iv,
            message_content: encryptedMessage.data,
            message_iv: encryptedMessage.iv,
            created_at: date.toISOString(),
            attachment: null,
            is_solreq: false
          };

        try {
            const { data, error } = await supabase
              .from('messaging')
              .insert([payload])
              .select();
      
            if (data) {
              console.log("Message sent:", data);
              updateFriend(message.from, message.to)
              sendPush(message.to,message.from, 'just accepted your SOL Mate request')
              setSelectedMessage(null)
            } else if (error) {
              console.error("Message send failed:", error);
            }
          } catch (err) {
            console.error("Message send error:", err);
          }
    }

  return (
    <Stack direction={'column'} bgcolor={'white'} sx={{ height: '45%', width: '45%', overflowY: 'auto'}} padding={2}>
        <Stack marginY={2}>
            <Typography>From:</Typography>
            <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                <Avatar sx={{marginX: 1}} src={from.avatar}></Avatar>
                <Typography sx={{marginX: 1}} >{from.user_name}</Typography>
                <Typography sx={{marginX: 1}} >{`(${from.email})`}</Typography>
            </Stack>
        </Stack>
        <Stack marginY={2}>
            <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                {message.attachment ? <i style={{cursor: 'pointer'}} onClick={() => setShowAttachment(prev => !prev)} className="fi fi-bs-clip"></i> : <></>}
                {showAttachment && <Stack marginX={1}>
                    <MessageAttachment url={message.attachment}/>
                </Stack>}
            </Stack>
        </Stack>
        <Stack marginY={2}>
            <Typography>Subject:</Typography>
            <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                <Typography sx={{marginX: 1}} >{message.subject}</Typography>
            </Stack>
        </Stack>
        <Stack marginY={2}>
            <Typography>Message:</Typography>
            <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                <Typography sx={{marginX: 1}} >{message.message_content}</Typography>
            </Stack>
        </Stack>
        <Button onClick={() =>  setSelectedMessage(null)} >Close</Button>
        {message.is_solreq && 
            <Button onClick={() => handleAcceptedReq()}>Accept</Button>
        }
    </Stack>
  );
};

export default FullMessage;