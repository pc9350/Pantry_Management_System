'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography, IconButton, Avatar, useMediaQuery } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>PantryPal - Smart Pantry Management</title>
        <meta name="description" content="Manage your pantry, reduce food waste, and discover recipes with ingredients you already have." />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700&display=swap"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
