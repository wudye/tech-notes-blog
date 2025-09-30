import React, { useState } from 'react'
import { Button, CircularProgress, Box } from '@mui/material'
import { Download } from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { noteService } from '../service/noteService.ts'
import { useApp } from '../../../base/hooks'

const DownloadNoteItem: React.FC = () => {
  const app = useApp()

  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!app.isLogin) {
      toast.info('请先登录')
      return
    }

    if (loading) {
      toast.info('正在下载中...')
      return
    }

    setLoading(true)

    try {
      const { data } = await noteService.downloadNoteService()
      const markdown = data.markdown

      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '卡码笔记' + Date.now() + '.md'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('下载成功')
    } catch (e: any) {
      toast.error(e.message || '下载失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="text"
      startIcon={loading ? <CircularProgress size={16} /> : <Download />}
      onClick={handleDownload}
      disabled={loading}
      sx={{
        color: 'text.primary',
        textTransform: 'none',
        fontSize: '0.875rem',
        fontWeight: 400,
        px: 2,
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'primary.main',
        },
        '&.Mui-disabled': {
          color: 'text.disabled',
        },
      }}
    >
      {loading ? '下载中...' : '下载笔记'}
    </Button>
  )
}

export default DownloadNoteItem