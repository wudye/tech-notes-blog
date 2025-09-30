import React, { useState, useEffect } from 'react'
import { Box, Button, Drawer, IconButton } from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  Comment,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import type { NoteWithRelations } from '../types/serviceTypes.ts'
import { useNoteLike } from '../../noteLike'
import { useApp } from '../../../base/hooks'
import CommentList from '../../../domain/comment/components/CommentList'

interface OptionsCardProps {
  note?: NoteWithRelations
  setNoteLikeStatus?: (noteId: number, isLiked: boolean) => void
  toggleIsModalOpen: () => void
  handleCollectionQueryParams: (noteId: number) => void
  handleSelectedNoteId: (noteId: number) => void
  onRefresh?: () => void
}

const OptionsCard: React.FC<OptionsCardProps> = ({
  note,
  setNoteLikeStatus,
  toggleIsModalOpen,
  handleCollectionQueryParams,
  handleSelectedNoteId,
  onRefresh,
}) => {
  const { like, unLike } = useNoteLike()
  const [commentDrawerVisible, setCommentDrawerVisible] = useState(false)
  const [localCommentCount, setLocalCommentCount] = useState(0)
  const app = useApp()
  let likeLoading = false

  useEffect(() => {
    if (note?.commentCount !== undefined) {
      setLocalCommentCount(note.commentCount)
    }
  }, [note?.commentCount])

  /**
   * 点赞按钮点击处理函数
   */
  async function likeButtonClickHandle() {
    if (!app.isLogin) {
      toast.info('请先登录')
      return
    }

    if (!setNoteLikeStatus || !note || !note.userActions) return

    if (likeLoading) return

    likeLoading = true
    setNoteLikeStatus(note.noteId, !note.userActions.isLiked)

    if (note.userActions.isLiked) {
      await unLike(note.noteId)
    } else {
      await like(note.noteId)
    }

    likeLoading = false
  }

  /**
   * 收藏按钮点击处理函数
   */
  async function collectButtonClickHandle() {
    if (!app.isLogin) {
      toast.info('请先登录')
      return
    }
    if (!note || !note.userActions) return

    toggleIsModalOpen()
    handleCollectionQueryParams(note.noteId)
    handleSelectedNoteId(note.noteId)
  }

  /**
   * 评论按钮点击处理函数
   */
  const handleCommentClick = async () => {
    if (!app.isLogin) {
      toast.info('请先登录')
      return
    }
    setCommentDrawerVisible(true)
  }

  // 评论成功后刷新笔记数据
  const handleCommentSuccess = () => {
    onRefresh?.()
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="text"
          startIcon={
            note?.userActions?.isLiked ? (
              <Favorite sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorder />
            )
          }
          onClick={likeButtonClickHandle}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {note?.likeCount || 0} 次点赞
        </Button>
        
        <Button
          variant="text"
          startIcon={
            note?.userActions?.isCollected ? (
              <Star sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorder />
            )
          }
          onClick={collectButtonClickHandle}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {note?.collectCount || 0} 次收藏
        </Button>
        
        <Button
          variant="text"
          startIcon={<Comment />}
          onClick={handleCommentClick}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {localCommentCount} 条评论
        </Button>
      </Box>

      <Drawer
        anchor="right"
        open={commentDrawerVisible}
        onClose={() => setCommentDrawerVisible(false)}
        PaperProps={{
          sx: { width: 500 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <h3 style={{ margin: 0, marginBottom: 16 }}>评论</h3>
          {note && (
            <CommentList
              noteId={note.noteId}
              onCommentCountChange={handleCommentSuccess}
            />
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default OptionsCard