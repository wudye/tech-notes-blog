import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Apps,
  BarChart,
  Cloud,
  Menu as MenuIcon,
  Person,
  Shop,
  ChevronLeft,
} from '@mui/icons-material'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  ADMIN_HOME,
  CATEGORY_MANAGE,
  QUESTION_LIST_MANAGE,
  QUESTION_MANAGE,
  USER_MANAGE,
} from './router/config.ts'
import { useDispatch } from 'react-redux'
import { intoAdminApp } from '../../store/appSlice.ts'
import { UserAvatarMenu } from '../../domain/user'
import { useUser } from '../../domain/user/hooks/useUser.ts'

const drawerWidth = 240
const drawerCollapsedWidth = 64

interface MenuItem {
  key: string
  label: string
  icon: React.ReactNode
  to: string
}

const menuItems: MenuItem[] = [
  {
    key: ADMIN_HOME,
    label: '仪表盘',
    icon: <Apps />,
    to: ADMIN_HOME,
  },
  {
    key: USER_MANAGE,
    label: '用户管理',
    icon: <Person />,
    to: USER_MANAGE,
  },
  {
    key: CATEGORY_MANAGE,
    label: '分类管理',
    icon: <Shop />,
    to: CATEGORY_MANAGE,
  },
  {
    key: QUESTION_MANAGE,
    label: '问题管理',
    icon: <BarChart />,
    to: QUESTION_MANAGE,
  },
  {
    key: QUESTION_LIST_MANAGE,
    label: '题单管理',
    icon: <Cloud />,
    to: QUESTION_LIST_MANAGE,
  },
]

const AdminApp: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()

  /**
   * 监听路由变化，设置选中菜单项
   */
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState('')

  // TODO: 检测路由变化时需要处理题单模块的特殊情况
  useEffect(() => {
    if (location.pathname.startsWith(QUESTION_LIST_MANAGE)) {
      setSelectedKey(QUESTION_LIST_MANAGE)
    } else {
      setSelectedKey(location.pathname)
    }
  }, [location.pathname])

  /**
   * 设置 Redux 中 isAdminApp
   */
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(intoAdminApp())
  }, [dispatch])

  const user = useUser()

  const handleDrawerToggle = () => {
    setCollapsed(!collapsed)
  }

  if (!user.isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          无权限
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${collapsed ? drawerCollapsedWidth : drawerWidth}px)`,
          ml: `${collapsed ? drawerCollapsedWidth : drawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <UserAvatarMenu />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? drawerCollapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? drawerCollapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            {collapsed ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={selectedKey === item.key}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 'auto' : 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ opacity: collapsed ? 0 : 1 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${collapsed ? drawerCollapsedWidth : drawerWidth}px)`,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 3,
            boxShadow: 1,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminApp