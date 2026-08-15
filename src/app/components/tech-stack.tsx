'use client';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { easeInOut } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const GlowCard = dynamic(() => import('./spotlight-card'), {
    ssr: false,
});




type navprop = {
    active: string;
}

// Define tech stack data arrays above the component
const languages = [
    {
        img: "/HTML.svg",
        alt: "HTML",
        name: "HTML",
        desc: "The standard markup language for creating web pages.",
        imgType: "img",
        brandColor: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-400/40",
    },
    {
        img: "/CSS.svg",
        alt: "CSS",
        name: "CSS",
        desc: "A style sheet language used for describing the presentation of a document.",
        imgType: "img",
        brandColor: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-400/40",
    },
    {
        img: "/JS.svg",
        alt: "JavaScript",
        name: "JavaScript (JS)",
        desc: "The dynamic programming language that powers modern web applications with interactive features and real-time functionality.",
        imgType: "Image",
        brandColor: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-400/40",
    },
    {
        img: "/Python.svg",
        alt: "Python",
        name: "Python",
        desc: "High-level language known for its readability and use in AI/ML.",
        imgType: "img",
        brandColor: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-400/40",
    },
    {
        img: "/sql-svgrepo-com.svg",
        alt: "SQL",
        name: "SQL",
        desc: "Language used to communicate with databases.",
        imgType: "Image",
        brandColor: "from-purple-500/20 to-indigo-500/20",
        borderColor: "border-purple-400/40",
    },
    {
        img: "/csh.svg",
        alt: "C#",
        name: "C#",
        desc: "An object-oriented language commonly used in game development (Unity).",
        imgType: "Image",
        brandColor: "from-violet-500/20 to-purple-500/20",
        borderColor: "border-violet-400/40",
    },
];

const frameworks = [
    {
        img: "/react.svg",
        alt: "React",
        name: "React",
        desc: "JavaScript library for building user interfaces.",
        imgType: "Image",
        brandColor: "from-cyan-500/20 to-blue-500/20",
        borderColor: "border-cyan-400/40",
    },
    {
        img: "/react.svg",
        alt: "React Native",
        name: "React Native",
        desc: "Framework for building native apps using React.",
        imgType: "Image",
        brandColor: "from-cyan-500/20 to-blue-500/20",
        borderColor: "border-cyan-400/40",
    },
    {
        img: "/nextjs.svg",
        alt: "Next.js",
        name: "Next.js",
        desc: "React framework for server-side rendering and routing.",
        imgType: "Image",
        brandColor: "from-gray-500/20 to-black/20",
        borderColor: "border-gray-400/40",
    },
    {
        img: "/tailwind.svg",
        alt: "Tailwind CSS",
        name: "Tailwind CSS",
        desc: "Utility-first CSS framework for fast UI styling.",
        imgType: "Image",
        brandColor: "from-teal-500/20 to-cyan-500/20",
        borderColor: "border-teal-400/40",
    },
    {
        img: "/motion react.svg",
        alt: "Framer Motion",
        name: "Framer Motion",
        desc: "Animation library for React for smooth transitions.",
        imgType: "Image",
        brandColor: "from-pink-500/20 to-purple-500/20",
        borderColor: "border-pink-400/40",
    },
    {
        img: "/vite.svg",
        alt: "Vite",
        name: "Vite",
        desc: "Fast frontend build tool for modern web projects.",
        imgType: "Image",
        brandColor: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-400/40",
    },
    {
        img: "/unity.svg",
        alt: "Unity",
        name: "Unity",
        desc: "A powerful game engine for 2D, 3D, AR/VR game development.",
        imgType: "Image",
        brandColor: "from-gray-500/20 to-slate-500/20",
        borderColor: "border-gray-400/40",
    },
    {
        img: "/android.svg",
        alt: "Android Studio",
        name: "Android Studio",
        desc: "IDE for Android app development using Java/Kotlin.",
        imgType: "Image",
        brandColor: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-400/40",
    },
];

const tools = [
    {
        img: "/git.svg",
        alt: "Git",
        name: "Git",
        desc: "Version control system to manage code history.",
        imgType: "Image",
        brandColor: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-400/40",
    },
    {
        img: "/github.svg",
        alt: "GitHub",
        name: "GitHub",
        desc: "Cloud platform for hosting Git repositories.",
        imgType: "Image",
        brandColor: "from-gray-500/20 to-slate-500/20",
        borderColor: "border-gray-400/40",
    },
    {
        img: "/ts.svg",
        alt: "TypeScript",
        name: "TypeScript",
        desc: "A superset of JavaScript that adds static typing.",
        imgType: "Image",
        brandColor: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-400/40",
    },
    {
        img: "/vercel.svg",
        alt: "Vercel",
        name: "Vercel",
        desc: "Deployment platform for frontend projects.",
        imgType: "Image",
        brandColor: "from-gray-500/20 to-black/20",
        borderColor: "border-gray-400/40",
    },
];


