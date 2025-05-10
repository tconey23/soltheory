import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { ChatItem } from 'react-chat-elements';
import { getAvatar, getMessages, getMeta } from '../../business/supabase_calls';
import 'react-chat-elements/dist/main.css';
import useGlobalStore from '../../business/useGlobalStore';
import FullMessage from './FullMessage';

const ChatBox = () => {
  const { user, userMeta } = useGlobalStore();
  const [conversations, setConversations] = useState()
  const [fullMessage, setFullMessage] = useState(null);

  const fetchMessages = async () => {
    const res = await getMessages(userMeta?.primary_id);
    // const avatars = await getAvatar(userMeta?.primary_id);
    if (!res || !user) return;

    for(let i=0; i<res.length; i++){ 
      let user = await getMeta(res[i].from)
      res[i].sender = user.user_name
      res[i].avatar = user.avatar
    }

    setConversations(res)
  };

  const handleMessageClick = (msg) => {
    setFullMessage(msg);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return ( 
    <Stack direction="column" width="98%" height="100%" borderRadius={1} overflowY="auto">
      {conversations?.map((cnv, i) =>{ 
        return (
        <ChatItem
          key={i}
          avatar={cnv.avatar}
        //   alt={msg.alt}
          title={`Conversation with ${cnv.sender}`}
          subtitle={cnv.subject}
          date={cnv.date}
          onClick={() => handleMessageClick(cnv)}
        />
      )})}
      {fullMessage && (
        <FullMessage msg={fullMessage} setFullMessage={setFullMessage} />
      )}
    </Stack>
  );
};

export default ChatBox;
