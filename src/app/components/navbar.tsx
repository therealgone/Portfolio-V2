'use client';

import { motion } from 'framer-motion';
import { ul } from 'framer-motion/client';
import { useEffect, useState } from 'react';

type NavbarProps = {
  active: string;
};



export default function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const section = [{ name: "Home", href: "#hero_page" },
  { name: "About", href: "#about" },
  { name: "Tech-Stack", href: "#tech-stack" },
  { name: "Project", href: "project" },
  { name: "Contact", href: "#contact" },
  ]


  useEffect(() => {
    if (active === "Home") {
      setNavScrolled(true);
     
      setOpen(true)
    } else {
      setNavScrolled(false);
       setOpen(false)
      
    }
  }, [active]);


  return (
    <div className='flex sticky top-0 z-[9999] justify-center py-9   '>

      {navScrolled ? (
        <motion.div className='bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-full px-6 py-3 fixed'>
          <ul className='flex items-center space-x-5 font-inter tracking-wider '>
            <li className="flex items-center ">
              <span className='w-5 h-5 bg-black border-2 border-white  rounded-full'></span>
            </li>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#">Tech-Stack</a></li>
            <li><a href="#">Project</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </motion.div>
      ) : (

        (open ? (
          <motion.div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl   fixed  py-5 px-5 rounded-3xl "
            onClick={() => { setOpen(!open) }}>
            <ul className='flex flex-col items-center space-x-5 font-inter tracking-wider  mb-5'>

              <li className="flex items-center ">
             <span className='w-5 h-5 mr-4 bg-black border-2 border-white  rounded-full'></span>
                
                <a className=''>{active}</a>
                
              </li>
              
              </ul>
            
            < ul className='flex flex-row items-center space-x-5 font-inter tracking-wider '>
            
            {section

              .filter((section) => section.name !== active)
              .map((section) =>
                 
                  <li key={section.name}  >
                    <a href={section.href}>{section.name}</a>
                  </li>
                
              )
            }
            </ul>



          </motion.div>
        ) : (
          <motion.div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl fixed rounded-full px-6 py-3 "
            onClick={() => { setOpen(!open) }}>

            <ul className='flex items-center space-x-5 font-inter tracking-wider '>
              <li className="flex items-center ">
              <span className='w-5 h-5 bg-black border-2 border-white  rounded-full'></span>
              </li>
              <li><a>{active}</a></li>

            </ul>
          </motion.div>
        ))

      )
      }
    </div>
  );
}
