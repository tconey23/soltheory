import { useEffect, useState } from 'react';
import { Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Tooltip, Avatar, Modal, FormControl, Input, InputLabel, MenuList } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';
import { decryptWithKey, importKeyFromBase64 } from '../business/cryptoUtils';


const SentMessages = ({user}) => {

    const [messages, setMessages] = useState([])

      const decryptRealtime = async (data) => {
        try {
          const base64Key = data.message_cipher_key;
          if (!base64Key) throw new Error("No message cipher key attached");
          const key = await importKeyFromBase64(base64Key);
          const decSub = await decryptWithKey(data.subject, data.subject_iv, key);
          const decMess = await decryptWithKey(data.message_content, data.message_iv, key);
    
          data.subject = decSub;
          data.message_content = decMess;
    
          return data;
        } catch (err) {
          console.error("Realtime decryption failed:", err);
          return data;
        }
      };
    
      const handleDecrypt = async (messData) => {
        setMessages([]);
        for (let message of messData) {
          try {
            const base64Key = message.message_cipher_key;
            if (!base64Key) continue;
            const key = await importKeyFromBase64(base64Key);
            const decSub = await decryptWithKey(message.subject, message.subject_iv, key);
            const decMess = await decryptWithKey(message.message_content, message.message_iv, key);
    
            message.subject = decSub;
            message.message_content = decMess;
    
            setMessages(prev => [...prev, message]);
          } catch (error) {
            console.error("Failed decrypting message:", message, error);
          }
        }
      };

    const getSentMessages = async () => {
        
        const { data, error } = await supabase
        .from('messaging')
        .select('*')
        .filter('from->>primary_id', 'eq', user?.metadata?.primary_id); 

        handleDecrypt(data)
                        
    }


    useEffect(() => {
        console.log(user)
        getSentMessages()   
    }, [])

  return (

            <TableBody>
                {messages.map((m) => (
                    <MessageItem data={m}/>
                ))}
            </TableBody>
  );
};

export default SentMessages;