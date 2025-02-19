import { useState } from "react";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion';
import { Button } from "../ui/button";

const Banner = () => {

 

  return (
    <div className='bg-gradient-to-r from-[#a8edea] to-[#fed6e3] h-screen'> 
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 1 }}
        transition={{ duration: 3 }}
      >
        <section className='flex justify-center items-center h-screen gap-6 transition delay-150 duration-300 ease-in-out'> {/* should have an explicit height to items center */}
          <section className='bg-slate-200 w-[70%] flex flex-col items-center gap-4 h-[400px] lg:w-[20%]'>
            <p className='text-center font-serif mt-[90px]'>Create rooms and chat with friends families and communities...</p>
            <Link to='/group'><Button  className='bg-orange-400 rounded-md p-1 hover:bg-red-500 hover:scale-105 lg:mt-6'>Chat</Button></Link>
          </section>
        </section>
      </motion.form>
    </div>  
  )
}

export default Banner;
