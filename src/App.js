import './App.css';
import HomePageCanvas from './HomePageCanvas';
import AppHeader from './components/AppHeader';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TwentyOneThings from './components/games/TwentyOneThings';
import Pic6 from './components/games/Pic6';
import GamePageComp from './components/games/GamePageComp';
import { Alert } from '@mui/material';
import { Stack } from '@mui/system';
import { useGlobalContext } from './business/GlobalContext';
import UserAlert from './components/UserAlert';
import { checkAndAddUsers } from './business/apiCalls';

function App() {
  const [user, setUser] = useState({email: 'tomconey@tomconey.dev'});
  const [toggleQuit, setToggleQuit] = useState(false)
  const {alertProps, setAlertProps} = useGlobalContext()

  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(()=>{
    if(toggleQuit){
      setTimeout(() => {
        setToggleQuit(false)
      }, 100);
    }
    console.log(toggleQuit)
  },[toggleQuit])

  useEffect(() => {
    if(alertProps.display){
      setTimeout(() => {
        setAlertProps(prev => ({
          ...prev,
          ['display']: false
        }))
      }, 5000);
    }
  }, [alertProps])

  return (
      <div className="App">
          <AppHeader />
        <div style={{height: '100%', backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
        <Stack width={'100vw'} justifyContent={'center'} alignItems={'center'} position={'fixed'} zIndex={1301}>
          {alertProps.display && <Alert severity={alertProps.severity} sx={{width: '50%'}}>{alertProps.text}</Alert>}
        </Stack>
          <Routes>
            <Route path="/" element={<HomePageCanvas user={user} setUser={setUser} />}/>
            <Route path="/home" element={<HomePageCanvas user={user} setUser={setUser} />}/>
            <Route path='/games' element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser}/>}/>
          {!toggleQuit && 
          <>
            <Route path="/21Things" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: '21things', displayName: '21 Things', component: TwentyOneThings}}/>}/>
            <Route path="/6pics" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: 'pic6', displayName: 'Pic6', component: Pic6}}/>}/>
          </>
            }
          </Routes>
        </div>
        <UserAlert />
      </div>
  );
}

export default App;
