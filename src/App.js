import { BrowserRouter ,Routes,Route} from 'react-router-dom';
import './App.css';
import PageComponent from './components/PageComponent';
import UserDashboard from './components/UserDashboard';
import Error from './components/Error';
import { ToastContainer,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageComponent/>}/>
          <Route element={<ProtectedRoutes/>}>
            <Route path="/userDashboard" element={<UserDashboard/>}/>
          </Route>
            <Route path="*" element={<Error/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer transition={Slide}/> 
    </>
  );
}

export default App;
