import { Routes, Route } from "react-router-dom";
import Banner from "./components/Banner/Banner";
import GroupRegister from "./pages/LoginRegister/GroupRegister";
import GroupChat from "./pages/Chat/GroupChat";
import { serverUrl } from "./constants/constants";

import io from 'socket.io-client';


function App() {
  
  const socket = io(`${serverUrl}`, {
    reconnection: true,
    //reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  socket.on('connect', () => {
    console.log('connected');

  });

  return (
    <div>
     
      <Routes>
          <Route path='/' element={<Banner />}/>
          <Route path='/Group' element={<GroupRegister socket={socket}/>}/> 
          <Route path='/chat/group' element = {<GroupChat socket={socket} />}/>
          
       </Routes>
       
    </div>
  )
}

export default App;
