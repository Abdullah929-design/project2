import React, { useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import { Stack, IconButton, Drawer, Box, List, ListItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import Logo from '../assets/images/Logo.png'


const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/Bmi', label: 'Bmi Calculator' },
    { path: '/MealPlanner', label: 'MealPlanner' }
  ]

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <img 
          src={Logo} 
          alt="Logo" 
          style={{
            width:'40px',
            height:'40px',
          }} 
        />
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} sx={{ px: 2, py: 1 }}>
            <Link 
              to={link.path}
              onClick={handleDrawerToggle}
              style={{
                textDecoration: 'none', 
                color: isActive(link.path) ? '#FF2625' : '#3A1212',
                borderBottom: isActive(link.path) ? '3px solid #FF2625' : 'none',
                cursor: 'pointer',
                display: 'block',
                padding: '8px 0',
                transition: 'all 0.3s ease',
                width: '100%',
                fontSize: '18px',
                fontWeight: isActive(link.path) ? 'bold' : 'normal'
              }}
            >
              {link.label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <Stack 
        direction="row" 
        alignItems="center"
        justifyContent="space-between"
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
            }} 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <Stack 
          direction="row" 
          gap="40px" 
          fontSize="24px" 
          alignItems="center"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              style={{
                textDecoration: 'none', 
                color: isActive(link.path) ? '#FF2625' : '#3A1212', 
                borderBottom: isActive(link.path) ? '3px solid #FF2625' : 'none',
                cursor: 'pointer',
                display: 'block',
                padding: '8px 0',
                transition: 'all 0.3s ease',
                fontWeight: isActive(link.path) ? 'bold' : 'normal'
              }}
            >
              {link.label}
            </Link>
          ))}
        </Stack>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, color: '#3A1212' }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar