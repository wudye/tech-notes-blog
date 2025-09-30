import React, { useState, useMemo } from 'react'
import {
  Tabs,
  Tab,
  Badge,
  Button,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
  Divider,
} from '@mui/material'
import {
  Message,
  Favorite,
  Notifications,
  Check,
  Delete,
  CheckCircle,
  MoreVert,
  Person,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { useMessages } from '../../../../domain/message/hooks/useMessages.ts'
import TimeAgo from '../../../../base/components/timeAgo/TimeAgo.tsx'
import MessageStats from './components/MessageStats.tsx'
import Panel from '../../../../base/components/panel/Panel'

// 消息类型枚举
enum MessageType {
  LIKE = 1,
  COMMENT = 2,
  SYSTEM = 3,
}

// 消息类型配置
const messageTypeConfig = {
  [MessageType.LIKE]: {
    label: '点赞消息',
    icon: Favorite,
    color: 'error.main',
    bgColor: '#fff2f0',
    borderColor: '#ffccc7',
  },
  [MessageType.COMMENT]: {
    label: '评论消息',
    icon: Message,
    color: 'primary.main',
    bgColor: '#f0f9ff',
    borderColor: '#91d5ff',
  },
  [MessageType.SYSTEM]: {
    label: '系统消息',
    icon: Notifications,
    color: 'success.main',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ padding: '20px 8px 8px 8px' }}
    >
      {value === index && children}
    </div>
  )
}

