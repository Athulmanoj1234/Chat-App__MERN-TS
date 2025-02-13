import { IoSendOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MdCloudUpload } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import { FcVideoCall } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { response } from "express";

interface GroupChatProps{
  socket: Socket;
}

const GroupChat: React.FC<GroupChatProps> = ({socket}) => {

  const location = useLocation();
  const {username, roomId} = location.state || {};

  const [messege, setMessege] = useState<string>('');
  const [file, setFile] = useState<File | null>();
  const [messegeList, setMessegeList] = useState<any[]>([]);
  const [imageView, setImageView] = useState<boolean>(false);
  const [isManglish, setIsManglish] = useState<boolean>(false);
  const [manglishWords, SetmanglishWords] = useState<string[]>([]);

  const manglishIcon = "https://www.manglish.app/icon.webp";
  
  interface MessegeData{
    username: string;
    roomId: string;
    messege: string;
    userId: string | undefined;
    time: string;
  }

  interface GroupUsers{
    username: string;
    userId: string;
    self: boolean;
    roomId: string;
    messeges: {content: string; fromSelf: boolean}[];
  }


  useEffect(() => {

    socket.on('messege', (data: MessegeData) => {
      
      console.log(`messege is ${data.messege} received from ${data.username} `);
      //if(data.userId == socket.id){
       // const selfMesseges = {...data, }

       setMessegeList((prevMessegeList: MessegeData[]) => 
              [...prevMessegeList, data]    
       );
      
       console.log(messegeList);
       });
       

    return () => {
      socket.off('messege');
    };

  },[socket]);

  useEffect(()=> {
    axios.get(`https://api.varnamproject.com/tl/ml/${messege}`)
     .then(response=> {
      console.log(response.data.result);
      SetmanglishWords(response.data.result);
     });
  }, [messege])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {  //current event will be received ie with current event current input value also received
     
     const file = event.target.files?.[0];
     if(file){
      const reader: FileReader = new FileReader(); //A FileReader is an inbuilt JavaScript API that reads file contents asynchronously. It can convert files into different formats like text, ArrayBuffer, or Base64.

      reader.onload = () => {   //when the file reading process is complete the onload callback is trigered
        const base64 = reader.result as string; //the file content is converted into base64 string after this line reader.readAsDataURL(file) gets executed
        socket.emit('fileUpload', {
          file: base64,
          username,
          roomId,

          userId: socket.id
        }); 
      
      }
      reader.readAsDataURL(file);//after file read as Dataurl ie base64 the file reading process is completed and onload function is called
    }     
  };


 const sendMessege = () => {

    setImageView(false);

    if(!messege && !file){
      return;
    }
    
    if(username !== '' && roomId !== ''){
      const messegeData: MessegeData = {
        username: username,
        userId: socket.id,
        roomId: roomId,  
        messege: messege,
        time: new Date(Date.now()).getHours() 
        + ':' +
        new Date(Date.now()).getMinutes() 
    } 
     
      if(file){
        handleFileUpload({
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
        setFile(null);
        
      }//if not file is selected then will be text it will be sented

      socket.emit('messege-data', messegeData);
      
      setMessege('');
    }else{
      alert('username and roomId cannot find');
    }
      
 }
  const isBase64 = (messege: string) => messege.startsWith('data:'); //startsWith function returns true or false as messege starts with specified word in the string. because Base64 encoded files always start with data:
  
  console.log(messegeList);

  const imojiState = () => {
     setImageView(true);   
  }

  const imojiClose = () => {
    setImageView(false);
  }
  
  const handleManglish = ()=> {
    console.log("manglish clicked");
    setIsManglish(true);
  }

  const handleMalClicked = (malWords: string)=> {
    setMessege(malWords);
    setIsManglish(false);
  }

  return (
    
    <section className='bg-white h-screen flex flex-col py-[60px]'>
    {/* Chat messages container */}
    <div className='w-[50%] mx-auto bg-[#dadada] flex-1 overflow-hidde h-40 '>
    
      <ScrollToBottom className='h-full px-4 '>
        <h1 className='text-2xl  fixed'>Messages</h1>
        <div className='flex flex-col gap-4 mt-8'>
        {isManglish && manglishWords?.map(malWords=> (
       <div className="flex flex-col">
        <button onClick={()=> {handleMalClicked(malWords)}}>{malWords}</button>
       </div>
       ) )
        }
          {messegeList?.map((userMessegeList: MessegeData) => (
            
            <div onClick={imojiClose}
              className={`${
                username === userMessegeList.username
                  ? 'bg-green-300 ml-auto'
                  : 'bg-blue-300 mr-auto'
              } p-2 rounded-md`}
            >
              <p>
                {isBase64(userMessegeList.messege) ? (
                  <img
                    src={userMessegeList.messege}
                    alt='Sent photo'
                    className='max-w-full h-14'
                  />
                ) : (
                  userMessegeList.messege
                )}
              </p>
              
              <p className={`text-xl ${userMessegeList.username ? 'text-orange-700 text-xs' : ''}`}>
                {isBase64(userMessegeList.messege) ? '' : (userMessegeList.username) }  
              {' ' + userMessegeList.time}</p>
            </div>
          ))}
        </div>
        
   {  imageView ?   
    <div className="mr-[130px] lg:ml-[10px]">
    <EmojiPicker className="h-[-120px] " onEmojiClick={(e) => setMessege(messege + e.emoji)}/>
    </div> : ''
      }
      </ScrollToBottom>
    </div>
    
    
         <div className='w-[50%] mx-auto bg-gray-100 h-12 flex items-center p-3 gap-0'>
         
           <input type='file'   
             onChange={handleFileUpload} className='hidden'
             id='fileInput'
           />
           <img src={manglishIcon} className="h-5 w-5 mt-2 mr-2" alt="" onClick={handleManglish}/>
           <label htmlFor='fileInput' className='cursor-pointer mt-3 ml-' ><MdCloudUpload className='text-orange-700 lg:w-[90%]'/></label>
           <input type='text' className='mt-4 bg-slate-400 rounded-2xl w-[300px]' value={messege} onChange={e => setMessege(e.target.value)} placeholder='type a messege' />
            
            <button className='mt-4 ml-[-18px] bg-blue-500 h-5  text-white mx-1' onClick={imojiState}><MdEmojiEmotions /></button>
            <button className='mt-4 mr-[20px] bg-blue-500 h-5  text-white' onClick={sendMessege}><IoSendOutline /></button>
          
          </div>
        </section>
  )
}
export default GroupChat;