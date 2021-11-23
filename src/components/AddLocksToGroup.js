import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { assignNewLock } from '../slices/groupsSlice'
import { fetchLocks, selectLocks } from '../slices/locksSlice'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  CircularProgress
} from '@mui/material'

// eslint-disable-next-line react/prop-types
export const AddLocksToGroup = ({ open, groupId, onClose }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchLocks())
  }, [dispatch])

  const allLocks = useSelector(selectLocks)
  const [newLockIds, setNewLockIds] = useState([])
  const [pending, setPending] = useState(false)
  const [failAdds, setFailAdds] = useState([])

  const onNewLocksChanged = (e) => {
    const { value } = e.target
    setNewLockIds(typeof value === 'string' ? value.split(',') : value)
  }

  const onCloseDialog = () => {
    setNewLockIds([])
    setFailAdds([])
    setPending(false)
    onClose()
  }

  const onAssigningNewLock = async () => {
    setPending(true)
    const failAddsTemp = []
    let i = 0
    while (i < newLockIds.length) {
      const newLockId = newLockIds[i]
      i++
      try {
        const resultAction = await dispatch(assignNewLock({ groupId, lockId: newLockId }))
        unwrapResult(resultAction)
      } catch (error) {
        failAddsTemp.push(newLockId)
      }
    }
    setPending(false)
    if (failAddsTemp.length === 0) {
      onCloseDialog()
    } else {
      setFailAdds(failAddsTemp)
      setNewLockIds(failAddsTemp) // i.e. remove the successfully added ones
    }
  }

  const onRemoveLock = (lockId) => {
    setFailAdds(failAdds.filter(lock => lock !== lockId))
    setNewLockIds(newLockIds.filter(lock => lock !== lockId))
  }

  function getStyles (lock) {
    return {
      fontWeight:
        newLockIds.indexOf(lock) === -1
          ? 400
          : 600
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Doors</DialogTitle>
      {pending
        ? (
          <DialogContent sx={{ width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress sx={{ marginBottom: '10px' }} />
            Adding locks...
          </DialogContent>
          )
        : failAdds.length > 0
          ? (
            <DialogContent sx={{ width: '500px' }}>
              <DialogContentText>The following locks could not be added. Try again.</DialogContentText>
              {failAdds.map(lockId => (
                <Chip
                  key={lockId}
                  label={allLocks.find((lock) => lock.id === lockId).name}
                  sx={{ marginTop: '10px', marginRight: '10px' }}
                  onDelete = {() => onRemoveLock(lockId)}
                />
              ))}
            </DialogContent>
            )
          : (
            <DialogContent sx={{ width: '500px' }}>
              <FormControl>
                <InputLabel>Select Doors</InputLabel>
                {/* TODO: Fix how the input label gets cut off at the top */}
                <Select
                  multiple
                  value={newLockIds}
                  onChange={onNewLocksChanged}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={allLocks.find((lock) => lock.id === value).name} />
                      ))}
                    </Box>
                  )}
                  sx={{ width: '450px' }}
                >
                  {allLocks.map((lock) => (
                    <MenuItem
                      key={lock.id}
                      value={lock.id}
                      name={lock.name}
                      style={getStyles(lock.id)}
                    >
                      {lock.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            )}
      <Divider />
      <DialogActions>
        <Button onClick={onCloseDialog}>Cancel</Button>
        <Button onClick={onAssigningNewLock} disabled={newLockIds.length === 0}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}
