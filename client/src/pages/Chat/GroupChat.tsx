import { IoSendOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MdCloudUpload } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import { FaAffiliatetheme } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../../constants/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

interface GroupChatProps{
  socket: Socket;
}

const GroupChat: React.FC<GroupChatProps> = ({socket}) => {

  const location = useLocation();
  const {username, roomId} = location.state || {};

  const [messege, setMessege] = useState<string>("");
  const [file, setFile] = useState<File | null>();
  const [messegeList, setMessegeList] = useState<any[]>([]);
  const [imageView, setImageView] = useState<boolean>(false);
  const [isManglish, setIsManglish] = useState<boolean>(false);
  const [manglishWords, SetmanglishWords] = useState<string[]>([]);
  const [malInput, setMalInput] = useState<string>("");
  const [manglishClickCount, setManglishClickCount] = useState<number>(0);
  const [manglishTheme, setManglishTheme] = useState(false);
  
  const manglishIcon = "https://www.manglish.app/icon.webp";
  
  interface MessegeData{
    username: string;
    roomId: string;
    messege: string;
    userId: string | undefined;
    time: string;
  }

  useEffect(() => {

    socket.on('messege', (data: MessegeData) => {
      console.log(`messege is ${data.messege} received from ${data.username} `);
      setMessegeList((prevMessegeList: MessegeData[]) => [...prevMessegeList, data]);
      console.log(messegeList);
       });
       return () => {
        socket.off('messege');
    };
  },[socket]);

  const splittedMessege = messege.split(" ");
  console.log(splittedMessege);
  const messegeIndex = splittedMessege.length - 1;
  const lastMalWord = splittedMessege[messegeIndex];
  console.log(lastMalWord);

  useEffect(()=> {
    axios.get(`${serverUrl}/malwords/${lastMalWord}`)
     .then(response=> {
      console.log(response.data[1]);
      SetmanglishWords(response.data[1]);
     }).catch(err=> {
          console.error("Error message:", err.message);
          console.error("Error code:", err.code); 
      })
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
    setMalInput("");
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
      }
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
   //new update for manglish button icon deciding opacity ie true or false based on odd or even count
  const handleManglishOn = ()=> {
    console.log("manglish clicked");
    setIsManglish(prevState=> !prevState);
  }

  const handleMalClicked = (malWords: string)=> {
    setMessege(prevMessege=> prevMessege.replace(lastMalWord, malWords));
    console.log(messege);
  }

  console.log(malInput);
 
  const handleMessegeChange = (e: any)=> {
    const newMessege = e.target.value;
    setMessege(newMessege);
  }
   
  const handleManglishTheme =()=> {
    setManglishTheme(prevTheme=> !prevTheme);
  }

  useEffect(()=> {
    if (!messege || manglishWords.length === 0) {
      return;
    }
    if(manglishWords){
        console.log(lastMalWord, manglishWords[0]);
      }
  },[messege, manglishWords])

  useEffect(()=> {
    setMessege(malInput);
    console.log(messege);
  }, [malInput]);

  console.log(manglishClickCount);

  return (
    <section className='bg-white h-screen flex flex-col py-[60px]'>
    {/* Chat messages container */}
      <div className='w-[50%] mx-auto bg-[#dadada] flex-1 overflow-hidde h-40 '>
        <ScrollToBottom className='h-full px-4 '>
          <h1 className='text-2xl  fixed'>Messages</h1>
          <div className='flex flex-col gap-4 mt-8'>
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
        { imageView ?   
          <div className="mr-[130px] lg:ml-[10px]">
            <EmojiPicker className="h-[-120px] " onEmojiClick={(e) => setMessege(messege + e.emoji)}/>
          </div> : ''
        }
        </ScrollToBottom>
      </div>
      { isManglish ? (
        <div className={`${manglishTheme ? 'flex justify-center bg-black text-green-700 gap-2 w-[50%] ml-[382px] flex-wrap'
                    : 'flex justify-center bg-[#FAF1F5] text-black gap-4 w-[50%] ml-[382px] flex-wrap'}` }>
          <Button className={`${manglishTheme ? buttonVariants({ variant: "lightTheme" }) : buttonVariants({ variant: "darkTheme" })}`} onClick={handleManglishTheme}><FaAffiliatetheme /></Button>
        { isManglish && ( manglishWords.map((eachManglishWord: string)=>(
          <Button onClick={()=> handleMalClicked(eachManglishWord)} className={buttonVariants({variant: "eachManglishWord"})}>{eachManglishWord}</Button>
        ) ) ) }
        </div>
      ) : " " }
      <div className='w-[50%] mx-auto bg-gray-100 h-12 flex items-center p-3 gap-0'>
        <Input type='file' onChange={handleFileUpload} className='' id='fileInput' />
          <img src={manglishIcon} className={`h-5 w-5 mr-2 ${isManglish == true ? 'opacity-90' : 'opacity-20'} `} alt="" onClick={()=> {handleManglishOn()}}/>
          <Label htmlFor='fileInput' ><MdCloudUpload className='text-orange-700 lg:w-[90%]'/></Label>
          <Input type="text" value={messege} onChange={handleMessegeChange} placeholder='type a messege' />
          <Button className={buttonVariants({ variant: "emojiEmotions", size: "emojiEmotions" })} onClick={imojiState}><BsEmojiSmile /></Button>
          <Button className={buttonVariants({ variant: "sendOutline", size: "sendOutline" })} onClick={sendMessege}><IoSendOutline /></Button>
      </div>
    </section>
  )
}
export default GroupChat;