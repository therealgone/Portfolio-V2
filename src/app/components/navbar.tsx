'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type NavbarProps = {
  active: string; 
};



export default function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

 useEffect(() => {
  if (active === "Home") {
    setNavScrolled(true);
  } else {
    setNavScrolled(false);
  }
}, [active]);
  

  return (
    <div className='flex sticky top-0 z-[9999] justify-center py-9'>

    { navScrolled ? (
      <motion.div className='bg-white rounded-full absolute py-5 px-5'>
        <ul className='flex items-center space-x-5 font-inter tracking-wider text-black'>
          <li className="flex items-center ">
            <span className='w-5 h-5 bg-black rounded-full'></span>
          </li>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Tech-Stack</a></li>
          <li><a href="#">Project</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </motion.div>
    ) : (

        <motion.div className='bg-white rounded-full absolute py-5 px-5'>
            <a className='text-black'>{active}</a>

        </motion.div>
    )
      }
    </div>
  );
}
