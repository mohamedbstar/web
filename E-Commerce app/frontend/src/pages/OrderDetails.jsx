import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl';

const OrderDetails = () => {
    const params = useParams();
    const orderId = params.id;
    const CurrentUser = useSelector((state) => state.CurrentUser);
    const [order, setOrder] = useState();
    const token = useSelector((state) => state.Token);
    const LoggedIn = useSelector((state) => state.LoggedIn);
    const [gError, setGError] = useState("");
    const [orderYear, setOrderYear] = useState("");
    const [orderMonth, setOrderMonth] = useState("");
    const [orderDay, setOrderDay] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        //check if logged in and get the user orders
        if (!LoggedIn) {
            navigate("/login");
        }
    }, []);
    useEffect(() => {
        const url = SERVER_API_URL + "/orders/" + orderId;
        async function getOrder() {

            const res = await fetch(url, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            });
            const resJson = await res.json();
            if (resJson.status != 'success') {
                setGError(resJson.message);
            } else {
                console.log('order is ' + resJson.data);

                setOrder(resJson.data);
            }
        }
        getOrder();
    }, []);
    useEffect(() => {
        if (order) {
            const timestamp = Number(order.timestamp); // Equivalent to "2023-01-01T00:59:59.000Z"

            // Create a Date object from the timestamp
            const date = new Date(timestamp);

            // Extract the date components
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-indexed (0-11)
            const day = date.getDate();

            console.log(`${year}-${month}-${day}`); // Output: "2023-1-1"
            setOrderDay(day);
            setOrderMonth(month);
            setOrderYear(year);
        }
    }, [order])

    return (
        <>
            {order &&
                <div className='flex flex-col m-10 gap-3'>
                    <h1 className='font-bold text-3xl'>Order Details</h1>
                    <div className='flex justify-between w-[50%]'>
                        <h1 className='text-lg'>Order ID: {order.id}</h1>
                        <h1 className='text-lg'>Orderd at: {orderDay}/{orderMonth}/{orderYear}</h1>
                    </div>
                    {order &&
                        <div className='flex flex-wrap gap-2'>
                            {
                                order.items.map((p) => {
                                    return (
                                        <div className="prod bg-white rounded-2xl flex flex-col gap-2  items-start w-[300px]  relative p-5">
                                            <img src={SERVER_BASE_URL + "/uploads/" + p.images[0]} className='w-[160px] aspect-square' />
                                            <h2 className='self-start font-bold'>{p.name.length > 20 ? p.name.substring(0, 20) : p.name}</h2>
                                            <div className='flex justify-between w-[100%]'>
                                                <h2 className='font-bold text-slate-800'>${p.price}</h2>
                                                <h2 className='font-bold'>{p.quantity} item{p.quantity > 1 ? 's' : ''}</h2>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default OrderDetails