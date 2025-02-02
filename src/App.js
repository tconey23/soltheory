import logo from './assets/soltheorylogo.png';
import HomePageLogo from './HomePageLogo';
import './App.css';
import HomePageCanvas from './HomePageCanvas';
import AppHeader from './components/AppHeader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppHeader />
      </header>
      <div style={{height: '100%', backgroundColor: 'black'}}>
        <HomePageCanvas />
      </div>
    </div>
  );
}

export default App;
