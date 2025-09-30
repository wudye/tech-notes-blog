import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import {
  createComment,
  deleteComment,
  getComments,
} from '@/request/api/comment'
import type { NoteComment } from '@/domain/note/types'
import { useUser } from '@/domain/user/hooks/useUser'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface NoteCommentsProps {
  noteId: number
}

export function NoteComments({ noteId }: NoteCommentsProps) {
  const [comments, setComments] = useState<NoteComment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser } = useUser()

  // 加载评论列表
  const loadComments = async () => {
    try {
      const { data } = await getComments(noteId)
      setComments(data)
    } catch (error) {
      toast.error('加载评论失败')
    }
  }

  // 提交评论
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.warning('请先登录')
      return
    }

    if (!content.trim()) {
      toast.warning('请输入评论内容')
      return
    }

    setLoading(true)
    try {
      await createComment(noteId, content.trim())
      toast.success('评论成功')
      setContent('')
      loadComments()
    } catch (error) {
      toast.error('评论失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除评论
  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      toast.success('删除成功')
      loadComments()
    } catch (error) {
      toast.error('删除失败')
    }
  }

  useEffect(() => {
    loadComments()
  }, [noteId])

  return (
    <Box className="note-comments">
      <Box className="comment-input" sx={{ mb: 2 }}>
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的评论..."
          multiline
          minRows={2}
          maxRows={6}
          fullWidth
          variant="outlined"
          inputProps={{ maxLength: 500 }}
          helperText={`${content.length}/500`}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '发表中...' : '发表评论'}
          </Button>
        </Box>
      </Box>

      <List sx={{ width: '100%' }}>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                comment.userId === currentUser?.userId && (
                  <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(comment.id)}
                    size="small"
                  >
                    删除
                  </Button>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={currentUser?.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {currentUser?.username}
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
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}