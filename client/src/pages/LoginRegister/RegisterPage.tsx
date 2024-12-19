import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import ChatPage from '../Chat/ChatPage';
import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import App from '../../App';

interface ChatPageProps {
  socket: Socket;
}

const RegisterPage: React.FC<ChatPageProps> = ({socket}) => {
 
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>();
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string>();

  
  const onUsernameSelection = async (username: string): Promise<void> => { 
     
    /*{const register = {
       username: username,
       email: email,
       password: password,
 }  */
    const userData = {
      username,
      imageFile: imageFile,
    }

    socket.emit('join', userData);
    setUsernameAlreadySelected(true);
    
    }

   const handleSubmit = (e: React.FormEvent) => {
  
     if(username !== ''){
      e.preventDefault();
       onUsernameSelection(username);
       setRedirect(true);
     }else{  //use else if we dont use else and we write outside braces it will execute no matter what
      alert('enter username and upload profile photo to continue');
      setRedirect(false);
     }
       
   }

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        
          if(file){
            const reader = new FileReader();
            
            reader.onload = () => {
              const base64 = reader.result as string;
              setImageFile(base64);

            } 

            reader.readAsDataURL(file)
          }

   }

   console.log(imageFile);


if(redirect == true){
  return <Navigate to = '/chat' />
 }


  return (
   <div className='bg-gradient-to-r from-[#a8edea] to-[#fed6e3] h-screen pt-40'>
      <div>
       <form action="" className='flex justify-center items-center  flex-col gap-6 border border-black rounded-lg w-[30%] h-[300px] ml-[230px] lg:ml-[500px]' onSubmit={handleSubmit}>
       <h1 className='text-2xl font-bold flex justify-center items-center mt-20 mr-9 ml-7'>Enter details</h1>
         <input type='text' placeholder='enter username here' value={username} onChange={ev => {setUsername(ev.target.value)}} className='border border-gray-300 rounded-lg p-2' />
         <input type='file' placeholder='use file here' id='fileInput' className='ml-[90px] hidden' onChange={handleFileChange}/>
         <label htmlFor='fileInput' className='bg-white cursor-pointer text-slate-400'>Upload Profile Photo</label>
         <button className='bg-red-600 rounded-lg p-2  '>Enter Chat</button>
       </form>
      </div> 
    </div>
   
  )
}

export default RegisterPage;
