import React, { useEffect, useState } from 'react'
import { 
  Fab, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box 
} from '@mui/material'
import { Wifi } from '@mui/icons-material'
import { kamanoteHost } from '../../constants'

const HostModal: React.FC = () => {
  const [host, setHost] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setHost(localStorage.getItem(kamanoteHost) || '')
  }, [])

  return (
    <>
      <Fab
        color="primary"
        onClick={() => {
          setOpen(true)
        }}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Wifi />
      </Fab>
      
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
              fontWeight: 500,
            }}
          >
            Host 配置
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: 'text.secondary' 
              }}
            >
              配置网络请求的 Host 地址，默认为：项目启动地址
            </Typography>
            
            <TextField
              fullWidth
              type="text"
              value={host}
              onChange={(e) => {
                setHost(e.target.value)
                localStorage.setItem(kamanoteHost, e.target.value)
              }}
              placeholder="请输入 Host 地址"
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HostModal