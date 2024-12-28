import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Socket } from "socket.io-client";
import GroupChat from "../Chat/GroupChat";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';

interface GroupRegisterProps{
  socket: Socket;
}

const GroupRegister: React.FC<GroupRegisterProps> = ({socket}) => {


  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [redirect, setredirect] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string>();


  const navigate = useNavigate();

  /*const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    
      if(file){
        const reader = new FileReader();
        
        reader.onload = () => {
          const base64 = reader.result as string;
          setImageFile(base64);
        } 
        reader.readAsDataURL(file)
      }
} */

console.log(imageFile);


  const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();

    if(roomId !== ''){ 
      socket.emit('join-room', roomId, username);
      //setredirect(true);
      navigate("/chat/group", { state: { username, roomId } }); // Pass username and roomId
    }else{
      alert('please enter the roomId that you wan to join');
    }

  }

  return (
    <div className='bg-gradient-to-r from-[#a8edea] to-[#fed6e3] h-screen pt-40'>
       
       <form action="" className='flex justify-center items-center  flex-col gap-6 border border-black rounded-lg  w-[30%] mx-60 py-4 lg:ml-[530px]' onSubmit={handleSubmit} >
        <h1 className='text-xl font-bold'>Enter Room</h1>
         <input type='text' placeholder='enter username again' className='border border-gray-300 rounded-lg p-2' value={username} onChange={ev => {setUsername(ev.target.value)}} />
         {/*<input type='file' placeholder='use file here' id='fileInput' className='ml-[90px] hidden' onChange={handleFileChange}/>
         <label htmlFor='fileInput' className='bg-white cursor-pointer text-slate-400'>Upload Profile Photo</label> */}
         <input type='text' placeholder='enter group/room id here' className='border border-gray-300 rounded-lg p-2' value={roomId} onChange={ev => {setRoomId(ev.target.value)}}/>
        
         <button className='bg-red-600 rounded-lg p-2  text-white'>Enter Room</button>
       </form>
       
    </div>
   
  )
}

export default GroupRegister;  