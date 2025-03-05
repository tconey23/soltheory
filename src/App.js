import './App.css';
import HomePageCanvas from './HomePageCanvas';
import AppHeader from './components/AppHeader';
import { Routes, Route } from 'react-router-dom';
import TwentyOneThings from './components/games/TwentyOneThings';
import Pic6 from './components/games/Pic6';
import GamePageComp from './components/games/GamePageComp';

function App() {
  return (
    <div className="App">
        <AppHeader />
      <div style={{height: '100%', backgroundColor: 'white'}}>
        <Routes>
          <Route path="/" element={<HomePageCanvas />}/>
          <Route path="/home" element={<HomePageCanvas />}/>
          <Route path='/games' element={<GamePageComp />}/>
          <Route path="/21Things" element={<GamePageComp selectedGame={{name: '21things', displayName: '21 Things', component: TwentyOneThings}}/>}/>
          <Route path="/6pics" element={<GamePageComp selectedGame={{name: 'pic6', displayName: 'Pic6', component: Pic6}}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
