import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import bannerImage from "../assets/images/banner.png"

const Banner = () => {
  return (
    <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        mt: '-80px', 
        pt: '80px', 
        overflow: 'hidden'
    }}>
      
      {/* Image - Completely unchanged */}
      <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '100%', md: '50%' },
          height: '100%',
          minHeight: '100vh',
          zIndex: 0
      }}>
        <img 
           src={bannerImage}
           alt='banner'
           style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </Box>
      
      {/* Content Container - Position unchanged, only child elements enhanced */}
      <Box sx={{
          mt: { lg: '150px', xs: '70px' },
          ml: { sm: '50px' },
          position: 'relative',
          p: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '100vh',
          zIndex: 1
      }}>
        <Box sx={{
            maxWidth: { xs: '100%', md: '50%' },
            zIndex: 2
        }}>
          {/* Fitness Club Text - Enhanced */}
          <Typography 
            color="#FF2625" 
            fontWeight="800" 
            fontSize="26px"
            letterSpacing="1px"
            sx={{ 
              mb: 1,
              textTransform: 'uppercase'
            }}
          >
            Fitness Club
          </Typography>
          
          {/* Main Heading - Enhanced */}
          <Typography 
            fontWeight="800" 
            sx={{ 
              fontSize: { lg: '72px', xs: '48px' },
              lineHeight: { lg: '1.1', xs: '1.2' },
              mb: 3,
              color: '#2A2A2A',
              '& br': {
                display: { xs: 'none', sm: 'block' }
              }
            }}
          >
            Sweat, Smile <br/> And Repeat
          </Typography>
          
          {/* Subheading - Enhanced */}
          <Typography 
            fontSize="22px" 
            lineHeight="32px" 
            mb={4}
            sx={{
              color: '#4A4A4A',
              fontWeight: 500,
              maxWidth: '90%'
            }}
          >
            Check out the most effective exercises personalized to your goals!
          </Typography>
          
          {/* Button - Enhanced */}
          <Button 
            variant="contained" 
            size="large"
            sx={{
              backgroundColor: '#FF2625',
              padding: '10px 30px',
              fontSize: '18px',
              fontWeight: '700',
              borderRadius: '4px',
              textTransform: 'none',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(255, 38, 37, 0.35)',
              '&:hover': { 
                backgroundColor: '#E62222',
                boxShadow: '0 6px 16px rgba(255, 38, 37, 0.45)'
              },
              transition: 'all 0.2s ease-out'
            }}
            href="#exercises"
          >
            Explore Exercises
          </Button>
          
          {/* Exercise watermark - COMPLETELY UNCHANGED */}
          <Typography
             fontWeight={600}
             color="#ff2625"
             sx={{
              opacity: '0.1',
               display: { lg: 'block', xs: 'none' },
              fontSize: '200px',
              position: 'absolute',
              bottom: '-80px',
              left: '20px',
              zIndex: -1
            }}>
            Exercise
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Banner