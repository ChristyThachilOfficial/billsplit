import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import ExpenseTracker from './components/ExpenseTracker';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ExpenseTracker/>} />
          
          <Route path='/login' element={<Login />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
