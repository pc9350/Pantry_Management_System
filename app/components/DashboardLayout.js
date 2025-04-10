'use client';

import React from 'react';
import { Box, Container, Paper, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './Navbar';
import theme from '../theme';
import Head from 'next/head';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const DashboardLayout = ({ 
  children, 
  title = 'PantryPal',
  breadcrumbs = [],
  maxWidth = 'lg',
  containerPadding = { xs: 2, md: 4 },
  pageActions = null
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{title} | PantryPal</title>
      </Head>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Navbar />
        
        <Container maxWidth={maxWidth} sx={{ flexGrow: 1, py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2 
            }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {title}
              </Typography>
              
              {pageActions && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {pageActions}
                </Box>
              )}
            </Box>
            
            {breadcrumbs.length > 0 && (
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                aria-label="breadcrumb"
                sx={{ mb: 2 }}
              >
                <Link href="/" passHref legacyBehavior>
                  <MuiLink 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                  </MuiLink>
                </Link>
                
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  if (isLast || !crumb.href) {
                    return (
                      <Typography 
                        key={crumb.label} 
                        color={isLast ? 'text.primary' : 'text.secondary'}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          fontWeight: isLast ? 500 : 400
                        }}
                      >
                        {crumb.icon && <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>{crumb.icon}</Box>}
                        {crumb.label}
                      </Typography>
                    );
                  }
                  
                  return (
                    <Link key={crumb.label} href={crumb.href} passHref legacyBehavior>
                      <MuiLink 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {crumb.icon && <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>{crumb.icon}</Box>}
                        {crumb.label}
                      </MuiLink>
                    </Link>
                  );
                })}
              </Breadcrumbs>
            )}
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: containerPadding,
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
            }}
          >
            {children}
          </Paper>
        </Container>

        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto', 
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} PantryPal | Reducing Food Waste, One Ingredient at a Time
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout; 