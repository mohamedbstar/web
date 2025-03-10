import React, { useEffect, useState } from 'react'
import airpods from "../assest/cats/airpods.webp";
import camera from "../assest/cats/camera.jpg";
import earphons from "../assest/cats/earphones.webp";
import mobile from "../assest/cats/mobile.webp";
import mouse from "../assest/cats/mouse.webp";
import printer from "../assest/cats/printer.webp";
import processor from "../assest/cats/processor.webp";
import refrigerator from "../assest/cats/refrigerator.webp";
import speakers from "../assest/cats/speakers.webp";
import trimmers from "../assest/cats/trimmers.webp";
import tv from "../assest/cats/tv.webp";
import watches from "../assest/cats/watches.webp";
import {Link} from "react-router-dom"

import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs"

const images = [
  airpods, camera, earphons, mobile, mouse, printer, processor, refrigerator, speakers, trimmers, tv, watches
]

const CategoriesList = React.memo(() => {
  const [catImages, setCatImages] = useState(images);
  let prosdCont;
  useEffect(() => {

    prosdCont = document.getElementById('prods');
    document.getElementById('sLeftBtn').addEventListener('click', () => {
      console.log('Left Btn Clicked');

      prosdCont.scrollBy({
        left: -100,
        behaviour: 'smooth'
      })
    });

    document.getElementById('sRightBtn').addEventListener('click', () => {
      console.log('Left Btn Clicked');

      prosdCont.scrollBy({
        left: 100,
        behaviour: 'smooth'
      })
    });
  }, []);
  return (
    <div className='relative'>
      <BsArrowLeftCircleFill id={'sLeftBtn'} size={40} className='cursor-pointer z-50 absolute bottom-12 left-12 text-slate-500' />

      <div className='cats-list my-10 px-3 relative' id='prods'>
        {
          catImages.map((ci) => {
            return (
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='img-cont rounded-full bg-slate-300'>
                  <Link to={'/categories/'+ci.split('/')[ci.split('/').length - 1].split('.')[0]}><img src={ci} className='hover:scale-125 cursor-pointer' /></Link>
                </div>
                <p>{ci.split('/')[ci.split('/').length - 1].split('.')[0]}</p>
              </div>
            );
          })
        }
      </div>
      <BsArrowRightCircleFill id={'sRightBtn'} size={40} className='cursor-pointer absolute bottom-12 right-12 text-slate-500' />
    </div>
  )
}
)

export default CategoriesList