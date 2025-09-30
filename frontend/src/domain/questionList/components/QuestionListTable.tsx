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
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-hot-toast'
import {
  CreateOrUpDateQuestionListBody,
  QuestionListEntity,
  QuestionListOptType,
} from '../types/types.ts'
import { diffObject } from '../../../base/utils'

interface QuestionListOptDrawerProps {
  mode: QuestionListOptType
  isDrawerOpen: boolean
  toggleIsDrawerOpen: () => void
  updateQuestionListHandle: (
    questionListId: number,
    body: CreateOrUpDateQuestionListBody,
  ) => void
  createQuestionListHandle: (body: CreateOrUpDateQuestionListBody) => void
  selectedQuestionList: QuestionListEntity | undefined
}

// Form validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('请输入题单名称')
    .min(2, '题单名称长度在 2 - 32 个字符范围内')
    .max(32, '题单名称长度在 2 - 32 个字符范围内'),
  description: yup
    .string()
    .min(2, '分类描述长度在 2 - 255 个字符范围内')
    .max(128, '分类描述长度在 2 - 255 个字符范围内'),
  type: yup.number().required('请选择题单分类'),
})

const QuestionListOptDrawer: React.FC<QuestionListOptDrawerProps> = ({
  mode,
  isDrawerOpen,
  toggleIsDrawerOpen,
  createQuestionListHandle,
  updateQuestionListHandle,
  selectedQuestionList,
}) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: 1,
    },
  })

  useEffect(() => {
    if (selectedQuestionList) {
      reset({
        name: selectedQuestionList.name || '',
        description: selectedQuestionList.description || '',
        type: selectedQuestionList.type || 1,
      })
    } else {
      reset({
        name: '',
        description: '',
        type: 1,
      })
    }
  }, [selectedQuestionList, reset])

  /**
   * 提交表单
   * @param values
   */
  const onFinishHandle = async (values: any) => {
    setLoading(true)
    try {
      if (mode === 'create') {
        // 创建操作
        createQuestionListHandle({
          name: values.name,
          description: values.description,
          type: Number(values.type),
        })
        toast.success('创建题单成功')
      } else {
        // 更新操作
        if (selectedQuestionList === undefined) {
          toast.error('未选中题单')
          return
        }
        const diff = diffObject(selectedQuestionList, values)
        if (Object.keys(diff).length === 0) {
          toast.warning('未作任何修改')
          return
        }
        // @ts-expect-error tes expect error
        updateQuestionListHandle(selectedQuestionList.questionListId, {
          ...diff,
        })
        toast.success('更新题单成功')
      }
      toggleIsDrawerOpen()
      reset()
    } catch (e: any) {
      toast.error(e.message || '操作失败')
    } finally {
      setLoading(false)
    }
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
          {mode === 'create' ? '创建分类' : '编辑分类'}
        </Typography>
        
        <Box
          component="form"
          onSubmit={handleSubmit(onFinishHandle)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="题单名称"
                placeholder="请输入题单名称"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="题单描述"
                placeholder="请输入题单描述"
                multiline
                rows={4}
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>题单分类</InputLabel>
                <Select
                  {...field}
                  label="题单分类"
                >
                  <MenuItem value={1}>普通题单</MenuItem>
                  <MenuItem value={2}>专属题单</MenuItem>
                </Select>
                {error && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? '提交中...' : (mode === 'create' ? '确认创建' : '确认更新')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default QuestionListOptDrawer