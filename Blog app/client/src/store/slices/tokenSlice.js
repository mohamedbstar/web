import {createSlice} from "@reduxjs/toolkit"

const tokenSlice = createSlice({
    name : 'tokenSlice',
    initialState : '',
    reducers : {
        setToken : (state, action)=>{
            return action.payload;
        },
        clearToken : (state, action)=>{
            return '';
        }
    }
})


export const {setToken, clearToken} = tokenSlice.actions;
export default tokenSlice.reducer;