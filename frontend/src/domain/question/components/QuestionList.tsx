import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  DialogContentText,
} from '@mui/material'
import { TreeItem } from '@mui/x-tree-view'
import { Add, Edit, Delete, ExpandMore, ChevronRight } from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import type { QuestionEntity } from '../types/types.ts'
import type { QuestionOptMode, QuestionQueryParams } from '../types/service.ts'
import { useCategory } from '../../category'
import { useQuestionList } from '../hooks/useQuestionList.ts'
import QuestionAddDrawer from './QuestionAddDrawer.tsx'
import { createQuestionBatchPlaceHolder } from '../../questionList/placeholder.ts'

/**
 * 管理端的问题列表
 */
const QuestionList: React.FC = () => {
  /**
   * 分页参数
   */
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /**
   * 查询参数
   */
  const [queryParams, setQueryParams] = useState<QuestionQueryParams>({
    page: 1,
    pageSize: 10,
  })

  /**
   * 获取分类树并将其映射为 TreeSelect 的数据结构
   */
  const { categoryTree } = useCategory()

  const treeData = categoryTree.map((item) => {
    return {
      title: item.name,
      value: item.categoryId,
      key: item.categoryId,
      children: item.children?.map((child) => ({
        title: child.name,
        value: child.categoryId,
        key: child.categoryId,
      })),
    }
  })

  /**
   * 获取问题列表、分页信息以及加载状态
   */
  const {
    questionList,
    pagination,
    loading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createQuestionBatch,
  } = useQuestionList(queryParams)

  /**
   * Drawer 的打开状态
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const toggleIsDrawerOpen = () => setIsDrawerOpen(!isDrawerOpen)

  /**
   * 打开抽屉的模式
   */
  const [mode, setMode] = useState<QuestionOptMode>('create')

  /**
   * 打开抽屉时选中的问题
   */
  const [selectedQuestion, setSelectedQuestion] = useState<
    QuestionEntity | undefined
  >(undefined)

  /**
   * 排序状态
   */
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  /**
   * 表格排序处理
   */
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
    
    setQueryParams((prev) => ({
      ...prev,
      sort: column as QuestionQueryParams['sort'],
      order: sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  /**
   * 重置排序
   */
  const resetSort = () => {
    setSortBy('')
    setSortOrder('asc')
    setQueryParams((prev) => {
      const { sort, order, ...rest } = prev
      return rest
    })
  }

  /**
   * 分类选择
   */
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setQueryParams((prev) => ({
      ...prev,
      categoryId,
    }))
  }

  /**
   * pagination onChange 事件
   */
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
    setQueryParams({
      ...queryParams,
      page: newPage,
      pageSize: pageSize,
    })
  }

  /**
   * 删除确认对话框
   */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<QuestionEntity | null>(null)

  const handleDeleteClick = (question: QuestionEntity) => {
    setQuestionToDelete(question)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(questionToDelete.questionId)
        toast.success('删除成功')
      } catch (error) {
        toast.error('删除失败')
      }
    }
    setDeleteDialogOpen(false)
    setQuestionToDelete(null)
  }

  /**
   * 批量创建对话框
   */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [loadingBatch, setLoadingBatch] = useState(false)

  /**
   * 渲染分类树
   */
  const renderTreeItems = (nodes: any[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeItem
        key={node.key}
        nodeId={node.key.toString()}
        label={node.title}
        onClick={() => handleCategorySelect(node.value)}
      >
        {node.children && node.children.length > 0
          ? renderTreeItems(node.children)
          : null}
      </TreeItem>
    ))
  }

  const handleBatchCreate = async () => {
    setLoadingBatch(true)
    try {
      await createQuestionBatch(textAreaValue)
      setIsModalOpen(false)
      setTextAreaValue('')
      toast.success('批量创建问题完成，刷新后可见')
    } catch (error) {
      toast.error('批量创建失败')
    } finally {
      setLoadingBatch(false)
    }
  }

  return (
    <div className="rounded bg-white p-4">
      <div className="mb-3 flex justify-between">
        <div className="flex gap-2 items-center">
          <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth size="small">
              <InputLabel>选择分类</InputLabel>
              <Select
                value={selectedCategoryId || ''}
                label="选择分类"
                onChange={(e) => handleCategorySelect(Number(e.target.value))}
              >
                <MenuItem value="">全部分类</MenuItem>
                {treeData.map((category) => (
                  <MenuItem key={category.key} value={category.value}>
                    {category.title}
                    {category.children?.map((child) => (
                      <MenuItem key={child.key} value={child.value} sx={{ pl: 4 }}>
                        {child.title}
                      </MenuItem>
                    ))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="outlined" onClick={resetSort}>
            重置
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsModalOpen(true)}
          >
            批量创建
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setMode('create')
              setIsDrawerOpen(true)
              setSelectedQuestion(undefined)
            }}
          >
            创建问题
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>问题 ID</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>考点</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSort('difficulty')}
                  sx={{ textTransform: 'none' }}
                >
                  难度 {sortBy === 'difficulty' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSort('viewCount')}
                  sx={{ textTransform: 'none' }}
                >
                  浏览量 {sortBy === 'viewCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>操作</TableCell>
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
              questionList?.map((question) => (
                <TableRow key={question.questionId}>
                  <TableCell>{question.questionId}</TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.examPoint}</TableCell>
                  <TableCell>{question.difficulty}</TableCell>
                  <TableCell>{question.viewCount}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="编辑">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedQuestion(question)
                            setMode('update')
                            setIsDrawerOpen(true)
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(question)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination ? Math.ceil(pagination.total / pageSize) : 0}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <QuestionAddDrawer
        mode={mode}
        isDrawerOpen={isDrawerOpen}
        toggleIsDrawerOpen={toggleIsDrawerOpen}
        selectedQuestion={selectedQuestion}
        treeData={treeData}
        createQuestion={createQuestion}
        updateQuestion={updateQuestion}
      />

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除问题 "{questionToDelete?.title}" 吗？此操作不可恢复。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 批量创建对话框 */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>批量创建问题</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={20}
            fullWidth
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            placeholder={createQuestionBatchPlaceHolder}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button
            onClick={handleBatchCreate}
            variant="contained"
            disabled={loadingBatch}
          >
            {loadingBatch ? <CircularProgress size={20} /> : '确认创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default QuestionList