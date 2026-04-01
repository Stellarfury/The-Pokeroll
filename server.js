import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("."));

let waiting = {2:[],3:[],4:[]};

io.on("connection",(socket)=>{

socket.on("find-match",({players})=>{
if(!waiting[players]) return;

waiting[players].push(socket);

if(waiting[players].length===players){
let roomId="room-"+Math.random().toString(36).substr(2,5);
let roomPlayers=waiting[players];

roomPlayers.forEach(s=>s.join(roomId));

roomPlayers.forEach(s=>{
s.emit("match-found",{
roomId,
players:roomPlayers.map(p=>p.id)
});
});

waiting[players]=[];
}
});

socket.on("roll",({roomId,roll,playerId})=>{
socket.to(roomId).emit("opponent-roll",{roll,playerId});
});

});

server.listen(3000,()=>console.log("Running on 3000"));
