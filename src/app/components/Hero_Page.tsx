'use client';
import { motion , easeInOut} from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';


const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});


export default function Hero_Page() {

   const splineRef = useRef<any>(null);

  const { ref: viewRef, inView } = useInView({
    threshold: 0.1, // trigger when 10% visible
  });

  useEffect(() => {
    if (!splineRef.current) return;

    if (inView) {
      splineRef.current.play(); // 👈 resume when visible
    } else {
      splineRef.current.stop(); // 👈 pause when out of view
    }
  }, [inView]);

  const motionProps90 = {  initial: { opacity: 0, y: 90 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeInOut },
  viewport: { once: true }
};
  return (
    <main ref={viewRef} className="relative  ">
      <motion.div layout
      {...motionProps90} 
           
             
          >
      <Spline
        scene="https://prod.spline.design/i7gHz8QTyTOZe0Wz/scene.splinecode" 
        
      />
      <div className="absolute bottom-5 right-5 z-[9999] bg-black w-[140px] h-[50px]" >
  </div>
  </motion.div>
    </main>
  );
}
