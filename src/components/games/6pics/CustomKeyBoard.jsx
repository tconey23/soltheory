import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Key = ({d, v, w}) => {

    return (
        <Stack sx={{height: '50px', border: '1px solid black', width: w*3, justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{width: '100%', fontSize: 25}}>{d.toUpperCase()}</Box>
        </Stack>
    )

}

const CustomKeyBoard = ({ setKeyboardInput, hintIndex, toggleCheckAnswer, giveUp, showGiveUp }) => {
  const [topRow, setTopRow] = useState([]);
  const [midRow, setMidRow] = useState([]);
  const [botRow, setBotRow] = useState([]);

  useEffect(() => {
    const top = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    let mid = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ];
    let bot = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

    if (showGiveUp && !giveUp) {
      mid = [...mid, '{hint}', '{giveup}'];
    } else if (!showGiveUp && !giveUp) {
      mid = [...mid, '{del}'];
    }
    if (toggleCheckAnswer) {
      bot = [...bot, '{check}'];
    }

    setTopRow(top);
    setMidRow(mid);
    setBotRow(bot);
  }, [showGiveUp, giveUp, toggleCheckAnswer, hintIndex]);

  const Row = ({ row }) => (
    <Stack alignItems="center" justifyContent="space-between" direction="row" width="100%">
      {row.map((k, i) => {
        let width = 10;
        if (k === '{hint}') return <Key key={i} d={`Hint ${hintIndex}`} v={'hint'} w={width} />;
        if (k === '{giveup}') return <Key key={i} d="Give Up" v="giveup" w={width} />;
        if (k === '{check}') return <Key key={i} d="Check" v="check" w={width} />;
        return <Key key={i} d={k} v={k} w={width} />;
      })}
    </Stack>
  );

  return (
    <Stack userdata="customkey" width={'90svw'} height={'auto'} alignItems={'center'} justifyContent={'center'}>
      <Stack alignItems="center" justifyContent="space-between" direction="column" width="100%">
        <Row row={topRow} />
        <Row row={midRow} />
        <Row row={botRow} />
      </Stack>
    </Stack>
  );
};

export default CustomKeyBoard
