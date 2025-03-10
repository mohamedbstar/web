import { createSlice } from "@reduxjs/toolkit";

const CartReducer = createSlice({
    initialState : [],
    name : "CartReducer",
    reducers : {
        addToCart : (state, action)=>{
            //const newState = [...state, action.payload];
            console.log('adding to cart..............');
            let newItem ;
            let newState;
            if (state.find((i)=>i._id == action.payload._id)) {
                //increase quantity
                newItem = {...state.find((i)=>i._id == action.payload._id)};
                newState = state.filter((i)=>i._id != action.payload._id);
                newItem.quantity += 1
                newState = [...newState, newItem]
            }else{
                //add to the cart with quantity 1
                newItem = {...action.payload};
                newItem.quantity = 1;
                newState = [...state, newItem]
            }
            
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
        removeFromCart : (state, action)=>{
            const newState = state.filter((i)=>i._id != action.payload._id);
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
        setCart : (state, action)=>{
            localStorage.setItem('cart', JSON.stringify(action.payload));
            return action.payload;
        },
        clearCart : (state, action)=>{
            localStorage.setItem('cart', JSON.stringify([]));
            return []
        },
        increaseItemInCart : (state, action)=>{
            let newItem = {...state.find((i)=>i._id == action.payload._id)}
            let newState = state.filter((i)=>i._id != action.payload._id)
            newItem.quantity += 1
            newState = [...newState, newItem];
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
        decreaseItemInCart : (state, action)=>{
            console.log('in reducer');
            
            let newState =  state.map((i)=>{
                if(i._id != action.payload._id){
                    return i;
                }else{
                    let newProd = {...i};
                    newProd.quantity -= 1;
                    if (newProd.quantity  > 0) {
                        return newProd;
                    }
                    return null;
                }
            })
            
            newState = newState.filter((i)=> i != null)
            console.log("newState=> "+newState);
            
            const returnObj =  newState.length > 0 ? newState : [];
            localStorage.setItem('cart', JSON.stringify(returnObj));
            return returnObj;
        }
    }
})

export const {addToCart, removeFromCart,setCart ,clearCart, increaseItemInCart,decreaseItemInCart} = CartReducer.actions;
export default CartReducer.reducer;