import express, { Request, Response, Express } from "express";
import next from "next";
import { Server, createServer } from "http";
import { Server as socketioServer, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

nextApp.prepare().then(async () => {
  const expressApp: Express = express();
  const server: Server = createServer(expressApp);
  const io: socketioServer = new socketioServer();

  io.attach(server);

  expressApp.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
  });

  io.on("connection", (socket: Socket) => {
    console.log("クライアントと接続しました");
    socket.on("create room", async (data, callback) => {
      try {
        const { roomName, capacity, isRelease, userId } = data;
        const room = await prisma.rooms.create({
          data: {
            room_name: roomName,
            capacity,
            isRelease,
            user_id: userId
          } as any
        })
        const roomId = 'room-' + room.id
        socket.join(roomId);
        callback({ roomName: roomName, message: '部屋を作成しました' })
      } catch(e) {
        callback(e)
      }
    });

    socket.on("disconnect", () => {
      console.log("クライアントと切断しました");
    });

    socket.on("room list", async (_, callback) => {
      const rooms = await prisma.rooms.findMany();
      console.log(io.sockets.adapter.rooms)
      callback(rooms)
    });
  });
});
