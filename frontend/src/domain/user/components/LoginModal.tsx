import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Tabs,
  Tab,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  ALPHANUMERIC_UNDERSCORE,
  ALPHANUMERIC_UNDERSCORE_CHINESE,
  PASSWORD_ALLOWABLE_CHARACTERS,
  EMAIL_PATTERN,
} from '../../../base/regex'
import { useLogin } from '../hooks/useLogin.ts'
import { useRegister } from '../hooks/useRegister.ts'
import { userService } from '../service/userService.ts'
import CountDownButton from './CountDownButton.tsx'

const LoginModal: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0) // 0 = login, 1 = register
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { loginHandle } = useLogin()
  const { registerHandle } = useRegister()

  // Login form schema
  const loginSchema = yup.object({
    accountOrEmail: yup.string().required('请输入账号或邮箱'),
    password: yup
      .string()
      .required('请输入密码')
      .matches(PASSWORD_ALLOWABLE_CHARACTERS, '密码中包含不允许的字符')
      .min(8, '密码长度在 8 - 16 个字符之间')
      .max(16, '密码长度在 8 - 16 个字符之间'),
  })

  // Register form schema
  const registerSchema = yup.object({
    account: yup
      .string()
      .required('请输入账号')
      .matches(ALPHANUMERIC_UNDERSCORE, '账号只能包含字母、数字和下划线')
      .min(6, '账号长度在 6 - 16 个字符')
      .max(16, '账号长度在 6 - 16 个字符'),
    username: yup
      .string()
      .required('请输入用户名')
      .matches(ALPHANUMERIC_UNDERSCORE_CHINESE, '昵称只能包含中文、字母、数字和下划线')
      .min(1, '昵称长度在 1 - 16 个字符之间')
      .max(16, '昵称长度在 1 - 16 个字符之间'),
    email: yup
      .string()
      .required('请输入邮箱')
      .email('邮箱格式不正确'),
    verifyCode: yup
      .string()
      .required('请输入验证码')
      .length(6, '验证码长度必须为6位'),
    password: yup
      .string()
      .required('请输入密码')
      .matches(PASSWORD_ALLOWABLE_CHARACTERS, '密码中包含不允许的字符')
      .min(8, '密码长度在 8 - 16 个字符之间')
      .max(16, '密码长度在 8 - 16 个字符之间'),
  })

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      accountOrEmail: '',
      password: '',
    },
  })

  const registerForm = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      account: '',
      username: '',
      email: '',
      verifyCode: '',
      password: '',
    },
  })

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      const email = registerForm.getValues('email')
      if (!email) {
        setError('请输入邮箱')
        return false
      }
      if (!EMAIL_PATTERN.test(email)) {
        setError('邮箱格式不正确')
        return false
      }
      setLoading(true)
      await userService.sendVerifyCode({ email, type: 'REGISTER' })
      setSuccess('验证码已发送')
      setError('')
      return true
    } catch (e: any) {
      setError(e.message || '发送失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  const onLoginSubmit = async (values: any) => {
    try {
      setLoading(true)
      setError('')
      
      // Parse account or email
      const isEmail = values.accountOrEmail.includes('@')
      const loginData = isEmail 
        ? { email: values.accountOrEmail, password: values.password }
        : { account: values.accountOrEmail, password: values.password }
      
      await loginHandle(loginData)
      setSuccess('登录成功')
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onRegisterSubmit = async (values: any) => {
    try {
      setLoading(true)
      setError('')
      await registerHandle(values)
      setSuccess('注册成功')
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const LoginForm = () => {
    return (
      <Box component="form" onSubmit={loginForm.handleSubmit(onLoginSubmit)} sx={{ mt: 2 }}>
        <Controller
          name="accountOrEmail"
          control={loginForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="账号或邮箱"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="off"
            />
          )}
        />
        
        <Controller
          name="password"
          control={loginForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="密码"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          登录
        </Button>
      </Box>
    )
  }

  const RegisterForm = () => {
    return (
      <Box component="form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)} sx={{ mt: 2 }}>
        <Controller
          name="account"
          control={registerForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="账号"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="off"
            />
          )}
        />
        
        <Controller
          name="username"
          control={registerForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="昵称"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="off"
            />
          )}
        />
        
        <Controller
          name="email"
          control={registerForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="邮箱"
              type="email"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="off"
            />
          )}
        />
        
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={8}>
            <Controller
              name="verifyCode"
              control={registerForm.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="验证码"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  autoComplete="off"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ mb: 1 }}>
              <CountDownButton handleSendVerifyCode={handleSendVerifyCode} />
            </Box>
          </Grid>
        </Grid>
        
        <Controller
          name="password"
          control={registerForm.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="密码"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          注册
        </Button>
      </Box>
    )
  }

  return (
    <div className="cursor-pointer">
      <Avatar onClick={() => setOpen(true)} sx={{ width: 36, height: 36 }}>
        <span className="flex items-center text-xs">登录</span>
      </Avatar>
      
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>注册登录</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
          >
            <Tab label="登录" />
            <Tab label="注册" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {tabValue === 0 ? <LoginForm /> : <RegisterForm />}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginModal