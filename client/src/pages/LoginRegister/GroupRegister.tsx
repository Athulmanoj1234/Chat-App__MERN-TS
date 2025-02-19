import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Socket } from "socket.io-client";
import GroupChat from "../Chat/GroupChat";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
 } from "@/components/ui/form";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInput, RoomIdInput } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

interface GroupRegisterProps{
  socket: Socket;
}

interface formSchema{
  username: {
    messege?: string;
  }
}

const GroupRegister: React.FC<GroupRegisterProps> = ({socket}) => {


  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [redirect, setredirect] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string>();
  const { handleSubmit } = useForm();

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

  const formSchema= z.object({
    username: z.string().min(4, { message: "username must contain atleast four letters" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data)=> {
    //e.preventDefault();
    console.log(data);
    if(roomId !== ''){ 
      socket.emit('join-room', roomId, data.username);
      //setredirect(true);
      navigate("/chat/group", { state: { username, roomId } }); // Pass username and roomId
    }else{
      alert('please enter the roomId that you wan to join');
    }
  }

  return (
    <div className='bg-gradient-to-r from-[#a8edea] to-[#fed6e3] h-screen pt-40'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center  flex-col gap-6 border border-black rounded-lg  w-[30%] mx-60 py-4 lg:ml-[530px]"> 
          <h1 className='text-xl font-bold'>Enter Room</h1>
          <FormField control={form.control} 
           name="username"
           render={({ field })=> (
            <UserInput {...field} type='text' placeholder='enter username again' value={username} onChange={ev => {setUsername(ev.target.value)}} />
            )} 
          />
          <RoomIdInput type='text' placeholder='enter group/room id here' className='border border-gray-300 rounded-lg p-2' value={roomId} onChange={ev => {setRoomId(ev.target.value)}}/>
          <Button className={buttonVariants({ variant: "enterToChat" })}>Enter Room</Button>
        </form>
       </Form>
    </div>
   
  )
}

export default GroupRegister;  