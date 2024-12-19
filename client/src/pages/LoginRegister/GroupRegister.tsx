import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Socket } from "socket.io-client";
import GroupChat from "../Chat/GroupChat";
import { useNavigate } from "react-router-dom";

interface GroupRegisterProps{
  socket: Socket;
}

const GroupRegister: React.FC<GroupRegisterProps> = ({socket}) => {


  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [redirect, setredirect] = useState<boolean>(false);

  const navigate = useNavigate();

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
         <input type='text' placeholder='enter group/room id here' className='border border-gray-300 rounded-lg p-2' value={roomId} onChange={ev => {setRoomId(ev.target.value)}}/>
        
         <button className='bg-red-600 rounded-lg p-2  text-white'>Enter Room</button>
       </form>
    </div>
   
  )
}

export default GroupRegister;  