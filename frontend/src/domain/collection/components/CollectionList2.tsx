import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material'
import {
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import type { CollectionVO } from '../types/types.ts'

interface CollectionList2Props {
  collectionVOList: CollectionVO[]
  handleSelectedCollectionId: (collectionId: number) => void
  toggleShowCollectionDetail: () => void
}

// 用户后台的收藏夹列表
const CollectionList2: React.FC<CollectionList2Props> = ({
  collectionVOList,
  handleSelectedCollectionId,
  toggleShowCollectionDetail,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<CollectionVO | null>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: CollectionVO) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedItem(null)
  }

  const handleEdit = () => {
    toast.info('todo...')
    handleMenuClose()
  }

  const handleDelete = () => {
    toast.info('todo...')
    handleMenuClose()
  }

  const handleCardClick = (item: CollectionVO) => {
    handleSelectedCollectionId(item.collectionId)
    toggleShowCollectionDetail()
  }

  return (
    <Grid container spacing={2}>
      {collectionVOList.map((item) => (
        <Grid item xs={12} sm={6} key={item.collectionId}>
          <Card
            sx={{
              cursor: 'pointer',
              border: 1,
              borderColor: 'grey.200',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 2,
              },
            }}
            onClick={() => handleCardClick(item)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'text.primary',
                    flex: 1,
                  }}
                >
                  {item.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, item)}
                  sx={{ color: 'text.secondary' }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'inherit',
                  display: 'block',
                  mt: 1,
                }}
              >
                {item.description ?? '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ color: 'text.secondary' }}>
              编辑收藏夹
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ color: 'text.secondary' }}>
              删除收藏夹
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  )
}

export default CollectionList2