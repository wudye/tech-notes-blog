import { useDispatch } from 'react-redux'
import { LoginBody } from '../types/serviceTypes.ts'
import { login } from '../../../store/appSlice.ts'
import { userService } from '../service/userService.ts'
import { toast } from 'react-hot-toast'
import { setUser } from '../../../store/userSlice.ts'
import { kamanoteUserToken } from '../../../base/constants'

export function useLogin() {
  const dispatch = useDispatch()

  async function handleUserAuth(token: string | undefined, data: any) {
    if (!token) {
      toast.error('token is null')
      throw new Error('token is null')
    }
    // 将 token 存储到 localStorage
    localStorage.setItem(kamanoteUserToken, token)
    // 存储用户信息
    dispatch(setUser(data))
    // 设置登录状态
    dispatch(login())
    toast.success('登录成功')
  }

  async function loginHandle(loginBody: LoginBody) {
    try {
      const resp = await userService.loginService(loginBody)
      const { token, data } = resp
      await handleUserAuth(token, data)
    } catch (e: any) {
      toast.error(e.message || '登录失败')
      throw e
    }
  }

  async function whoAmIHandle() {
    try {
      const resp = await userService.whoamiService()
      const { data, token } = resp
      await handleUserAuth(token, data)
    } catch (e: unknown) {
      console.log(e)
    }
  }

  return {
    loginHandle,
    whoAmIHandle,
  }
}