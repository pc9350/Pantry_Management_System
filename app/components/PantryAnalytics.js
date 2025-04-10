import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  width: 45,
  height: 45,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? `${color}15` : theme.palette.primary.light + '15',
  color: color || theme.palette.primary.main,
}));

// A hook to get category distribution data
const useCategoryData = (items) => {
  const counts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const PantryAnalytics = ({ items }) => {
  const theme = useTheme();
  const categoryData = useCategoryData(items);
  
  // Calculate expiry counts (in a real app, this would use actual expiry data)
  const expiringSoon = getRandomNumber(1, 5);
  const freshItems = items.length - expiringSoon;
  const shoppingListCount = getRandomNumber(3, 10);
  
  // For Demo: Simulate usage over time
  const usageData = [
    { name: 'Mon', usage: getRandomNumber(1, 5) },
    { name: 'Tue', usage: getRandomNumber(1, 5) },
    { name: 'Wed', usage: getRandomNumber(1, 5) },
    { name: 'Thu', usage: getRandomNumber(1, 5) },
    { name: 'Fri', usage: getRandomNumber(1, 5) },
    { name: 'Sat', usage: getRandomNumber(1, 5) },
    { name: 'Sun', usage: getRandomNumber(1, 5) },
  ];
  
  // Colors for pie chart
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#9c27b0',
    '#795548',
    '#607d8b',
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0}>
            <IconBox color={theme.palette.primary.main}>
              <KitchenIcon />
            </IconBox>
            <Typography variant="overline" color="text.secondary">
              Total Items
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 1 }}>
              {items.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {items.length > 10 ? 'Well-stocked pantry' : 'Add more items to your pantry'}
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0}>
            <IconBox color={theme.palette.success.main}>
              <AccessTimeIcon />
            </IconBox>
            <Typography variant="overline" color="text.secondary">
              Fresh Items
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Typography variant="h4" component="div" fontWeight="bold">
                {freshItems}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                / {items.length}
              </Typography>
            </Box>
            <Typography variant="body2" color="success.main">
              {Math.round((freshItems / items.length) * 100)}% of items are fresh
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0}>
            <IconBox color={theme.palette.error.main}>
              <WarningIcon />
            </IconBox>
            <Typography variant="overline" color="text.secondary">
              Expiring Soon
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 1 }}>
              {expiringSoon}
            </Typography>
            <Typography variant="body2" color="error.main">
              {expiringSoon > 0 
                ? `${expiringSoon} ${expiringSoon === 1 ? 'item needs' : 'items need'} attention`
                : 'No items expiring soon'}
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0}>
            <IconBox color={theme.palette.secondary.main}>
              <TrendingUpIcon />
            </IconBox>
            <Typography variant="overline" color="text.secondary">
              Shopping List
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 1 }}>
              {shoppingListCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shoppingListCount > 0 
                ? `${shoppingListCount} ${shoppingListCount === 1 ? 'item' : 'items'} on your list` 
                : 'Your shopping list is empty'}
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0} sx={{ height: 300 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Item Usage Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Track how many items you've used each day
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 200, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="usage" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </StatCard>
        </motion.div>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          style={{ height: '100%' }}
        >
          <StatCard elevation={0} sx={{ height: 300 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Category Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Breakdown of your pantry by category
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 200, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name}) => name}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </StatCard>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default PantryAnalytics; 