import './App.css';
import HomePageCanvas from './HomePageCanvas';
import AppHeader from './components/AppHeader';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import TwentyOneThings from './components/games/TwentyOneThings';
import Pic6 from './components/games/Pic6';
import SixPicsPacks from './components/games/SixPicsPacks';
import GamePageComp from './components/games/GamePageComp';
import { useMediaQuery } from '@mui/material';
import SixPics from './assets/SixPics';


function App() {
  const [user, setUser] = useState({email: 'tomconey@tomconey.dev'});

  return (
    <div className="App">
        <AppHeader />
      <div style={{height: '100%', backgroundColor: 'white'}}>
        <Routes>
          <Route path="/" element={<HomePageCanvas user={user} setUser={setUser} />}/>
          <Route path="/home" element={<HomePageCanvas user={user} setUser={setUser} />}/>
          <Route path='/games' element={<GamePageComp user={user} setUser={setUser}/>}/>
          <Route path="/21Things" element={<GamePageComp user={user} setUser={setUser} selectedGame={{name: '21things', displayName: '21 Things', component: TwentyOneThings}}/>}/>
          <Route path="/6pics" element={<GamePageComp user={user} setUser={setUser} selectedGame={{name: 'pic6', displayName: 'Pic6', component: Pic6}}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
