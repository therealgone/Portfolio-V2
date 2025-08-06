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
    },
    {
        img: "/CSS.svg",
        alt: "CSS",
        name: "CSS",
        desc: "A style sheet language used for describing the presentation of a document.",
        imgType: "img",
    },
    {
        img: "/JS.svg",
        alt: "JavaScript",
        name: "JavaScript (JS)",
        desc: "A programming language for creating interactive web content.",
        imgType: "Image",
    },
    {
        img: "/Python.svg",
        alt: "Python",
        name: "Python",
        desc: "High-level language known for its readability and use in AI/ML.",
        imgType: "img",
    },
    {
        img: "/sql-svgrepo-com.svg",
        alt: "SQL",
        name: "SQL",
        desc: "Language used to communicate with databases.",
        imgType: "Image",
    },
    {
        img: "/csh.svg",
        alt: "C#",
        name: "C#",
        desc: "An object-oriented language commonly used in game development (Unity).",
        imgType: "Image",
    },
];

const frameworks = [
    {
        img: "/react.svg",
        alt: "React",
        name: "React",
        desc: "JavaScript library for building user interfaces.",
        imgType: "Image",
    },
    {
        img: "/react.svg",
        alt: "React Native",
        name: "React Native",
        desc: "Framework for building native apps using React.",
        imgType: "Image",
    },
    {
        img: "/nextjs.svg",
        alt: "Next.js",
        name: "Next.js",
        desc: "React framework for server-side rendering and routing.",
        imgType: "Image",
    },
    {
        img: "/tailwind.svg",
        alt: "Tailwind CSS",
        name: "Tailwind CSS",
        desc: "Utility-first CSS framework for fast UI styling.",
        imgType: "Image",
    },
    {
        img: "/motion react.svg",
        alt: "Framer Motion",
        name: "Framer Motion",
        desc: "Animation library for React for smooth transitions.",
        imgType: "Image",
    },
    {
        img: "/vite.svg",
        alt: "Vite",
        name: "Vite",
        desc: "Fast frontend build tool for modern web projects.",
        imgType: "Image",
    },
    {
        img: "/unity.svg",
        alt: "Unity",
        name: "Unity",
        desc: "A powerful game engine for 2D, 3D, AR/VR game development.",
        imgType: "Image",
    },
    {
        img: "/android.svg",
        alt: "Android Studio",
        name: "Android Studio",
        desc: "IDE for Android app development using Java/Kotlin.",
        imgType: "Image",
    },
];

const tools = [
    {
        img: "/git.svg",
        alt: "Git",
        name: "Git",
        desc: "Version control system to manage code history.",
        imgType: "Image",
    },
    {
        img: "/github.svg",
        alt: "GitHub",
        name: "GitHub",
        desc: "Cloud platform for hosting Git repositories.",
        imgType: "Image",
    },
    {
        img: "/ts.svg",
        alt: "TypeScript",
        name: "TypeScript",
        desc: "A superset of JavaScript that adds static typing.",
        imgType: "Image",
    },
    {
        img: "/vercel.svg",
        alt: "Vercel",
        name: "Vercel",
        desc: "Deployment platform for frontend projects.",
        imgType: "Image",
    },
];


export default function Tech({ active }: navprop) {




    const [show, setShow] = useState(false)

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
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 place-items-center'
                    >
                        <motion.h2
                            className='col-span-1 md:col-span-2 lg:col-span-3 text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Languages
                        </motion.h2>
                        {languages.map((lang, idx) => (
                            <motion.div
                                key={lang.name}
                                {...motionProps90}
                                layout
                                className="w-80 h-32 md:w-96 md:h-40 bg-white/10 border border-white/20 rounded-2xl shadow-lg backdrop-blur-md p-5 flex flex-col items-center transition-transform hover:scale-[1.03]"
                            >
                                <div className="flex items-center justify-center mb-2">
                                    {lang.imgType === "Image" ? (
                                        <Image src={lang.img} alt={lang.alt} width={50} height={50} className="w-[50px] h-[50px]" loading="lazy" />
                                    ) : (
                                        <img src={lang.img} alt={lang.alt} width={50} height={50} className="w-[50px] h-[50px]" loading="lazy" />
                                    )}
                                    <h1 className='flex flex-col items-center justify-center px-5 text-2xl md:text-3xl tracking-wide font-medium'>{lang.name}</h1>
                                </div>
                                <p className='w-full text-justify leading-normal text-white/40 text-sm md:text-base'>{lang.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Frameworks & Libraries Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 place-items-center mt-12 md:mt-20'
                    >
                        <motion.h2
                            className='col-span-1 md:col-span-2 lg:col-span-3 text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Frameworks & Libraries
                        </motion.h2>
                        {frameworks.map((fw, idx) => (
                            <motion.div
                                key={fw.name}
                                {...motionProps90}
                                layout
                                className="w-80 h-32 md:w-96 md:h-40 bg-white/10 border border-white/20 rounded-2xl shadow-lg backdrop-blur-md p-5 flex flex-col items-center transition-transform hover:scale-[1.03]"
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <Image src={fw.img} alt={fw.alt} width={50} height={50} className="w-[50px] h-[50px]" loading="lazy" />
                                    <h1 className='flex flex-col items-center justify-center px-5 text-2xl md:text-3xl tracking-wide font-medium'>{fw.name}</h1>
                                </div>
                                <p className='w-full text-justify leading-normal text-white/40 text-sm md:text-base'>{fw.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tools & Platforms Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 place-items-center mt-12 md:mt-20'
                    >
                        <motion.h2
                            className='col-span-1 md:col-span-2 lg:col-span-3 text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Tools & Platforms
                        </motion.h2>
                        {tools.map((tool, idx) => (
                            <motion.div
                                key={tool.name}
                                {...motionProps90}
                                layout
                                className="w-80 h-32 md:w-96 md:h-40 bg-white/10 border border-white/20 rounded-2xl shadow-lg backdrop-blur-md p-5 flex flex-col items-center transition-transform hover:scale-[1.03]"
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <Image src={tool.img} alt={tool.alt} width={50} height={50} className="w-[50px] h-[50px]" loading="lazy" />
                                    <h1 className='flex flex-col items-center justify-center px-5 text-2xl md:text-3xl tracking-wide font-medium'>{tool.name}</h1>
                                </div>
                                <p className='w-full text-justify leading-normal text-white/40 text-sm md:text-base'>{tool.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </>)}
        </div>
    )
}