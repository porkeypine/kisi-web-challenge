import { configureStore } from '@reduxjs/toolkit'
import groupsReducer from './slices/groupsSlice'
import locksReducer from './slices/locksSlice'

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
    locks: locksReducer
  }
})
