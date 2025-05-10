import { useEffect, useState } from 'react';
import { Stack, Typography, Paper, Box } from '@mui/material';
import { Button } from 'react-chat-elements';
import useGlobalStore from '../../business/useGlobalStore';
import { handleDecrypt } from './helpers/solmate_helpers';
import { decryptWithKey, importKeyFromBase64 } from './helpers/cryptoUtils';
import { getMeta } from '../../business/supabase_calls';

const FullMessage = ({ msg, setFullMessage }) => {
  const { user, userMeta } = useGlobalStore();
  const [messages, setMessages] = useState([])


  const decrypt = async (m) => {
    try {
      const importedKey = await importKeyFromBase64(m.crypto_key); // 🔑 Fix here
      const dec = await decryptWithKey(m.encr_text, m.iv, importedKey);
      const meta = await getMeta(m.sent_by)

      m.sender = meta?.user_name
      setMessages(prev => [...prev, { ...m, text: dec }]);
    } catch (err) {
      console.error('Decryption error:', err);
    }
  };

  useEffect(() => {
    if(msg?.message_content){
        msg?.message_content.forEach((m) => decrypt(m))
    }
  }, [msg])


  const isUserMessage = (m) => m.sent_by === userMeta?.primary_id;

  return (
    <Stack
      direction="column"
      spacing={2}
      padding={2}
      sx={{ width: '100%', maxHeight: '90vh', overflowY: 'auto', bgcolor: '#f5f5f5' }}
    >
      {messages.map((m, i) => (
        <Box
          key={i}
          sx={{
            alignSelf: isUserMessage(m) ? 'flex-end' : 'flex-start',
            bgcolor: isUserMessage(m) ? '#cfe3ff' : '#ffffff',
            padding: 1.5,
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: '70%',
            cursor: 'pointer',
            wordBreak: 'break-word',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {isUserMessage(m) ? 'You' : 'Them'} – {m.date || 'Unknown date'}
          </Typography>
          <Typography variant="body1">
            {m.text || 'Decryption failed or pending'}
          </Typography>
        </Box>
      ))}

      <Button
        text="Close"
        onClick={() => setFullMessage(null)}
        style={{ alignSelf: 'center', marginTop: '1rem' }}
      />
    </Stack>
  );
};

export default FullMessage;
