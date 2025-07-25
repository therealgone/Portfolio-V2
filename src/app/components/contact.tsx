'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';



// Dynamically import the Spline component
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

type NavbarProps ={
    active : string;
};
export default function Contact({active}: NavbarProps) {
 
 const  [load,setLoad] = useState(false)

 useEffect(()=> {
    if (active =="Tech-Stack")
    {
        setLoad(true)
    }
 }, [active])

    
 

  return (
    <main className="relative w-full h-[700px] bg-[#0c0c0c] overflow-hidden">
      <div  className="w-full h-full">
        {load && (
          <div
            
            className="w-full h-full"
          >
            <Spline scene="https://prod.spline.design/LaBNtFQdltJnCIZC/scene.splinecode" />
          </div>
        )}
      </div>

      <div className="absolute bottom-5 right-5 z-[9999] bg-black w-[140px] h-[50px] rounded-xl flex items-center justify-center text-white text-sm">
       
      </div>
    </main>
  );
}
