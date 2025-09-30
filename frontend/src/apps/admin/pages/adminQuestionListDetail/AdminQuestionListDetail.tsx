import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import {
  Delete,
  Add,
  DragIndicator,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuestionListItem } from '../../../../domain/questionList'
import { useQuestionList2 } from '../../../../domain/questionList'
import { QuestionVO, SearchQuestionModal } from '../../../../domain/question'
import type { QuestionListItemVO } from '../../../../domain/questionList/types/types.ts'

// Sortable table row component
interface SortableRowProps {
  item: QuestionListItemVO
  onDelete: (questionId: number) => void
}

const SortableRow: React.FC<SortableRowProps> = ({ item, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.rank })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(item.question.questionId)
    setDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <TableRow
        ref={setNodeRef}
        style={style}
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <TableCell sx={{ width: '5%' }}>
          <Box
            {...attributes}
            {...listeners}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          >
            <DragIndicator sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {item.rank}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ width: '80%' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            {item.question.title}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: '15%' }}>
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除题目 "{item.question.title}" 吗？此操作不可撤销。
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
    </>
  )
}

const AdminQuestionListDetail: React.FC = () => {
  /**
   * 题单 ID
   */
  const { questionListId } = useParams()

  /**
   * 题单详细信息
   */
  const { questionList } = useQuestionList2(Number(questionListId))

  /**
   * 题单项列表
   */
  const {
    questionListItems,
    createQuestionListItem,
    deleteQuestionListItem,
    sortListItemVO,
  } = useQuestionListItem(Number(questionListId))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [items, setItems] = useState<QuestionListItemVO[]>(questionListItems)

  // Update local state when questionListItems changes
  React.useEffect(() => {
    setItems(questionListItems)
  }, [questionListItems])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.rank === active.id)
      const newIndex = items.findIndex((item) => item.rank === over?.id)

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        rank: index + 1,
      }))

      setItems(newItems)
      
      try {
        await sortListItemVO(newItems)
        toast.success('排序成功')
      } catch (error) {
        toast.error('排序失败')
        // Revert on error
        setItems(questionListItems)
      }
    }
  }

  const handleDelete = async (questionId: number) => {
    try {
      await deleteQuestionListItem(Number(questionListId), questionId)
      toast.success('删除成功')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Question List Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
            {questionList?.name}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 80 }}>
                题集描述:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {questionList?.description || '-'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 80 }}>
                题集类型:
              </Typography>
              <Chip
                label={questionList?.type || '-'}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Add Question Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={toggleIsModalOpen}
        >
          添加题目
        </Button>
      </Box>

      {/* Sortable Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%', fontWeight: 500 }}>排序</TableCell>
              <TableCell sx={{ width: '80%', fontWeight: 500 }}>标题</TableCell>
              <TableCell sx={{ width: '15%', fontWeight: 500 }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    暂无题目
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map(item => item.rank)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item) => (
                    <SortableRow
                      key={item.rank}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Search Question Modal */}
      <SearchQuestionModal
        isModalOpen={isModalOpen}
        toggleIsModalOpen={toggleIsModalOpen}
        onConfirm={async (item: QuestionVO) => {
          await createQuestionListItem(Number(questionListId), item)
          toast.success('添加成功')
        }}
      />
    </Box>
  )
}

export default AdminQuestionListDetail