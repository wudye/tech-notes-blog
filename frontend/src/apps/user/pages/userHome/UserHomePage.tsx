import React, { useState } from 'react'
import { UserHomeProfile, useUser2 } from '../../../../domain/user'
import { useParams } from 'react-router-dom'
import { Panel } from '../../../../base/components'
import { Tabs, Tab, Box } from '@mui/material'
import UserNoteList from './components/UserNoteList.tsx'
import UserCollectList from './components/UserCollectList.tsx'

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
      style={{ paddingTop: '16px' }}
    >
      {value === index && children}
    </div>
  )
}

const UserHomePage: React.FC = () => {
  const { userId } = useParams()
  const { userVO } = useUser2(userId ?? '')
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ mx: 'auto', width: 700 }}>
      <UserHomeProfile user={userVO} />
      <Box sx={{ mt: 2 }}>
        <Panel>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 400,
                '&.Mui-selected': {
                  fontWeight: 500,
                },
              },
            }}
          >
            <Tab label="笔记" />
            <Tab label="收藏" />
          </Tabs>
          <TabPanel value={activeTab} index={0}>
            <UserNoteList userId={userId} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <UserCollectList userId={userId} />
          </TabPanel>
        </Panel>
      </Box>
    </Box>
  )
}

export default UserHomePage