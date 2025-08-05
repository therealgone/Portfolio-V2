
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';


type nav = {
    active: string;
};

export default function projects({ active }: nav) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (active == "Project") {
            setShow(true);
        }
    }, [active]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-8 md:space-y-12 px-4 md:px-8 lg:px-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                   className="text-4xl md:text-7xl font-bold text-white mb-10 text-center"
            >
                Projects
            </motion.h1>

            <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
                {/* 🔹 Project 1: Fake News Detection */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://github.com/therealgone/FAKE-NEWS-DETECTION"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/FAKE-NEWS-DETECTION/raw/main/Fake%20News%20Detector%20UI.png"
                            className="w-full h-full object-cover"
                            alt="Fake News Detector"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">Fake News Detection Project</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                A modern web application that uses AI to detect and verify fake news articles.
                                Built with FastAPI, React, CUDA ML, and Google's Gemini AI.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 2: Medical Insurance Analysis */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://github.com/therealgone/Medical-Insurance-Report-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/Medical-Insurance-Report-/raw/main/UI1.png"
                            className="w-full h-full object-cover"
                            alt="Medical Insurance Report"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">Medical Insurance Report Analysis System</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                This system analyzes medical reports and scans for insurance claims using OCR,
                                AI image analysis, and NLP to extract and understand health data.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 3: Sign Language Detection */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://github.com/therealgone/Hand-Gesture-Based-Communication-System-for-Disabled-Individual"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/Hand-Gesture-Based-Communication-System-for-Disabled-Individual/raw/main/UI.jpg"
                            className="w-full h-full object-cover"
                            alt="Sign Language Detection"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">Sign Language Detection System</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                A real-time system using computer vision and ML to translate sign language gestures
                                into speech and text for accessible communication.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 4: NexText */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://github.com/therealgone/NexText"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/NexText/raw/main/UI/Home.png"
                            className="w-full h-full object-cover"
                            alt="NexText"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">NexText - Real-time Chat Application</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                A modern, real-time chat application built with Next.js, featuring a sleek UI with beautiful animations
                                and a secure authentication system.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 5: React Movie */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://github.com/therealgone/React-Movie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/React-Movie/blob/main/Movie/UI%20Movie.png?raw=true"
                            className="w-full h-full object-cover"
                            alt="React Movie"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">React Movie 🎬</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                A modern, glowing, IMDB-inspired movie browser built with React and the TMDB API. This project was made just to learn and practice React, API integration, and beautiful UI design!
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 6: Dev-Book */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://my-book-indol.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/Dev-Book/blob/main/public/UI.png?raw=true"
                            className="w-full h-full object-cover"
                            alt="Dev-Book"
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">Dev-Book</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                A living dev journey: Everything I learn, build, and improve in React and web development. As I learn, I build. As I build, I forget. Dev-Book is my way of documenting everything — so I never lose track of my dev journey. It's also a place for other devs to learn real-world things, just raw code and logic.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Project 7: Jeevan Baabu's Portfolio Website V1 */}
                <motion.a
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    href="https://jeevan-beryl.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[900px] mx-auto"
                >
                    <div className="relative w-full aspect-[9/7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer hover:shadow-white/10">
                        <img
                            src="https://github.com/therealgone/Jeevan_Website/raw/main/UI"
                            className="w-full h-full object-cover"
                            alt="Jeevan Baabu's Portfolio Website V1"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/900x700?text=Portfolio+V1'; }}
                        />
                        <div className="absolute bottom-0 w-full h-[150px] md:h-[200px] bg-gradient-to-br from-gray-800/10 to-gray-900/10 backdrop-blur-xl border-t border-gray-700/10 p-3 md:p-5">
                            <h1 className="text-white text-lg md:text-xl">Jeevan Baabu's Portfolio Website V1</h1>
                            <p className="text-white/70 mt-1 md:mt-2 text-base md:text-xl">
                                My very first personal portfolio website, built from scratch to showcase my projects, skills, and journey as a developer. This project marked the beginning of my web development path and is a milestone in my learning.
                            </p>
                        </div>
                    </div>
                </motion.a>

                {/* 🔹 Coming Soon */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[900px] h-[200px] md:h-[250px] rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-dashed border-white text-white/60 text-lg md:text-xl tracking-widest hover:scale-[1.03] transition-all duration-900 ease-in-out mx-auto"
                >
                    <span className="animate-bounce">🚀</span> More Projects Coming Soon...
                </motion.div>
            </div>
        </div>
    );
}