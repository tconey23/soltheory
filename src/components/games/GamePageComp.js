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
import { useGlobalContext } from '../../business/GlobalContext'


const GameMenu = ({user, toggleMenu, setToggleMenu, setSelectedOption, selectedOption}) => {

    const {alertProps, setAlertProps, isMobile} = useGlobalContext()

    const menuOptions = user 
    ? ['Play', 'Friends', 'My Games', 'Account', 'Quit', 'Close']
    : ['Play', 'Account', 'Close']


    const handleOption = (opt) => {
        setSelectedOption(opt)

        setTimeout(() => {
            setToggleMenu(false)
        }, 500);
    }

    const menuList = (
        <Stack>
            <List>
                {menuOptions.map((opt, i) => (
                    <ListItem key={i}>
                        <Button variant={selectedOption === opt ? 'contained' : ''} onClick={() => handleOption(opt)}>{opt}</Button>
                    </ListItem>
                ))}
            </List>
        </Stack>
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
    const {alertProps, setAlertProps, isMobile} = useGlobalContext()

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
        <Stack userData='gamePage 1' direction={'column'} height={'100%'} width={'100%'}>
            <GameMenu 
                toggleMenu={toggleMenu} 
                setToggleMenu={setToggleMenu} 
                selectedOption={selectedOption} 
                setSelectedOption={setSelectedOption} 
                user={user}
            />

            <Stack userData='gamePage 2' direction={'column'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
                <Stack direction={'row'} width={'100%'}>
                    {!isMobile && <Stack height={'100%'} width={'30%'} userData='left_spacer'></Stack>}

                    <Stack userData='gamePage 4' width={isMobile ? '100%' : '40%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                        {Game && selectedOption !== 'Account'
                            ? <Game selectedGame={selectedGame} user={user} /> 
                            :<>
                                <Stack userData='gamePage 5' height={'80%'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                                    <List userData='gamePage list 1' sx={{width: isMobile ?  '160%' : '100%'}}>
                                        <ListItem
                                        sx={{
                                            justifySelf: 'anchor-center',
                                            transition: 'all 0.25s ease-in-out',
                                            marginTop: 10,
                                            marginBottom: 10,
                                            width: '50%',
                                            "&:hover": {
                                                cursor: 'pointer',
                                                boxShadow: '3px 3px 7px 1px #9a1fd94a',
                                                borderRadius: 20,
                                                scale: 1.05
                                            }
                                        }}>
                                            <Stack userData='gamePage 6' onClick={() => nav('/21things')} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}>
                                                <Hexagon dims={100}/>
                                                <Typography fontSize={50} fontFamily={font}>21Things</Typography>
                                            </Stack>
                                        </ListItem>
                                        <ListItem sx={{
                                            justifySelf: 'anchor-center',
                                            transition: 'all 0.25s ease-in-out',
                                            marginTop: 10,
                                            marginBottom: 10,
                                            width: '50%',
                                            "&:hover": {
                                                cursor: 'pointer',
                                                boxShadow: '3px 3px 7px 1px #9a1fd94a',
                                                borderRadius: 20,
                                                scale: 1.05
                                            }
                                        }}>
                                            <Stack userData='gamePage 7' onClick={() => nav('/6pics')} direction={'row'} height={100} justifyContent={'center'} alignItems={'center'}>
                                                <SixPics dims={100}/>
                                                <Typography fontSize={50} fontFamily={font}>6Pics</Typography>
                                            </Stack>
                                        </ListItem>
                                    </List>
                                </Stack>
                            </> 
                        }
                    </Stack>

                    {!isMobile && 
                    <Stack height={'100%'} width={'30%'} userData='friends_section' alignItems={'center'}>
                        <Stack userData='gamePage 8' width={'60%'} height={'85%'} justifyContent={'center'} alignItems={'center'} sx={{boxShadow: 'inset #00000021 0px 0px 6px 6px', borderRadius: 2}}>
                            <Friends />
                        </Stack>
                    </Stack>}

                </Stack>


            </Stack>

            {selectedOption === "Account" && 
                <Modal
                    open={selectedOption==='Account'}
                >
                    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
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
