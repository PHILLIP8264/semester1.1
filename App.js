import './App.css';
import Nav from './Nav';
import Home from './Pages/Home';
import Comparison from './Pages/Comparison';
import Timeline from './Pages/Timeline';
import Character from './Pages/Character';


function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <Home />
      break;
      case "/Comparison":
        component = <Comparison />
        break;
        case "/Timeline":
          component = <Timeline />
          break;
          case "/Character":
          component = <Character />
          break;
  }
  return (

    <div className="App">
      <Nav />
      <div className='container'>
        {component}
      </div>
     
    </div>
  );
}

export default App;
