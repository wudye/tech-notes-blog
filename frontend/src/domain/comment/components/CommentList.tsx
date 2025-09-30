import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Pagination,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Favorite, FavoriteBorder, Reply } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentInput from './CommentInput.tsx'
import type { Comment } from '@/domain/comment/types.ts'
import { useComment } from '@/domain/comment/hooks/useComment.ts'

interface CommentListProps {
  noteId: number
  onCommentCountChange?: () => void
}

const CommentList: React.FC<CommentListProps> = ({ noteId }) => {
  /**
   * 查询评论参数
   */
  const [commentQueryParams, setCommentQueryParams] = useState({
    noteId,
    page: 1,
    pageSize: 10,
  })

  const { comments, loading, createComment, likeComment, pagination } =
    useComment(commentQueryParams)

  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [showReplies, setShowReplies] = useState<Set<number>>(new Set())

  const handleReply = (comment: Comment) => {
    setReplyTo(comment)
  }

  const toggleReplies = (commentId: number) => {
    const newShowReplies = new Set(showReplies)
    if (newShowReplies.has(commentId)) {
      newShowReplies.delete(commentId)
    } else {
      newShowReplies.add(commentId)
    }
    setShowReplies(newShowReplies)
  }

  // 收集所有属于该主评论的回复（扁平化）
  function flattenReplies(
    comment: Comment,
  ): Array<{ reply: Comment; parent: Comment }> {
    const result: Array<{ reply: Comment; parent: Comment }> = []

    function dfs(replies: Comment[], parent: Comment) {
      for (const reply of replies || []) {
        result.push({ reply, parent })
        if (reply.replies && reply.replies.length > 0) {
          dfs(reply.replies, reply)
        }
      }
    }

    if (comment.replies && comment.replies.length > 0) {
      dfs(comment.replies, comment)
    }
    return result
  }

  // 渲染单个回复项
  const renderReplyItem = (reply: Comment, parentComment: Comment) => {
    return (
      <Box
        key={reply.commentId}
        sx={{
          mb: 1.5,
          ml: 4,
          borderRadius: 2,
          p: 1.5,
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: 'grey.50',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Avatar
            src={reply.author?.avatarUrl}
            sx={{
              width: 28,
              height: 28,
              mt: 0.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {reply.author?.username}
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                回复
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: 'primary.main' }}
              >
                @{parentComment.author?.username}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              {reply.content}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption">
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={
                  reply.userActions?.isLiked ? (
                    <Favorite sx={{ color: 'error.main', fontSize: 16 }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 16 }} />
                  )
                }
                onClick={() => likeComment(reply.commentId)}
                sx={{
                  minWidth: 'auto',
                  p: 0.5,
                  textTransform: 'none',
                  color: 'text.disabled',
                  fontSize: '0.75rem',
                }}
              >
                {reply.likeCount || 0}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => handleReply(reply)}
                sx={{
                  minWidth: 'auto',
                  p: 0.5,
                  textTransform: 'none',
                  color: 'text.disabled',
                  fontSize: '0.75rem',
                }}
              >
                回复
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  // 渲染一级评论
  const renderMainComment = (comment: Comment) => {
    // 扁平化所有属于一级评论的回复
    const flatReplies = flattenReplies(comment)
    const hasReplies = flatReplies.length > 0
    const isRepliesVisible = showReplies.has(comment.commentId)

    return (
      <Box
        key={comment.commentId}
        sx={{
          borderRadius: 2,
          borderBottom: 1,
          borderColor: 'grey.100',
          p: 1.5,
          transition: 'background-color 0.2s',
          '&:last-child': {
            borderBottom: 0,
          },
          '&:hover': {
            bgcolor: 'grey.50',
          },
        }}
      >
        {/* 主评论 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Avatar
            src={comment.author?.avatarUrl}
            sx={{ flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: 'text.primary' }}
              >
                {comment.author?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, color: 'text.secondary' }}
            >
              {comment.content}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="text"
                startIcon={
                  comment.userActions?.isLiked ? (
                    <Favorite sx={{ color: 'error.main' }} />
                  ) : (
                    <FavoriteBorder />
                  )
                }
                onClick={() => likeComment(comment.commentId)}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  minWidth: 'auto',
                  px: 1,
                }}
              >
                {comment.likeCount || 0}
              </Button>
              <Button
                variant="text"
                startIcon={<Reply />}
                onClick={() => handleReply(comment)}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  minWidth: 'auto',
                  px: 1,
                }}
              >
                回复
              </Button>
              {hasReplies && (
                <Button
                  variant="text"
                  onClick={() => toggleReplies(comment.commentId)}
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  }}
                >
                  {isRepliesVisible
                    ? '收起回复'
                    : `查看回复 (${flatReplies.length})`}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* 回复区域 */}
        {hasReplies && isRepliesVisible && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {flatReplies.map(({ reply, parent }) =>
                renderReplyItem(reply, parent),
              )}
            </Box>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* 评论输入框 */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}
        >
          发表评论
        </Typography>
        <CommentInput
          noteId={noteId}
          parentId={replyTo?.commentId}
          replyTo={replyTo}
          onComment={async (noteId, parentId, content) => {
            await createComment({ noteId, parentId, content })
            setReplyTo(null)
          }}
          onCancel={() => setReplyTo(null)}
        />
      </Box>

      {/* 评论列表 */}
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}
        >
          评论 ({comments?.length || 0})
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : comments && comments.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {comments.map(renderMainComment)}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 8,
              color: 'text.disabled',
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              💬
            </Typography>
            <Typography variant="body2">
              暂无评论，快来发表第一条评论吧！
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={
            pagination ? Math.ceil(pagination.total / commentQueryParams.pageSize) : 0
          }
          page={commentQueryParams.page}
          onChange={(event, page) => {
            setCommentQueryParams((prev) => ({
              ...prev,
              page,
            }))
          }}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}

export default CommentList