import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa"
import CategorySlider from './CategorySlider';
import CartAdder from './CartAdder';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/reducers/CartReducer';


const ProductDetails = React.memo(() => {
    const params = useParams();
    const productId = params.id;
    const dispatch = useDispatch();
    const [gError, setGError] = useState('');
    const [prod, setProd] = useState();
    const [curImageIndex, setCurImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [curImage, setCurImage] = useState("");
    const [sameCatProds, setSameCatProds] = useState([]);
    const [display, setDisplay] = useState();
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(SERVER_API_URL + "/products/" + productId);
            const resJson = await res.json();
            console.log(resJson.status);
            console.log(resJson.message);
            console.log(resJson.code);
            if (resJson.status != 'success') {
                setGError(resJson.message);
            } else {
                setProd(resJson.data);
                setImages(resJson.data.images);
            }
            console.log('resJson ====> ' + resJson);

        }
        fetchData();
    }, []);


    useEffect(() => {
        if (prod) {
            async function fetchDataInCat(cat) {
                const res = await fetch(SERVER_API_URL + "/products/" + "categories/" + cat);
                const resJson = await res.json();
                console.log(resJson.status);
                console.log(resJson.message);
                console.log(resJson.code);
                if (resJson.status != 'success') {
                    setGError(resJson.message);
                } else {
                    setSameCatProds(resJson.data);
                }
            }
            fetchDataInCat(prod.category);
        }
    }, [prod]);

    useEffect(()=>{
        setTimeout(()=>{
            setDisplay(false);
        },3000)
    },[addedToCart])

    useEffect(() => {
        console.log('curImageIndex ====> ' + curImageIndex);
    }, [curImageIndex]);
    return (
        <div className='grid w-[100vw] p-7'>
            {prod &&
                <div className='p-info flex items-center justify-center  box-border'>
                    <div className='imgs flex flex-row items-start justify-start w-[40%] box-border p-0'>
                        <div className='flex flex-col gap-2 w-[30%] relative left-10'>
                            {
                                images.map((i, ind) => {
                                    return <img src={SERVER_BASE_URL + "/uploads/" + i}
                                        onClick={() => setCurImageIndex(ind)}
                                    className='w-[100px] aspect-auto'
                                    />
                                })
                            }
                        </div>
                        <div className='flex items-center justify-center ps-0 w-[90%]'>
                            <img src={SERVER_BASE_URL + "/uploads/" + images[curImageIndex]} className='w-[70%] aspect-square' />
                        </div>
                    </div>
                    <div className='price w-[60%] h-[100%] flex flex-col justify-start gap-3 relative'>
                        <h1 className='text-5xl font-bold'>{prod.name}</h1>
                        <h1 className='text-2xl text-slate-400 font-bold'>{prod.category}</h1>
                        <div className='flex '>
                            {
                                <>
                                    <FaStar size={30} className='text-red-600' />
                                    <FaStar size={30} className='text-red-600' />
                                    <FaStar size={30} className='text-red-600' />
                                    <FaStar size={30} className='text-red-600' />
                                    <FaStar size={30} className='' />
                                </>
                            }
                        </div>
                        <div className='flex gap-5'>
                            <p className='text-2xl font-bold text-red-600'>${prod.price}</p>
                            <p className='text-2xl font-bold line-through'>${prod.price}</p>
                        </div>
                        <div onClick={() => {
                                dispatch(addToCart(prod));
                                setDisplay(true);
                                setAddedToCart(!addedToCart);
                            }} className='cursor-pointer bg-red-600 text-white rounded-lg w-40 text-center hover:bg-red-700 hover:scale-110'>
                            <button type='submit' className='cursor-pointer'>Add To Cart</button>
                            {display && <p className='bg-green-500 text-white p-0 border border-white border-2'>Added To Cart</p>}
                        </div>
                        <div className='flex flex-col gap-2 w-[50%]'>
                            <h1 className='text-2xl text-slate-500'>Description</h1>
                            {
                                <p className='text-lg'>{prod.description}</p>
                            }
                        </div>
                    </div>
                </div>
            }
            {sameCatProds.length > 0 &&
                <div className='flex flex-col mt-7'>
                    <h1 className='text-3xl self-center'>Recomended Products</h1>
                    <CategorySlider category={''} items={sameCatProds} />
                </div>
            }
        </div>
    )
})

export default ProductDetails