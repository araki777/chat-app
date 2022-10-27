import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchUserJoinRoom = async (
  joinRoomList: string[],
  userId: string
) => {
  const userJoinRooms = await prisma.rooms.findMany({
    where: {
      AND: {
        id: {
          in: joinRoomList,
        },
      },
      NOT: {
        black_list: {
          has: userId,
        },
      },
    },
    select: {
      id: true,
      room_name: true,
      user_id: true,
      isRelease: true,
      capacity: true,
    },
    orderBy: { updated_at: "desc" },
  });

  return userJoinRooms;
};

export const createRoom = async (response: any) => {
  const room = await prisma.rooms.create({
    data: {
      capacity: response.capacity,
      isRelease: response.isRelease,
      room_name: response.roomName,
      user_id: response.userId,
    },
  });
  await prisma.users.update({
    where: {
      id: response.userId,
    },
    data: {
      join_room_list: {
        push: room.id,
      },
    },
  });
  return room;
};
