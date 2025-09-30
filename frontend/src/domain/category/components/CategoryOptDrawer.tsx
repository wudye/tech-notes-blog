import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  AddCircleOutline,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import type { CategoryTree, OptMode } from '../types/types.ts'
import { isParentCategory } from '../utils'
import CategoryOptDrawer from './CategoryOptDrawer.tsx'
import { useCategory } from '../hooks/useCategory.ts'

const CategoryList: React.FC = () => {
  /**
   * 选中的 Category
   */
  const [selectedCategory, setSelectedCategory] = useState<CategoryTree>()

  /**
   * 抽屉是否打开
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const toggleIsDrawerOpen = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  /**
   * 抽屉打开的模式
   */
  const [mode, setMode] = useState<OptMode>('create')

  /**
   * 删除确认对话框
   */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryTree | null>(null)

  /**
   * 获取分类及其附属操作函数
   */
  const {
    categoryTree,
    updateCategory,
    createCategory,
    deleteCategory,
    loading,
  } = useCategory()

  const handleDeleteClick = (category: CategoryTree) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete)
        toast.success('删除成功')
      } catch (error) {
        toast.error('删除失败')
      }
    }
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setMode('create')
            setIsDrawerOpen(true)
            setSelectedCategory(undefined)
          }}
        >
          创建分类
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}>分类 ID</TableCell>
              <TableCell sx={{ width: '10%' }}>分类名</TableCell>
              <TableCell sx={{ width: '15%' }}>分类类型</TableCell>
              <TableCell sx={{ width: '10%' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : categoryTree.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    暂无数据
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categoryTree.map((category) => (
                <TableRow key={category.categoryId} hover>
                  <TableCell>{category.categoryId}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {isParentCategory(category) ? (
                      <Chip 
                        label="父分类" 
                        color="error" 
                        size="small" 
                        variant="outlined"
                      />
                    ) : (
                      <Chip 
                        label="子分类" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="编辑">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCategory(category)
                            setMode('update')
                            setIsDrawerOpen(true)
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="删除">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(category)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {/* 只有一级分类（父分类）才能添加子分类 */}
                      {isParentCategory(category) && (
                        <Tooltip title="添加子分类">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setMode('create')
                              setSelectedCategory(category)
                              setIsDrawerOpen(true)
                            }}
                            sx={{ color: 'success.main' }}
                          >
                            <AddCircleOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除分类 "{categoryToDelete?.name}" 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            取消
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>
      
      <CategoryOptDrawer
        category={selectedCategory}
        mode={mode}
        isDrawerOpen={isDrawerOpen}
        updateCategory={updateCategory}
        createCategory={createCategory}
        toggleIsDrawerOpen={toggleIsDrawerOpen}
      />
    </Box>
  )
}

export default CategoryList