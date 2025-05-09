import { useEffect, useState } from 'react';
import { Stack, Typography, Paper, Box } from '@mui/material';
import { Button } from 'react-chat-elements';
import useGlobalStore from '../../business/useGlobalStore';
import { handleDecrypt } from './helpers/solmate_helpers';
import { decryptWithKey } from './helpers/cryptoUtils';

const FullMessage = ({ msg, setFullMessage }) => {
  const { user, userMeta } = useGlobalStore();
  const [messages, setMessages] = useState([])

  const decrypt = async (m) => {
    console.log(m)
    const dec = await decryptWithKey(m.encr_text, m.iv, m.crypto_key)
  }

  useEffect(() => {
    if(msg?.message_content){
    
        msg?.message_content.forEach((m) => decrypt(m))
    }
  }, [msg])


  const isUserMessage = (m) => m.sent_by === user?.primary_id;

  return (
    <Stack
      direction="column"
      spacing={2}
      padding={2}
      sx={{ width: '100%', maxHeight: '90vh', overflowY: 'auto', bgcolor: '#f5f5f5' }}
    >
      {/* <Typography variant="h6">{msg.title || 'Conversation'}</Typography> */}

      {/* {msg?.message_content.map((m, i) => {
        
            console.log(m)

        (
        <Box
          key={i}
          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
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
            {isUserMessage(m) ? 'You' : 'Them'} – {m.date}
          </Typography>
          <Typography variant="body1">
            {expandedIndex === i ? m.text : m.text.slice(0, 60) + (m.text.length > 60 ? '…' : '')}
          </Typography>
        </Box>
      )})} */}

      <Button
        text="Close"
        onClick={() => setFullMessage(null)}
        style={{ alignSelf: 'center', marginTop: '1rem' }}
      />
    </Stack>
  );
};

export default FullMessage;
