import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decreaseItemInCart, increaseItemInCart, removeFromCart, setCart } from '../store/reducers/CartReducer';
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl';
import { FaRegPlusSquare } from "react-icons/fa";
import { FaRegMinusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const CartSlice = useSelector((state) => state.Cart);
  const token = useSelector((state) => state.Token);
  const [localCart, setLocalCart] = useState(CartSlice);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [gError, setGError] = useState("");
  const navigate = useNavigate();
  /*useEffect(() => {
    if (CartSlice.length == 0) {
      //make sure that cart is loaded from the localStorage
      console.log('before cartslice length is ' + CartSlice.length);

      dispatch(setCart(JSON.parse(localStorage.getItem('cart'))));
      console.log('after cartslice length is ' + CartSlice.length);
    }
  }, []);*/

  useEffect(() => {
    let totQ = 0;
    let totP = 0;
    if (CartSlice.length > 0) {
      console.log('Cart Slice length : ' + CartSlice.length);

      for (let index = 0; index < CartSlice.length; index++) {
        const element = CartSlice[index];
        totQ += element.quantity;
        totP = totP + (element.quantity * element.price);
      }

      setTotalItems(totQ);
      setTotalPrice(totP);
    }

  }, [CartSlice])

  function increase(p) {
    let newProd = { ...p };
    newProd.quantity += 1;
    dispatch(removeFromCart(p))
    dispatch(addToCart(newProd));

    //write to localStorage
    let storageCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    /*let prod = localCart.filter((i)=>i._id = newProd._id);
    prod.quantity += 1*/
    storageCart.map((i) => {
      if (i._id == newProd._id) {
        //increase quantity
        i.quantity += 1;
      }
      return i;
    })
    localStorage.setItem('cart', JSON.stringify(storageCart));
  }

  async function doCheckout() {
    //first make sure the user is logged in
    //then do the placeOrder
    console.log('Checkout clicked');
    console.log('cart slice ' + CartSlice);

    const url = SERVER_API_URL + "/orders/";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': "Bearer " + token,
        //content type
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: [...CartSlice] })
    })
    const resJson = await res.json();
    if (resJson.status != 'success') {
      setGError(resJson.message);
    } else {
      window.location = resJson.url;

    }
  }

  return (
    <div className='flex'>
      <div className='items flex flex-col gap-2 w-[70%] p-5'>
        {gError && <p className='w-[50%] text-white bg-red-700 rounded-md self-center justify-self-center m-3 text-center'>{gError}</p>}
        {CartSlice.length > 0 ?
          CartSlice.map((p) => {
            return (
              <div className='item flex w-70% relative'>
                <div className='bg-sky-50 w-[20%] flex items-center justify-center border border-2'>
                  <img src={SERVER_BASE_URL + "/uploads/" + p.images[0]} className='w-[70%] h-auto rounded-lg' />
                </div>
                <div className='bg-white w-[70%] p-5 flex flex-col gap-3 relative'>
                  <MdDelete onClick={() => dispatch(removeFromCart(p))} size={30} className='absolute top-3 right-3 text-red-600 cursor-pointer' />
                  <p className='text-2xl text-gray-800'>{p.name}</p>
                  <p className='text-lg text-gray-500'>{p.category}</p>
                  <div className='flex justify-between'>
                    <p className='text-lg font-bold text-red-600'>${p.price}</p>
                    <p className='text-lg font-bold'>Total: ${p.price * p.quantity}</p>
                  </div>
                  <div className='flex items-start gap-1'>
                    <FaRegMinusSquare size={30} className='hover:text-red-600 cursor-pointer' onClick={() => dispatch(decreaseItemInCart(p))} />
                    <p className='text-2xl'>{p.quantity}</p>
                    <FaRegPlusSquare size={30} className='hover:text-red-600 cursor-pointer' onClick={() => dispatch(increaseItemInCart(p))} />
                  </div>
                </div>
              </div>
            )
          }) : <h1 className='self-center text-3xl'>No Products To Show</h1>
        }
      </div>
      <div className='summary w-[30%]'>
        <div className='flex flex-col items-center justify-center p-5'>
          <h1 className='bg-red-600 text-white w-[80%] text-center text-2xl'>Summary</h1>
          <div className='bg-white flex flex-col w-[80%] p-2 gap-3'>
            <div className='flex justify-between'>
              <h1 className='text-2xl'>Quantity</h1>
              <p className='text-2xl'>{CartSlice.length > 0 ? totalItems : 0}</p>
            </div>
            <div className='flex justify-between'>
              <h1 className='text-2xl'>Price</h1>
              <p className='text-2xl'>${CartSlice.length > 0 ? totalPrice : 0}</p>
            </div>
          </div>
          <button onClick={() => doCheckout()} className='text-2xl w-[80%] bg-sky-400 p-3 text-white'>Checkout</button>
        </div>
      </div>
    </div>
  )
}

export default Cart