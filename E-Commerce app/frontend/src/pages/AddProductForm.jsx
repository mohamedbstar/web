import React, { useEffect, useState } from 'react'
import "./css/AddProductForm.css"
import { IoMdClose } from "react-icons/io";
import { SERVER_API_URL } from '../utils/serverUrl';
import { useSelector } from 'react-redux';

const categs = [
    'airpod','camera','earphone','mobile','mouse','printer','processor','refrigerator','speaker','trimmer','tv','watch'
]

const AddProductForm = ({ setVisible, setSuccessMessage , url, formMethod, pId, setPId}) => {
    let fileInput;
    let fileDiv;
    const token = useSelector((state)=>state.Token);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [gError, setGError] = useState("")
    const [cats, setCats] = useState(categs);

    useEffect(() => {
        fileInput = document.getElementById('file-input');
        fileDiv = document.getElementById('file-div');
        fileDiv.addEventListener('click', () => {
            fileInput.click();
        });
    }, []);
    async function doSubmit(e) {
        e.preventDefault();
        console.log(name);
        console.log(brand);
        console.log(category);
        console.log(images);
        console.log(price);
        console.log(sellingPrice);
        console.log(description);
        console.log(quantity);

        //the function used to update state based on the field
        const formData = new FormData();
        formData.append("name", name);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("sellingPrice", sellingPrice);
        formData.append("description", description);
        for (let index = 0; index < images.length; index++) {
            const element = images[index];
            formData.append("images", element);
        }
        formData.append("quantity", quantity);

        console.log('form data =========> ' + formData.images);
        console.log('url is =====> ' + url);
        
        let fetchUrl;
        if (pId != undefined && pId != '') {
            fetchUrl = url + pId;
        }else{
            fetchUrl = url;
        }
        const res = await fetch(fetchUrl, {
            method: formMethod,
            headers: {
                //"Content-Type": "multipart/form-data; boundary=---------------------------974767299852498929531610575",
                'Authorization' : 'Bearer '+token
            },
            body: formData
        })
        console.log('AFTER FETCH url is ' + fetchUrl);
        
        const resJson = await res.json();
        if (resJson.status != 'success') {
            setGError(resJson.message);
        } else {
            setSuccessMessage("Edited Product Successfully")
            setVisible(false);
            setPId('');
        }
    }
    return (
        /* className='w-[100vw] h-[100vh] flex items-center justify-center backdrop-blur-3xl' */
        <div className='overlay'>
            <form encType='multipart/form-data' className='relative border box-border w-[40%] p-5 bg-white flex flex-col items-start gap-3 h-[600px] overflow-scroll'>
                <IoMdClose size={30} className='absolute top-2 right-2 cursor-pointer' onClick={() => {
                    setVisible(false);
                }} />
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Product Name:</p>
                    <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Product Name' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Brand Name:</p>
                    <input type='text' name='brand' value={brand} onChange={(e) => setBrand(e.target.value)} placeholder='Enter Brand Name' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%] max-w-[400px] gap-3'>
                    <p className='text-lg font-bold'>Category:</p>
                    <select multiple className='styled-select' name='category' onChange={(e) => setCategory(e.target.value)}>
                        {
                            cats.map((c)=>{
                                return <option value={c}>{c}</option>
                            })
                        }
                    </select>
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Images:</p>
                    <input id='file-input' multiple onChange={(e) => {
                        const array = Array.from(e.target.files);
                        setImages(array);
                    }} name='image' type='file' accept='png, jpg, jpeg' className='hidden' />
                    <div id='file-div' className='w-[100%] h-[100px] bg-slate-100 text-black font-bold flex items-center justify-center cursor-pointer'>Drop Image here</div>
                    <p className='text-xs text-red-700'>*Please Provide an image for the product</p>
                    
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Price:</p>
                    <input type='text' name='price' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Enter Price' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Selling Price:</p>
                    <input type='text' name='sellingPrice' value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder='Enter Selling Price' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Quantity:</p>
                    <input type='text' name='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Enter Selling Price' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Description:</p>
                    <textarea placeholder='Enter Description' value={description} name='description' onChange={(e) => setDescription(e.target.value)} className='styled-textarea' />
                </div>
                <button onClick={doSubmit} className='w-[70%] p-2 text-lg font-bold text-white bg-red-700 rounded-s-full rounded-e-full self-center hover:bg-white hover:text-red-700 hover:border hover:border-red-700 hover:border-4'>Add</button>
            </form>
        </div>
    )
}

export default AddProductForm