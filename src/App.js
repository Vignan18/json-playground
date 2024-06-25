import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Compare from './components/Compare/Compare'
import Parse from  './components/Parse/Parse'
import About from './components/About/About';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/parse" element={<Parse />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
