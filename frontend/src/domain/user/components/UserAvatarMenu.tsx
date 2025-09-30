import React, { useState } from 'react'
import { Avatar, Popover } from '@mui/material'
import { Person } from '@mui/icons-material'
import ProfileMenu from './ProfileMenu.tsx'
import { useUser } from '../hooks/useUser.ts'

const UserAvatarMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const user = useUser()

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <Avatar
        sx={{ width: 36, height: 36, cursor: 'pointer' }}
        src={user?.avatarUrl}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {user?.avatarUrl ? null : <Person />}
      </Avatar>
      
      <Popover
        sx={{
          pointerEvents: 'none',
          '& .MuiPopover-paper': {
            pointerEvents: 'auto',
            marginTop: '8px',
          },
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableRestoreFocus
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ProfileMenu />
      </Popover>
    </div>
  )
}

export default UserAvatarMenu