import React, { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import type {
  CreateQuestionBody,
  QuestionOptMode,
  UpdateQuestionBody,
} from '../types/service.ts'
import { QuestionDifficulty, QuestionEntity } from '../types/types.ts'
import { diffObject } from '../../../base/utils'

interface QuestionAddDrawerProps {
  mode: QuestionOptMode
  treeData: any
  isDrawerOpen: boolean
  toggleIsDrawerOpen: () => void
  selectedQuestion: QuestionEntity | undefined
  createQuestion: (body: CreateQuestionBody) => void
  updateQuestion: (question: UpdateQuestionBody) => void
}

// Form validation schema
const schema = yup.object({
  title: yup
    .string()
    .required('请输入题目')
    .min(2, '题目长度在 2 - 255 个字符')
    .max(255, '题目长度在 2 - 255 个字符'),
  difficulty: yup.number().required('请选择难度'),
  examPoint: yup
    .string()
    .min(2, '考点长度在 2 - 255 个字符')
    .max(255, '考点长度在 2 - 255 个字符'),
  categoryId: yup.number().required('请选择所属分类'),
})

const QuestionAddDrawer: React.FC<QuestionAddDrawerProps> = ({
  mode,
  treeData,
  isDrawerOpen,
  toggleIsDrawerOpen,
  selectedQuestion,
  createQuestion,
  updateQuestion,
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      questionId: '',
      title: '',
      difficulty: QuestionDifficulty.Easy,
      examPoint: '',
      categoryId: 0,
    },
  })

  useEffect(() => {
    if (mode === 'update' && selectedQuestion) {
      reset({
        questionId: selectedQuestion.questionId?.toString() || '',
        title: selectedQuestion.title || '',
        difficulty: selectedQuestion.difficulty || QuestionDifficulty.Easy,
        examPoint: selectedQuestion.examPoint || '',
        categoryId: selectedQuestion.categoryId || 0,
      })
      setSelectedCategoryId(selectedQuestion.categoryId || null)
    } else if (mode === 'create') {
      reset({
        questionId: '',
        title: '',
        difficulty: QuestionDifficulty.Easy,
        examPoint: '',
        categoryId: 0,
      })
      setSelectedCategoryId(null)
    }
  }, [mode, selectedQuestion, reset])

  async function onFinish(values: any) {
    setLoading(true)
    try {
      if (mode === 'create') {
        createQuestion(values as CreateQuestionBody)
        toast.success('创建成功')
        toggleIsDrawerOpen()
      } else if (mode === 'update') {
        if (selectedQuestion === undefined) {
          throw new Error('selectedQuestion is undefined')
        }
        const diffResult = diffObject(
          selectedQuestion,
          values,
        ) as UpdateQuestionBody
        updateQuestion({
          ...diffResult,
          questionId: selectedQuestion.questionId,
        })
        toast.success('更新成功')
        toggleIsDrawerOpen()
      }
    } catch (error) {
      toast.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  // Render tree items for category selection
  const renderTreeItems = (nodes: any[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeItem
        key={node.value}
        nodeId={node.value.toString()}
        label={node.title}
        onClick={() => {
          setSelectedCategoryId(node.value)
          setValue('categoryId', node.value)
        }}
      >
        {node.children && node.children.length > 0
          ? renderTreeItems(node.children)
          : null}
      </TreeItem>
    ))
  }

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleIsDrawerOpen}
      PaperProps={{
        sx: { width: 450 }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {mode === 'create' ? '创建问题' : '更新问题'}
        </Typography>
        
        <Box
          component="form"
          onSubmit={handleSubmit(onFinish)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {mode === 'update' && (
            <Controller
              name="questionId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="问题ID"
                  disabled
                  fullWidth
                />
              )}
            />
          )}

          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="题目"
                placeholder="请输入题目"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="difficulty"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>难度</InputLabel>
                <Select
                  {...field}
                  label="难度"
                >
                  <MenuItem value={QuestionDifficulty.Easy}>简单</MenuItem>
                  <MenuItem value={QuestionDifficulty.Medium}>中等</MenuItem>
                  <MenuItem value={QuestionDifficulty.Hard}>困难</MenuItem>
                </Select>
                {error && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="examPoint"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="考点"
                placeholder="请输入考点"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              所属分类 *
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1, maxHeight: 200, overflow: 'auto' }}>
              <TreeView
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
                selected={selectedCategoryId?.toString() || ''}
              >
                {renderTreeItems(treeData)}
              </TreeView>
            </Box>
            {errors.categoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.categoryId.message}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? '提交中...' : (mode === 'create' ? '创建题目' : '更新题目')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default QuestionAddDrawer