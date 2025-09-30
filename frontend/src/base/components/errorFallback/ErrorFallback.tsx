import React from 'react'
import { Button, Typography, Box, Paper } from '@mui/material'
import { Home, Refresh, ErrorOutline } from '@mui/icons-material'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <ErrorOutline
        sx={{
          fontSize: 64,
          color: 'error.main',
          mb: 3,
        }}
      />
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 1,
        }}
      >
        {error.name}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 4,
          maxWidth: 600,
        }}
      >
        {error.message}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => {
            window.location.href = '/'
          }}
          sx={{ px: 3 }}
        >
          返回首页
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={resetErrorBoundary}
          sx={{ px: 3 }}
        >
          重新尝试
        </Button>
      </Box>

      <Paper
        sx={{
          mt: 2,
          p: 3,
          maxWidth: 800,
          width: '100%',
          backgroundColor: 'grey.50',
          border: 1,
          borderColor: 'grey.200',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: 'text.secondary',
            mb: 2,
          }}
        >
          错误栈信息：
        </Typography>
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-words',
            fontSize: '0.875rem',
            color: 'text.secondary',
            fontFamily: 'monospace',
            overflow: 'auto',
            maxHeight: 300,
            m: 0,
          }}
        >
          {error.stack}
        </Box>
      </Paper>
    </Box>
  )
}

export default ErrorFallback