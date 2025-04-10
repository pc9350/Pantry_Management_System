import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';

const pages = [
  { name: 'My Pantry', href: '/', icon: <KitchenIcon /> },
  { name: 'Add Items', href: '/ImageCapture', icon: <AddAPhotoIcon /> },
  { name: 'Recipes', href: '/recipes', icon: <MenuBookIcon /> },
];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (href) => {
    return router.pathname === href;
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          PantryPal
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <Link href={page.href} key={page.name} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem 
              button 
              sx={{ 
                py: 1.5,
                backgroundColor: isActive(page.href) ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                color: isActive(page.href) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: 1,
                mx: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(page.href) ? 'primary.main' : 'text.secondary',
                minWidth: 40
              }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem button sx={{ py: 1.5, borderRadius: 1, mx: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button sx={{ py: 1.5, borderRadius: 1, mx: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <KitchenIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: 'flex',
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                PantryPal
              </Typography>
            </Box>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {pages.map((page) => (
                  <Link href={page.href} key={page.name} passHref style={{ textDecoration: 'none' }}>
                    <Button
                      sx={{
                        my: 2, 
                        mx: 1,
                        color: isActive(page.href) ? 'primary.main' : 'text.primary',
                        fontWeight: isActive(page.href) ? 600 : 400,
                        position: 'relative',
                        '&::after': isActive(page.href) ? {
                          content: '""',
                          position: 'absolute',
                          width: '40%',
                          height: '3px',
                          bottom: '6px',
                          left: '30%',
                          backgroundColor: 'primary.main',
                          borderRadius: '3px'
                        } : {}
                      }}
                      startIcon={page.icon}
                    >
                      {page.name}
                    </Button>
                  </Link>
                ))}
              </Box>
            )}

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">About</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 