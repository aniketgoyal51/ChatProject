// client/src/App.js

import { Routes, Route } from 'react-router-dom'
import React from 'react';
import Chat from './Components/chat';
import Login from './Components/login';
import SignUp from './Components/signup';
import Home from './Home';

function App() {
  return (
    <Routes>
      <Route path='/' element={< Home/>} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/chat' element={<Chat />} />
    </Routes>
  );
}

export default App;
