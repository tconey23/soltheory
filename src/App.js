import './App.css';
import HomePageCanvas from './HomePageCanvas';
import AppHeader from './components/AppHeader';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TwentyOneThings from './components/games/TwentyOneThings';
import Pic6 from './components/games/Pic6';
import GamePageComp from './components/games/GamePageComp';
import EscLanding from './r3fAssets/EscLanding';
import { Alert } from '@mui/material';
import { Stack } from '@mui/system';
import { useGlobalContext } from './business/GlobalContext';
import UserAlert from './components/UserAlert';
import { checkAndAddUsers } from './business/apiCalls';
import ErrorPage from './components/ErrorPage';
import ThreeDTwentyOne from './r3fAssets/ThreeDTwentyOne';

function App() {
  const [user, setUser] = useState({email: ''});
  const [toggleQuit, setToggleQuit] = useState(false)
  const {alertProps, setAlertProps} = useGlobalContext()
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
      <div userData='app wrapper' className="App" style={{justifyContent: 'center'}}>
         {toggleHeader && <AppHeader />}
        <div style={{height: '98%', backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
        <Stack userData='app alerts wrapper' width={'100vw'} height={'10vh'} justifyContent={'center'} alignItems={'center'} position={'fixed'}>
          {alertProps.display && <Alert severity={alertProps.severity} sx={{width: '50%'}}>{alertProps.text}</Alert>}
        </Stack>
        <Stack userData='app 2' height={'100%'}>
          <Routes>
            <Route path="/" element={<HomePageCanvas user={user} setUser={setUser} />}/>
            <Route path="/home" element={<HomePageCanvas user={user} setUser={setUser} />}/>
            <Route path='/games' element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser}/>}/>
            <Route path='/esc' element={<EscLanding />}/>
            <Route path='/error' element={<ErrorPage />}/>
            {/* <Route path='/21Things' element={<ThreeDTwentyOne />}/> */}
          {!toggleQuit && 
          <>
            <Route path="/21Things" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: '21things', displayName: '21 Things', component: TwentyOneThings}}/>}/>
            <Route path="/6pics" element={<GamePageComp setToggleQuit={setToggleQuit} user={user} setUser={setUser} selectedGame={{name: 'pic6', displayName: 'Pic6', component: Pic6}}/>}/>
          </>
            }
          </Routes>
          </Stack>
        </div>
      </div>
  );
}

export default App;
