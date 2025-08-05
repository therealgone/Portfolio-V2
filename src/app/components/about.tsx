'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { easeInOut, spring } from 'framer-motion';
import { Typewriter } from "react-simple-typewriter";

type navprop = { active: string };

export default function About({ active }: navprop) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active === "Home") {
      setShow(true);
    }
  }, [active]);

  const motionProps90 = {
    initial: { opacity: 0, y: 200 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: easeInOut, type: spring, mass: 0.5, damping: 30 },
    viewport: { once: true }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 md:py-20 px-4 text-zinc-300">
      {show && (
        <div className="w-full max-w-6xl">
          <motion.div className="text-center mb-8 md:mb-16" {...motionProps90}>
            <motion.h1
              className="text-3xl md:text-5xl lg:text-7xl font-bold text-white bg-clip-text mb-6 md:mb-10 text-center"
              {...motionProps90}
            >
              About Me
            </motion.h1>
          </motion.div>

          <motion.div className="p-px animate-rotate-border rounded-2xl md:rounded-3xl bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-zinc-900"
            {...motionProps90}>
            <div className="py-4 md:py-5 px-4 md:px-6 backdrop-blur-3xl rounded-2xl md:rounded-3xl bg-zinc-950">
              <motion.div className="text-center mb-8 md:mb-12" {...motionProps90}>
                <motion.h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4" {...motionProps90}>
                  <Typewriter
                    words={["Jeevan Baabu Murugan"]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                  />
                </motion.h2>
                <motion.p className="text-sm md:text-lg lg:text-xl text-zinc-400 font-medium" {...motionProps90}>
                  Computer Science Engineering (AI & ML)
                </motion.p>
                <motion.p className="text-xs md:text-base text-zinc-500 mt-2" {...motionProps90}>
                  SRM Institute of Science and Technology, Kattankulathur
                </motion.p>
              </motion.div>

              <div className="space-y-6 md:space-y-8">
                {/* Introduction */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Introduction</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    Driven by curiosity and a love for building across multiple domains, I'm a final-year student exploring the intersection of technology and creativity.
                  </p>
                </motion.div>

                {/* Development Domains */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Development Domains</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    I explore <span className="font-semibold text-white">Web Development</span>, <span className="font-semibold text-zinc-300">App Development</span>, and <span className="font-semibold text-zinc-200">Game Development</span> — with hands-on projects ranging from full-stack websites to mobile apps and immersive games.
                  </p>
                </motion.div>

                {/* Machine Learning */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Machine Learning</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    My ML work includes building smart gesture-based systems using <span className="font-semibold text-white">LSTM</span>, <span className="font-semibold text-zinc-300">MediaPipe</span>, and <span className="font-semibold text-zinc-200">TensorFlow</span> — blending real-time input with efficient model performance.
                  </p>
                </motion.div>

                {/* Tech Stack */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Tech Stack</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    I'm comfortable with <span className="font-semibold text-white">React</span>, <span className="font-semibold text-zinc-300">Next.js</span>, <span className="font-semibold text-zinc-200">Tailwind CSS</span>, and <span className="font-semibold text-zinc-400">Framer Motion</span> and currently diving deeper into <span className="font-semibold text-white">TypeScript</span> and modern UI/UX design.
                  </p>
                </motion.div>

                {/* Emerging Technologies */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-800 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Emerging Technologies</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    I'm stepping into <span className="font-semibold text-zinc-300">cross-platform app development</span> and <span className="font-semibold text-zinc-200">3D game engines</span> to level up across stacks and expand my technical horizons.
                  </p>
                </motion.div>

                {/* System Optimization */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-900 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">System Optimization</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    On the system side, I love tweaking performance — from <span className="font-semibold text-white">PC optimization and overclocking</span> to deploying ML models on <span className="font-semibold text-zinc-300">edge devices like Raspberry Pi</span>.
                  </p>
                </motion.div>

                {/* Continuous Learning */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-lg md:text-xl font-semibold text-white">Continuous Learning</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-lg">
                    I thrive on learning. Whether it's earning certifications like <span className="font-semibold text-zinc-300">Oracle Cloud</span>, <span className="font-semibold text-zinc-200">Red Hat Linux</span>, <span className="font-semibold text-zinc-100">JPMorgan Forage</span> or collaborating with peers, my goal is to grow as a <span className="font-semibold text-white">well-rounded, creative engineer</span> who bridges disciplines and builds for impact.
                  </p>
                </motion.div>
              </div>

              <motion.div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-zinc-700/20" {...motionProps90}>
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-zinc-700/10 to-zinc-900/10 rounded-full border border-zinc-600/30"
                    whileHover={{ scale: 1.05, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
                    whileTap={{ scale: 0.95, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
                  >
                    <span className="text-zinc-400 font-medium text-xs md:text-sm">Always Learning • Always Building • Always Growing</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
