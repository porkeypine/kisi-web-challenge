import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { KisiClient } from '../http-common'

const initialState = {
  items: [],
  status: 'idle',
  error: null
}
// lock: { id: 0, name: "Test lock", desc: "some desc" }

export const fetchLocks = createAsyncThunk(
  'locks/fetchLocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await KisiClient.get('locks')
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.message })
    }
  }
)

export const locksSlice = createSlice({
  name: 'locks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchLocks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // console.log('Fetch locks succeeded: ', action.payload)
        state.items = [] // reset
        action.payload.forEach(lockData => {
          state.items.push({
            id: lockData.id,
            name: lockData.name,
            desc: lockData.description
          })
        })
      })
      .addCase(fetchLocks.rejected, (state, action) => {
        state.status = 'failed'
        // console.log('Fetch locks failed: ', action.error.message)
        state.error = action.error.message
      })
  }
})

export const selectLocks = (state) => state.locks.items

export const selectLockById = (state, lockId) => {
  return state.locks.items.find(lock => lock.id === lockId)
}

export default locksSlice.reducer
