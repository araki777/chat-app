import express from 'express'
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ユーザーを1件だけ取得する
router.post('/:id', async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.params.id
    }
  })

  res.json({ user })
})

export default router;
