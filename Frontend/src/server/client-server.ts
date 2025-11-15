import io from 'socket.io-client';
import type {Socket} from 'socket.io-client';
import { SocketEvents } from './SocketEvents';

interface TelemetryData {
    Date: string;
    Session: string;
    Time: string;
    RPM: string;
    Speed: string;
    Gear: string;
    Throttle: string;
    Break: string;
    State: string;
    Driver:string;
  }

export class ClientServer{
 public clientSocket : Socket  | null;
 static clientInstance:ClientServer | null;

 constructor(){
    const BackendUrl = import.meta.env.VITE_BACKEND_URL
    console.log("Backend :",BackendUrl)
    this.clientSocket = io(BackendUrl);
    this.SocketHandler();
 }
 static getInstance(){
    if(!ClientServer.clientInstance){
        ClientServer.clientInstance = new ClientServer();
    }
    return ClientServer.clientInstance;
 }

 private SocketHandler(){
    this.clientSocket.on(SocketEvents.CONNECT , ()=>{
        console.log("User connected to the backend" , this.clientSocket.id)
    })

    this.clientSocket.on(SocketEvents.MOCK_DATA , (payload:ArrayBuffer)=>{

        const textDecoder = new TextDecoder('utf-8')
        const text = textDecoder.decode(payload)
        const values:string[] = text.split(',');
        console.log("yoo: ",values)
        const telemetry: TelemetryData = {
            Date: (values[0]) ,
            Session: (values[1]) ,
            Time: (values[2]) ,
            RPM: (values[3]) ,
            Speed: (values[4]) ,
            Gear: (values[5]) ,
            Throttle: (values[6]) ,
            Break: (values[7]),
            State: (values[8]) ,
            Driver: (values[9]) 
          };
          console.log("hh");
          console.log(telemetry);   

    })
    this.clientSocket.on(SocketEvents.WELCOME, (data:string)=>{
        console.log(data)

    })
 }
}