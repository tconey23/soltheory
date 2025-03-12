import { useEffect, useState } from 'react';
import { Button, Stack, Typography, List, ListItem, Box, ImageList, Modal } from '@mui/material';
import {Drawer} from '@mui/material';
import SolGamesLogo from '../../assets/SolGamesLogo';
import Hexagon from './Hexagon';
import SixPics from '../../assets/SixPics';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login'
import MyGames from './MyGames';
import { addFriend } from '../../business/apiCalls';
import Friends from '../Friends';


const GameMenu = ({user, toggleMenu, setToggleMenu, setSelectedOption, selectedOption}) => {

    const menuOptions = user 
    ? ['Play', 'Friends', 'My Games', 'Account', 'Quit', 'Close']
    : ['Play', 'Account', 'Close']


    const handleOption = (opt) => {
        setSelectedOption(opt)

         console.log(opt)

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


const GamePageComp = ({selectedGame, user, setUser, setToggleQuit }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Play');
    const [toggleLogin, setToggleLogin] = useState(false)
    const [font, setFont] = useState('Fredoka')
    const [query, setQuery] = useState(null)

    const nav = useNavigate()

    let Game = selectedGame?.component;
    
    useEffect(() => {
       if(selectedOption === 'Quit'){
        nav('/games')
        setToggleQuit(true)
       }
       if(selectedOption === 'Play'){
        nav('/games')
        setToggleQuit(false)
       }
    }, [selectedOption])

    return (
        <Stack direction={'column'} sx={{ height: '75vh', width: '100vw' }}>
            <GameMenu 
                toggleMenu={toggleMenu} 
                setToggleMenu={setToggleMenu} 
                selectedOption={selectedOption} 
                setSelectedOption={setSelectedOption} 
                user={user}
            />
            <Stack direction={'row'} padding={2}>
                <Stack>
                    <Box>
                        <Button onClick={() => setToggleMenu(prev => !prev)} variant='contained'>Menu</Button>
                    </Box>
                </Stack>
                <Stack width={'90%'} height={'80%'} justifyContent={'center'} alignItems={'center'}>
                    {Game && selectedOption !== 'Account'
                        ? <Game selectedGame={selectedGame} user={user} /> 
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
                <Stack width={'8%'} justifyContent={'center'} alignItems={'center'}>
                    <Friends />
                </Stack>
            </Stack>
            {selectedOption === "Account" && 
                <Modal
                    open={selectedOption==='Account'}
                >
                    <Stack justifyContent={'center'} alignItems={'center'}>
                        <Login setSelectedOption={setSelectedOption} user={user} setUser={setUser}/>
                    </Stack>
                </Modal>
            }
            {selectedOption === 'My Games' && 
                <Modal
                    open={selectedOption==='My Games'}
                    sx={{width: '100%', alignItems: 'center', justifyContent: 'center'}}
                >
                <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Stack width={'80%'} height={'80%'}>
                        <MyGames user={user} setSelectedOption={setSelectedOption} />
                    </Stack>
                </Stack>
            </Modal>
            }
        </Stack>
    );
};

export default GamePageComp;
