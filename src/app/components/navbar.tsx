'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { useEffect, useState } from 'react';

// FPS Counter Component
function FPSCounter() {
  

  return (
     <motion.div
      className="fixed top-4 right-6 z-[9999]  gpu-boost animate-rotate-border  rounded-full p-px bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white shadow-xl"
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      {/* Inner content with background */}
      <div className="flex gap-5 items-center rounded-full bg-black px-5 py-3" style={{ pointerEvents: "auto" }}>
        <a
          href="https://github.com/therealgone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition duration-200"
        >
          <FaGithub size={22} />
        </a>
        <a
          href="https://www.linkedin.com/in/jeevan-baabu-97a19125b"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-300 transition duration-200"
        >
          <FaLinkedin size={22} />
        </a>
      </div>
    </motion.div>
   
  );
}

type NavbarProps = {
  active: string;
};

export default function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const section = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tech-Stack", href: "#tech-stack" },
    { name: "Project", href: "#project" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    if (active === "Home") {
      setNavScrolled(true);
      setOpen(true);
    } else {
      setNavScrolled(false);
      setOpen(false);
    }
  }, [active]);

  return (
    <>
      <FPSCounter />
      <div className=' gpu-boost flex sticky top-0 z-[9999] justify-center py-9'>

        {navScrolled ? (
          <motion.div
            className="gpu-boost animate-rotate-border fixed rounded-full p-px bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white shadow-xl"
            layout
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            whileTap={{ scale: 0.97, transition: { type: "tween", duration: 1, ease: "easeInOut" } }}
            whileHover={{ scale: 1.03, transition: { type: "tween", duration: 1, ease: "easeInOut" } }}
          >
            <div className='bg-black backdrop-blur-md   shadow-2xl rounded-full px-6 py-3'>
              <ul className='flex items-center space-x-6 font-inter tracking-wider text-white text-sm'>
                <li className="flex items-center">
                  <span className='w-3 h-3 bg-white border-gray-600    drop-shadow-[0_0_6px_white] rounded-full'></span>
                </li>
                {section.map((sec) => (
                  <li key={sec.name}>
                    <a href={sec.href} className="hover:text-zinc-500 transition duration-200">{sec.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          open ? (
            <motion.div
              className="gpu-boost animate-rotate-border fixed rounded-3xl p-px bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white  shadow-xl "
              layout
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
              whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 } }}
              whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 } }}
              onClick={() => setOpen(!open)}
            >
              <div className="py-5 px-6 bg-black shadow-xl rounded-3xl ">
                <ul className='flex flex-col items-center gap-4 font-inter tracking-wider text-white mb-5 text-sm'>
                  <li className="flex items-center ">
                    <span className='w-3 h-3 mr-4 bg-white  drop-shadow-[0_0_6px_white] rounded-full'></span>
                    <a>{active}</a>
                  </li>
                </ul>

                <ul className='flex flex-row items-center space-x-6 font-inter tracking-wider text-white text-sm'>
                  {section
                    .filter((sec) => sec.name !== active)
                    .map((sec) => (
                      <li key={sec.name}>
                        <a href={sec.href} className="hover:text-zinc-500 transition duration-200">{sec.name}</a>
                      </li>
                    ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="gpu-boost animate-rotate-border fixed rounded-full p-px bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white  shadow-lg"
              layout
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
              whileTap={{ scale: 0.97, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
              whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
              onClick={() => setOpen(!open)}
            >
              <div className="px-6 py-3 bg-black shadow-lg rounded-full text-white">
                <ul className="flex items-center space-x-6 font-inter tracking-wider text-sm">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-white   drop-shadow-[0_0_6px_white] rounded-full"></span>
                  </li>
                  <li>
                    <a>{active}</a>
                  </li>
                </ul>
              </div>
            </motion.div>
          )
        )}
      </div>
    </>
  );
}
