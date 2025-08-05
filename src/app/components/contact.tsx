'use client';

import { useState } from "react";
import { motion } from "framer-motion";

type nav = {
  active: string;
}
export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [notification, setNotification] = useState<string | false>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {



    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };
  const namesent = formData.name

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("https://formspree.io/f/xeokobav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {

      setNotification(namesent);



      setTimeout(() => setNotification(false), 5000);

      setFormData({ name: "", email: "", message: "" });
    } else {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-10 md:py-20">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}


          className="fixed bottom-5 right-5 w-[280px] md:w-[330px] rounded-xl bg-white/50 backdrop-blur-md p-3 md:p-4 animate-slide-up-fade z-50 text-black">
          <div className="text-xs md:text-sm font-semibold mb-1 border-b border-white/30 pb-1">✔️ Message Sent</div>
          <div className="text-xs">Thank you, {notification} , for reaching out.</div>
          <div className="text-xs">We'll get back to you very soon.</div>
        </motion.div>

      )}

      <motion.h1
        className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 90 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        Contact
      </motion.h1>
      <motion.form
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-[700px] font-mono tracking-wide p-4 md:p-6 lg:p-10 rounded-2xl md:rounded-3xl shadow-xl flex flex-col gap-4 md:gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:drop-shadow-[0_0_4px_white] focus:ring-2 focus:ring-zinc-500/30 outline-none transition mb-2 text-sm md:text-base"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:ring-2 focus:drop-shadow-[0_0_4px_white] focus:ring-zinc-500/30 outline-none transition mb-2 text-sm md:text-base"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="w-full p-3 md:p-4 h-32 md:h-48 rounded-lg md:rounded-xl bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-700/30 focus:border-zinc-500 focus:ring-2 focus:drop-shadow-[0_0_4px_white] focus:ring-zinc-500/30 outline-none transition mb-2 resize-none text-sm md:text-base"
          />
        </motion.div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-full animate-rotate-border rounded-2xl md:rounded-3xl bg-conic/[from_var(--border-angle)] from-white via-zinc-800 to-white text-white font-bold p-px shadow-lg hover:shadow-white/20 transition-all duration-300 text-base md:text-lg tracking-wide mt-2"
        >
          <h1 className="backdrop-blur-3xl rounded-2xl md:rounded-3xl bg-zinc-950 py-2 md:py-3 w-full text-sm md:text-base">Send Message</h1>
        </motion.button>
      </motion.form>
    </div>
  );
}