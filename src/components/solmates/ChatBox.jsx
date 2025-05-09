import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { ChatItem } from 'react-chat-elements';
import { getAvatar, getMessages } from '../../business/supabase_calls';
import 'react-chat-elements/dist/main.css';
import { decryptWithKey, importKeyFromBase64 } from './helpers/cryptoUtils';
import useGlobalStore from '../../business/useGlobalStore';
import FullMessage from './FullMessage';

const ChatBox = () => {
  const { user, userMeta } = useGlobalStore();
  const [conversations, setConversations] = useState()
  const [messages, setMessages] = useState([]);
  const [fullMessage, setFullMessage] = useState(null);

  const fetchMessages = async () => {
    const res = await getMessages(userMeta?.primary_id);
    // const avatars = await getAvatar(userMeta?.primary_id);
    if (!res || !user) return;

    setConversations(res)
  };

  const handleMessageClick = (msg) => {
    setFullMessage(msg);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Stack direction="column" width="98%" height="100%" borderRadius={1} overflow="auto">
      {conversations?.map((cnv, i) => (
        <ChatItem
          key={i}
        //   avatar={msg.avatar}
        //   alt={msg.alt}
             title={cnv.subject}
        //   subtitle={msg.subject}
          date={cnv.date}
          onClick={() => handleMessageClick(cnv)}
        />
      ))}
      {fullMessage && (
        <FullMessage msg={fullMessage} setFullMessage={setFullMessage} />
      )}
    </Stack>
  );
};

export default ChatBox;
