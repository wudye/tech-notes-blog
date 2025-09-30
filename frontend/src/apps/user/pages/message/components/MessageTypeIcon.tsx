import React from 'react'
import { Box } from '@mui/material'
import { Message, Favorite, Notifications } from '@mui/icons-material'

interface MessageTypeIconProps {
  type: number
  size?: number
  className?: string
}

const MessageTypeIcon: React.FC<MessageTypeIconProps> = ({
  type,
  size = 16,
  className = '',
}) => {
  const getIcon = () => {
    const iconProps = { sx: { fontSize: size } }
    
    switch (type) {
      case 1: // LIKE
        return <Favorite {...iconProps} sx={{ ...iconProps.sx, color: 'error.main' }} />
      case 2: // COMMENT
        return <Message {...iconProps} sx={{ ...iconProps.sx, color: 'primary.main' }} />
      case 3: // SYSTEM
        return <Notifications {...iconProps} sx={{ ...iconProps.sx, color: 'success.main' }} />
      default:
        return <Notifications {...iconProps} sx={{ ...iconProps.sx, color: 'text.disabled' }} />
    }
  }

  return (
    <Box
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {getIcon()}
    </Box>
  )
}

export default MessageTypeIcon