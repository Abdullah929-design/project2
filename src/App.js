import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Box} from '@mui/material';
import Home from './pages/Home';
import Bmi from './pages/Bmi';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MealTracker from './pages/MealPlanner';
import './App.css';

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Box width="400px" sx={{width:{xl:'1488px'}}} m='auto'>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Bmi" element={<Bmi />}/>
            <Route path="/MealPlanner" element={<MealTracker userId={1} />} />
        </Routes>
        <Footer/>
      </Box>
      </BrowserRouter>
    
  )
}

export default App
