import express from 'express'
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// roomに紐づく作成日が30日前までのデータを取得する
router.post('/', async (req, res) => {
  console.log(req.params);
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
    }
  })

  res.json(messages)
})

export default router;
