import React from 'react'
import { useSelector } from 'react-redux'
import { selectGroups } from '../slices/groupsSlice'
import { Link } from 'react-router-dom'
import './GroupsList.css'
import {
  Box,
  Paper,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined'

export const GroupsList = () => {
  const groups = useSelector(selectGroups)
  const loadStatus = useSelector(state => state.groups.status)

  const renderedGroups = groups.map(group => (
    <ListItem key={group.id} sx={{ paddingTop: '3px', paddingBottom: '3px', marginLeft: '10px' }}>
      <ListItemButton component={Link} to={`/groups/${group.id}`}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={group.name} secondary={group.desc ? group.desc : 'No description'} />
        <SensorDoorOutlinedIcon />
        <span className="numLocks">
          {group.numLocks}
        </span>
      </ListItemButton>
    </ListItem>
  ))

  if (loadStatus === 'loading') {
    return (
      <Box className="pageContainer">
        <CircularProgress sx={{ textAlign: 'center', marginBottom: '15px' }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box className="pageContainer">
      <Typography variant="h2" textAlign="left">Groups</Typography>
      <Typography variant="body2" textAlign="left">Add members to groups and assign different access rights</Typography>
      <Paper elevation={3} className="groupsContainer">
        <Button variant="outlined" sx={{ margin: 2 }}>Add Group</Button>
        <Divider />
        <List sx={{ paddingTop: 2, paddingBottom: 2 }}>
          {renderedGroups}
        </List>
      </Paper>
    </Box>
  )
}
