'use client';

import { motion} from 'framer-motion';
import { useEffect, useState } from 'react';

// FPS Counter Component
function FPSCounter() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let lastFpsUpdate = last;
    let rafId: number;
    function loop(now: number) {
      frame++;
      if (now - lastFpsUpdate > 500) {
        setFps(Math.round((frame * 1000) / (now - lastFpsUpdate)));
        frame = 0;
        lastFpsUpdate = now;
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);
  // FPS counter should always be visible, so remove the NODE_ENV check
  return (
    <motion.div
      className="animate-rotate-border fixed top-4 right-6 z-[99999] rounded-full p-px bg-conic/[from_var(--border-angle)] from-black via-cyan-400 to-black shadow-xl"
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-cyan-400/30 shadow-lg rounded-full px-4 py-1 text-white font-mono text-xs flex items-center justify-center min-w-[60px]">
        FPS: {fps}
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
            className="gpu-boost animate-rotate-border fixed rounded-full p-px bg-conic/[from_var(--border-angle)] from-black via-cyan-400 to-black shadow-xl"
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
            whileTap={{ scale: 0.97, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
            whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
          >
            <div className='bg-[#0f172a]/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl rounded-full px-6 py-3'>
              <ul className='flex items-center space-x-6 font-inter tracking-wider text-white text-sm'>
                <li className="flex items-center">
                  <span className='w-3 h-3 bg-cyan-400/80   drop-shadow-[0_0_6px_cyan] rounded-full'></span>
                </li>
                {section.map((sec) => (
                  <li key={sec.name}>
                    <a href={sec.href} className="hover:text-cyan-400 transition duration-200">{sec.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          open ? (
            <motion.div
              className="gpu-boost animate-rotate-border fixed rounded-3xl p-px bg-conic/[from_var(--border-angle)] from-black via-cyan-400 to-black shadow-xl "
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
              <div className="py-5 px-6 bg-[#0f172a]/80 backdrop-blur-md border border-cyan-500/30 shadow-xl rounded-3xl ">
                <ul className='flex flex-col items-center gap-4 font-inter tracking-wider text-white mb-5 text-sm'>
                  <li className="flex items-center ">
                    <span className='w-3 h-3 mr-4 bg-cyan-400/80  drop-shadow-[0_0_6px_cyan] rounded-full'></span>
                    <a>{active}</a>
                  </li>
                </ul>

                <ul className='flex flex-row items-center space-x-6 font-inter tracking-wider text-white text-sm'>
                  {section
                    .filter((sec) => sec.name !== active)
                    .map((sec) => (
                      <li key={sec.name}>
                        <a href={sec.href} className="hover:text-cyan-400 transition duration-200">{sec.name}</a>
                      </li>
                    ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="gpu-boost animate-rotate-border fixed rounded-full p-px bg-conic/[from_var(--border-angle)] from-black via-cyan-400 to-black shadow-lg"
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
              <div className="px-6 py-3 bg-[#0f172a]/80 backdrop-blur-md border border-cyan-400/30 shadow-lg rounded-full text-white">
                <ul className="flex items-center space-x-6 font-inter tracking-wider text-sm">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-cyan-400   drop-shadow-[0_0_6px_cyan] rounded-full"></span>
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
