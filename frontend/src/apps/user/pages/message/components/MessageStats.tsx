import React from 'react'
import { Badge, Tooltip, Box, Typography } from '@mui/material'
import { Favorite, Message, Notifications } from '@mui/icons-material'

interface MessageStatsProps {
  totalMessages: number
  unreadCount: number
  likeCount: number
  commentCount: number
  systemCount: number
  unreadLikeCount: number
  unreadCommentCount: number
  unreadSystemCount: number
}

const MessageStats: React.FC<MessageStatsProps> = ({
  totalMessages,
  unreadCount,
  likeCount,
  commentCount,
  systemCount,
  unreadLikeCount,
  unreadCommentCount,
  unreadSystemCount,
}) => {
  const stats = [
    {
      label: '点赞',
      icon: <Favorite sx={{ color: 'error.main' }} />,
      count: likeCount,
      unread: unreadLikeCount,
    },
    {
      label: '评论',
      icon: <Message sx={{ color: 'primary.main' }} />,
      count: commentCount,
      unread: unreadCommentCount,
    },
    {
      label: '系统',
      icon: <Notifications sx={{ color: 'success.main' }} />,
      count: systemCount,
      unread: unreadSystemCount,
    },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 1, sm: 2 },
        fontSize: '0.875rem',
        color: 'text.secondary',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          共 {totalMessages} 条消息
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'primary.main',
          }}
        >
          {unreadCount} 条未读
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {stats.map((stat) => (
          <Tooltip
            key={stat.label}
            title={`${stat.label}消息: ${stat.count}条 (${stat.unread}条未读)`}
            arrow
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                transition: 'color 0.2s',
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              {stat.icon}
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', sm: 'inline' },
                  color: 'inherit',
                }}
              >
                {stat.count}
              </Typography>
              {stat.unread > 0 && (
                <Badge
                  badgeContent={stat.unread}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.625rem',
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                />
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}

export default MessageStats