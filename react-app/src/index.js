import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Nav from './Nav';
import Scroll from './Scroll';
import Input from './Input';
import GlobalStyle from './Styles/GlobalStyle';
import Intersection from './Intersection';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <GlobalStyle />
    <Nav />
    <Routes>
      <Route path='/' element={<Scroll/>} />
      <Route path='/scroll' element={<Scroll/>} />
      <Route path='/input' element={<Input/>} />
      <Route path='/intersection' element={<Intersection/>} />
    </Routes>
  </BrowserRouter>
);