import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { SERVER_BASE_URL } from '../utils/serverUrl';
import { addToCart } from '../store/reducers/CartReducer';
import { useDispatch } from 'react-redux';

const SearchResult = () => {
    const location = useLocation();
    const prods = location.state || [];
    const [prodToAdd, setProdToAdd] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (prodToAdd) {
            dispatch(addToCart(prodToAdd));
            setProdToAdd();
        }
    }, [prodToAdd]);
    return (
        <div className='flex flex-wrap items-center justify-center gap-3 mt-5'>
            {prods.length > 0 ?
                prods.map((p) => {
                    return (
                        <div className="prod flex flex-col border w-[330px] h-[500px] border-none">
                            <div className='bg-sky-100 w-auto h-[220px] flex items-center justify-center p-2 '>
                                <img src={SERVER_BASE_URL + "/uploads/" + p.images[0]} className='w-52 h-auto rounded-lg hover:scale-125 cursor-pointer' />
                            </div>
                            <div className='bg-white flex flex-col w-[330px] h-[230px] gap-2 p-4 relative'>
                                <Link to={'/products/' + p._id}><h3 className='text-lg font-sans font-bold absolute top-[10px]'>{p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name}</h3></Link>
                                <p className='text-slate-500 font-sans absolute top-[70px]'>{p.category}</p>
                                <p className='text-red-700 text-lg font-semibold absolute top-[100px]'>${p.price}</p>
                                <div onClick={() => {
                                    console.log('adding to cart');
                                    setProdToAdd(p);
                                }} className='relative top-[130px] cursor-pointer bg-red-600  py-1 text-white rounded-full w-40 text-center hover:bg-red-700 hover:scale-110'>
                                    <button type='submit' className='cursor-pointer'>Add To cart</button>
                                </div>
                            </div>
                        </div>
                    )
                })
                :
                <h1 className='text-center text-2xl'>
                    No Products Match Your Search
                </h1>
            }
        </div>
    )
}

export default SearchResult