import Main from './js/Main';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Render from './js/Rendering';
import TEST1 from './TEST_HYE/mui_appbar_test';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Render" element={<Render />} />
          {/* TESTING BY HYE */}
          <Route path="/TEST1" element={<TEST1 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;