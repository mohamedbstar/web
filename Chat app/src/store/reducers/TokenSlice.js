import { createSlice } from "@reduxjs/toolkit";

const TokenSlice = createSlice({
    initialState : "",
    name : "TokenSlice",
    reducers : {
        setToken : (state, action)=>{
            return action.payload;
        },
        clearToken : (state, action)=>{
            return "";
        }
    }
})

export const {setToken, clearToken} = TokenSlice.actions;
export default TokenSlice.reducer;