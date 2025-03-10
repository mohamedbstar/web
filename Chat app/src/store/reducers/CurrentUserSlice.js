import { createSlice } from "@reduxjs/toolkit";

const CurrentUserSlice = createSlice({
    initialState : {},
    name : "CurrentUserSlice",
    reducers : {
        setCurrentUser : (state, action)=>{
            return action.payload;
        },
        clearCurrentUser : (state, action)=>{
            return {};
        }
    }
})

export const {setCurrentUser, clearCurrentUser} = CurrentUserSlice.actions;
export default CurrentUserSlice.reducer;