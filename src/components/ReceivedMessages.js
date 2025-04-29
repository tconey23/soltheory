import { useEffect } from 'react';
import { TableBody } from '@mui/material';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';

const ReceivedMessages = () => {
  const { messages, initialFetch, messageKey } = useGlobalContext();

  useEffect(() => {
    if (!messages?.inbound?.length) {
      initialFetch();   
    }
  }, []); 

  return (
    <TableBody key={messageKey}>
      {messages?.inbound?.map((m) => (
        <MessageItem key={m.message_id} data={m} /> 
      ))}
    </TableBody>
  );
};

export default ReceivedMessages;
