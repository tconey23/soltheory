import './App.css';
import HomePageCanvas from './r3fAssets/HomePageCanvas'; 
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
import ErrorPage from './components/ErrorPage';
import DevCanvas from './r3fAssets/DevCanvas';
import Login from './components/Login';
import AccountPage from './components/AccountPage';
import Friends from './components/Friends';

function App() {
  const [toggleQuit, setToggleQuit] = useState(false)
  const {alertProps, setAlertProps, user, setUser} = useGlobalContext()
  const [toggleHeader, setToggleHeader] = useState(true)

  useEffect(() => {
    // console.log(user)
  }, [user])

  useEffect(()=>{
    if(toggleQuit){
      setTimeout(() => {
        setToggleQuit(false)
      }, 100);
    }
    // console.log(toggleQuit)
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
      <Stack userdata='app_wrapper' direction={'column'} height={'100vh'} width={'100vw'}>
         
          <Stack userdata='app_header' width={'100%'} height={'10%'}>
            <AppHeader />
          </Stack>
        
          <UserAlert />

          <Stack userdata='app 2' height={'90%'} justifyContent={'center'} alignItems={'center'}>
            <Routes>
              <Route path="/" element={<HomePageCanvas user={user} setUser={setUser} />}/>
              <Route path="/home" element={<HomePageCanvas user={user} setUser={setUser} />}/>
              <Route path='/games' element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser}/>}/>
              <Route path='/esc' element={null}/>
              <Route path='/error' element={<ErrorPage />}/>
              <Route path='/dev_canvas' element={<DevCanvas />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/account' element={<AccountPage />}/>
              <Route path='/friends' element={<Friends />}/>
            {!toggleQuit && 
              <>
                <Route path="/21Things" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: '21things', displayName: '21 Things', component: TwentyOneThings}}/>}/>
                <Route path="/6pics" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: 'pic6', displayName: 'Pic6', component: Pic6}}/>}/>
              </>
            }
            </Routes>
          </Stack>
      </Stack>
  );
}

export default App;
