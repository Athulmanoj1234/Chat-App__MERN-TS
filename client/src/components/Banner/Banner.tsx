import { useState } from "react";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion';

const Banner = () => {

 

  return (
   <div className='bg-gradient-to-r from-[#a8edea] to-[#fed6e3] h-screen'> 
       <motion.form
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 1 }}
       transition={{ duration: 3 }}
       >
       <section className='flex justify-center items-center h-screen gap-6 transition delay-150 duration-300 ease-in-out'> {/* should have an explicit height to items center */}
      
        <section className='bg-slate-200 w-[30%] flex flex-col items-center gap-4 h-72 lg:w-[20%]'>
          <h2 className='text-center font-bold text-lg'>Go with group chats</h2>
          <p className='text-center font-serif'>Create rooms and chat with friends families and communities...</p>
          <Link to='/group'><button  className='bg-orange-400 rounded-md p-1 hover:bg-red-500 hover:scale-105 transition-transform lg:mt-6 focus:rotate-180'>Chat</button></Link>
        </section>
        <section className='bg-slate-200 w-[30%] flex flex-col items-center gap-4 h-72 lg:w-[20%]'>
        <h2 className='text-center font-bold text-lg'>Go with private chats</h2>
          <p className='text-center font-serif'>lets chat private with one on one by sending text messeges which ensures safety...</p>
           
           <Link to='/register'><button  className='bg-orange-400 rounded-md p-1 hover:bg-red-500 hover:scale-105 transition-transform focus:rotate-180' >chat</button></Link>
        </section>
           
     </section>
     </motion.form>
    </div>  
  )
}

export default Banner;
