import express, { Request, Response, Express } from "express";
import next from "next";
import { Server, createServer } from "http";
import { Server as socketioServer, Socket } from "socket.io";
import idGenerator from "../helpers/id-generator";
import { MissingStaticPage } from "next/dist/shared/lib/utils";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

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
    socket.on("create room", (values, callback) => {
      const { roomName, count, isRelease } = values
      const roomId = "room-" + idGenerator().toString()
      socket.join(roomId);
      console.log(io.sockets.adapter.rooms);
      callback(roomId)
    });

    socket.on("disconnect", () => {
      console.log("クライアントと切断しました");
    })

    socket.on("room list", (_, callback) => {
      const rooms = io.sockets.adapter.rooms
      const roomList = [] as any
      rooms.forEach((_, key) => {
        if (key.match(/room-*/)) {
          roomList.push(key)
        }
      })
      callback(roomList)
    })
  });
});
