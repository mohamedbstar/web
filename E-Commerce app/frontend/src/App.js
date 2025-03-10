
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {

  return (
    <div className='relative'>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
