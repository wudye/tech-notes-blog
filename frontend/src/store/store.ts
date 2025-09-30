import React from 'react'

import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import appReducer from './appSlice'


export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
    },
/*     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {},
    enhancers: [], */
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
