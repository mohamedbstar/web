import {configureStore} from '@reduxjs/toolkit'
import TokenSlice from "./reducers/TokenSlice.js"
import LoggedInSlice from "./reducers/LoggedInReducer.js"
import CurrentUserSlice from "./reducers/CurrentUserSlice.js"
import CartReducer from "./reducers/CartReducer.js"

const store = configureStore({
    reducer : {
        Token : TokenSlice,
        LoggedIn : LoggedInSlice,
        CurrentUser : CurrentUserSlice,
        Cart : CartReducer
    }
}) 

export default store;