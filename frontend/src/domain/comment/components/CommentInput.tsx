import React, { useState } from 'react'
import {
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  Chip,
} from '@mui/material'
import { Send, Close } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useUser } from '@/domain/user/hooks/useUser.ts'
import type { Comment } from '@/domain/comment/types.ts'

interface CommentInputProps {
  noteId: number
  parentId?: number
  onComment: (
    noteId: number,
    parentId: number,
    content: string,
  ) => Promise<void>
  onCancel?: () => void
  replyTo?: Comment | null
}

export const CommentInput: React.FC<CommentInputProps> = ({
  noteId,
  parentId,
  onComment,
  onCancel,
  replyTo,
}) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useUser()

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.warning('请填写评论内容')
      return
    }
    setLoading(true)
    try {
      await onComment(noteId, parentId || 0, content)
      setContent('')
    } catch {
      toast.error('评论发布失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit()
    }
  }

  if (!user.userId) {
    return (
      <Box
        sx={{
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'grey.300',
          bgcolor: 'grey.50',
          p: 3,
          textAlign: 'center',
          color: 'text.disabled',
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          💬
        </Typography>
        <Typography variant="body2">
          请先登录后再发表评论
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 回复提示 */}
      {replyTo && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 2,
            border: 1,
            borderColor: 'info.light',
            bgcolor: 'info.lighter',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography variant="body2" sx={{ color: 'info.main' }}>
              回复
            </Typography>
            <Avatar
              src={replyTo.author?.avatarUrl}
              sx={{ width: 24, height: 24 }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: 'info.main' }}
            >
              @{replyTo.author?.username}
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={onCancel}
            startIcon={<Close />}
            sx={{ color: 'info.main' }}
          >
            取消
          </Button>
        </Box>
      )}

      {/* 输入区域 */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar
          src={user.avatarUrl}
          sx={{ width: 40, height: 40, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              replyTo
                ? `回复 @${replyTo.author?.username}...`
                : '写下你的评论...'
            }
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 500 }}
            helperText={`${content.length}/500`}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {replyTo ? 'Ctrl+Enter 发送回复' : 'Ctrl+Enter 发送评论'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {replyTo && (
                <Button onClick={onCancel} disabled={loading} variant="outlined">
                  取消
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={<Send />}
              >
                {replyTo ? '回复' : '发表评论'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CommentInput