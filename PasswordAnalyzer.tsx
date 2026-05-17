import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, LinearProgress, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Check, X, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface PasswordCheck {
  label: string;
  passed: boolean;
}

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzePassword = (pwd: string) => {
    const checks: PasswordCheck[] = [
      { label: 'At least 8 characters', passed: pwd.length >= 8 },
      { label: 'Contains uppercase letter', passed: /[A-Z]/.test(pwd) },
      { label: 'Contains lowercase letter', passed: /[a-z]/.test(pwd) },
      { label: 'Contains number', passed: /[0-9]/.test(pwd) },
      { label: 'Contains special character', passed: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
      { label: 'Not in password history', passed: !passwordHistory.includes(pwd) },
    ];
    return checks;
  };

  const calculateStrength = (pwd: string) => {
    const checks = analyzePassword(pwd);
    const passedCount = checks.filter(c => c.passed).length;
    return (passedCount / checks.length) * 100;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 33) return { label: 'Weak', color: 'error' as const };
    if (strength < 66) return { label: 'Medium', color: 'warning' as const };
    return { label: 'Strong', color: 'success' as const };
  };

  const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + symbols;
    let newPassword = '';

    // Ensure at least one of each type
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill rest randomly
    for (let i = newPassword.length; i < 16; i++) {
      newPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setSuggestions([newPassword, ...suggestions.slice(0, 2)]);
  };

  const addToHistory = () => {
    if (password && !passwordHistory.includes(password)) {
      setPasswordHistory([password, ...passwordHistory.slice(0, 4)]);
    }
  };

  const checks = analyzePassword(password);
  const strength = calculateStrength(password);
  const strengthInfo = getStrengthLabel(strength);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Password Strength Analyzer
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Enter Password</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to analyze"
              variant="outlined"
            />
            <Button
              variant="outlined"
              onClick={() => setShowPassword(!showPassword)}
              sx={{ minWidth: 56 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
            <Button
              variant="contained"
              onClick={addToHistory}
              disabled={!password}
            >
              Analyze
            </Button>
          </Box>

          {password && (
            <>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Password Strength</Typography>
                  <Chip
                    label={strengthInfo.label}
                    color={strengthInfo.color}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={strength}
                  color={strengthInfo.color}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, mb: 1 }}>
                Security Requirements
              </Typography>
              <List dense>
                {checks.map((check, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {check.passed ? (
                        <Check size={20} color="#4caf50" />
                      ) : (
                        <X size={20} color="#f44336" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={check.label}
                      primaryTypographyProps={{
                        color: check.passed ? 'success.main' : 'error.main'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Generate Strong Password</Typography>
            <Button
              variant="contained"
              startIcon={<RefreshCw size={18} />}
              onClick={generateStrongPassword}
            >
              Generate
            </Button>
          </Box>

          {suggestions.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Suggested Passwords:
              </Typography>
              {suggestions.map((suggestion, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    mb: 1,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  }}
                >
                  <Typography sx={{ fontFamily: 'monospace' }}>{suggestion}</Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setPassword(suggestion);
                      navigator.clipboard.writeText(suggestion);
                    }}
                  >
                    Use
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {passwordHistory.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Password History</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Previously analyzed passwords (for demonstration only - never store real passwords!)
            </Typography>
            {passwordHistory.map((pwd, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  bgcolor: 'background.default',
                  borderRadius: 1
                }}
              >
                <Typography sx={{ fontFamily: 'monospace' }}>{'*'.repeat(pwd.length)}</Typography>
                <Chip
                  label={getStrengthLabel(calculateStrength(pwd)).label}
                  color={getStrengthLabel(calculateStrength(pwd)).color}
                  size="small"
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
