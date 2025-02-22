interface Join{
    username: string;
    imageFile: string;
}

interface File{ 
    filename: string;
    originalname: string;
}

interface callData{
    userToCall: string;
    signalData: string;
    from: string;
    name: string;
}

declare module 'socket.io' { //This tells TypeScript that you are augmenting the types of the socket.io module, specifically the Socket interface. Without this, TypeScript would have no knowledge of your custom changes to the Socket object. whenever we need to add new properties we need to sue decalre module
    export interface Socket  {
      username?: string;
   } 
  }

interface MessegeData{
    username: string;
    roomId: string;
    messege: String;
    time: string;
  }

interface Data{
    file: File;
    username: string;
    roomId: string;
    userId: string;
    messege: String;
    time: string;
} 

export { Join, File, callData, MessegeData, Data };