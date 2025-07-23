import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import AppHeader from './components/AppHeader'
import { Stack, Typography } from '@mui/material'
import { Routes, Route, useNavigate} from 'react-router-dom';
import HomePage from './views/homepage/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Account from './components/Account';
import useGlobalStore from './business/useGlobalStore';
import Modals from './views/modals/Modals';
import { checkSession, getMeta } from './business/supabase_calls';
import Error from './views/Error';
import AdminControls from './components/AdminControls';
import useBreakpoints from './business/useBreakpoints';
import SolMates from './components/solmates/SolMates';
import UserAlert from './ui_elements/Alert';
import FadeStack from './ui_elements/FadeStack';
import LoadingAnimation from './ui_elements/LoadingAnimation';
import Password from './components/Password';
import Wavetuner from './components/games/WaveTuner/Wavetuner';

// import GamesWrapper from './components/games/GamesWrapper';
// import TwentyOneThings from './components/games/21Things/TwentyOneThings';
// import Pic6 from './components/games/6pics/Pic6';
// import AdSpace from './ui_elements/AdSpace';
// import SharedGame from './components/games/21Things/SharedGame';
// import Sandbox from './components/games/Sandbox/Sandbox';
// import MyThreeSongs from './components/games/MyThreeSongs/MyThreeSongs';
// import AvettDemo from './components/games/6pics/AvettDemo';

const SixPics = lazy(() => import('./components/games/6pics/Pic6'))
const TwentyOneThings = lazy (() => import('./components/games/21Things/TwentyOneThings'))
const AdSpace = lazy (() => import('./ui_elements/AdSpace'))
const GamesWrapper = lazy (() => import('./components/games/GamesWrapper'))
const SharedGame = lazy (() => import('./components/games/21Things/SharedGame'))
const Sandbox = lazy (() =>  import('./components/games/Sandbox/Sandbox'))
const MyThreeSongs = lazy (() =>  import('./components/games/MyThreeSongs/MyThreeSongs'))
const AvettDemo = lazy (() =>  import('./components/games/6pics/AvettDemo'))

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

function App() {
  const navTo = useNavigate()
  const setScreen = useGlobalStore((state) => state.setScreen)
  const screen = useGlobalStore((state) => state.screen)
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const setSession = useGlobalStore((state) => state.setSession)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setUserMeta = useGlobalStore((state) => state.setUserMeta)
  const setHeight = useGlobalStore((state) => state.setHeight)
  const setAlertContent = useGlobalStore((state) => state.setAlertContent)
  const inGame = useGlobalStore((state) => state.inGame)
  const setInGame = useGlobalStore((state) => state.setInGame)
  const { width, height } = useScreenSize();
  const {screenSize} = useBreakpoints()
  const [appReady, setAppReady] = useState(false)
  const [redirect, setRedirect] = useState(false)

  // const height = useWindowHeight() 

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
    if(redir){
      setRedirect(true)
      navTo(redir)
    } else {
      setRedirect(false)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [userMeta])

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true)
    }, 1000);
    setInGame(false)
  }, [])

  useEffect(() =>{
    if(user && !redirect){
      // navTo('/home')
    }
  }, [user, redirect])

  useEffect(() => { 
    if(userMeta?.user_name) {
      setAlertContent({
        text: `Welcome ${userMeta?.user_name}`,
        type: 'info'
      })
    }
  }, [userMeta, user])

const [dims, setDims] = useState(
  {
    width: '100%',
    height: '80%'
  }
)
  
  useEffect(() => {
    switch(screen){
      case 'xs': setDims({width: '100%', height: '88%'})
      break;
      case 'md': setDims({width: '100%', height: '100%'})
      break;
      default: setDims({width: '100%', height: '90%'})
    }
  }, [screen])

    useEffect(() => {
    let lastHeight = window.innerHeight;
  
    const handleResize = () => {
      const currentHeight = window.innerHeight;
  
      if (currentHeight > lastHeight) {
        // Keyboard is likely dismissed
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }, 50);
      }
  
      lastHeight = currentHeight;
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  return (
   <Stack direction={'column'} height={'100svh'} width={'100dvw'} justifyContent={'flex-start'} alignItems={'center'}>

    <Stack flex="0 0 10%" width="100%">
      <AppHeader />
    </Stack>
    <Stack flex="1" width="100%" id="main" height={'80svh'} justifyContent={'flex-start'} alignItems={'center'}>
      <Suspense fallback={
        <FadeStack initial={{opacity: 1}} animate={{opacity: 0}} exit={{opacity: 0}} transition={{duration: 1.5, delay: 1.5}}>
          <Stack width={'100%'} height={'80%'} bgcolor={'black'} position={'absolute'} justifyContent={'center'} sx={{top: 0, left: 0}}>
            <Typography fontFamily={'fredoka regular'} fontSize={20} color={'white'}>Loading SOL Theory...</Typography>
          </Stack>
        </FadeStack>
      }>
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
              <SixPics />
            } 
            />

            

          <Route 
            path={'/games/wavetuner'}
            element={
              <Wavetuner />
            } 
            />

          <Route 
            path={"/mythreesongs"}
            element={
              <MyThreeSongs />
            } 
            />
              
          <Route 
            path={"/games/sandbox"}
            element={
              <Sandbox />
            } 
            />

          <Route 
            path={"/resetpassword"}
            element={
              <Password />
            } 
            />

          <Route path="/games/21things/:gameId" element={<TwentyOneThings redirect={false} />} />
          <Route path="/games/6pics/:gameId" element={<SixPics />} />

          <Route path="/avett/" element={<AvettDemo demo={true}/>} />

          <Route path="/games/6pics/promo/avett" element={<SixPics />} />

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
        </Suspense>
      </Stack>

    
      {!inGame && 
      <Stack flex="0 0 7%" width="100%">
        <AdSpace />
      </Stack> }

    <UserAlert />
    {appReady && <Modals needsLogin={false}/>}


   </Stack>
  )
}

export default App 
