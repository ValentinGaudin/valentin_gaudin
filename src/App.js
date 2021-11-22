import NotFound from './pages/NotFound';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "tailwindcss/tailwind.css";
import Home from './pages/Home';
import Work from './pages/Work';
import Contact from './pages/Contact';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ <Home /> } />
        <Route path="/work" element={<Work />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path='/?' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;