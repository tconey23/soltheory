import { useEffect, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box } from '@mui/material';
import {Drawer} from '@mui/material';

const GameMenu = ({toggleMenu, setToggleMenu, setSelectedOption, selectedOption}) => {

    const menuOptions = ['Play', 'Friends', 'Account', 'Close']
    

    const handleOption = (opt) => {
        setSelectedOption(opt)

        setTimeout(() => {
            setToggleMenu(false)
        }, 500);
    }

    const menuList = (
        <List>
            {menuOptions.map((opt, i) => (
                <ListItem key={i}>
                    <Button variant={selectedOption === opt ? 'contained' : ''} onClick={() => handleOption(opt)}>{opt}</Button>
                </ListItem>
            ))}
        </List>
    )

    return (
        <Drawer open={toggleMenu}>
            {menuList}
        </Drawer>
    )
}

const Header = ({toggleMenu, setToggleMenu, selectedGame}) => {
    return (
        <Stack width={'100vw'}>

        </Stack>
    )
}

const GamePageComp = ({ selectedGame }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Play');

    const Game = selectedGame?.component;

    return (
        <Stack direction={'column'} sx={{ height: '99vh', width: '100vw' }}>
            <GameMenu 
                toggleMenu={toggleMenu} 
                setToggleMenu={setToggleMenu} 
                selectedOption={selectedOption} 
                setSelectedOption={setSelectedOption} 
            />
            <Stack direction={'row'} padding={2}>
                <Stack>
                    <Box>
                        <Button onClick={() => setToggleMenu(prev => !prev)} variant='contained'>Menu</Button>
                    </Box>
                </Stack>
                <Stack width={'98%'} justifyContent={'center'} alignItems={'center'}>
                    {Game ? <Game selectedGame={selectedGame} /> : <Typography>No Game Selected</Typography>}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default GamePageComp;
