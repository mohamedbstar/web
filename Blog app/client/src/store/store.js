import {} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import loggedInSlice from "./slices/loggedSlice"
import tokenSlice from "./slices/tokenSlice.js"
import decodedToken from "./slices/decodedToken.js"

const store = configureStore({
    reducer : {
        loggedInSlice : loggedInSlice,
        token : tokenSlice,
        decoded_token : decodedToken
    }
})

export default store;