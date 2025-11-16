import io from 'socket.io-client';
import type {Socket} from 'socket.io-client';
import { SocketEvents } from './SocketEvents';
import { data, useUserData } from '@/store/userData.store';


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
        console.log(payload);
        const newData = payload.toString();


        const textDecoder = new TextDecoder('utf-8')
        const text = textDecoder.decode(payload)
        // console.log("::: data" ,text)
        const values:string[] = text.split(',');

        // console.log("brake:: ",values[7])
        console.log("lap: " , values[13] , values[14] , values[15])
        const telemetry: data = {
            Date: values[0] || "",
            SessionTime: Number(values[1]) || 0,
            Time: Number(values[2]) || 0,
            RPM: Number(values[3]) || 0,
            Speed: Number(values[4]) || 0,
            nGear: Number(values[5]) || 0,
            Throttle: Number(Number(values[6]).toFixed(2)) || 0,
            Brake: values[7] === 'False' ? false : true,
            Status: values[8] || "",
            Driver: values[9] || "",
            ES: Number(values[10]) || 0,
            Time_td: Number(values[11]) || 0,
            TrackPosition: Number(values[12]) || 0,
            CurrentLap: Number(values[13]) || 0,
            BestLap: Number(values[14]) || 0,
            LastLap: Number(values[15])   || 0,
            LapDelta: Number(values[16]) || 0,
            WeatherCondition: values[17] || "",
            WeatherTemp: Number(values[18].slice(0,2)) || 0,
            WeatherWind: Number(values[19].slice(0,4)) || 0,
            EngineVibration: Number(values[20]) || 0,
          
            Tiretemps: {
              fl: Number(values[21]) || 0,
              fr: Number(values[22]) || 0,
              rl: Number(values[23]) || 0,
              rr: Number(values[24]) || 0,
            },
          
            Fuel: Number(values[25]) || 0,
            TrackName: values[26] || "",
            TrackLocation: values[27] || "",
            Rotation: Number(values[28]) || 0
          };
          
        //   console.log(telemetry.EngineVibration)
        // console.log("brake:: ",telemetry.Brake)

          useUserData.getState().setData(telemetry)


    })
    this.clientSocket.on(SocketEvents.WELCOME, (data:string)=>{
        console.log(data)

    })
 }
}