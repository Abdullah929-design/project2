import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Facebook, Twitter, Instagram, YouTube, FitnessCenter, LocationOn, Phone, Email } from '@mui/icons-material';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: '#FF8A00',
  fontSize: '1.2rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#ffffff',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#FF2625',
    transform: 'translateX(5px)',
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#FF2625',
    transform: 'translateY(-3px)',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: '#ffffff',
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter sx={{ color: '#FF2625', fontSize: '2rem', mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FF2625 30%, #FF8A00 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  POWERGYM
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your premier destination for fitness training and workout excellence. 
                We're dedicated to helping you achieve your fitness goals.
              </Typography>
              <Box>
                <SocialIcon aria-label="Facebook">
                  <Facebook />
                </SocialIcon>
                <SocialIcon aria-label="Twitter">
                  <Twitter />
                </SocialIcon>
                <SocialIcon aria-label="Instagram">
                  <Instagram />
                </SocialIcon>
                <SocialIcon aria-label="YouTube">
                  <YouTube />
                </SocialIcon>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">Quick Links</FooterTitle>
            <FooterLink href="#" underline="none">Home</FooterLink>
            <FooterLink href="#" underline="none">Workouts</FooterLink>
            <FooterLink href="#" underline="none">Exercises</FooterLink>
            <FooterLink href="#" underline="none">Trainers</FooterLink>
            <FooterLink href="#" underline="none">Pricing</FooterLink>
            <FooterLink href="#" underline="none">Blog</FooterLink>
          </Grid>

          {/* Programs Column */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">Programs</FooterTitle>
            <FooterLink href="#" underline="none">Strength Training</FooterLink>
            <FooterLink href="#" underline="none">Cardio Programs</FooterLink>
            <FooterLink href="#" underline="none">Fat Burning</FooterLink>
            <FooterLink href="#" underline="none">Body Building</FooterLink>
            <FooterLink href="#" underline="none">CrossFit</FooterLink>
            <FooterLink href="#" underline="none">Yoga</FooterLink>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">Contact Us</FooterTitle>
            <ContactItem>
              <LocationOn sx={{ color: '#FF2625', mr: 1 }} />
              <Typography variant="body2">
                123 Fitness Street, Gym City, 10001
              </Typography>
            </ContactItem>
            <ContactItem>
              <Phone sx={{ color: '#FF2625', mr: 1 }} />
              <Typography variant="body2">(555) 123-4567</Typography>
            </ContactItem>
            <ContactItem>
              <Email sx={{ color: '#FF2625', mr: 1 }} />
              <Typography variant="body2">info@powergym.com</Typography>
            </ContactItem>
          </Grid>
        </Grid>

        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.1)', 
          my: 4,
          borderWidth: '1px'
        }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} PowerGym. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <FooterLink href="#" underline="none" sx={{ mr: 2 }}>Privacy Policy</FooterLink>
            <FooterLink href="#" underline="none">Terms of Service</FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;