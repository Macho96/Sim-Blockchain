import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Dashboard from '../pages/Dashboard';
import NavBar from '../pages/Navbar';
import SystemOptions from '../pages/SystemOptions';
import Mined from '../pages/Mined';

export default function AppRouter() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} ></Route>
        <Route path="/home" element={<Home />} ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/registro" element={<Registro />} ></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/mined" element={<Mined />}></Route>
        <Route path="/system" element={<SystemOptions />}></Route>
      </Routes>
    </Router>
  )



} 