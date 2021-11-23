import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { KisiClient } from '../http-common'

const initialState = {
  items: [
    // For testing without API
    // {
    //   id: 1,
    //   name: 'Test group',
    //   desc: 'Test desc',
    //   numLocks: 1,
    //   locks: [
    //     { groupLockId: 0, lockId: 0, name: 'Test lock', desc: 'some desc' }
    //   ]
    // },
    // { id: 2, name: 'Test group 2', desc: 'Test desc 2', numLocks: 0, locks: [] }
  ],
  status: 'idle',
  error: null
}

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await KisiClient.get('groups')
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.message })
    }
  }
)

export const fetchGroupLocks = createAsyncThunk(
  'groups/fetchGroupLocks',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await KisiClient.get('group_locks', {
        params: { group_id: groupId }
      })
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.message })
    }
  }
)

export const assignNewLock = createAsyncThunk(
  'groups/assignNewLock',
  async ({ groupId, lockId }) => {
    const response = await KisiClient.post('group_locks', {
      group_id: Number(groupId),
      lock_id: Number(lockId)
    })
    return response.data
  }
  // error handled in the AddLocksToGroup component as it needs to know if request failed
)

export const deassignLock = createAsyncThunk(
  'groups/deassignLock',
  async ({ groupId, groupLockId }, { fulfillWithValue, rejectWithValue }) => {
    try {
      await KisiClient.delete(`group_locks/${groupLockId}`) // success returns no content
      return fulfillWithValue({ groupId: groupId, groupLockId: groupLockId })
    } catch (error) {
      return rejectWithValue({ error: error.message })
    }
  }
)

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // console.log('Fetch groups succeeded: ', action.payload)
        action.payload.forEach(groupData => {
          state.items.push({
            id: groupData.id,
            name: groupData.name,
            desc: groupData.description,
            numLocks: groupData.locks_count,
            locks: []
          })
        })
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed'
        // console.log('Fetch groups failed: ', action.error.message)
        state.error = action.error.message
      })
      .addCase(fetchGroupLocks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchGroupLocks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // console.log('Fetch group locks succeeded: ', action.payload)
        // they should all belong to the same group
        if (action.payload.length > 0) {
          const existingGroup = state.items.find(group => group.id === action.payload[0].group_id)
          if (existingGroup) {
            existingGroup.locks = [] // reset
            action.payload.forEach(groupLockData => {
              existingGroup.locks.push({
                groupLockId: groupLockData.id,
                lockId: groupLockData.lock.id,
                name: groupLockData.lock.name,
                desc: groupLockData.lock.description
              })
            })
          }
        }
      })
      .addCase(fetchGroupLocks.rejected, (state, action) => {
        state.status = 'failed'
        // console.log('Fetch group locks failed: ', action.error.message)
        state.error = action.error.message
      })
      .addCase(assignNewLock.fulfilled, (state, { payload }) => {
        // console.log('Assign new lock succeeded, payload:', payload)
        // action.payload returns the group lock object
        state.status = 'succeeded'
        const existingGroup = state.items.find(group => group.id === payload.group_id)
        if (existingGroup) {
          existingGroup.locks.push({
            groupLockId: payload.id,
            lockId: payload.lock.id,
            name: payload.lock.name,
            desc: payload.lock.description
          })
          existingGroup.numLocks++
        }
      })
      .addCase(deassignLock.fulfilled, (state, action) => {
        // payload is custom, with groupId and groupLockId
        const payload = action.payload
        // console.log('Deassign lock succeeded, payload:', payload)
        state.status = 'succeeded'
        const existingGroup = state.items.find(group => group.id === payload.groupId)
        if (existingGroup) {
          existingGroup.locks = existingGroup.locks.filter(lock => lock.groupLockId !== payload.groupLockId) // remove lock with matching groupLockId
          existingGroup.numLocks--
          // console.log('Post delete:', existingGroup.locks)
        }
      })
  }
})

export const selectGroups = (state) => state.groups.items

export const selectGroupById = (state, groupId) => {
  return state.groups.items.find(group => group.id === groupId)
}

export default groupsSlice.reducer
