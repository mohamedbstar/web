import React, { useEffect, useRef, useState } from 'react'
import images from '../utils/LgScreenSliderImages.js';
import img1Lg from "../assest/banner/img1.webp"
import img2Lg from "../assest/banner/img2.webp"
import img3Lg from "../assest/banner/img3.jpg"
import img4Lg from "../assest/banner/img4.jpg"
import img5Lg from "../assest/banner/img5.webp"

import img1Mb from "../assest/banner/img1_mobile.jpg"
import img2Mb from "../assest/banner/img2_mobile.webp"
import img3Mb from "../assest/banner/img3_mobile.jpg"
import img4Mb from "../assest/banner/img4_mobile.jpg"
import img5Mb from "../assest/banner/img5_mobile.png"

import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs"



const LargeImages = [
    /*"../assest/banner/img1.webp",
    "../assest/banner/img2.webp",
    "../assest/banner/img3.jpg",
    "../assest/banner/img4.jpg",
    "../assest/banner/img5.webp",*/

    img1Lg, img2Lg, img3Lg, img4Lg, img5Lg
]

const MobileImages = [
    /*"/assest/banner/img1_mobile.jpg",
    "../assest/banner/img2_mobile.webp",
    "../assest/banner/img3_mobile.jpg",
    "../assest/banner/img4_mobile.jpg",
    "../assest/banner/img5_mobile.png"*/

    img1Mb, img2Mb, img3Mb, img4Mb, img5Mb
]

const Slider = React.memo(() => {
    const [curImageIndex, setCurImageIndex] = useState(0);
    const [curImages, setCurImages] = useState(LargeImages);
    const intervalRef = useRef(null); //holds reference to anything i want

    /*useEffect(()=>{
        indexRef.current = curImageIndex;
    },[curImageIndex]);*/

    useEffect(() => {
        const inter = setInterval(() => {
            setCurImageIndex((prev) => (prev + 1) % 5)
        }, 2500)
        return () => clearInterval(inter);
    }, [curImageIndex])

    function handleNextImage() {
        setCurImageIndex(
            curImageIndex < 4 ? curImageIndex + 1 : 0
        )
    }

    function handlePrevImage() {
        setCurImageIndex(
            curImageIndex > 0 ? curImageIndex - 1 : 4
        )
    }
    return (
        <div id='slider' className='slider p-5 w-full h-80 relative'>
            <BsArrowLeftCircleFill size={40} onClick={handlePrevImage} className=' absolute top-40 left-10 text-white' />
            <img src={curImages[curImageIndex]} className='h-full w-full' />
            <BsArrowRightCircleFill size={40} onClick={handleNextImage} className='absolute  top-40 right-10 text-white' />
        </div>
    )
}
)
export default Slider