const MessagePage: React.FC = () => {
  const {
    messages,
    deleteMessage,
    markMessagesAsRead,
    markAllMessagesAsRead,
    loading,
  } = useMessages()

  const [activeTab, setActiveTab] = useState<number>(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  // 按类型分组消息
  const groupedMessages = useMemo(() => {
    const grouped = {
      all: messages,
      like: messages.filter((msg) => msg.type === MessageType.LIKE),
      comment: messages.filter((msg) => msg.type === MessageType.COMMENT),
      system: messages.filter((msg) => msg.type === MessageType.SYSTEM),
    }
    return grouped
  }, [messages])

  // 获取未读消息数量
  const getUnreadCount = (messageList: typeof messages) => {
    return messageList.filter((msg) => !msg.isRead).length
  }

  // 处理消息点击
  const handleMessageClick = (message: any) => {
    if (!message.isRead) {
      markMessagesAsRead([message.messageId])
    }
    // 如果有目标链接，可以在这里处理导航
    if (message.target) {
      // 根据 target.type 和 targetId 进行导航
      console.log('Navigate to:', message.target)
    }
  }

  // 处理删除消息
  const handleDeleteMessage = (messageId: number) => {
    deleteMessage(messageId)
    toast.success('消息已删除')
    setAnchorEl(null)
  }

  // 处理标记已读
  const handleMarkAsRead = (messageId: number) => {
    markMessagesAsRead([messageId])
    toast.success('已标记为已读')
    setAnchorEl(null)
  }

  // 处理全部已读
  const handleMarkAllAsRead = () => {
    markAllMessagesAsRead()
    toast.success('已全部标记为已读')
  }

  // 处理菜单打开
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, message: any) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedMessage(message)
  }

  // 处理菜单关闭
  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMessage(null)
  }

  // 获取操作描述
  const getActionText = (type: number) => {
    switch (type) {
      case MessageType.LIKE:
        return '赞了你的笔记'
      case MessageType.COMMENT:
        return '评论了你的笔记'
      case MessageType.SYSTEM:
        return ''
      default:
        return ''
    }
  }

  // 渲染消息列表
  const renderMessageList = (messageList: typeof messages) => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 12,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )
    }

    if (messageList.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            暂无消息
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            当有新消息时会在这里显示
          </Typography>
        </Box>
      )
    }

    return (
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        {messageList.map((message, idx) => renderMessageItem(message, idx))}
      </List>
    )
  }

  // 渲染消息项
  const renderMessageItem = (message: any, idx: number) => {
    const config = messageTypeConfig[message.type as MessageType]
    const actionText = getActionText(message.type)
    const isSystem = message.type === MessageType.SYSTEM
    const postTitle = message.target?.question?.title

    return (
      <React.Fragment key={message.messageId}>
        <ListItem
          sx={{
            bgcolor: config.bgColor,
            borderLeft: !message.isRead
              ? `4px solid ${config.borderColor}`
              : '4px solid transparent',
            mb: 1,
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 1,
            },
            '&:hover .message-action-btn': {
              opacity: 1,
            },
          }}
          onClick={() => handleMessageClick(message)}
        >
          <ListItemAvatar>
            <Avatar
              src={message.sender.avatar}
              sx={{ width: 44, height: 44 }}
            >
              {message.sender.avatar ? null : <Person />}
            </Avatar>
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {isSystem ? '系统通知' : message.sender.username}
                </Typography>
                {!isSystem && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {actionText}
                  </Typography>
                )}
                {postTitle && (
                  <Chip
                    label={`《${postTitle}》`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
                {!message.isRead && (
                  <Chip
                    label="新"
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.625rem', height: 20 }}
                  />
                )}
              </Box>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary', mb: 1, lineHeight: 1.5 }}
                >
                  {message.content}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  <TimeAgo datetime={message.createdAt} />
                </Typography>
              </Box>
            }
          />

          <IconButton
            className="message-action-btn"
            size="small"
            onClick={(e) => handleMenuClick(e, message)}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              color: 'text.secondary',
            }}
          >
            <MoreVert />
          </IconButton>
        </ListItem>
        {idx < messageList.length - 1 && <Divider variant="inset" component="li" />}
      </React.Fragment>
    )
  }

  // 标签页数据
  const tabData = [
    { key: 'all', label: '全部', messages: groupedMessages.all },
    { key: 'like', label: '点赞', messages: groupedMessages.like },
    { key: 'comment', label: '评论', messages: groupedMessages.comment },
    { key: 'system', label: '系统', messages: groupedMessages.system },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: 1000,
        px: { xs: 1, sm: 0 },
        mx: 'auto',
      }}
    >
      <Panel>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            消息中心
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            查看你的评论、点赞和系统通知
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <MessageStats
            totalMessages={messages.length}
            unreadCount={getUnreadCount(groupedMessages.all)}
            likeCount={groupedMessages.like.length}
            commentCount={groupedMessages.comment.length}
            systemCount={groupedMessages.system.length}
            unreadLikeCount={getUnreadCount(groupedMessages.like)}
            unreadCommentCount={getUnreadCount(groupedMessages.comment)}
            unreadSystemCount={getUnreadCount(groupedMessages.system)}
          />
          {getUnreadCount(groupedMessages.all) > 0 && (
            <Button
              variant="outlined"
              startIcon={<CheckCircle />}
              onClick={handleMarkAllAsRead}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              全部标记为已读
            </Button>
          )}
        </Box>

        <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              pt: 2,
            }}
          >
            {tabData.map((tab, index) => (
              <Tab
                key={tab.key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    {getUnreadCount(tab.messages) > 0 && (
                      <Badge
                        badgeContent={getUnreadCount(tab.messages)}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.625rem',
                            minWidth: 16,
                            height: 16,
                          },
                        }}
                      />
                    )}
                  </Box>
                }
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>

          {tabData.map((tab, index) => (
            <TabPanel key={tab.key} value={activeTab} index={index}>
              {renderMessageList(tab.messages)}
            </TabPanel>
          ))}
        </Paper>
      </Panel>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedMessage && !selectedMessage.isRead && (
          <MenuItem onClick={() => handleMarkAsRead(selectedMessage.messageId)}>
            <Check sx={{ mr: 1, fontSize: 18 }} />
            标记已读
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.messageId)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          删除消息
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MessagePage