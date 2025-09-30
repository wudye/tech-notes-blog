import React, { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser.ts'
import {
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  IconButton,
  Input,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PhotoCamera } from '@mui/icons-material'
import { UserState } from '../types/types.ts'
import { useUserForm } from '../hooks/useUserForm.ts'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'

const UserInfoForm: React.FC = () => {
  /**
   * 用户信息展示
   */
  const user = useUser() as UserState

  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  const { updateUserInfo, updateUserAvatar } = useUserForm()

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || '',
      gender: user?.gender || 1,
      birthday: user?.birthday ? dayjs(user.birthday) : null,
      email: user?.email || '',
      school: user?.school || '',
      signature: user?.signature || '',
    }
  })

  const handleEditToggle = () => {
    setEditing(!editing)
    if (!editing) {
      // Reset form when starting to edit
      reset({
        username: user.username,
        gender: user.gender,
        birthday: user.birthday ? dayjs(user.birthday) : null,
        email: user.email,
        school: user.school,
        signature: user.signature,
      })
    }
  }

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        gender: user.gender,
        birthday: user.birthday ? dayjs(user.birthday) : null,
        email: user.email,
        school: user.school,
        signature: user.signature,
      })
    }
  }, [user, reset])

  const handleSave = async (values: any) => {
    const oldValues = user
    // 提取差异字段
    const diff: Partial<typeof oldValues> = {}

    // 这段确实需要特殊处理 birthday 字段
    Object.entries(values).forEach(([key, newValue]) => {
      // @ts-expect-error ...
      const oldValue = oldValues[key]
      if (key === 'birthday') {
        // 类型检查并格式化生日
        const newBirthday = newValue
          ? dayjs(newValue as string | Date).format('YYYY-MM-DD')
          : null
        const oldBirthday =
          dayjs(oldValues[key] as string | Date).format('YYYY-MM-DD') ?? null
        if (newBirthday !== oldBirthday) {
          // @ts-expect-error ...
          diff[key] = newBirthday
        }
      } else if (newValue !== oldValue) {
        // @ts-expect-error ...
        diff[key] = newValue
      }
    })

    // 如果没有修改任何字段，提示用户无需更新
    if (Object.keys(diff).length === 0) {
      setMessage({ type: 'info', text: '未更新任何字段' })
      return
    }

    try {
      await updateUserInfo(diff)
      setMessage({ type: 'success', text: '更新成功！' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message })
    } finally {
      setEditing(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      // Replace with your actual upload endpoint
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/users/avatar', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.code === 200) {
        await updateUserAvatar(result.data.url)
        setMessage({ type: 'success', text: '头像更新成功！' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '头像上传失败' })
    }
  }

  return (
    <div className="rounded-lg bg-white p-6">
      {message && (
        <Alert 
          severity={message.type} 
          onClose={() => setMessage(null)}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}
      
      <div className="mb-6 flex items-center space-x-4">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.avatarUrl} sx={{ width: 64, height: 64 }} />
          <Input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarUpload}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              color="primary"
              component="span"
              sx={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                backgroundColor: 'white',
                boxShadow: 1,
                '&:hover': { backgroundColor: 'grey.100' }
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </label>
        </Box>
        <div>
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <Button onClick={handleEditToggle} className="ml-auto" variant="outlined">
          {editing ? '取消编辑' : '编辑'}
        </Button>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={handleSubmit(handleSave)} sx={{ mt: 2 }}>
          <Controller
            name="username"
            control={control}
            rules={{ required: '请输入用户名' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="用户名"
                fullWidth
                margin="normal"
                disabled={!editing}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" disabled={!editing}>
                <InputLabel>性别</InputLabel>
                <Select {...field} label="性别">
                  <MenuItem value={1}>男</MenuItem>
                  <MenuItem value={2}>女</MenuItem>
                  <MenuItem value={3}>保密</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="生日"
                disabled={!editing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址'
              }
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="邮箱"
                type="email"
                fullWidth
                margin="normal"
                disabled={!editing}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="school"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="学校"
                fullWidth
                margin="normal"
                disabled={!editing}
              />
            )}
          />

          <Controller
            name="signature"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="个性签名"
                multiline
                rows={3}
                fullWidth
                margin="normal"
                disabled={!editing}
              />
            )}
          />

          {editing && (
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                保存
              </Button>
              <Button onClick={handleEditToggle} variant="outlined">
                取消
              </Button>
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    </div>
  )
}

export default UserInfoForm