import { useEffect, useState } from 'react'
import './App.css'
import AppHeader from './components/AppHeader'
import { Stack } from '@mui/material'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './views/homepage/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Account from './components/Account';
import useGlobalStore from './business/useGlobalStore';
import Modals from './views/modals/Modals';
import { checkSession, getMeta } from './business/supabase_calls';
import Error from './views/Error';
import GamesWrapper from './components/games/GamesWrapper';
import TwentyOneThings from './components/games/21Things/TwentyOneThings';
import Pic6 from './components/games/6pics/Pic6';
import AdminControls from './components/AdminControls';
import useBreakpoints from './business/useBreakpoints';
import SolMates from './components/solmates/SolMates';
import UserAlert from './ui_elements/Alert';
import { useWindowHeight } from './business/useWindowHeight';

function App() {
  const navTo = useNavigate()
  const setScreen = useGlobalStore((state) => state.setScreen)
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const setSession = useGlobalStore((state) => state.setSession)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setUserMeta = useGlobalStore((state) => state.setUserMeta)
  const setHeight = useGlobalStore((state) => state.setHeight)
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)

  const {screenSize} = useBreakpoints()

  const [appReady, setAppReady] = useState(false)

  const height = useWindowHeight() 

 useEffect(() => {
  setHeight(height)
 }, [height])

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

  useEffect(() => { 
    if(userMeta?.user_name) {
      console.log(userMeta?.user_name)
      setAlertContent({
        text: `Welcome ${userMeta?.user_name}`,
        type: 'info'
      })
    }
  }, [userMeta, user])
  
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
      <Route path={"/"} element={<HomePage />}/>
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

    <UserAlert />

    {appReady && <Modals needsLogin={!userMeta}/>}

   </Stack>
  )
}

export default App 
