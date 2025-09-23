import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
/* import type { UserState } from '@/domain/user'
import { Gender, Admin } from '@/domain/user' */

interface UserState {
    name: string;
    age: number;
}

const initialState: UserState = {
    name: 'Guest',
    age: 0,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName(state, action: PayloadAction<string>) { 
            state.name = action.payload
        },
        setAge(state, action: PayloadAction<number>) {
            // 更新用户年龄
            state.age = action.payload;
        }
    },
})

export const { setName, setAge } = userSlice.actions
export default userSlice.reducer