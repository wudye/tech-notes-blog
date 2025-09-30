import React from 'react'
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Typography,
} from '@mui/material'
import { Favorite, FavoriteBorder, Reply } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { Comment } from '@/domain/comment/types.ts'

interface CommentItemProps {
  comment: Comment
  onReply: () => void
  onLike: () => void
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
}) => {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="text"
            size="small"
            startIcon={
              comment.userActions?.isLiked ? (
                <Favorite sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorder />
              )
            }
            onClick={onLike}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {comment.likeCount || 0} 赞
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<Reply />}
            onClick={onReply}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            回复
          </Button>
        </Box>
      }
    >
      <ListItemAvatar>
        <Avatar src={comment.author?.avatarUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {comment.author?.username}
          </Typography>
        }
        secondary={
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {comment.content}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  )
}

export default CommentItem