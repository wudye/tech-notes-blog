import React from 'react'
import { NoteWithRelations } from '../types/serviceTypes.ts'
import { Link } from 'react-router-dom'
import { USER_HOME } from '../../../apps/user/router/config.ts'
import { Avatar, Box, Typography } from '@mui/material'
import { Person } from '@mui/icons-material'
import { TimeAgo } from '../../../base/components'

interface AuthorCardProps {
  note?: NoteWithRelations
}

/**
 * NoteItem 的笔记作者信息模块
 */
const AuthorCard: React.FC<AuthorCardProps> = ({ note }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Link to={`${USER_HOME}/${note?.author.userId}`}>
        <Avatar
          src={note?.author.avatarUrl}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            bgcolor: !note?.author.avatarUrl ? 'warning.main' : 'transparent',
            color: !note?.author.avatarUrl ? 'white' : 'inherit',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
            },
          }}
        >
          <Person />
        </Avatar>
      </Link>
      
      <Box sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
        <Link 
          to={`${USER_HOME}/${note?.author.userId}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            {note?.author.username}
          </Typography>
        </Link>
        
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          <TimeAgo datetime={note?.createdAt} />
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthorCard