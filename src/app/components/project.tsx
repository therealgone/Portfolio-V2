
import { motion} from 'framer-motion';
import { useEffect, useState } from 'react';

type nav = {
    active:string
}




export default function projects ({active}:nav) {

    const [show,setShow] = useState(false)

    useEffect(() => {

        if (active  == "Tech-Stack" )
        {
            setShow(true)
        }
    })

    return (

        <div className='min-h-screen'>
            { show && (
           <motion.div>
<h1 className='text-3xl text-white'>Project</h1>
           </motion.div>
           )}
        </div>
    )
}