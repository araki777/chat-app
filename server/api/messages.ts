import express from 'express'
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// roomに紐づく作成日が30日前までのデータを取得する
router.get('/', async (req, res) => {
  const today = new Date()
  const todaybefore30 = new Date(today.setDate(today.getDate() - 30))
  const messages = await prisma.messages.findMany({
    where: {
      AND: [
        {
          room_id: req.params
        },
        {
          created_at: {
            gte: todaybefore30
          }
        }
      ]
    },
    orderBy: {
      created_at: 'asc'
    },
    select: {
      id: true,
      message: true,
      user_id: true
    }
  })

  res.json(messages)
})

export default router;
