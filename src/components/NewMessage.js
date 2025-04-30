// src/components/NewMessage.js

import { useEffect, useState } from 'react';
import { Button, FormControl, Input, InputLabel, MenuList, MenuItem, Stack } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { generateCipherKey, importKeyFromBase64, encryptWithKey } from '../business/cryptoUtils';
import { sendPush } from '../business/apiCalls';

export const NewMessage = ({ setDraftMessage, solMate, setSolMate }) => {
  const { user, getUserData} = useGlobalContext();
  const [to, setTo] = useState();
  const [toData, setToData] = useState()
  const [subject, setSubject] = useState();
  const [messageText, setMessageText] = useState();
  const [file, setFile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    const { data: urlData } = supabase.storage.from('messagingobjects').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const sendMessage = async () => {
    const date = new Date();
    const attachmentUrl = await uploadFile();

    // Always generate a fresh key for each message
    const messageCipherKeyBase64 = await generateCipherKey();
    const messageCryptoKey = await importKeyFromBase64(messageCipherKeyBase64);

    const encryptedSubject = await encryptWithKey(subject, messageCryptoKey);
    const encryptedMessage = await encryptWithKey(messageText, messageCryptoKey);

    const payload = {
      from: user.primary_id,
      to: to,
      subject: encryptedSubject.data,
      subject_iv: encryptedSubject.iv,
      message_content: encryptedMessage.data,
      message_iv: encryptedMessage.iv,
      created_at: date.toISOString(),
      attachment: attachmentUrl || null,
      is_solreq: solMate ? true : false,
      message_cipher_key: messageCipherKeyBase64 
    };

    try {
      const { data, error } = await supabase.from('messaging').insert([payload]).select();

      if (data) {
        console.log("Message sent:", data);
        if (solMate) {
          sendPush(data[0].to, data[0].from, "wants to be SOL Mates");
        }
        setSolMate(false);
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

  const fetchUser = async (toUser, fromUser) => {
    const tofrom = await getUserData(toUser, fromUser)

    if(tofrom) {
        setToData(tofrom.to)
    }
}

  useEffect(() => {
    getUserSuggestions();
  }, []);

  useEffect(() => {
    if (to) {
      setShowSuggestions(false);
    }
  }, [to]);

  useEffect(() => {
    if (solMate) {
      fetchUser(solMate.id, null)
      setTo(solMate.id);
      setSubject('SOL Mate request');
      setMessageText("Let's be SOL Mates!");
    }
  }, [solMate]);

  return (
    <Stack width={'80%'} height={'80%'}>
      <FormControl sx={{ marginY: 2 }}>
        {!to && <InputLabel>To:</InputLabel>}
        <Input
          disabled={solMate}
          value={to?.email || toData}
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
          setDraftMessage(false);
          setSolMate(false);
        }}>Cancel</Button>
      </Stack>
    </Stack>
  );
};

export default NewMessage;
