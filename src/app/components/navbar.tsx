'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
export default function navbar () {
const [open,setOpen] = useState(false)
    
    return (
        <div className='flex sticky top-0 z-[9999] justify-center py-9 '>
            <motion.div className='bg-white rounded-full w-[100px] h-[10px] absolute py-6'>

            </motion.div>
        </div>
    )
}