import { motion } from 'framer-motion';
import { GlowCard } from "./spotlight-card";

export default function tech() {

    return (
        <div className='min-h-screen   '>
            <h1>Tech</h1>
            <div className=' '>

                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    viewport={{ once: true }}
                    className='grid grid-cols-3 gap-7 place-items-center'
                >
                    {/* Section Title */}
                    <motion.h1
                        className='col-span-3 text-4xl font-bold text-center tracking-wide text-white mb-6'
                    >
                        Languages
                    </motion.h1>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/html.svg" alt='HTML' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>HTML</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>The standard markup language for creating web pages.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/css.svg" alt='CSS' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>CSS</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>A style sheet language used for describing the presentation of a document.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/JS.svg" alt='JavaScript' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>JavaScript (JS)</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>A programming language for creating interactive web content.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/python.svg" alt='Python' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Python</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>High-level language known for its readability and use in AI/ML.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/sql-svgrepo-com.svg" alt='SQL' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>SQL</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Language used to communicate with databases.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/csh.svg" alt='C#' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>C#</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>An object-oriented language commonly used in game development (Unity).</p>
                    </GlowCard>

                </motion.div>

                {/* Frameworks & Libraries Section */}
                <motion.div
                   initial={{ opacity: 0, y: 90 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    viewport={{ once: true }}
                    className='grid grid-cols-3 gap-7 place-items-center mt-20'
                >
                    {/* Section Title */}
                    <motion.h1
                        className='col-span-3 text-4xl font-bold text-center tracking-wide text-white mb-6'
                    >
                        Frameworks & Libraries
                    </motion.h1>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/react.svg" alt='React' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>React</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>JavaScript library for building user interfaces.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/react.svg" alt='React Native' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>React Native</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Framework for building native apps using React.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/nextjs.svg" alt='Next.js' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Next.js</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>React framework for server-side rendering and routing.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/tailwind.svg" alt='Tailwind CSS' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Tailwind CSS</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Utility-first CSS framework for fast UI styling.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px]  hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/motion react.svg" alt='Framer Motion' className='w-[70px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Framer Motion</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Animation library for React for smooth transitions.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/vite.svg" alt='Vite' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Vite</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Fast frontend build tool for modern web projects.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/unity.svg" alt='Unity' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Unity</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>A powerful game engine for 2D, 3D, AR/VR game development.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/android.svg" alt='Android Studio' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Android Studio</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>IDE for Android app development using Java/Kotlin.</p>
                    </GlowCard>

                </motion.div>

                {/* Tools & Platforms Section */}
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    viewport={{ once: true }}
                    className='grid grid-cols-3 gap-7 place-items-center mt-20'
                >
                    {/* Section Title */}
                    <motion.h1
                        className='col-span-3 text-4xl font-bold text-center tracking-wide text-white mb-6'
                    >
                        Tools & Platforms
                    </motion.h1>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/git.svg" alt='Git' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Git</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Version control system to manage code history.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/github.svg" alt='GitHub' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>GitHub</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Cloud platform for hosting Git repositories.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/ts.svg" alt='TypeScript' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>TypeScript</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>A superset of JavaScript that adds static typing.</p>
                    </GlowCard>

                    <GlowCard className='  blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/vercel.svg" alt='Vercel' className='w-[50px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Vercel</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>Deployment platform for frontend projects.</p>
                    </GlowCard>

                    <GlowCard className='   blur-[1.5px] hover:blur-none transition-all ease-in-out duration-500 '>
                        <div className='flex'>
                            <img src="/spline.svg" alt='Spline' className='w-[60px] ' />
                            <h1 className='flex flex-col items-center  justify-center px-5 text-3xl tracking-wide font-medium'>Spline</h1>
                        </div>
                        <p className='w-full text-justify   leading-normal text-white/40'>3D design tool used for creating and embedding interactive experiences.</p>
                    </GlowCard>

                </motion.div>
            </div>
        </div>
    )
}