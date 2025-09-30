import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Box,
  TableSortLabel,
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import type { QuestionQueryParams } from '../types/service.ts'
import { useQuestionTable } from '../hooks/useQuestionTable.ts'
import type { QuestionWithUserStatus } from '../types/types.ts'
import { QUESTION } from '../../../apps/user/router/config.ts'
import { DifficultyTag } from '../index.ts'

interface QuestionTableProps {
  categoryId: number | undefined
}

/**
 * 用户端的问题列表
 */
const QuestionTable: React.FC<QuestionTableProps> = ({ categoryId }) => {
  /**
   * 分页受控
   */
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /**
   * 排序状态
   */
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  /**
   * 初始化查询参数对象
   */
  const [queryParams, setQueryParams] = useState<QuestionQueryParams>({
    categoryId: categoryId,
    page: 1,
    pageSize: 10,
  })

  /**
   * 监听 categoryId 变化，动态更新 queryParams
   */
  useEffect(() => {
    if (categoryId) {
      setQueryParams((prev) => {
        return {
          ...prev,
          categoryId: categoryId,
        }
      })
      setPage(1)
    }
  }, [categoryId])

  /**
   * 获取问题列表
   */
  const { questionList, loading, pagination } = useQuestionTable(queryParams)

  /**
   * pagination change handle
   */
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setQueryParams((prev) => {
      return {
        ...prev,
        page: newPage,
        pageSize: pageSize,
      }
    })
    setPage(newPage)
  }

  /**
   * 排序处理
   */
  const handleSort = (column: string) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(column)
    setSortOrder(newOrder)
    
    setQueryParams((prev) => {
      return {
        ...prev,
        sort: column === 'difficulty' ? 'difficulty' : 'view',
        order: newOrder,
      }
    })
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>状态</TableCell>
              <TableCell sx={{ width: '15%' }}>问题 ID</TableCell>
              <TableCell sx={{ width: '35%' }}>标题</TableCell>
              <TableCell sx={{ width: '20%' }}>考点</TableCell>
              <TableCell sx={{ width: '10%' }}>
                <TableSortLabel
                  active={sortBy === 'difficulty'}
                  direction={sortBy === 'difficulty' ? sortOrder : 'asc'}
                  onClick={() => handleSort('difficulty')}
                >
                  难度
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '10%' }}>
                <TableSortLabel
                  active={sortBy === 'viewCount'}
                  direction={sortBy === 'viewCount' ? sortOrder : 'asc'}
                  onClick={() => handleSort('viewCount')}
                >
                  浏览量
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              questionList?.map((questionWithUserStatus) => (
                <TableRow key={questionWithUserStatus.questionId}>
                  <TableCell>
                    {questionWithUserStatus.userQuestionStatus.finished ? (
                      <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                    ) : null}
                  </TableCell>
                  <TableCell>{questionWithUserStatus.questionId}</TableCell>
                  <TableCell>
                    <Link
                      to={`${QUESTION}/${questionWithUserStatus.questionId}`}
                      style={{ 
                        color: '#1976d2', 
                        textDecoration: 'none',
                      }}
                    >
                      {questionWithUserStatus.title}
                    </Link>
                  </TableCell>
                  <TableCell>{questionWithUserStatus.examPoint}</TableCell>
                  <TableCell>
                    <DifficultyTag difficulty={questionWithUserStatus.difficulty} />
                  </TableCell>
                  <TableCell>{questionWithUserStatus.viewCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={pagination ? Math.ceil(pagination.total / pageSize) : 0}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  )
}

export default QuestionTable