import logo from './assets/soltheorylogo.png';
import HomePageLogo from './HomePageLogo';
import './App.css';
import HomePageCanvas from './HomePageCanvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <HomePageLogo /> */}
        <p>
          Under construction. Check back in later
        </p>
      </header>
      <div style={{height: '100%', backgroundColor: 'black'}}>
        <HomePageCanvas />
      </div>
    </div>
  );
}

export default App;
