import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Lock, Mail, Scan, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const activityData = [
  { date: '2024-05-10', scans: 12, logins: 45, alerts: 3 },
  { date: '2024-05-11', scans: 18, logins: 52, alerts: 5 },
  { date: '2024-05-12', scans: 15, logins: 48, alerts: 2 },
  { date: '2024-05-13', scans: 22, logins: 61, alerts: 7 },
  { date: '2024-05-14', scans: 19, logins: 55, alerts: 4 },
  { date: '2024-05-15', scans: 25, logins: 68, alerts: 6 },
  { date: '2024-05-16', scans: 21, logins: 59, alerts: 3 },
];

const threatData = [
  { name: 'Safe', value: 245, color: '#4caf50' },
  { name: 'Low Risk', value: 89, color: '#ff9800' },
  { name: 'Medium Risk', value: 34, color: '#ff5722' },
  { name: 'High Risk', value: 12, color: '#f44336' },
];

const recentScans = [
  { module: 'Vulnerability Scanner', target: '192.168.1.1', status: 'Safe', time: '2 min ago', severity: 'low' },
  { module: 'Phishing Detector', target: 'suspicious-email.eml', status: 'Phishing', time: '15 min ago', severity: 'high' },
  { module: 'Password Analyzer', target: 'User12345', status: 'Weak', time: '1 hour ago', severity: 'medium' },
  { module: 'Vulnerability Scanner', target: '10.0.0.5', status: 'Vulnerable', time: '2 hours ago', severity: 'high' },
  { module: 'Phishing Detector', target: 'newsletter.eml', status: 'Safe', time: '3 hours ago', severity: 'low' },
];

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Security Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Scans</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>1,247</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>+12% from last week</Typography>
                </Box>
                <Scan size={48} opacity={0.3} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Threats Detected</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>46</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>-8% from last week</Typography>
                </Box>
                <AlertTriangle size={48} opacity={0.3} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>387</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>+23% from last week</Typography>
                </Box>
                <Activity size={48} opacity={0.3} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Security Score</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>87%</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Good security posture</Typography>
                </Box>
                <Shield size={48} opacity={0.3} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Activity Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="scans" stroke="#667eea" strokeWidth={2} />
                  <Line type="monotone" dataKey="logins" stroke="#4facfe" strokeWidth={2} />
                  <Line type="monotone" dataKey="alerts" stroke="#f5576c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Threat Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Scan Activity</Typography>
          <Box sx={{ mt: 2 }}>
            {recentScans.map((scan, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: scan.severity === 'high' ? 'error.light' : scan.severity === 'medium' ? 'warning.light' : 'success.light'
                    }}
                  >
                    {scan.module.includes('Password') && <Lock size={20} />}
                    {scan.module.includes('Vulnerability') && <Scan size={20} />}
                    {scan.module.includes('Phishing') && <Mail size={20} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{scan.module}</Typography>
                    <Typography variant="caption" color="text.secondary">{scan.target}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: scan.status === 'Safe' ? 'success.light' : 'error.light',
                      color: scan.status === 'Safe' ? 'success.dark' : 'error.dark'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{scan.status}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
                    {scan.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
