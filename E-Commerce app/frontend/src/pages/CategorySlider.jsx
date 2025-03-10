import React, { useEffect, useState } from 'react'
import airpods from "../assest/cats/airpods.webp"

import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs"
import { Link } from 'react-router-dom'
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, setCart } from '../store/reducers/CartReducer.js'
import useAddTOCart from '../utils/cartUtils.js'
import CartAdder from './CartAdder.jsx'
const CategorySlider = React.memo((props) => {
    const dispatch = useDispatch();
    const Cart = useSelector((state) => state.Cart);
    const [prods, setProds] = useState(props.items);
    const [prodToAdd, setProdToAdd] = useState();

    let prosdCont;
    useEffect(() => {

        prosdCont = document.getElementById('prods-cont' + props.category);
        document.getElementById('sLeftBtn' + props.category).addEventListener('click', () => {
            console.log('Left Btn Clicked');

            prosdCont.scrollBy({
                left: -100,
                behaviour: 'smooth'
            })
        });

        document.getElementById('sRightBtn' + props.category).onclick = () => {
            console.log('Right Btn Clicked');
            prosdCont.scrollBy({
                left: 100,
                behaviour: 'smooth'
            })
        }
    }, []);

    useEffect(() => {
        if (prodToAdd) {
            dispatch(addToCart(prodToAdd));
            setProdToAdd();
            
        }
    }, [prodToAdd]);


    return (
        <div className='tops p-5 relative'>
            <h2 className='font-bold text-3xl p-4 relative'>{props.category}</h2>
            <BsArrowLeftCircleFill id={'sLeftBtn' + props.category} size={40} className='z-50 absolute bottom-52 left-12 text-slate-500' />
            <div id={'prods-cont' + props.category} className="prods-cont relative flex items-start justify-start overflow-scroll p-2 w-92 gap-4">
                {
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
                }
            </div>

            <BsArrowRightCircleFill id={'sRightBtn' + props.category} size={40} className='absolute  bottom-52 right-12 text-slate-500' />

        </div>
    )
}
)

export default CategorySlider