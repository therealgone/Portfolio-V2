'use client';


import Spline from '@splinetool/react-spline';


export default function Hero_Page({}) {
  return (
    <main className="relative">
      <Spline
        scene="https://prod.spline.design/i7gHz8QTyTOZe0Wz/scene.splinecode" 
      />
      <div className="absolute bottom-5 right-5 z-[9999] bg-black w-[140px] h-[50px]" >
  </div>
    </main>
  );
}
