import { useEffect, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box, ImageList } from '@mui/material';
import {Drawer} from '@mui/material';
import SolGamesLogo from '../../assets/SolGamesLogo';
import Hexagon from './Hexagon';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';


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


const GamePageComp = ({ selectedGame }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Play');
    const [toggleLogin, setToggleLogin] = useState(false)
    const [font, setFont] = useState('Fredoka')

    const nav = useNavigate()

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
                    {Game 
                        ? <Game selectedGame={selectedGame} /> 
                        :<>
                            <SolGamesLogo />
                            <List>
                                <ListItem
                                sx={{
                                    transition: 'all 0.25s ease-in-out',
                                    "&:hover": {
                                        cursor: 'pointer',
                                        boxShadow: '3px 3px 7px 1px #9a1fd94a',
                                        borderRadius: 20,
                                        scale: 1.05
                                    }
                                    }}>
                                    <Stack onClick={() => nav('/21things')} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}>
                                        <Hexagon dims={100}/>
                                        <Typography fontSize={50} fontFamily={font}>21Things</Typography>
                                    </Stack>
                                </ListItem>
                                <ListItem sx={{
                                    transition: 'all 0.25s ease-in-out',
                                    "&:hover": {
                                        cursor: 'pointer',
                                        boxShadow: '3px 3px 7px 1px #9a1fd94a',
                                        borderRadius: 20,
                                        scale: 1.05
                                    }
                                    }}>
                                    <Stack onClick={() => nav('/6pics')} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}>
                                        <SixPics dims={100}/>
                                        <Typography fontSize={50} fontFamily={font}>6Pics</Typography>
                                    </Stack>
                                </ListItem>
                            </List>
                        </> 
                    }
                </Stack>
            </Stack>
            {<Stack>

            </Stack>}
        </Stack>
    );
};

export default GamePageComp;
