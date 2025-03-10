import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/reducers/CartReducer';
import { SERVER_API_URL } from '../utils/serverUrl';


const CheckoutSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //get cart, token, currennt user
    const CartSlice = useSelector((state) => state.Cart);
    const token = useSelector((state) => state.Token);
    const CurrentUser = useSelector((state) => state.CurrentUser);
    const [order, setOrder] = useState([]);
    const [gError, setGError] = useState("");
    const [success, setSuccess] = useState(false);
    useEffect(()=>{
        //cancel showing the page when not coming from stripe

    },[]);

    useEffect(() => {
        async function clearCartSaveUserOrder() {
            if (CartSlice.length > 0) {
                setOrder([...CartSlice])
                let items = {cart:{CartSlice}};
                items.email = CurrentUser.email;
                //add order to current user in database
                const url = SERVER_API_URL + "/orders/user/" + CurrentUser._id;
                const res = await fetch(url, {
                    method: "POST",
                    headers : {
                        'Authorization' : "Bearer " + token,
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(items)
                })
                const resJson = await res.json();
                if (resJson.status != 'success') {
                    setGError(resJson.message);
                }else{
                    setSuccess(true);
                }
                //clear cart from redux and local storage
                dispatch(clearCart());
                localStorage.setItem("cart", JSON.stringify([]));
            }
        }
        clearCartSaveUserOrder();
    }, [CartSlice])

    return (
        <div>
            {gError && <p className='bg-red-600 w-[100%] text-white text-center self-center'></p>}
            {success && 
                <div className='w-[100%] h-[100vh] flex flex-col items-center justify-center '>
                    <h1 className='text-3xl'>Placed Order Successfully</h1>
                    <Link to={'/'} className='font-bold text-lg text-red-900 hover:text-red-500' >Back Home</Link>
                    </div>
            }
        </div>
    )
}

export default CheckoutSuccess