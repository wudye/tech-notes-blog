import React from 'react'
import { Divider, Typography } from '@mui/material'
import { NoteRankList } from '../../../../../domain/note'
import { Panel } from '../../../../../base/components'

const RankList: React.FC = () => {
  return (
    <Panel>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        今日笔记排行榜
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <NoteRankList />
    </Panel>
  )
}

export default RankList