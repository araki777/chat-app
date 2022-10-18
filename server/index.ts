import express, { Request, Response, Express } from "express";
import next from "next";
import { Server, createServer } from "http";
import { Server as socketioServer, Socket } from "socket.io";
import roomsRouter from './api/rooms';

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

nextApp.prepare().then(async () => {
  const expressApp: Express = express();
  const server: Server = createServer(expressApp);
  const io: socketioServer = new socketioServer();

  io.attach(server);

  expressApp.use(express.json())
  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use('/api/rooms', roomsRouter)

  expressApp.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
  });

  io.on("connection", (socket: Socket) => {
    console.log("クライアントと接続しました");

    socket.on("join", (roomId) => {
      socket.join(roomId)
    })

    // チャットをルーム宛てに送る
    socket.on("sendMessage", (response) => {
      io.to(response.roomId).emit('giveMessage', response.msg)
    });

    socket.on("disconnect", () => {
      console.log("クライアントと切断しました");
    });
  });
});
