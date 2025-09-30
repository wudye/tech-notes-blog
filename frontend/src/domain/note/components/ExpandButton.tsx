import React from 'react'
import { Button } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

interface ExpandButtonProps {
  isCollapsed: boolean
  toggleCollapsed: () => void
}

const ExpandButton: React.FC<ExpandButtonProps> = ({
  toggleCollapsed,
  isCollapsed,
}) => {
  return (
    <div>
      <Button
        variant="text"
        onClick={toggleCollapsed}
        endIcon={
          isCollapsed ? (
            <ExpandMore sx={{ color: 'text.secondary' }} />
          ) : (
            <ExpandLess sx={{ color: 'text.secondary' }} />
          )
        }
        sx={{
          fontSize: '0.875rem',
          color: 'text.secondary',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {isCollapsed ? '展开阅读全文' : '收起内容'}
      </Button>
    </div>
  )
}

export default ExpandButton