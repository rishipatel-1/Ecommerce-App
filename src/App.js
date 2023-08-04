import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel/AdminHomePage/AdminPanel';
import UserPanel from './components/UserPanel/UserHomepage/UserPanel';
import Login from './components/pages/auth/Login/Login';
import Register from './components/pages/auth/Register/Register';
import PrivateRoute from './components/pages/auth/AuthRoutes/PrivateRoute';
import AuthPrivateRoute from './components/pages/auth/AuthRoutes/AuthPrivateRoute';
import AdminPrivateRoute from './components/pages/auth/AuthRoutes/AdminPrivateRoute';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer/>
        <Routes>
        <Route path="/admin" element={<AdminPrivateRoute><AdminPanel/></AdminPrivateRoute>} />
        <Route path="/" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
        <Route path="/login" element={<AuthPrivateRoute><Login/></AuthPrivateRoute>} />
        <Route path="/register" element={<AuthPrivateRoute><Register/></AuthPrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;