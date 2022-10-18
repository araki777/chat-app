import express from 'express'
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get('/first-get', async (_req, res) => {
  const firstRooms = await prisma.rooms.findMany({
    take: 10
  })
  res.json({ firstRooms })
})

router.post('/create', async (req, res) => {
  try {
    const { roomName, capacity, isRelease, userId } = req.body;
    // ルームを作成する
    const room = await prisma.rooms.create({
      data: {
        room_name: roomName,
        capacity,
        isRelease,
        user_id: userId
      } as any
    })
    // ユーザーのルームリストへ追加
    await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        join_room_list: {
          push: room.id
        },
        updated_at: new Date()
      },
    })
    res.json(room)
  } catch(e) {
    res.json(e)
  }
})

export default router;
