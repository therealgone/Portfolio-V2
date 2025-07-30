'use client';

import { useState } from "react";
import { motion } from "framer-motion";

const motionProps90 = {
  initial: { opacity: 0, y: 90 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  viewport: { once: true }
};


type nav = {
  active : string;
}
export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://formspree.io/f/xeokobav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Message sent!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-20">
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-white mb-10 text-center"
        {...motionProps90}
      >
        Contact
      </motion.h1>
      <motion.form
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-[700px]  font-mono tracking-wide p-6 md:p-10 rounded-3xl shadow-xl flex flex-col gap-6"
      >
        <motion.div {...motionProps90}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-4 rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:drop-shadow-[0_0_4px_white] focus:ring-2 focus:ring-zinc-500/30 outline-none transition mb-2"
          />
        </motion.div>
        <motion.div {...motionProps90}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-4 rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:ring-2 focus:drop-shadow-[0_0_4px_white] focus:ring-zinc-500/30 outline-none transition mb-2"
          />
        </motion.div>
        <motion.div {...motionProps90}>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="w-full p-4 h-48 rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:ring-2 focus:drop-shadow-[0_0_4px_white] focus:ring-zinc-500/30 outline-none transition mb-2 resize-none"
          />
        </motion.div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-full animate-rotate-border rounded-3xl bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white text-white font-bold p-px shadow-lg hover:shadow-white/20 transition-all duration-300 text-lg tracking-wide mt-2"
        >
          <h1 className="backdrop-blur-3xl rounded-3xl bg-zinc-950 py-3 w-full ">Send Message</h1>
        </motion.button>
      </motion.form>
    </div>
  );
}