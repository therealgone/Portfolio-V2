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
        <div className='min-h-screen py-20'>
            {show && (<>
                <motion.h1
                    className="text-5xl md:text-7xl font-bold text-white mb-10 text-center"
                    {...motionProps90}
                >
                    Tech Stack
                </motion.h1>
                <div className=' '>

                    <motion.div
                        {...motionProps90} layout
                        className='grid grid-cols-3 gap-7 place-items-center'
                    >
                        {/* Section Title */}
                        <motion.h2
                            className='col-span-3 text-2xl md:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Languages
                        </motion.h2>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <img src="/HTML.svg" alt='HTML' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>HTML</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>The standard markup language for creating web pages.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <img src="/CSS.svg" alt='CSS' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>CSS</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>A style sheet language used for describing the presentation of a document.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90}
                            layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/JS.svg" alt='JavaScript' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>JavaScript (JS)</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>A programming language for creating interactive web content.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <img src="/Python.svg" alt='Python' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Python</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>High-level language known for its readability and use in AI/ML.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/sql-svgrepo-com.svg" alt='SQL' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>SQL</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Language used to communicate with databases.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/csh.svg" alt='C#' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>C#</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>An object-oriented language commonly used in game development (Unity).</p>
                            </GlowCard>
                        </motion.div>

                    </motion.div>

                    {/* Frameworks & Libraries Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='grid grid-cols-3 gap-7 place-items-center mt-20'
                    >
                        {/* Section Title */}
                        <motion.h2
                            className='col-span-3 text-2xl md:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Frameworks & Libraries
                        </motion.h2>

                        <motion.div
                            {...motionProps90} layout

                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/react.svg" alt='React' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>React</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>JavaScript library for building user interfaces.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/react.svg" alt='React Native' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>React Native</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Framework for building native apps using React.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/nextjs.svg" alt='Next.js' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Next.js</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>React framework for server-side rendering and routing.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/tailwind.svg" alt='Tailwind CSS' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Tailwind CSS</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Utility-first CSS framework for fast UI styling.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px]  hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/motion react.svg" alt='Framer Motion' width={50} height={50} className='w-[70px] ' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Framer Motion</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Animation library for React for smooth transitions.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/vite.svg" alt='Vite' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Vite</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Fast frontend build tool for modern web projects.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90}
                            layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/unity.svg" alt='Unity' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Unity</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>A powerful game engine for 2D, 3D, AR/VR game development.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90}
                            layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/android.svg" alt='Android Studio' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Android Studio</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>IDE for Android app development using Java/Kotlin.</p>
                            </GlowCard>
                        </motion.div>

                    </motion.div>

                    {/* Tools & Platforms Section */}
                    <motion.div
                        {...motionProps90} layout
                        className='grid grid-cols-3 gap-7 place-items-center mt-20'
                    >
                        {/* Section Title */}
                        <motion.h2
                            className='col-span-3 text-2xl md:text-3xl font-semibold text-zinc-400 text-center mb-4'
                        >
                            Tools & Platforms
                        </motion.h2>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/git.svg" alt='Git' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Git</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Version control system to manage code history.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/github.svg" alt='GitHub' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>GitHub</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Cloud platform for hosting Git repositories.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/ts.svg" alt='TypeScript' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>TypeScript</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>A superset of JavaScript that adds static typing.</p>
                            </GlowCard>
                        </motion.div>

                        <motion.div
                            {...motionProps90} layout
                        >
                            <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                                <div className='flex'>
                                    <Image src="/vercel.svg" alt='Vercel' width={50} height={50} loading='lazy' />
                                    <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Vercel</h1>
                                </div>
                                <p className='w-full text-justify   leading-normal text-white/40'>Deployment platform for frontend projects.</p>
                            </GlowCard>
                        </motion.div>

                    </motion.div>
                </div>
            </>)}
        </div>

    )
}