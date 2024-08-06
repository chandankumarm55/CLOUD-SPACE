import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Main from './pages/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='register' element={ <Register /> } />
          <Route path='login' element={ <Login /> } />
          <Route path='/' element={ <Main /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
