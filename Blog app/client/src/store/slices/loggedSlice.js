import {createSlice} from "@reduxjs/toolkit"


const loggedInSlice = createSlice({
    name : "loggedInSlice",
    initialState : false,
    reducers:{
        login : (state, action)=>{
            return true;
        },
        logout : (state, action)=>{
            return false;
        }
    }
})


export const {login, logout} = loggedInSlice.actions;
export default loggedInSlice.reducer;