export default function Tech({ active }: navprop) {
    const [show, setShow] = useState(false)
    const [selectedTech, setSelectedTech] = useState<{
        name: string;
        desc: string;
        img: string;
        alt: string;
    } | null>(null)

    const motionProps90 = {
        initial: { opacity: 0, y: 90 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: easeInOut },
        viewport: { once: true }
    };



    useEffect(() => {

        if (active == "About") {
            setShow(true)
        }

    }, [active])



    return (
        <div className='min-h-screen py-10 md:py-20'>
            {show && (<>
                <motion.h1
                    className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 md:mb-10 text-center"
                    {...motionProps90}
                >
                    Tech Stack
                </motion.h1>
                <div className='px-4 md:px-0'>

                    {/* Languages Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='flex flex-wrap justify-center gap-6 md:gap-8'
                    >
                        <motion.h2
                            className='w-full text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-8'
                        >
                            Languages
                        </motion.h2>
                        {languages.map((lang, idx) => (
                            <motion.div
                                key={lang.name}
                                {...motionProps90}
                                layout
                                className="group relative"
                            >
                                <motion.div 
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border backdrop-blur-sm flex items-center justify-center cursor-pointer relative overflow-hidden"
                                    whileHover={{ 
                                        scale: 1.1,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedTech({
                                            name: lang.name,
                                            desc: lang.desc,
                                            img: lang.img,
                                            alt: lang.alt
                                        });
                                    }}
                                >
                                    {/* Brand color background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${lang.brandColor} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                                    
                                    {/* Base background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:${lang.borderColor} transition-all duration-300`}></div>
                                    
                                    {/* Icon */}
                                    <div className="relative z-10">
                                    {lang.imgType === "Image" ? (
                                            <Image src={lang.img} alt={lang.alt} width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                    ) : (
                                            <img src={lang.img} alt={lang.alt} width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                    )}
                                </div>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Frameworks & Libraries Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='flex flex-wrap justify-center gap-6 md:gap-8 mt-16 md:mt-24'
                    >
                        <motion.h2
                            className='w-full text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-8'
                        >
                            Frameworks & Libraries
                        </motion.h2>
                        {frameworks.map((fw, idx) => (
                            <motion.div
                                key={fw.name}
                                {...motionProps90}
                                layout
                                className="group relative"
                            >
                                <motion.div 
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border backdrop-blur-sm flex items-center justify-center cursor-pointer relative overflow-hidden"
                                    whileHover={{ 
                                        scale: 1.1,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedTech({
                                            name: fw.name,
                                            desc: fw.desc,
                                            img: fw.img,
                                            alt: fw.alt
                                        });
                                    }}
                                >
                                    {/* Brand color background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${fw.brandColor} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                                    
                                    {/* Base background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:${fw.borderColor} transition-all duration-300`}></div>
                                    
                                    {/* Icon */}
                                    <div className="relative z-10">
                                        <Image src={fw.img} alt={fw.alt} width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                </div>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tools & Platforms Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='flex flex-wrap justify-center gap-6 md:gap-8 mt-16 md:mt-24'
                    >
                        <motion.h2
                            className='w-full text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-8'
                        >
                            Tools & Platforms
                        </motion.h2>
                        {tools.map((tool, idx) => (
                            <motion.div
                                key={tool.name}
                                {...motionProps90}
                                layout
                                className="group relative"
                            >
                                <motion.div 
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border backdrop-blur-sm flex items-center justify-center cursor-pointer relative overflow-hidden"
                                    whileHover={{ 
                                        scale: 1.1,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedTech({
                                            name: tool.name,
                                            desc: tool.desc,
                                            img: tool.img,
                                            alt: tool.alt
                                        });
                                    }}
                                >
                                    {/* Brand color background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${tool.brandColor} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                                    
                                    {/* Base background */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:${tool.borderColor} transition-all duration-300`}></div>
                                    
                                    {/* Icon */}
                                    <div className="relative z-10">
                                        <Image src={tool.img} alt={tool.alt} width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                </div>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </>)}

            {/* Tech Modal */}
            {selectedTech && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedTech(null)}
                >
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-sm mx-auto text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6">
                            <img src={selectedTech.img} alt={selectedTech.alt} className="w-16 h-16 mx-auto mb-4" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{selectedTech.name}</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">{selectedTech.desc}</p>
                        
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}