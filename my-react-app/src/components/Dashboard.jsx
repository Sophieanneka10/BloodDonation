import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Bloodtype,
  Event,
  History,
  Message,
  Notifications,
  Warning,
  Settings,
  Menu as MenuIcon,
  ChevronRight,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function Dashboard({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Blood Requests', icon: <Bloodtype />, path: '/blood-requests' },
    { text: 'Donation Drives', icon: <Event />, path: '/donation-drives' },
    { text: 'Donation History', icon: <History />, path: '/donation-history' },
    { text: 'Messages', icon: <Message />, path: '/messages' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Emergency', icon: <Warning />, path: '/emergency' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#fff' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
          RedWeb
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <Box
                  component="img"
                  src="https://via.placeholder.com/32"
                  alt="Profile"
                  sx={{ width: 32, height: 32, borderRadius: '50%' }}
                />
              </IconButton>
              <Button
                color="inherit"
                onClick={onLogout}
                sx={{ textTransform: 'none', color: 'text.secondary' }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Blood Requests Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Blood Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No active blood requests
                    </Typography>
                  </Box>
                  <Bloodtype color="error" />
                </Box>
                <Typography variant="h3" sx={{ my: 2 }}>
                  0
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ChevronRight />}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  View all requests
                </Button>
              </Paper>
            </Grid>

            {/* Donation Drives Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Donation Drives
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No upcoming drives
                    </Typography>
                  </Box>
                  <Event color="primary" />
                </Box>
                <Typography variant="h3" sx={{ my: 2 }}>
                  0
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ChevronRight />}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  View all drives
                </Button>
              </Paper>
            </Grid>

            {/* Emergency Requests Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Emergency Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No emergency requests
                    </Typography>
                  </Box>
                  <Warning color="error" />
                </Box>
                <Typography variant="h3" sx={{ my: 2 }}>
                  0
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ChevronRight />}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  View emergencies
                </Button>
              </Paper>
            </Grid>

            {/* Recent Blood Requests Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Recent Blood Requests</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ textTransform: 'none', borderRadius: 1 }}
                  >
                    Create Request
                  </Button>
                </Box>
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No recent blood requests
                </Typography>
              </Paper>
            </Grid>

            {/* Upcoming Donation Drives Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Upcoming Donation Drives</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ textTransform: 'none', borderRadius: 1 }}
                  >
                    Create Drive
                  </Button>
                </Box>
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No upcoming donation drives
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
