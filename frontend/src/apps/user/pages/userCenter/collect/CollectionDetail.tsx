import React, { useState } from 'react'
import { NoteList, NoteQueryParams, useNotes } from '../../../../../domain/note'
import { Button, Box } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

interface CollectionDetailProps {
  selectedCollectionId?: number
  toggleShowCollectionDetail: () => void
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({
  selectedCollectionId,
  toggleShowCollectionDetail,
}) => {
  const [noteQueryParams, setNoteQueryParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    collectionId: selectedCollectionId,
  })

  const handleQueryParams = (params: NoteQueryParams) => {
    setNoteQueryParams((prev) => {
      return {
        ...prev,
        ...params,
      }
    })
  }

  const {
    noteList,
    pagination,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
  } = useNotes(noteQueryParams)

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={toggleShowCollectionDetail}
          variant="text"
          startIcon={<ArrowBack />}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          返回
        </Button>
      </Box>
      <NoteList
        noteList={noteList}
        showOptions={false}
        pagination={pagination}
        queryParams={noteQueryParams}
        setQueryParams={handleQueryParams}
        setNoteLikeStatusHandle={setNoteLikeStatusHandle}
        setNoteCollectStatusHandle={setNoteCollectStatusHandle}
      />
    </Box>
  )
}

export default CollectionDetail