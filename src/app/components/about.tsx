'use client';
import { motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


type navprop = {  active:string}


export default function About({active}:navprop) {

  const [show,setShow] =useState(false)

  useEffect(() => {
    if(active == "Home")
    {
      setShow(true)
    }
  })

  return (
   <div className="">
  {show && (
   <motion.div>
 <h1 className='text-5xl text-white'>jevan</h1>
   </motion.div>
   )}
   </div>
      
  );
}
