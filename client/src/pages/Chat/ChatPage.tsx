import { IoSendOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { IoCloseCircleSharp } from "react-icons/io5";


interface ChatPageProps {
  socket: Socket;
 }

interface Users {
  userId: string;
  username: string;
  self: boolean;
  messeges: { content: string; fromSelf: boolean, time: string }[];
  hasNewMessages: boolean;
  profilePhoto: string;
}

interface SelfUsers {
  userId: string;
  username: string;
  self: boolean;
  profilePhoto: string;
}


const ChatPage: React.FC<ChatPageProps> = ({socket}) => {

     const [content, setContent] = useState<string>('');
     const [users, setUser] = useState<Users[]>([]);
     const [self, setSelfuser] = useState<SelfUsers | null>(null);
     const [selecteduser, setSelectedUser] = useState<Users | null>(null);
     const [otherUsers, setOtherUsers] = useState<Users[]>([]);
     const [time, setTime] = useState<string>();
     const [clickProfile, setClickProfile] = useState<boolean>(false);
     
     useEffect(() => {
      socket.on('users', (user: Users[]) => {
        console.log("Received users list:", user);
        
        const proccessedUsers = user.map((user: Users) => {
          user.self = user.userId === socket.id;  // Mark the current user
          user.messeges = []; //initializing array with messeges
          user.hasNewMessages = false; //first we are setting hashnew messeges as false 
          return user;
        });
    
        proccessedUsers.sort((a, b) => (a.self ? -1 : 1 || a.username < b.username ? -1 : 1));

        setUser(proccessedUsers);
      });
    
      return () => {
        socket.off('users');  // Clean up the event listener
      };
    }, [socket]);  // Re-run this effect when the socket object changes
    

  useEffect(() => {
    //console.log(users); // Log the users state when it's updated
    if(users.length > 0){
      const currentUser = users.find(user => user.self); // Find the current user
    
      console.log("Current User:", currentUser);
      setSelfuser(currentUser || null);
      console.log(users);
  
    // Filter out the other users
      const others = users.filter(user => !user.self); 
      setOtherUsers(others || []);
      console.log("Other Users:", others);
      }else{
        console.warn('user array is empty');
      }
   }, [users]); // This will log when the users array is updated

 
  useEffect(() => {
     
    socket.on('individual-messege', ({ content, from, time }: { content: string, from: string, time: string }) => {

      console.log(':', from);
    
    setUser(prevUsers => prevUsers.map((user) => {

      if(user.userId === from){  //if user is another user not us.
        const updatedMesseges = [...user.messeges, {content, fromSelf: false, time}];

        console.log(updatedMesseges);

        if(user.userId === selecteduser?.userId){
            setSelectedUser(prevSelectedUser => {
              if(prevSelectedUser){
                 return {...prevSelectedUser, messeges: updatedMesseges};
              }
              return prevSelectedUser;
            })
        }

        if(user !== selecteduser){
          
          return {...user, messeges: updatedMesseges, hasNewMessages: true}
        }else{
          return {...user, messeges: updatedMesseges}
        }
      }
        return user;
    }))

    });
    return () => {
      socket.off('individual-messege');
    };

 }, [selecteduser, socket]);

  const handleUser = (user: Users ) => {

      setSelectedUser(user); 
   }

  const handleSendMessege = () => {

    if(selecteduser){
      const time = new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes();
      setTime(time);

      socket.emit('private-messege', {content,
        to: selecteduser?.userId,
        time,
      })
      
      setUser((prevUsers) => 
        prevUsers.map((user: Users) => {  //user state again stores new array elements
         
         if(user.userId === selecteduser.userId){ 
            const updatedSelfMesseges = [...user.messeges, { content, fromSelf: true, time }];
            console.log(updatedSelfMesseges);
            
            return {...user, messeges: updatedSelfMesseges};
            } 
         //setSelectedUser(user);
         return user;
         })
        )
        setSelectedUser((prevSelectedUsers) => {
          if(prevSelectedUsers){
            return {...prevSelectedUsers, messeges: [...prevSelectedUsers.messeges, {content, fromSelf: true, time}]};
          }
          return prevSelectedUsers;
      })
      setContent('');//messege is clearing after sending the messege
      console.log(selecteduser);
    }else{
      alert('messege didnt send one more click on receiver chat');
    }
  }
  const zoomImage = () => {
     setClickProfile(true);
  }
  const closeProfile = () => {
    setClickProfile(false);
  }

  return (
   
    <section className='h-screen flex text-white'>
      <section className='bg-[#00003f] w-[20%] '><h1 className='mx-5 my-6 text-3xl font-bold'>Chats</h1>
        <br/>
        <div className='flex flex-col gap-4'>
        { otherUsers ? ( otherUsers.map(users => (
         <div className='bg-blue-900 text-xl font-semibold inline-flex mx-3 hover:bg-blue-950'>
           <img src={users.profilePhoto} alt='profile' className='w-[26px] h-[24px]`} ml-3 my-6 rounded-xl ' />
           <button onClick = {() => handleUser(users)} className=' mx-2 rounded-[30px] '>{users.username}</button>
         </div>
        ) ) ): <div>no chats loaded</div>
        }
        </div>
      </section>
      <section className=' w-[80%] flex flex-col gap-2'><h1 className='text-2xl text-black ml-3 font-bold'>messeges</h1>
      { self ? 
        <div className='flex '>
          <img src={self.profilePhoto}
            alt='profile'
            className={` ${clickProfile ? 'transition-all delay-150 duration-300 ease-in-out  mt-9 h-[300px] w-[280px] rounded-[590px] ml-[190px] lg:ml-[420px] lg:mt-16':  'transition-all delay-150 duration-300 ease-in-out w-[30px] h-[30px] rounded-[700px] ml-[490px] mt-2 lg:ml-[1100px]' }`}
            onClick={zoomImage}>
          </img>
            {clickProfile ? <button className='text-black h-[40px]' onClick={closeProfile}><IoCloseCircleSharp/></button> : ''}
          <button className='mb-auto ml-auto text-xl font-bold px-2 mr-16 py-1 text-black  '>{self.username}<p className='font-thin'>&#40;you&#41;</p></button>
        </div> : <h1 className='mt-[410px] mx-4 text-4xl' >loading...</h1> }
        <div className='my-14 mx-3 flex flex-col gap-8'>
          <ScrollToBottom className='h-[520px]'> 
          { !clickProfile && selecteduser?.messeges.map((messeges, idx) => 
           <div className={`h-10 w-[20%] ${messeges.fromSelf ? 'bg-green-300 ml-auto' : 'bg-blue-300'} my-9 p-2 rounded-md`}>
              <p><span className='text-black text-xl font-thin'>{messeges.content}&nbsp; &nbsp;</span><span className='text-sm'>{messeges.time}</span></p>  
            </div>
          )}  
           </ScrollToBottom >  
            </div>
        </section>
        <section className='fixed bottom-4 mx-[170px] flex gap-1'>
          <input type='text' className='mt-4 bg-slate-500 rounded-2xl w-[500px] h-7 lg:ml-[135px] lg:w-[1150px]' value={content} onChange={ev => {setContent(ev.target.value)}} />
          <button className=' mt-4 text-white bg-blue-400 h-8' onClick={handleSendMessege}
          disabled={!selecteduser}><IoSendOutline /></button>
        </section>
    </section>
  )
}

export default ChatPage;
