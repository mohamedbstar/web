import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../store/reducers/CartReducer.js";



function useAddTOCart(p) {
    const Cart = useSelector((state) => state.Cart);
    const dispatch = useDispatch();

    useEffect(() => {
        if (p) {
            let cartItem = Cart.find((item) => item._id == p._id);
            //if the item exists in the cart, then increase its quantity
            if (cartItem) {
                //increase its quantity in the cart
                let anotherItem = { ...cartItem }
                anotherItem.quantity += 1;
                //update the item in the cart
                const newCart = Cart.map((item) => {
                    return item._id == p._id ? anotherItem : item;
                })
                dispatch(setCart(newCart))
                //update the item in local storage

                localStorage.setItem('cart', JSON.stringify(newCart));
                return;
            }
            //else add the product to the cart
            console.log('inside addTOCart');
            let newProduct = { ...p };
            newProduct.quantity = 1;
            //add to cart slice
            dispatch(addToCart(newProduct));

            //write to cart item in the localStorage
            let storageCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            storageCart.push(newProduct);
            localStorage.setItem('cart', JSON.stringify(storageCart));
        }
    }, [p]);

}
export default useAddTOCart;