import { IoSendOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MdCloudUpload } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import { FcVideoCall } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { response } from "express";
import { LayoutGroup } from "framer-motion";

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
  const lastWordRef = useRef<string>('');

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
  //setMessege(splittedMessege.join());
  console.log(lastMalWord);
  //setMessege(messege + lastWord);

  useEffect(()=> {
    axios.get(`http://localhost:4002/malwords/${lastMalWord}`)
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
      }//if not file is selected then will be text it will be sented
      socket.emit('messege-data', messegeData);
      setMessege('');
      //setMalInput('');
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
    setManglishClickCount(prevCount=> prevCount + 1);
    setIsManglish(true);
  }

  const handleMalClicked = (malWords: string)=> {
    setMalInput(prevMalwords=> prevMalwords + " " + malWords);
    //console.log(malWords);
    //setMalInput(prevWords=> prevWords + " " + malWords);
    //setMalInput("");
    //setMessege(malInput);
    //setIsManglish(false);
  }
  console.log(malInput);
 
  /*useEffect(()=> {
    if(!messege || manglishWords.length == 0){
      return;
    }
      const newSplittedMessege = messege.split(" ");
      const updatedMessege = newSplittedMessege.map(word=> {
      if(word.startsWith("")){
        console.log(manglishWords[0]);
        console.log("word finded");
        setMessege(manglishWords[0]);
        const manglishWord = manglishWords.find(mWord=> 
          word.toLocaleLowerCase() === mWord.toLocaleLowerCase());
          return manglishWord || word; 
      } 
      })
      
      //setMessege(updatedMessege.join(" "));
  }, [messege, manglishWords]); 
 */ 
  
const handleMessegeChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
  const newMessege = e.target.value;
  setMessege(newMessege);

  //const lastWord = newMessege.split(" ").pop() || "";
  //console.log(lastWord); 
  //updating the useRef as curent lastword word as lastWord 
  //lastWordRef.current = lastWord;
}

  useEffect(()=> {
    if (!messege || manglishWords.length === 0) {
      return;
    }

    //const lastWord = lastWordRef.current;
    
    /*if(lastWord.trim().length === 0 || lastWord.startsWith(" ")){
      const manglishMatch = manglishWords[0];
      const updatedMessege = messege.trim() + " " + manglishMatch;
      setMessege(updatedMessege);
    }else{ */
      //if (lastWord.trim().length === 0) {
        //return; // Ignore if there's no word
      //}
      //console.log(lastWord.toLowerCase());
      /*const manglishMatch = manglishWords.find((word) =>
        word.toLowerCase() === lastWord.toLowerCase()
      );*/
      if(manglishWords){
        //const updatedMessege = messege.replace(lastMalWord, manglishWords[0]);
        //setMessege(updatedMessege);
        console.log(lastMalWord, manglishWords[0]);
      }
    //}
  },[messege, manglishWords])

  useEffect(()=> {
    //const getMalWordSpecifivally = splittedMessege.filter(eachMixedWord=> !(eachMixedWord[0] >= "a" && eachMixedWord[0] <= "z"));
    //console.log(getMalWordSpecifivally); 
    console.log(messege);
    //setMessege(splittedMessege.join(" ") + " " + malInput);
    setMessege(malInput)
  }, [malInput]);

  console.log(manglishClickCount);

  useEffect(() => {
    if(manglishClickCount % 2 == 0){ 
      setIsManglish(false);
      console.log("it is true");
    }else{  //if odd then enabling manglish keyboard
      setIsManglish(true);
    }
  }, [manglishClickCount]); 

  return (
    
    <section className='bg-white h-screen flex flex-col py-[60px]'>
    {/* Chat messages container */}
    <div className='w-[50%] mx-auto bg-[#dadada] flex-1 overflow-hidde h-40 '>
    
      <ScrollToBottom className='h-full px-4 '>
        <h1 className='text-2xl  fixed'>Messages</h1>
        <div className='flex flex-col gap-4 mt-8'>
        {isManglish && manglishWords?.map((malWords: string)=> (
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
           <img src={manglishIcon} className={`h-5 w-5 mt-2 mr-2 ${isManglish ? 'opacity-90' : 'opacity-20'} `} alt="" onClick={()=> {handleManglishOn()}}/>
           <label htmlFor='fileInput' className='cursor-pointer mt-3 ml-' ><MdCloudUpload className='text-orange-700 lg:w-[90%]'/></label>
           <input type='text' className='mt-4 bg-slate-400 rounded-2xl w-[300px]' value={messege} onChange={handleMessegeChange} placeholder='type a messege' />
            
            <button className='mt-4 ml-[-18px] bg-blue-500 h-5  text-white mx-1' onClick={imojiState}><MdEmojiEmotions /></button>
            <button className='mt-4 mr-[20px] bg-blue-500 h-5  text-white' onClick={sendMessege}><IoSendOutline /></button>
          
          </div>
        </section>
  )
}
export default GroupChat;