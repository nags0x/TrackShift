import { Server, Socket } from "socket.io";
import { SocketEvents } from "../types/SocketEvents.ts";

export class socketServer {

    static instance:socketServer | null;
    public io:Server | null;
    constructor(io:Server) {
        this.io = io
        this.io.on(SocketEvents.CONNECTION, (socket) => {
            this.handleConnection(socket)
        });
    }

    static getInstance(io?:Server | null){
        if(!socketServer.instance){
            socketServer.instance = new socketServer(io);
        }
        return socketServer.instance
    }

    private handleConnection(socket:Socket) { //Responsible for as handling socket connection methods
        console.log("User connected with socketId: ", socket.id);

        socket.emit(SocketEvents.WELCOME , {
            data:"Welcome gattu"
        })
    }
};

