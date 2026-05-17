import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Container } from '@mui/material';
import { Shield, Lock, Scan, Mail, BarChart3, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import PhishingDetector from './components/PhishingDetector';
import SecureLogin from './components/SecureLogin';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

const drawerWidth = 280;

type Page = 'dashboard' | 'password' | 'vulnerability' | 'phishing' | 'login';

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: BarChart3 },
  { id: 'password' as Page, label: 'Password Analyzer', icon: Lock },
  { id: 'vulnerability' as Page, label: 'Vulnerability Scanner', icon: Scan },
  { id: 'phishing' as Page, label: 'Phishing Detector', icon: Mail },
  { id: 'login' as Page, label: 'Secure Login', icon: Shield },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Shield size={32} style={{ marginRight: 12 }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          CyberSec Suite
        </Typography>
      </Toolbar>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentPage === item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: currentPage === item.id ? 'white' : 'inherit' }}>
                  <Icon size={22} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: { sm: 'none' },
          }}
        >
          <Toolbar>
            <Menu onClick={handleDrawerToggle} style={{ marginRight: 16 }} />
            <Typography variant="h6" noWrap component="div">
              Cybersecurity Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
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
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: 'background.default',
            overflow: 'auto',
          }}
        >
          <Toolbar sx={{ display: { sm: 'none' } }} />
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'password' && <PasswordAnalyzer />}
          {currentPage === 'vulnerability' && <VulnerabilityScanner />}
          {currentPage === 'phishing' && <PhishingDetector />}
          {currentPage === 'login' && <SecureLogin />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}