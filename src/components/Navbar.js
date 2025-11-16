import React from 'react'
import {Link} from 'react-router-dom'
import { Stack } from '@mui/material'
import Logo from '../assets/images/Logo.png'


const Navbar = () => {
  return (
    <Stack 
      direction="row" 
      alignItems="center"
      sx={{
        mt: {sm:'32px', xs:'20px'},
        position: 'relative',
        zIndex: 1000
      }} 
      px='20px'
    >
      <Link to="/">
        <img 
          src={Logo} 
          alt="Logo" 
          style={{
            width:'48px',
            height:'48px',
            cursor: 'pointer',
            marginRight: '40px'
          }} 
        />
      </Link>
      
      <Stack 
        direction="row" 
        gap="40px" 
        fontSize="24px" 
        alignItems="center"
      >
        <Link 
          to="/" 
          style={{
            textDecoration: 'none', 
            color: '#3A1212', 
            borderBottom: '3px solid #FF2625',
            cursor: 'pointer',
            display: 'block',
            padding: '8px 0',
            transition: 'all 0.3s ease'
          }}
        >
          Home
        </Link>
        
        <Link 
          to='/Bmi' 
          style={{
            textDecoration: 'none', 
            color: '#3A1212',
            cursor: 'pointer',
            display: 'block',
            padding: '8px 0',
            transition: 'all 0.3s ease'
          }}
        >
          Bmi Calculator
        </Link>

        <Link 
          to='/MealPlanner' 
          style={{
            textDecoration: 'none', 
            color: '#3A1212',
            cursor: 'pointer',
            display: 'block',
            padding: '8px 0',
            transition: 'all 0.3s ease'
          }}
        >
          MealPlanner
        </Link>


      </Stack>
    </Stack>
  )
}

export default Navbar