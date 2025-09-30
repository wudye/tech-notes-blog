import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  CircularProgress,
} from '@mui/material'
import type { StatisticEntity } from '../types/types.ts'
import { useStatistic } from '../hooks/useStatistic.ts'

const StatisticTable: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { loading, statistic, pagination } = useStatistic(page, pageSize)

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell align="right">登录人数</TableCell>
              <TableCell align="right">今日注册</TableCell>
              <TableCell align="right">累计注册</TableCell>
              <TableCell align="right">今日笔记数</TableCell>
              <TableCell align="right">今日提交笔记人数</TableCell>
              <TableCell align="right">累计笔记数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              statistic?.map((row) => (
                <TableRow key={row.date}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.loginCount}</TableCell>
                  <TableCell align="right">{row.registerCount}</TableCell>
                  <TableCell align="right">{row.totalRegisterCount}</TableCell>
                  <TableCell align="right">{row.noteCount}</TableCell>
                  <TableCell align="right">{row.submitNoteCount}</TableCell>
                  <TableCell align="right">{row.totalNoteCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination ? Math.ceil(pagination.total / pageSize) : 0}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </div>
  )
}

export default StatisticTable