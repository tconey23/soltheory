import { useEffect, useState } from 'react';
import { Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Tooltip, Avatar, Modal, FormControl, Input, InputLabel, MenuList } from '@mui/material';
import { supabase } from '../business/supabaseClient';
import { useGlobalContext } from '../business/GlobalContext';
import { MessageItem } from './MessageItem';

const ReceivedMessages = ({messages}) => {
  return (
    <TableBody>
        {messages.map((m) => (
            <MessageItem data={m}/>
        ))}
    </TableBody>
  );
};

export default ReceivedMessages;