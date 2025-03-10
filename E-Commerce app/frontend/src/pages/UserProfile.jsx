import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"
import { SERVER_API_URL } from "../utils/serverUrl.js"

const UserProfile = () => {
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const [userOrders, setUserOrders] = useState([]);
  const token = useSelector((state) => state.Token);
  const LoggedIn = useSelector((state) => state.LoggedIn);
  const [orders, setOrders] = useState([]);
  const [gError, setGError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    //check if logged in and get the user orders
    if (!LoggedIn) {
      navigate("/login");
    } else {
      const url = SERVER_API_URL + "/orders/user/" + CurrentUser._id;
      async function getOrders() {
        const res = await fetch(url, {
          headers: {
            'Authorization': "Bearer " + token
          }
        });
        const resJson = await res.json();
        if (resJson.status != 'success') {
          setGError(resJson.message);
        } else {
          setOrders(resJson.data);
        }
      }
      getOrders();
    }
  }, []);

  return (
    <div className='flex flex-nowrap gap-5 justify-between'>
      <div className='flex flex-col items-center justify-center m-5 w-[30%]'>
        <h1 className='font-bold text-2xl'>All Info</h1>
        {orders.length > 0 ?
          <div className='orders flex flex-wrap gap-2 w-[100%]'>
            {
              orders.map((o) => {
                const numProds = o.items.length;
                const totalPrice = o.items.reduce((sum, item) => sum + Number(item.price), 0);
                const orderId = o.id;
                return (
                  <div className="order rounded-2xl flex flex-col gap-2 w-[100%] relative m-5 p-5 bg-white">
                    <Link to={'/order/'+o.id}><h2 className='font-bold text-gray-600 text-2xl'>order id: {o.id}</h2></Link>
                    <div className='flex justify-between'>
                      <h2 className='text-gray-600 text-2xl'>{numProds} item{numProds > 1 ? 's' : ''}</h2>
                      <h2 className='text-gray-600 text-2xl'>{totalPrice}$</h2>
                    </div>
                  </div>
                )
              })
            }
          </div> :
          <h1>No orders to show</h1>
        }
      </div>
      <div className='summary w-[60%] m-5'>
        <div className='flex flex-col items-center justify-center p-5'>
          <h1 className='bg-red-600 text-white w-[80%] text-center text-2xl rounded-md'>{CurrentUser.name}'s Orders</h1>
          <div className='bg-white flex flex-col w-[80%] p-2 gap-3 rounded-b-md'>
            <div className='flex justify-between'>
              <h1 className='text-2xl'>Total Orders</h1>
              <p className='text-2xl'>{orders.length}</p>
            </div>
            <div className='flex justify-between'>
              <h1 className='text-2xl'>Email</h1>
              <p className='text-2xl'>{CurrentUser.email}</p>
            </div>
            <div className='flex justify-between'>
              <h1 className='text-2xl'>Role</h1>
              <p className='text-2xl'>{CurrentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default UserProfile