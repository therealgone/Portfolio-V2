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
 




    
 

  return (
    <main className="relative w-full  bg-[#0c0c0c] overflow-hidden">
     
    </main>
  );
}
