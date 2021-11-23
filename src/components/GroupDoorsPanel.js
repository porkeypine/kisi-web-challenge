import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectGroupById, deassignLock } from '../slices/groupsSlice'
import {
  Box,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material'
import { TabPanel } from '@mui/lab'
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined'
import DeleteIcon from '@mui/icons-material/Delete'

// eslint-disable-next-line react/prop-types
export const GroupDoorsPanel = ({ handleAdd, groupId }) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const dispatch = useDispatch()
  const group = useSelector(state => selectGroupById(state, groupId))
  const loadStatus = useSelector(state => state.groups.status)

  const onDeleteLock = async (groupLockId) => {
    setDeleteInProgress(true)
    await dispatch(deassignLock({ groupId: groupId, groupLockId: groupLockId }))
    setDeleteInProgress(false)
  }

  let renderedLocks = []
  renderedLocks = group.locks.map(lock => (
    <ListItem
    sx={{ paddingTop: '5px', paddingBottom: '10px', marginLeft: '10px' }}
    key={lock.groupLockId}
    secondaryAction={
      <IconButton onClick={() => onDeleteLock(lock.groupLockId)} edge="end" aria-label="delete">
        <DeleteIcon />
        </IconButton>
      }
      >
      <ListItemAvatar>
        <Avatar>
          <SensorDoorOutlinedIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={lock.name} secondary={lock.desc ? lock.desc : 'No description'} />
    </ListItem>
  ))
  return (
    <TabPanel value="1" sx={{ width: '100%', paddingTop: '10px', paddingBottom: '0px' }}>
      <Button variant="outlined" sx={{ margin: 2 }} onClick={handleAdd}>Add Doors</Button>
      <Divider />
      <List sx={{ paddingTop: 2, paddingBottom: 2 }}>
        {deleteInProgress
          ? (
            <Box sx={{ marginTop: '5px', marginLeft: '20px', textAlign: 'center' }}>
              <CircularProgress />
              <Typography>Deleting...</Typography>
            </Box>
            )
          : loadStatus !== 'loading' && renderedLocks.length === 0
            ? (
              <Typography sx={{ marginTop: '5px', marginLeft: '20px' }}>
                No doors.
              </Typography>
              )
            : renderedLocks}
      </List>
    </TabPanel>
  )
}
