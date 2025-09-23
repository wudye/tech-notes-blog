import React from 'react'

import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
    },
/*     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {},
    enhancers: [], */
})

export default store
