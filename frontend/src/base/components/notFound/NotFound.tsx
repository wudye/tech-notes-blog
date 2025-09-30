import React from 'react'
import { Button, Typography, Box } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

/**
 * 404 Not Found 组件
 */
const NotFound: React.FC = () => {
  function goBack() {
    window.history.back()
  }

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
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '6rem',
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 2,
        }}
      >
        404
      </Typography>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 1,
        }}
      >
        Not Found
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 4,
          maxWidth: 400,
        }}
      >
        访问页面不存在
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        onClick={goBack}
        sx={{
          px: 3,
          py: 1,
        }}
      >
        返回上一页
      </Button>
    </Box>
  )
}

export default NotFound