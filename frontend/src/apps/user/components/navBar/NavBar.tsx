import React, { useEffect, useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Tabs, 
  Tab, 
  Badge, 
  IconButton,
  Container 
} from '@mui/material'
import { Notifications } from '@mui/icons-material'
import { NavLink, useLocation } from 'react-router-dom'
import {
  HOME_PAGE,
  MESSAGE_CENTER,
  QUESTION_LIST,
  QUESTION_SET,
} from '../../router/config.ts'
import Logo from '../logo/Logo.tsx'
import { useApp } from '../../../../base/hooks/index.ts'
import { LoginModal, UserAvatarMenu } from '../../../../domain/user'
import SearchInput from '../searchInput/SearchInput.tsx'
import { ColumnDivider } from '../../../../base/components'
import DownloadNoteItem from '../../../../domain/note/components/DownloadNoteItem.tsx'
import { messageService } from '../../../../domain/message/service/messageService.ts'

interface NavItem {
  label: string
  key: string
  to: string
}

const navItems: NavItem[] = [
  {
    label: '首页',
    key: 'home',
    to: HOME_PAGE,
  },
  {
    label: '题库',
    key: 'question-set',
    to: QUESTION_SET,
  },
  {
    label: '题单',
    key: 'question-list',
    to: QUESTION_LIST,
  },
]

const NavBar: React.FC = () => {
  /**
   * 监听路由变化，设置选中菜单项
   */
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('home')
  const location = useLocation()

  /**
   * 未读消息数量状态
   */
  const [unreadCount, setUnreadCount] = useState<number>(0)

  /**
   * 获取 app 信息
   */
  const app = useApp()

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedMenuItem('home')
    } else {
      const pathSegment = location.pathname.split('/')[1]
      setSelectedMenuItem(pathSegment)
    }
  }, [location.pathname])

  /**
   * 定时获取未读消息数量
   */
  useEffect(() => {
    // 如果用户未登录，不获取消息数量
    if (!app.isLogin) {
      setUnreadCount(0)
      return
    }

    // 立即获取一次未读消息数量
    const fetchUnreadCount = async () => {
      try {
        const response = await messageService.getUnreadCount()
        setUnreadCount(response.data)
      } catch (error) {
        console.error('获取未读消息数量失败:', error)
      }
    }

    fetchUnreadCount()

    // 设置5秒定时器
    const interval = setInterval(fetchUnreadCount, 5000)

    // 清理定时器
    return () => {
      clearInterval(interval)
    }
  }, [app.isLogin])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedMenuItem(newValue)
  }

  return (
    <AppBar 
      position="static" 
      color="inherit" 
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 16 } }}>
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: 'var(--header-height)',
            px: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Logo />
            <Tabs
              value={selectedMenuItem}
              onChange={handleTabChange}
              sx={{
                minHeight: 'var(--header-height)',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                  color: 'text.primary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.key}
                  label={item.label}
                  value={item.key}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                />
              ))}
            </Tabs>
            <ColumnDivider />
            <Box>
              <DownloadNoteItem />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <SearchInput />
            <IconButton
              component={NavLink}
              to={MESSAGE_CENTER}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.625rem',
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>
            {app.isLogin ? <UserAvatarMenu /> : <LoginModal />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar