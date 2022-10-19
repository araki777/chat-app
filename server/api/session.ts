import express from 'express'
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  // const session = await prisma.users.update({
  //   where: {

  //   }
  // })
})

export default router;
