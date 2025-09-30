import React, { useState } from 'react'
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  Typography, 
  Box,
  CircularProgress 
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { CreateCollectionBody } from '../types/types.ts'

interface CreateCollectionModalProps {
  isModalOpen: boolean
  toggleIsModalOpen: () => void
  createCollection: (
    body: CreateCollectionBody,
    noteId?: number, // 笔记 ID，点击某个笔记弹窗时，该笔记的 ID
  ) => Promise<void> // 创建收藏夹处理函数
  selectedNoteId?: number
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isModalOpen,
  toggleIsModalOpen,
  createCollection,
  selectedNoteId,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCollectionBody>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (values: CreateCollectionBody) => {
    setLoading(true)
    try {
      await createCollection(values, selectedNoteId)
      reset()
      toggleIsModalOpen()
      toast.success('收藏夹创建成功')
    } catch (error: any) {
      toast.error(error.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      reset()
      toggleIsModalOpen()
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          创建新的收藏夹
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: '请输入收藏夹名称',
              minLength: {
                value: 2,
                message: '最少两个字符'
              },
              maxLength: {
                value: 32,
                message: '最多 32 个字符'
              },
              pattern: {
                value: /^[\u4e00-\u9fa5a-zA-Z0-9_+\-]+$/,
                message: '只能包含中文、字母、数字、下划线、中划线'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="收藏夹名称"
                placeholder="请输入收藏夹名称"
                variant="outlined"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: {
                value: 128,
                message: '最多 128 个字符'
              },
              pattern: {
                value: /^[\u4e00-\u9fa5a-zA-Z0-9_+\-\s]*$/,
                message: '只能包含中文、字母、数字、下划线、中划线'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="收藏夹描述"
                placeholder="请输入收藏夹描述"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ mr: 1 }}
        >
          取消
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
          sx={{
            position: 'relative',
            minWidth: 100,
          }}
        >
          {loading && (
            <CircularProgress
              size={16}
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: '-8px',
                marginTop: '-8px',
              }}
            />
          )}
          {loading ? '创建中...' : '创建'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateCollectionModal