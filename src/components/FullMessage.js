// src/components/FullMessage.js

import { useState } from 'react';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import MessageAttachment from './MessageAttachment';
import { useGlobalContext } from '../business/GlobalContext';
import { supabase } from '../business/supabaseClient';
import { encryptWithKey, importKeyFromBase64, generateCipherKey } from '../business/cryptoUtils';
import { sendPush } from '../business/apiCalls';

const FullMessage = ({ message, setSelectedMessage, setPendingDelete }) => {
  const { user } = useGlobalContext();
  const [showAttachment, setShowAttachment] = useState(false);

  const deleteMessage = async () => {
    console.log(message)
        const { error } = await supabase
      .from('messaging')
      .delete()
      .eq('id', message.id)
  }

  // deleteMessage()

  const updateFriendsAfterAcceptance = async (userA, userB) => {
    try {
      // 1. Fetch A's current friends
      const { data: userAData, error: userAError } = await supabase
        .from('users')
        .select('friends')
        .eq('primary_id', userA.primary_id)
        .single();
  
      if (userAError) throw userAError;
      let updatedFriendsA = userAData?.friends || [];
  
      // Only add if not already added
      if (!updatedFriendsA.find(f => f.primary_id === userB.primary_id)) {
        updatedFriendsA.push({
          primary_id: userB.primary_id,
          user_name: userB.user_name,
          avatar: userB.avatar,
          email: userB.email,
          settings: {
            share_game_data: true,
            show_user_profile: true,
            show_online_status: true,
            allow_direct_messages: true
          }
        });
      }
  
      await supabase
        .from('users')
        .update({ friends: updatedFriendsA })
        .eq('primary_id', userA.primary_id);
  
      // 2. Fetch B's current friends
      const { data: userBData, error: userBError } = await supabase
        .from('users')
        .select('friends')
        .eq('primary_id', userB.primary_id)
        .single();
  
      if (userBError) throw userBError;
      let updatedFriendsB = userBData?.friends || [];
  
      if (!updatedFriendsB.find(f => f.primary_id === userA.primary_id)) {
        updatedFriendsB.push({
          primary_id: userA.primary_id,
          user_name: userA.user_name,
          avatar: userA.avatar,
          email: userA.email,
          settings: {
            share_game_data: true,
            show_user_profile: true,
            show_online_status: true,
            allow_direct_messages: true
          }
        });
      }
  
      await supabase
        .from('users')
        .update({ friends: updatedFriendsB })
        .eq('primary_id', userB.primary_id);
        deleteMessage()
  
      console.log('Both friend lists updated!');
    } catch (error) {
      console.error('Error updating friends:', error);
    }
  };
  

  const handleAcceptedReq = async () => {
    try {
      const date = new Date();
      const base64Key = await generateCipherKey();
      const cryptoKey = await importKeyFromBase64(base64Key);

      const encryptedSubject = await encryptWithKey('SOL Mate request accepted!', cryptoKey);
      const encryptedMessage = await encryptWithKey(`${message.from.user_name} has accepted your request to be SOL Mates!`, cryptoKey);

      const payload = {
        from: user.metadata,
        to: message.from,
        subject: encryptedSubject.data,
        subject_iv: encryptedSubject.iv,
        message_content: encryptedMessage.data,
        message_iv: encryptedMessage.iv,
        created_at: date.toISOString(),
        attachment: null,
        is_solreq: false,
        message_cipher_key: base64Key
      };

      const { data, error } = await supabase
        .from('messaging')
        .insert([payload])
        .select();

      if (data) {
        console.log("Acceptance message sent:", data);
        await updateFriendsAfterAcceptance(user.metadata, message.from);

        sendPush(message.to, message.from, 'just accepted your SOL Mate request');
        setSelectedMessage(null);
      } else if (error) {
        console.error("Message send failed:", error);
      }
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

  return (
    <Stack direction={'column'} bgcolor={'white'} sx={{ height: '45%', width: '45%', overflowY: 'auto' }} padding={2}>
      <Button>
        <i onClick={() => setPendingDelete(message)} className="fi fi-sr-trash"></i>
      </Button>
      <Stack marginY={2}>
        <Typography>From:</Typography>
        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
          <Avatar sx={{ marginX: 1 }} src={message.from.avatar}></Avatar>
          <Typography sx={{ marginX: 1 }}>{message.from.user_name}</Typography>
          <Typography sx={{ marginX: 1 }}>({message.from.email})</Typography>
        </Stack>
      </Stack>

      <Stack marginY={2}>
        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
          {message.attachment && (
            <i style={{ cursor: 'pointer' }} onClick={() => setShowAttachment(prev => !prev)} className="fi fi-bs-clip"></i>
          )}
          {showAttachment && (
            <Stack marginX={1}>
              <MessageAttachment url={message.attachment} />
            </Stack>
          )}
        </Stack>
      </Stack>

      <Stack marginY={2}>
        <Typography>Subject:</Typography>
        <Typography sx={{ marginX: 1 }}>{message.subject}</Typography>
      </Stack>

      <Stack marginY={2}>
        <Typography>Message:</Typography>
        <Typography sx={{ marginX: 1 }}>{message.message_content}</Typography>
      </Stack>

      <Button onClick={() => setSelectedMessage(null)}>Close</Button>
      {message.is_solreq && (
        <Button onClick={handleAcceptedReq}>Accept</Button>
      )}
    </Stack>
  );
};

export default FullMessage;
