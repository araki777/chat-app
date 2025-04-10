import express, { Request, Response, Express } from "express";
import next from "next";
import { Server, createServer } from "http";
import { Server as socketioServer, Socket } from "socket.io";
import usersRouter from './api/users';
import messagesRouter from './api/messages';
import { createRoom, fetchUserJoinRoom } from "./hooks/room";
import { createMessage } from "./hooks/message";

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
  expressApp.use('/api/users', usersRouter)
  expressApp.use('/api/messages', messagesRouter)

  expressApp.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
  });

  io.on("connection", (socket: Socket) => {
    console.log("クライアントと接続しました");

    // ユーザーが所属するルームを取得し、接続
    socket.on("joinUserRoom", async (response, callback) => {
      const { joinRoomList, userId }: { joinRoomList: string[], userId: string } = response
      const userJoinRooms = await fetchUserJoinRoom(joinRoomList, userId)
      userJoinRooms.forEach((res) => {
        socket.join(res.id)
      })

      callback(userJoinRooms)
    })

    // ルームを作成する
    socket.on("createRoom", async (response, callback) => {
      const room = await createRoom(response)
      socket.join(room.id)
      console.log(room);
      callback(room)
    })

    // チャットをルーム宛てに送る
    socket.on("sendMessage", async (response) => {
      const message = await createMessage(response)
      io.to(message.room_id as string).emit('giveMessage', { id: message.id, message: message.message, user_id: message.user_id })
    });

    // ルーム宛てにユーザーのマウス位置を送る
    socket.on("mouseMove", async (response) => {
      io.to(response.roomId).emit('giveMouseMove', response)
    })

    // ルーム宛てに絵の描画位置を送る
    socket.on("draw", async (response) => {
      const { roomId, points, status } = response
      if (status === 'end') {
        io.to(roomId).emit('giveDrawEnd', { points: points })
      } else {
        io.to(roomId).emit('giveDraw', { points: points })
      }
    })

    // 他のユーザーに自身の動画情報を送信
    socket.on("sendVideo", async (response) => {
      console.log(response);
      io.to(response.roomId).emit('giveVideo', response.stream)
    })

    socket.on("disconnect", () => {
      console.log("クライアントと切断しました");
    });
  });
});
