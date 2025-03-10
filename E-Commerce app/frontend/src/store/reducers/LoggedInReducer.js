import { createSlice } from "@reduxjs/toolkit";

const LoggedInReducer = createSlice({
    initialState : false,
    name : "loggedInReducer",
    reducers : {
        login : (state, action)=>{
            state = true;
            return true;
        },
        logout : (state, action)=>{
            return false;
        }
    }
})

export const {login, logout} = LoggedInReducer.actions;
export default LoggedInReducer.reducer;