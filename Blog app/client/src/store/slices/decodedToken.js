import {createSlice} from "@reduxjs/toolkit"

const decodedTokenSlice = createSlice({
    name : 'tokenSlice',
    initialState : '',
    reducers : {
        setDecodedToken : (state, action)=>{
            return action.payload;
        },
        clearDecodedToken : (state, action)=>{
            return '';
        }
    }
})


export const {setDecodedToken, clearDecodedToken} = decodedTokenSlice.actions;
export default decodedTokenSlice.reducer;