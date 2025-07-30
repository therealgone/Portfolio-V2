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
    <div className="flex flex-col items-center min-h-screen py-20 px-4  text-gray-300">
      {show && (
        <div className="w-full max-w-6xl">
          <motion.div className="text-center mb-16" {...motionProps90}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent mb-6"
              {...motionProps90}
            >
              About Me
            </motion.h1>
            <motion.div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" {...motionProps90} />
          </motion.div>

          <motion.div className="p-px animate-rotate-border rounded-3xl bg-conic/[from_var(--border-angle)] from-[#0a0a0a] via-[#1f2937] to-[#0a0a0a]"
          {...motionProps90}>
            <div className="py-5 px-6 backdrop-blur-3xl rounded-3xl bg-[#0a0a0a]">
              <motion.div className="text-center mb-12" {...motionProps90}>
                <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-4" {...motionProps90}>
                  <Typewriter
                    words={["Jeevan Baabu Murugan"]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                  />
                </motion.h2>
                <motion.p className="text-lg md:text-xl text-cyan-400 font-medium" {...motionProps90}>
                  Computer Science Engineering (AI & ML)
                </motion.p>
                <motion.p className="text-base text-gray-400 mt-2" {...motionProps90}>
                  SRM Institute of Science and Technology, Kattankulathur
                </motion.p>
              </motion.div>

              <div className="space-y-8">
                {/* Introduction */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Introduction</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Driven by curiosity and a love for building across multiple domains, I'm a final-year student exploring the intersection of technology and creativity.
                  </p>
                </motion.div>

                {/* Development Domains */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Development Domains</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    I explore <span className="text-cyan-300 font-semibold">Web Development</span>, <span className="text-purple-300 font-semibold">App Development</span>, and <span className="text-green-300 font-semibold">Game Development</span> — with hands-on projects ranging from full-stack websites to mobile apps and immersive games.
                  </p>
                </motion.div>

                {/* Machine Learning */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Machine Learning</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    My ML work includes building smart gesture-based systems using <span className="text-blue-400 font-semibold">LSTM</span>, <span className="text-cyan-400 font-semibold">MediaPipe</span>, and <span className="text-orange-400 font-semibold">TensorFlow</span> — blending real-time input with efficient model performance.
                  </p>
                </motion.div>

                {/* Tech Stack */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Tech Stack</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    I'm comfortable with <span className="text-blue-400 font-semibold">React</span>, <span className="text-cyan-400 font-semibold">Next.js</span>, <span className="text-teal-400 font-semibold">Tailwind CSS</span>, and <span className="text-purple-400 font-semibold">Framer Motion</span> and currently diving deeper into <span className="text-yellow-300 font-semibold">TypeScript</span> and modern UI/UX design.
                  </p>
                </motion.div>

                {/* Emerging Technologies */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Emerging Technologies</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    I'm stepping into <span className="text-pink-400 font-semibold">cross-platform app development</span> and <span className="text-indigo-400 font-semibold">3D game engines</span> to level up across stacks and expand my technical horizons.
                  </p>
                </motion.div>

                {/* System Optimization */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">System Optimization</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    On the system side, I love tweaking performance — from <span className="text-emerald-300 font-semibold">PC optimization and overclocking</span> to deploying ML models on <span className="text-sky-300 font-semibold">edge devices like Raspberry Pi</span>.
                  </p>
                </motion.div>

                {/* Continuous Learning */}
                <motion.div className="group" {...motionProps90}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-white">Continuous Learning</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    I thrive on learning. Whether it's earning certifications like <span className="text-orange-400 font-semibold">Oracle Cloud</span>, <span className="text-red-400 font-semibold">Red Hat Linux</span>, <span className="text-blue-400 font-semibold">JPMorgan Forage</span> or collaborating with peers, my goal is to grow as a <span className="text-lime-300 font-semibold">well-rounded, creative engineer</span> who bridges disciplines and builds for impact.
                  </p>
                </motion.div>
              </div>

              <motion.div className="mt-12 pt-8 border-t border-cyan-500/20" {...motionProps90}>
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-500/30"
                    whileHover={{ scale: 1.05, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
                    whileTap={{ scale: 0.95, transition: { type: "tween", duration: 0.2, ease: "easeInOut" } }}
                  >
                    <span className="text-cyan-300 font-medium">Always Learning • Always Building • Always Growing</span>
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