import React from 'react'
import { Button, Box, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'

interface CollectModalFooterProps {
  onCreate: () => void
  onConfirm: () => void
}

const CollectModalFooter: React.FC<CollectModalFooterProps> = ({
  onCreate,
  onConfirm,
}) => {
  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Button
        variant="text"
        startIcon={<Add />}
        onClick={onCreate}
        sx={{
          color: 'primary.main',
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            color: 'primary.dark',
            backgroundColor: 'primary.lighter',
          },
        }}
      >
        创建收藏夹
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        sx={{
          textTransform: 'none',
        }}
      >
        确定
      </Button>
    </Box>
  )
}

export default CollectModalFooter