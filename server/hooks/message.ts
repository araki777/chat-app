import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMessage = async (response: any) => {
  const message = await prisma.messages.create({
    data: {
      message: response.msg,
      user_id: response.userId,
      room_id: response.roomId
    }
  })
  return message
}
