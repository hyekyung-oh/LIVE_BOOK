import Main from './js/Main';
import Rendering from './js/Rendering';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Render from './js/Rendering';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      {/* <Main /> */}
      <Rendering />
=======
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Render" element={<Render />} />
        </Routes>
      </BrowserRouter>
>>>>>>> 31aa5d12f740976a91e1d621559b24f5b31192f7
    </div>
  );
}

export default App;
