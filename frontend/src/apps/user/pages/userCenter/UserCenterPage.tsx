import React, { useEffect, useState } from 'react'
import { Panel } from '../../../../base/components'
import {
  Apps,
  Person,
  Settings,
} from '@mui/icons-material'
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box 
} from '@mui/material'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  USER_CENTER,
  USER_COLLECT,
  USER_INFO,
  USER_NOTE,
} from '../../router/config.ts'

const UserCenterPage: React.FC = () => {
  interface MenuItem {
    key: string
    label: string
    icon: React.ReactNode
    to: string
  }

  const items: MenuItem[] = [
    {
      key: USER_INFO,
      label: '个人信息',
      icon: <Person />,
      to: USER_INFO,
    },
    {
      key: USER_COLLECT,
      label: '个人收藏',
      icon: <Apps />,
      to: USER_COLLECT,
    },
    {
      key: USER_NOTE,
      label: '个人笔记',
      icon: <Settings />,
      to: USER_NOTE,
    },
  ]

  /**
   * 监听路由变化，设置菜单选中状态
   */
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState(USER_INFO)

  useEffect(() => {
    if (location.pathname === USER_CENTER) {
      setSelectedKey(USER_INFO)
    } else {
      setSelectedKey(location.pathname)
    }
  }, [location.pathname])

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 4 
      }}
    >
      <Box sx={{ width: 240 }}>
        <Panel>
          <List sx={{ py: 0 }}>
            {items.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  selected={selectedKey === item.key}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.lighter',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: selectedKey === item.key ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: selectedKey === item.key ? 500 : 400,
                        color: selectedKey === item.key ? 'primary.main' : 'text.primary',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Panel>
      </Box>
      <Box sx={{ width: 800 }}>
        <Panel>
          <Outlet />
        </Panel>
      </Box>
    </Box>
  )
}

export default UserCenterPage