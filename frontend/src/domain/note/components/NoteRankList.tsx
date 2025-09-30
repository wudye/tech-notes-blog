import React, { useEffect, useState } from 'react'
import { Box, Pagination, Typography } from '@mui/material'
import { NoteItem, NoteQueryParams } from '../index.ts'
import type { CollectionQueryParams } from '../../collection/types/types.ts'
import { useCollection2 } from '../../collection'
import { useApp } from '@/base/hooks'
import { useUser } from '../../user/hooks/useUser.ts'
import CollectionModal from '../../collection/components/CollectionModal.tsx'
import type { NoteWithRelations } from '../types/serviceTypes.ts'
import type { Pagination as PaginationType } from '../../../request'

interface NoteListProps {
  noteList: NoteWithRelations[] // 笔记列表
  pagination: PaginationType | undefined // 分页数据
  setNoteLikeStatusHandle: (noteId: number, isLiked: boolean) => void // 设置笔记的点赞状态
  setNoteCollectStatusHandle: (noteId: number, isCollected: boolean) => void // 设置笔记的收藏状态
  queryParams: NoteQueryParams // 查询参数
  setQueryParams: (queryParams: NoteQueryParams) => void // 设置查询参数的函数
  showAuthor?: boolean // 是否展示作者信息
  showQuestion?: boolean // 是否展示题目信息
  showOptions?: boolean // 是否展示点赞/收藏/评论等按钮
}

const NoteList: React.FC<NoteListProps> = ({
  noteList,
  pagination,
  setNoteLikeStatusHandle,
  setNoteCollectStatusHandle,
  queryParams,
  setQueryParams,
  showOptions = true,
  showAuthor = true,
  showQuestion = true,
}) => {
  /**
   * 处理 分页变化
   * @param event 事件对象
   * @param page 当前页码
   */
  function handlePageChange(event: React.ChangeEvent<unknown>, page: number) {
    setQueryParams({
      ...queryParams,
      page,
      pageSize: queryParams.pageSize || 10,
    })
  }

  /**
   * 控制收藏夹 Modal 的打开与关闭
   */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  const [selectedNoteId, setSelectedNoteId] = useState<number | undefined>(
    undefined,
  )
  const handleSelectedNoteId = (noteId: number) => {
    setSelectedNoteId(noteId)
  }

  /**
   * 收藏夹查询参数设置
   */
  const app = useApp()
  const user = useUser()

  const [collectionQueryParams, setCollectionQueryParams] =
    useState<CollectionQueryParams>({
      noteId: undefined,
      creatorId: undefined,
    })

  useEffect(() => {
    setCollectionQueryParams((prev) => {
      return {
        ...prev,
        creatorId: app.isLogin ? user.userId : undefined,
      }
    })
  }, [app, user])

  function handleCollectionQueryParams(noteId: number) {
    setCollectionQueryParams((prev) => {
      return {
        ...prev,
        noteId,
      }
    })
  }

  const { collectionVOList, createCollection, collectNote } = useCollection2(
    collectionQueryParams,
  )

  // Calculate total pages
  const totalPages = pagination ? Math.ceil(pagination.total / (queryParams.pageSize || 10)) : 0

  return (
    <div>
      {noteList.map((note) => (
        <NoteItem
          key={note.noteId}
          note={note}
          setNoteLikeStatus={setNoteLikeStatusHandle}
          toggleIsModalOpen={toggleIsModalOpen}
          handleCollectionQueryParams={handleCollectionQueryParams}
          handleSelectedNoteId={handleSelectedNoteId}
          showOptions={showOptions}
          showAuthor={showAuthor}
          showQuestion={showQuestion}
        />
      ))}
      
      {noteList.length > 0 && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={queryParams.page || 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      {noteList.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            color: 'text.disabled',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.disabled' }}>
            暂无笔记
          </Typography>
        </Box>
      )}
      
      <CollectionModal
        isModalOpen={isModalOpen}
        collectNote={collectNote}
        selectedNoteId={selectedNoteId}
        toggleIsModalOpen={toggleIsModalOpen}
        collectionVOList={collectionVOList}
        createCollection={createCollection}
        setNoteCollectStatusHandle={setNoteCollectStatusHandle}
      />
    </div>
  )
}

export default NoteList