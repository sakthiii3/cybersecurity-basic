import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Chip, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
import { Upload, Mail, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface AnalysisResult {
  prediction: 'Safe' | 'Phishing';
  confidence: number;
  urls: string[];
  suspiciousPatterns: string[];
  features: {
    name: string;
    value: string;
    risk: 'low' | 'medium' | 'high';
  }[];
}

export default function PhishingDetector() {
  const [emailContent, setEmailContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  const analyzeEmail = async () => {
    setAnalyzing(true);
    setResult(null);

    // Simulate ML analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const urls = extractUrls(emailContent);
    const suspiciousKeywords = ['urgent', 'verify', 'account', 'suspended', 'click here', 'confirm', 'password', 'security alert'];
    const suspiciousPatterns: string[] = [];

    const lowerContent = emailContent.toLowerCase();
    suspiciousKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        suspiciousPatterns.push(keyword);
      }
    });

    // Simple heuristic for demo
    const hasSuspiciousUrls = urls.some(url =>
      url.includes('bit.ly') ||
      url.includes('tinyurl') ||
      url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
    );

    const suspicionScore =
      (suspiciousPatterns.length * 10) +
      (urls.length > 3 ? 20 : 0) +
      (hasSuspiciousUrls ? 30 : 0) +
      (emailContent.includes('!') ? 10 : 0);

    const isPhishing = suspicionScore > 40;
    const confidence = Math.min(95, 60 + suspicionScore);

    const features = [
      { name: 'Suspicious Keywords', value: `${suspiciousPatterns.length} found`, risk: suspiciousPatterns.length > 3 ? 'high' : suspiciousPatterns.length > 0 ? 'medium' : 'low' },
      { name: 'URL Count', value: urls.length.toString(), risk: urls.length > 3 ? 'high' : urls.length > 1 ? 'medium' : 'low' },
      { name: 'Shortened URLs', value: hasSuspiciousUrls ? 'Yes' : 'No', risk: hasSuspiciousUrls ? 'high' : 'low' },
      { name: 'Urgency Indicators', value: lowerContent.includes('urgent') || lowerContent.includes('immediately') ? 'Yes' : 'No', risk: lowerContent.includes('urgent') ? 'high' : 'low' },
      { name: 'Grammar Quality', value: emailContent.length > 50 ? 'Normal' : 'Short', risk: 'low' },
    ];

    setResult({
      prediction: isPhishing ? 'Phishing' : 'Safe',
      confidence: confidence,
      urls: urls,
      suspiciousPatterns: suspiciousPatterns,
      features: features
    });

    setAnalyzing(false);
  };

  const samplePhishingEmail = `Dear Valued Customer,

Your account has been SUSPENDED due to suspicious activity!

To verify your identity and restore access, please click here immediately:
http://secure-bank-verify.xyz/confirm?id=12345

You must confirm within 24 hours or your account will be permanently closed.

Click here to verify now: http://bit.ly/verify123

Thank you,
Security Team`;

  const sampleSafeEmail = `Hi there,

Hope you're doing well! Just wanted to share our latest blog post about cybersecurity best practices.

You can read it on our official website at https://company.com/blog/security-tips

Let me know if you have any questions.

Best regards,
Marketing Team`;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Phishing Email Detection
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Email Content</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste email content below or use a sample email
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEmailContent(samplePhishingEmail)}
            >
              Load Phishing Sample
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEmailContent(sampleSafeEmail)}
            >
              Load Safe Sample
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEmailContent('')}
            >
              Clear
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={10}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste email content here..."
            variant="outlined"
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />

          <Button
            variant="contained"
            onClick={analyzeEmail}
            disabled={!emailContent || analyzing}
            startIcon={analyzing ? null : <Upload size={20} />}
            fullWidth
          >
            {analyzing ? 'Analyzing with ML Model...' : 'Analyze Email'}
          </Button>
        </CardContent>
      </Card>

      {analyzing && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>Running ML Classification...</Typography>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Extracting features, analyzing URLs, checking patterns...
            </Typography>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Alert
            severity={result.prediction === 'Phishing' ? 'error' : 'success'}
            sx={{ mb: 3 }}
            icon={result.prediction === 'Phishing' ? <AlertTriangle /> : <CheckCircle />}
          >
            <Typography variant="h6">
              Prediction: {result.prediction}
            </Typography>
            <Typography variant="body2">
              Confidence: {result.confidence.toFixed(1)}%
            </Typography>
          </Alert>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Model Confidence</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {result.prediction === 'Phishing' ? 'Phishing Probability' : 'Safe Probability'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {result.confidence.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={result.confidence}
                  color={result.prediction === 'Phishing' ? 'error' : 'success'}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Feature Analysis</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feature</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Risk Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell>{feature.name}</TableCell>
                        <TableCell>{feature.value}</TableCell>
                        <TableCell>
                          <Chip
                            label={feature.risk.toUpperCase()}
                            size="small"
                            color={
                              feature.risk === 'high' ? 'error' :
                              feature.risk === 'medium' ? 'warning' : 'success'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {result.urls.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Extracted URLs ({result.urls.length})</Typography>
                {result.urls.map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      mb: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                  >
                    <ExternalLink size={16} />
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.875rem', flex: 1, wordBreak: 'break-all' }}>
                      {url}
                    </Typography>
                    <Chip
                      label={url.includes('bit.ly') || url.includes('tinyurl') ? 'Suspicious' : 'Normal'}
                      size="small"
                      color={url.includes('bit.ly') || url.includes('tinyurl') ? 'warning' : 'default'}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {result.suspiciousPatterns.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Suspicious Patterns Detected</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {result.suspiciousPatterns.map((pattern, index) => (
                    <Chip
                      key={index}
                      label={pattern}
                      color="warning"
                      icon={<AlertTriangle size={16} />}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
