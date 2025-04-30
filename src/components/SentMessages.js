import { useEffect } from 'react';
import { TableBody } from '@mui/material';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';

const SentMessages = ({ user }) => {
  const { messages, initialFetch, messageKey } = useGlobalContext(); 

  useEffect(() => {
    if (!messages?.outbound?.length) {
      initialFetch();
    }
  }, []);

  return (
    <TableBody key={messageKey}>
      {messages?.outbound
        ?.slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((m) => (
          <MessageItem key={m.message_id} data={m} origin={'sent'}/>
      ))}
    </TableBody>
  );
};

export default SentMessages;
