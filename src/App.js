import Main from './js/Main';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Render from './js/Rendering';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Render" element={<Render />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;