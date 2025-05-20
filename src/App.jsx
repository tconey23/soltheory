import { useEffect, useState } from 'react'
import './App.css'
import AppHeader from './components/AppHeader'
import { Stack } from '@mui/material'
import { Routes, Route, useLocation, useNavigate, redirect } from 'react-router-dom';
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
import AdSpace from './ui_elements/AdSpace';
import FinalStage from './components/games/21Things/FinalStage';
import { useParams } from 'react-router-dom';
import SharedGame from './components/games/21Things/SharedGame';

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
  const [redirect, setRedirect] = useState(false)

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
    const redir = sessionStorage.getItem('redirectAfterLogin')
    console.log(redir)
    if(redir){
      setRedirect(true)
      navTo(redir)
    } else {
      setRedirect(false)
    }
  }, [userMeta])

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true)
    }, 1000);
  }, [])

  useEffect(() =>{
    if(user && !redirect){
      // navTo('/home')
    }
  }, [user, redirect])

  useEffect(() => { 
    if(userMeta?.user_name) {
      // console.log(userMeta?.user_name)
      setAlertContent({
        text: `Welcome ${userMeta?.user_name}`,
        type: 'info'
      })
    }
  }, [userMeta, user])
  
  

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
            <GamesWrapper />
        } 
      />

      <Route 
        path={"/games/21things"}
        element={
            <TwentyOneThings /> 
        } 
      />

      <Route 
        path={"/games/6pics"}
        element={
            <Pic6/>
        } 
      />

      <Route path="/games/21things/:gameId" element={<TwentyOneThings redirect={false} />} />
      <Route path="/games/6pics/:gameId" element={<Pic6 />} />

      <Route path="/games/21things/shared/:userId/:gameId" element={<SharedGame />} />

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

    {appReady && <Modals needsLogin={false}/>}

    <Stack position={'fixed'} sx={{transform: `translateY(${height-75}px)`, height: '100%', width: '100%'}}>
      <AdSpace />
    </Stack> 

   </Stack>
  )
}

export default App 
