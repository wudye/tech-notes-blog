import React, { useState } from 'react'
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Grid,
  Pagination,
  CircularProgress,
} from '@mui/material'
import { Admin, Banned } from '../types/types.ts'
import type { UserListQueryParams } from '../types/serviceTypes.ts'
import { useUserList } from '../hooks/useUserList.ts'

const UserList: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState<UserListQueryParams>({
    page,
    pageSize,
  })

  const { userList, pagination, loading } = useUserList(filters)

  const handleFilter = () => {
    setPage(1)
    setFilters({
      ...filters,
      page: 1,
    })
  }

  const handleReset = () => {
    const resetFilters = {
      page: 1,
      pageSize: pageSize,
    }
    setFilters(resetFilters)
    setPage(1)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
    setFilters({
      ...filters,
      page: newPage,
    })
  }

  return (
    <div className="rounded-lg bg-white p-4">
      {/* 筛选区域 */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="用户ID"
              value={filters.userId || ''}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="账号"
              value={filters.account || ''}
              onChange={(e) => setFilters({ ...filters, account: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="用户名"
              value={filters.username || ''}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>是否管理员</InputLabel>
              <Select
                value={filters.isAdmin ?? ''}
                label="是否管理员"
                onChange={(e) => setFilters({ ...filters, isAdmin: e.target.value as Admin })}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value={Admin.ADMIN}>是</MenuItem>
                <MenuItem value={Admin.NOT_ADMIN}>否</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>是否封禁</InputLabel>
              <Select
                value={filters.isBanned ?? ''}
                label="是否封禁"
                onChange={(e) => setFilters({ ...filters, isBanned: e.target.value as Banned })}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value={Banned.UNBANNED}>正常</MenuItem>
                <MenuItem value={Banned.BANNED}>已封禁</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleFilter} sx={{ mr: 1 }}>
            筛选
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            重置
          </Button>
        </Box>
      </Box>

      {/* 表格 */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户ID</TableCell>
              <TableCell>账号</TableCell>
              <TableCell>用户名</TableCell>
              <TableCell>是否管理员</TableCell>
              <TableCell>是否封禁</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              userList?.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.account}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isAdmin === Admin.ADMIN ? '是' : '否'}
                      color={user.isAdmin === Admin.ADMIN ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isBanned === Banned.BANNED ? '已封禁' : '正常'}
                      color={user.isBanned === Banned.BANNED ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页 */}
      {pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(pagination.total / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </div>
  )
}

export default UserList