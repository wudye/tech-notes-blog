import React, { useState } from 'react'
import { Box, Typography, Divider, Skeleton } from '@mui/material'
import { NoteList, NoteQueryParams, useNotes } from '../../../../domain/note'
import { Panel } from '../../../../base/components'
import RankList from './components/RankList.tsx'
import { NoteHeatMap } from '../../../../domain/note'
import { Top3Count } from '../../../../domain/note'
import { useApp } from '@/base/hooks'

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    sort: 'create',
    order: 'desc',
  })

  const setSearchParamsHandle = (params: NoteQueryParams) => {
    setSearchParams((prev) => ({ ...prev, ...params }))
  }

  const {
    noteList,
    pagination,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
    loading,
  } = useNotes(searchParams)

  const app = useApp()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: 700 }}>
        <Panel>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            近期笔记
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
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
          ) : (
            <NoteList
              noteList={noteList}
              pagination={pagination}
              queryParams={searchParams}
              setQueryParams={setSearchParamsHandle}
              setNoteLikeStatusHandle={setNoteLikeStatusHandle}
              setNoteCollectStatusHandle={setNoteCollectStatusHandle}
            />
          )}
        </Panel>
      </Box>
      
      <Box
        sx={{
          ml: 2,
          width: 320,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <RankList />
        {app.isLogin && (
          <Panel>
            <Top3Count />
            <NoteHeatMap />
          </Panel>
        )}
      </Box>
    </Box>
  )
}

export default HomePage