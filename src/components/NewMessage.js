import { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, FormControl, Input, InputLabel, List, Menu, MenuItem, MenuList, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';

export const NewMessage = ({ setDraftMessage, solMate, setSolMate}) => {
    const { user, setAlertProps, cipherKey } = useGlobalContext();
    const [to, setTo] = useState();
    const [subject, setSubject] = useState();
    const [messageText, setMessageText] = useState();
    const [file, setFile] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
  
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
  
    const handleFileChange = (e) => {
      const selected = e.target.files[0];
      if (selected) setFile(selected);
    };
  
    const uploadFile = async () => {
      if (!file) return null;
  
      const filePath = `${user?.metadata?.primary_id}/${Date.now()}_${file.name}`;
  
      const { data, error } = await supabase.storage
        .from('messagingobjects')
        .upload(filePath, file);
  
      if (error) {
        console.error("Upload error:", error);
        return null;
      }
  
      const { data: urlData } = supabase
        .storage
        .from('messagingobjects')
        .getPublicUrl(filePath);
  
      return urlData.publicUrl;
    };
  
    const sendMessage = async () => {
      const date = new Date();
  
      const encryptedSubject = await encryptText(subject);
      const encryptedMessage = await encryptText(messageText);
      const attachmentUrl = await uploadFile();
  
      const payload = {
        from: user.metadata,
        to: to,
        subject: encryptedSubject.data,
        subject_iv: encryptedSubject.iv,
        message_content: encryptedMessage.data,
        message_iv: encryptedMessage.iv,
        created_at: date.toISOString(),
        attachment: attachmentUrl || null,
        is_solreq: solMate ? true : false
      };
  
      try {
        const { data, error } = await supabase
          .from('messaging')
          .insert([payload])
          .select();
  
        if (data) {
          console.log("Message sent:", data);
          setSolMate(false)
          setDraftMessage(false);
        } else if (error) {
          console.error("Message send failed:", error);
        }
      } catch (err) {
        console.error("Message send error:", err);
      }
    };
  
    const getUserSuggestions = async () => {
      const { data: users } = await supabase.from('users').select('*');
      if (users) setSuggestions(users);
    };
  
    useEffect(() => {
      getUserSuggestions();
    }, []);

    useEffect(() => {
        if(to){
            setShowSuggestions(false)
        }
    }, [to])

    useEffect(() =>{
        if(solMate){
            setTo(solMate)
            setSubject('SOL Mate request')
            setMessageText("Let's be SOL Mates!")
        }
    }, [solMate])
  
    return (
      <Stack width={'80%'} height={'80%'}>
        <FormControl sx={{ marginY: 2 }}>
          {!to && <InputLabel>To:</InputLabel>}
          <Input
            disabled={solMate}
            value={to?.email || ""}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setTo(e.target.value)}
          />
          {showSuggestions && (
            <MenuList>
              {suggestions.map((s) => (
                <MenuItem key={s.email} onClick={() => setTo(s)}>
                  {s.email}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </FormControl>
  
        <FormControl sx={{ marginY: 2 }}>
          {!subject && <InputLabel>Subject:</InputLabel>}
          <Input disabled={solMate} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </FormControl>
  
        <FormControl sx={{ marginY: 2 }}>
         {!messageText && <InputLabel>Message:</InputLabel>}
          <Input
            disabled={solMate}
            multiline
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </FormControl>
  
        <FormControl sx={{ marginY: 2 }}>
          <input type="file" onChange={handleFileChange} />
        </FormControl>
  
        <Stack direction={'row'}>
          <Button onClick={sendMessage}>Send</Button>
          <Button onClick={() => {
            setDraftMessage(false)
            setSolMate(false)
            }}>Cancel</Button>
        </Stack>
      </Stack>
    );
  };
  