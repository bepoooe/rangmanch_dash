import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Create as CreateIcon, AutoAwesome as AutoAwesomeIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContentGenerator: React.FC = () => {
  const theme = useTheme();
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = () => {
    setLoading(true);
    setError('');
    setGeneratedContent('');
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setGeneratedContent('Generated content goes here...');
    }, 2000);
  };

  return (
    <Card
      sx={{
        background: 'rgba(15, 39, 68, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        animation: `${slideUp} 0.6s ease-out forwards`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)',
          opacity: 0.5,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover::before': {
          opacity: 0.8,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${theme.palette.primary.main}15`,
              color: theme.palette.primary.main,
              mr: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            }}
          >
            <CreateIcon />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart Content Generator
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel 
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Content Type
              </InputLabel>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as string)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiSelect-icon': {
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&.Mui-focused .MuiSelect-icon': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <MenuItem value="blog">Blog Post</MenuItem>
                <MenuItem value="social">Social Media Post</MenuItem>
                <MenuItem value="video">Video Script</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel 
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Tone
              </InputLabel>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value as string)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiSelect-icon': {
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&.Mui-focused .MuiSelect-icon': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="humorous">Humorous</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            multiline
            rows={4}
            placeholder="Enter your content topic or idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!prompt || loading}
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
              boxShadow: '0 4px 12px rgba(157, 78, 221, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(157, 78, 221, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AutoAwesomeIcon />
              )
            }
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>

          {error && (
            <Alert 
              severity="error"
              sx={{
                bgcolor: 'rgba(255, 72, 66, 0.16)',
                color: theme.palette.error.light,
                border: '1px solid rgba(255, 72, 66, 0.3)',
                '& .MuiAlert-icon': {
                  color: theme.palette.error.light,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {generatedContent && (
            <Box 
              sx={{ 
                mt: 2,
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)',
                  opacity: 0.5,
                },
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {generatedContent}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  // You might want to add a toast notification here
                }}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default ContentGenerator;