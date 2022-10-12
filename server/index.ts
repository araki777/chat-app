import express, { Request, Response, Express } from "express";
import next from "next";
import { Server, createServer } from "http";
import { Server as socketioServer, Socket } from "socket.io";
import idGenerator from "../helpers/id-generator";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

async function main() {
  try {
    await nextApp.prepare();
    const expressApp: Express = express();
    const server: Server = createServer(expressApp);
    const io: socketioServer = new socketioServer();

    io.attach(server);

    io.on("connection", (socket) => {
      console.log(`SOCKET CONNECTED!`, socket.id);
    });

    expressApp.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
