
import {config} from 'dotenv'
import { databaseConnection } from './Database/dbConnect.ts';
import path from 'path'
import http from 'http'
import https from 'https'
import { app } from './app.ts';
import { Server } from 'socket.io';
import { socketServer } from './socketServer/SocketServer.ts';
import { fileURLToPath } from 'url';
import { UdPServer } from './udpServer/udpServer.ts';
import { TelemetryModel } from './model/F1Data.model.ts';
const envPath:(string) = path.resolve("/home/pumpum/coding/WeTalk/Backend/src","../.env")  
config()
    
//Since it's module then it means that __dirname doesnot exists , let's recreate it 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// await databaseConnection()
// .then(()=>{
//     try {
//         console.log("Database connected succesfully")
//     } catch (error) {
//         console.log(error)
//     }
// })

// const options:https.ServerOptions = {
//     key: fs.readFileSync(path.join(__dirname , '../certs/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname , '../certs/cert.pem'))
// }


const udpServer = UdPServer.getInstance();

const server = http.createServer(app);

//SocketIo Server
const io = new Server(server , { //Make it https later on
    cors:{origin:"*",
        credentials:true,
    },
    transports:["polling" , "websocket"]
})

export const relayServer = socketServer.getInstance(io);

//Clears telemetry
export async function clearTelemetry() {
    try {
        const result = await TelemetryModel.deleteMany({});
        console.log(`Deleted ${result.deletedCount} telemetry records.`);
    } catch (err) {
        console.error("Error clearing telemetry:", err);
    }
}

// Uncomment it to clear the telemetry data 
// clearTelemetry()

const port = Number(process.env.APP_PORT)

server.listen(port , '0.0.0.0', ()=>{
    console.log("Server listening on port" , port)
})
