import { useEffect, useState } from 'react'
import './App.css'
import AppHeader from './components/AppHeader'
import { Modal, Stack } from '@mui/material'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './views/homepage/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Account from './components/Account';
import useGlobalStore from './business/useGlobalStore';
import Modals from './views/modals/Modals';
import { checkSession, deviceData, getMeta } from './business/supabase_calls';
import Error from './views/Error';
import GamesWrapper from './components/games/GamesWrapper';
import TwentyOneThings from './components/games/21Things/TwentyOneThings';
import SixPics from './assets/SixPics';
import Pic6 from './components/games/6pics/Pic6';
import AdminControls from './components/AdminControls';
import useBreakpoints from './business/useBreakpoints';
import SolMates from './components/solmates/SolMates';

function App() {
  const navTo = useNavigate()
  const location = useLocation()
  const screen = useGlobalStore((state) => state.screen)
  const setScreen = useGlobalStore((state) => state.setScreen)
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  // const session = useGlobalStore((state) => state.session)
  const setSession = useGlobalStore((state) => state.setSession)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setUserMeta = useGlobalStore((state) => state.setUserMeta)

  const {screenSize} = useBreakpoints()

  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const sz = Object.entries(screenSize).find((s) => !!s[1])
    setScreen(sz[0])
  }, [screenSize])

  useEffect(() => {
          if (user) {
            (async () => {
              const res = await getMeta(user?.id);
              if(res?.primary_id){
                  setUserMeta(res)
              }
            })();
          } else {
              (async () => {
                  const existingSession = await checkSession()
                  if(existingSession){
                      setUser(existingSession?.session?.user)
                      setSession(existingSession?.session)
                  }
                })();
          }
        }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true)
    }, 1000);
  }, [])

  useEffect(() =>{
    if(user){
      navTo('/home')
    }
  }, [user])
  
  // useEffect(() => {
  //   if(location.pathname === '/'){
  //     navTo('/home')
  //   }

  //   const debugDevice = async () => {
  //     const res = await deviceData(window, navigator, userMeta?.primary_id)
  //   }

  //   debugDevice()
  // }, [])

  // console.log(navigator) 

  return (
   <Stack direction={'column'} height={'100dvh'} width={'100dvw'} justifyContent={'flex-start'} alignItems={'center'} overflow={'hidden'}>
    <Stack width={'100%'} height={'10%'}>
      <AppHeader />
    </Stack>

    <Routes>

      <Route path='*' element={<Error/>} />
      <Route path={"/home"} element={<HomePage />}/>
      {!user && <Route path={"/login"} element={<HomePage needsLogin={true}/>} />}

      <Route 
        path={"/account"}
        element={
          <PrivateRoute userData={userMeta}>
            <Account />
          </PrivateRoute>
        } 
      />

      <Route 
        path={"/games"}
        element={
          <PrivateRoute userData={userMeta}>
            <GamesWrapper />
          </PrivateRoute>
        } 
      />

      <Route 
        path={"/games/21things"}
        element={
          <PrivateRoute userData={userMeta}>
            <TwentyOneThings />
          </PrivateRoute>
        } 
      />

      <Route 
        path={"/games/6pics"}
        element={
          <PrivateRoute userData={userMeta}>
            <Pic6/>
          </PrivateRoute>
        } 
      />

    <Route 
        path={"/account/admin"}
        element={
          <PrivateRoute userData={userMeta}>
            <AdminControls />
          </PrivateRoute>
        } 
      />

    <Route 
        path={"/solmates"}
        element={
          <PrivateRoute userData={userMeta}>
            <SolMates />
          </PrivateRoute>
        } 
      />

    </Routes>

    

    {appReady && <Modals needsLogin={!userMeta}/>}

   </Stack>
  )
}

export default App 
