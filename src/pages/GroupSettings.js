import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { selectGroupById, fetchGroupLocks } from '../slices/groupsSlice'
import { AddLocksToGroup } from '../components/AddLocksToGroup'
import { GroupDoorsPanel } from '../components/GroupDoorsPanel'
import './GroupsSettings.css'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Tab
} from '@mui/material'
import { TabContext, TabList } from '@mui/lab'

export const GroupSettings = () => {
  const params = useParams()
  const groupId = Number(params.groupId) // to match with what's in the store
  const group = useSelector(state => selectGroupById(state, groupId))
  const loadStatus = useSelector(state => state.groups.status)
  const dispatch = useDispatch()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState('1')
  useEffect(() => {
    dispatch(fetchGroupLocks(groupId))
  }, [dispatch, groupId])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const openAddLocksDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  if (!group && loadStatus !== 'loading') {
    // e.g. user manually keyed in random url to arrive at a non-existent group's page
    // should see a "Group Not Found" page
    return (
      <Box className="pageContainer">
        <Typography variant="h5">Group not found</Typography>
      </Box>
    )
  } else if (loadStatus === 'loading') {
    return (
      <Box className="pageContainer">
        <CircularProgress sx={{ marginBottom: '15px' }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box className="pageContainer">
      <Typography variant="h2" textAlign="left">{group.name}</Typography>
      <Typography variant="body2" textAlign="left">Add members to groups and assign different access rights</Typography>
      <Paper elevation={3} className="settingsContainer">
        <TabContext value={tabValue}>
          <Box sx={{ borderRight: 1, borderColor: 'divider', display: 'inline-flex' }}>
            <TabList onChange={handleTabChange} orientation="vertical" className="tabList">
              <Tab label="Members" value="0" />
              <Tab label="Doors" value="1" />
              <Tab label="Floors" value="2" />
            </TabList>
          </Box>
          <GroupDoorsPanel
            handleAdd={openAddLocksDialog}
            groupId={groupId}
          />
        </TabContext>
      </Paper>
      <AddLocksToGroup open={dialogOpen} groupId={groupId} onClose={handleCloseDialog} />
      {/* TODO: handle clicking out of the dialog without clicking any button */}
    </Box>
  )
}
