import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/reducers/CartReducer';

const CategoryProds = () => {
    const params = useParams();
    const category = params.category;
    const [prods, setProds] = useState([]); //products of the requested category
    const navigate = useNavigate();
    const [prodToAdd, setProdToAdd] = useState(); //item to be added to cart if clicked
    const [gError, setGError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchProds() {
            const url = SERVER_API_URL + "/products/categories/" + category;
            const res = await fetch(url);
            const resJson = await res.json();
            if (resJson.status != 'success') {
                setGError(resJson.message);
            } else {
                setProds(resJson.data);
            }
        }
        if (category) {
            //fetch data
            fetchProds();
        }
    }, [category]);

    useEffect(()=>{
        //add the item to the cart
        if (prodToAdd) {
            dispatch(addToCart(prodToAdd));
            setProdToAdd();
        }
    },[prodToAdd]);
    return (
        <div>
            {gError && <p className='w-[50%] text-white bg-red-700 rounded-md self-center justify-self-center m-3 text-center'>{gError}</p>}
            {
                prods.length > 0 ? <div className='main w-[70%] h-[100vh] p-8 flex flex-col'>
                    <div className='flex flex-row p-5 justify-between'>
                        <h1 className='font-bold text-3xl '>All Products in {category}</h1>

                    </div>
                    <div className='all-prods flex flex-wrap gap-4'>
                        {
                            prods.map((p) => {
                                return (
                                    <div className="prod bg-white rounded-2xl flex flex-col gap-5  items-center w-[300px]  relative p-5">
                                        <img src={SERVER_BASE_URL + "/uploads/" + p.images[0]} className='w-[160px] aspect-auto rounded-full' />
                                        <h2 className='self-start font-bold text-gray-600'>{p.name.length > 20 ? p.name.substring(0, 20) : p.name}</h2>
                                        <h2 className='self-start font-bold text-slate-800'>${p.price}</h2>
                                        <div  onClick={()=>{
                                         console.log('adding to cart');
                                         setProdToAdd(p);
                                        }} className='relative cursor-pointer bg-red-600  py-1 text-white rounded-full w-40 text-center hover:bg-red-700 hover:scale-110'>
                                        <button type='submit' className='cursor-pointer'>Add To cart</button>
                                    </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div> : <h1 className='text-3xl font-bold text-center mt-7'>No Products In {category}</h1>
            }
        </div>
    )
}

export default CategoryProds