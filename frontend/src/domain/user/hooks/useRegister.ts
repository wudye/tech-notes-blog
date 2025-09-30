import { RegisterBody } from '../types/serviceTypes.ts'
import { userService } from '../service/userService.ts'
import { useDispatch } from 'react-redux'
import { login } from '../../../store/appSlice.ts'
import { toast } from 'react-hot-toast'
import { kamanoteUserToken } from '../../../base/constants'
import { setUser } from '../../../store/userSlice.ts'
import type { UserEntity } from '../types/types.ts'

export function useRegister() {
  // 注册请求函数
  const dispatch = useDispatch()

  async function registerHandle(registerBody: RegisterBody) {
    try {
      const resp = await userService.registerService(registerBody)
      if (resp) {
        const { token, data } = resp
        if (!token) {
          toast.error('token is null')
          throw new Error('token is null')
        }
        // 将 token 存储到 localStorage
        localStorage.setItem(kamanoteUserToken, token)
        // 存储用户信息
        dispatch(
          setUser({
            ...data,
            ...registerBody,
          } as UserEntity),
        )
        // 设置登录状态
        dispatch(login())
        toast.success('注册成功')
      }
    } catch (e: any) {
      toast.error(e.message)
      throw new Error(e.message)
    }
  }

  return {
    registerHandle,
  }
}