import { createSlice } from "@reduxjs/toolkit";

const LoggedInReducer = createSlice({
    initialState : false,
    name : "loggedInReducer",
    reducers : {
        login : (state, action)=>{
            console.log('doing login');
            
            return true;
        },
        logout : (state, action)=>{
            return false;
        }
    }
})

export const {login, logout} = LoggedInReducer.actions;
export default LoggedInReducer.reducer;