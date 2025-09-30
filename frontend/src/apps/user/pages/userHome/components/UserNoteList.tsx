import React, { useState } from 'react'
import { NoteList, NoteQueryParams, useNotes } from '../../../../../domain/note'
import { Box, Typography, Skeleton } from '@mui/material'

interface UserNoteListProps {
  userId?: string
}

const UserNoteList: React.FC<UserNoteListProps> = ({ userId }) => {
  const [queryParams, setQueryParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    sort: 'create',
    order: 'desc',
    authorId: userId,
  })

  const {
    noteList,
    pagination,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
    loading,
  } = useNotes(queryParams)

  function handleQueryParams(params: NoteQueryParams) {
    setQueryParams((prev) => ({ ...prev, ...params }))
  }

  if (userId === undefined) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box>
      <NoteList
        noteList={noteList}
        pagination={pagination}
        queryParams={queryParams}
        setQueryParams={handleQueryParams}
        setNoteLikeStatusHandle={setNoteLikeStatusHandle}
        setNoteCollectStatusHandle={setNoteCollectStatusHandle}
        showOptions={false}
      />
      {noteList.length === 0 && !loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              fontWeight: 500,
              color: 'text.secondary'
            }}
          >
            暂无笔记
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'text.disabled' }}
          >
            该用户还没有发布任何笔记
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default UserNoteList