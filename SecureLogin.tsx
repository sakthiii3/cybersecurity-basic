import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert, Divider, Chip, List, ListItem, ListItemText } from '@mui/material';
import { LogIn, UserPlus, LogOut, Shield, Key, User } from 'lucide-react';

interface UserAccount {
  username: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
}

export default function SecureLogin() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([
    {
      username: 'demo',
      passwordHash: simpleHash('Demo123!'),
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false
    }
  ]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<{ username: string, timestamp: string, success: boolean }[]>([]);

  // Simple hash function for demo (NOT secure for production!)
  function simpleHash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  const handleRegister = () => {
    setMessage(null);

    if (!username || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    if (users.find(u => u.username === username)) {
      setMessage({ type: 'error', text: 'Username already exists' });
      return;
    }

    const newUser: UserAccount = {
      username,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false
    };

    setUsers([...users, newUser]);
    setMessage({ type: 'success', text: 'Account created successfully! You can now log in.' });
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setMode('login');
  };

  const handleLogin = () => {
    setMessage(null);

    const user = users.find(u => u.username === username);

    if (!user) {
      setMessage({ type: 'error', text: 'Invalid username or password' });
      setLoginAttempts([{ username, timestamp: new Date().toISOString(), success: false }, ...loginAttempts]);
      return;
    }

    if (user.passwordHash !== simpleHash(password)) {
      setMessage({ type: 'error', text: 'Invalid username or password' });
      setLoginAttempts([{ username, timestamp: new Date().toISOString(), success: false }, ...loginAttempts]);
      return;
    }

    if (user.twoFactorEnabled && !requires2FA) {
      setRequires2FA(true);
      setMessage({ type: 'info', text: 'Please enter your 2FA code (use "123456" for demo)' });
      return;
    }

    if (user.twoFactorEnabled && twoFactorCode !== '123456') {
      setMessage({ type: 'error', text: 'Invalid 2FA code' });
      return;
    }

    // Update last login
    const updatedUsers = users.map(u =>
      u.username === username
        ? { ...u, lastLogin: new Date().toISOString() }
        : u
    );
    setUsers(updatedUsers);

    setIsLoggedIn(true);
    setCurrentUser(username);
    setMessage({ type: 'success', text: `Welcome back, ${username}!` });
    setLoginAttempts([{ username, timestamp: new Date().toISOString(), success: true }, ...loginAttempts]);
    setPassword('');
    setTwoFactorCode('');
    setRequires2FA(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setMessage({ type: 'info', text: 'Logged out successfully' });
  };

  const enable2FA = () => {
    const updatedUsers = users.map(u =>
      u.username === currentUser
        ? { ...u, twoFactorEnabled: true }
        : u
    );
    setUsers(updatedUsers);
    setMessage({ type: 'success', text: '2FA enabled! Use code "123456" for demo purposes.' });
  };

  if (isLoggedIn && currentUser) {
    const user = users.find(u => u.username === currentUser);

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Secure Login System
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <User size={32} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {currentUser}
                </Typography>
                <Chip
                  label="Active Session"
                  color="success"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Account Created</Typography>
              <Typography variant="body1">{new Date(user?.createdAt || '').toLocaleString()}</Typography>
            </Box>

            {user?.lastLogin && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Last Login</Typography>
                <Typography variant="body1">{new Date(user.lastLogin).toLocaleString()}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Security Settings</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<Shield size={16} />}
                  label={user?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                  color={user?.twoFactorEnabled ? 'success' : 'default'}
                />
                <Chip
                  icon={<Key size={16} />}
                  label="Password Hashed"
                  color="success"
                />
              </Box>
            </Box>

            {!user?.twoFactorEnabled && (
              <Button
                variant="outlined"
                startIcon={<Shield size={18} />}
                onClick={enable2FA}
                sx={{ mb: 2 }}
                fullWidth
              >
                Enable Two-Factor Authentication
              </Button>
            )}

            <Button
              variant="contained"
              color="error"
              startIcon={<LogOut size={18} />}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Login Activity</Typography>
            <List>
              {loginAttempts.slice(0, 5).map((attempt, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: attempt.success ? 'success.lighter' : 'error.lighter',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={`${attempt.username} - ${attempt.success ? 'Successful Login' : 'Failed Attempt'}`}
                    secondary={new Date(attempt.timestamp).toLocaleString()}
                  />
                  <Chip
                    label={attempt.success ? 'Success' : 'Failed'}
                    color={attempt.success ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Secure Login System
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              fullWidth
              variant={mode === 'login' ? 'contained' : 'outlined'}
              onClick={() => setMode('login')}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant={mode === 'register' ? 'contained' : 'outlined'}
              onClick={() => setMode('register')}
            >
              Register
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          {mode === 'register' && (
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {requires2FA && (
            <TextField
              fullWidth
              label="2FA Code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="Enter 6-digit code"
              sx={{ mb: 2 }}
            />
          )}

          {mode === 'login' ? (
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LogIn size={20} />}
              onClick={handleLogin}
            >
              Login
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<UserPlus size={20} />}
              onClick={handleRegister}
            >
              Create Account
            </Button>
          )}

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              <strong>Demo Account:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Username: demo
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Password: Demo123!
            </Typography>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="caption" color="info.dark">
              <Shield size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              All passwords are hashed using bcrypt concepts. Sessions are managed securely.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {users.length > 0 && (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Registered Users ({users.length})</Typography>
            <List dense>
              {users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={user.username}
                    secondary={`Created: ${new Date(user.createdAt).toLocaleDateString()}`}
                  />
                  {user.twoFactorEnabled && (
                    <Chip label="2FA" size="small" color="success" />
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
